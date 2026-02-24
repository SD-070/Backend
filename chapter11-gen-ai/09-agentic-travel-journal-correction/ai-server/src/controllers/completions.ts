import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { OpenAI } from 'openai';
import {
  Agent,
  OpenAIChatCompletionsModel,
  run,
  setDefaultOpenAIClient,
  tool,
  InputGuardrailTripwireTriggered,
  user,
  assistant,
  type InputGuardrail
} from '@openai/agents';
import { z } from 'zod';
import type { promptSchema } from '#schemas';
import { Chat, Post } from '#models';
import type { PostDTO } from '#types';

type PromptDTO = z.infer<typeof promptSchema>;
type CompletionDTO = { completion: string; chatId: string };

export const createChat: RequestHandler<{}, CompletionDTO, PromptDTO> = async (req, res) => {
  const { prompt, chatId } = req.body;
  const { user: userInfo } = req;
  console.log('userInfo:', userInfo);
  //  const prompt = "That's not good enough, I am very upset.";
  //  const chatId = '699833d213e8cd6b17bf7dbb';
  // const userInfo = {
  //   // id: undefined,
  //   id: '6930026b56b7d82ac14c948a',
  //   roles: ['user']
  // };
  const signedIn = !!userInfo?.id;

  const client = new OpenAI({
    apiKey: process.env.AI_API_KEY,
    baseURL: process.env?.AI_URL
  });

  // let currentChat: InstanceType<typeof Chat>;
  let currentChat: InstanceType<typeof Chat>;

  if (chatId) {
    currentChat = (await Chat.findById(chatId)) || (await Chat.create({}));
  } else {
    currentChat = await Chat.create({});
  }

  currentChat.history.push({ role: 'user', content: prompt });

  setDefaultOpenAIClient(client);

  // The Agents SDK uses the OpenAI Responses API under the hood, however it accept any valid Model type
  // In development, we use the OpenAIChatCompletionsModel to register an OpenAI Chat Completions Model
  // We do this so that we can use the OpenAI-compatible APIs provided by Ollama or LM Studio
  const model = new OpenAIChatCompletionsModel(client, process.env.AI_MODEL!);

  const getPostsTool = tool({
    name: 'get_posts',
    description:
      'Get the travel blog posts from a user to offer personalized travel recommendations',
    parameters: z.object({ userId: z.string() }),
    async execute({ userId }) {
      console.log(`\x1b[35mFunction get_posts called with userId: ${userId}\x1b[0m`);
      const userPosts = await Post.find({ author: userId })
        .select('title content -_id')
        .lean<PostDTO[]>();
      return JSON.stringify(userPosts);
    }
  });

  const guardrailAgent = new Agent({
    name: 'Guardrail check',
    instructions: `We give travel recommendations. If the input is remotely about travel and travel destinations
       return isNotAboutTravel: false, otherwise return true.`,
    model,
    outputType: z.object({
      isNotAboutTravel: z.boolean(),
      reasoning: z.string()
    })
  });

  const travelGuardrails: InputGuardrail = {
    name: 'Travel Assistant Guardrail',
    execute: async ({ input, context }) => {
      const result = await run(guardrailAgent, input, { context });
      return {
        outputInfo: result.finalOutput,
        tripwireTriggered: result.finalOutput?.isNotAboutTravel ?? false
      };
    }
  };

  const generalizedAgent = new Agent({
    name: 'Generalized Agent',
    instructions: `You offer general travel advice and recommendations. You suggest that the user log in to 
    get more personalized results. If the user asks for follow up questions about a travel destination, use your general knowledge.`,
    model
  });

  const personalizedAgent = new Agent({
    name: 'Personalized Agent',
    instructions: `You are a helpful assistant with memory of past conversations for user with userId: ${userInfo?.id}.
       You can access user posts if needed using the get_posts tool.
       When asked to use the get_posts tool, please call the tool and and use the information to offer personalized travel
       recommendations. If the user asks for more information about a travel destination, use your general knowledge.`,
    model,
    tools: [getPostsTool]
  });

  const triageAgent = new Agent({
    name: 'Triage Agent',
    instructions: `${signedIn ? 'The user is logged in.' : 'The user is not logged in'}
      If the user is logged in, handoff to the personalized agent.
      If the user is not logged in, handoff to the generalized agent.
        `,
    model,
    inputGuardrails: [travelGuardrails],
    handoffs: [generalizedAgent, personalizedAgent]
  });

  try {
    const formattedHistory = currentChat.history.map(entry =>
      entry.role === 'user' ? user(entry.content) : assistant(entry.content)
    );

    const result = await run(triageAgent, formattedHistory);
    // Log the final output of the agent
    if (result.finalOutput) {
      currentChat.history.push({
        role: 'assistant',
        content: result.finalOutput
      });
    }

    await currentChat.save();

    // console.log('chatId:', currentChat._id);
    // console.log(result.finalOutput);
    res.json({
      completion: result.finalOutput || 'Something went wrong, please ask again',
      chatId: currentChat._id.toString()
    });
  } catch (error) {
    if (error instanceof InputGuardrailTripwireTriggered) {
      res.json({
        completion: 'That is outside of my abilities, I only answer questions about travel.',
        chatId: currentChat._id.toString()
      });
      res.json({
        completion: 'Something went wrong, please ask again',
        chatId: currentChat._id.toString()
      });
    }
  }
};

export const getChatHistory: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: { status: 400 } });

  const chat = await Chat.findById(id);

  if (!chat) throw new Error('Chat not found', { cause: { status: 404 } });

  res.json(chat);
};
