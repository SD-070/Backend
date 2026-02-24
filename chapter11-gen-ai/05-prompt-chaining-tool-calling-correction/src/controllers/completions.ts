import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources';
import type { z } from 'zod';
import type { promptSchema } from '#schemas';
import { Chat } from '#models';
import { tools, getPosts, returnError } from '#utils';
import type { PostDTO, ErrorResponseDTO } from '#types';

type PromptDTO = z.infer<typeof promptSchema>;
type CompletionDTO = { completion: string } | { completion: string; chatId: string };

// declared outside of function, to persist across API calls. Will reset if server stops/restarts
const messages: ChatCompletionMessageParam[] = [
  { role: 'system', content: 'You are a helpful assistant' }
];

export const createInMemoryChat: RequestHandler<{}, CompletionDTO, PromptDTO> = async (
  req,
  res
) => {
  const { prompt } = req.body;

  const client = new OpenAI({
    apiKey: process.env.AI_API_KEY,
    baseURL: process.env?.AI_URL
  });

  // const list = await client.models.list();

  // for await (const model of list) {
  //   console.log(model);
  // }
  // return;

  messages.push({ role: 'user', content: prompt });
  console.log(process.env.AI_MODEL + '\n\n');
  // console.log(messages);
  const completion = await client.chat.completions.create({
    model: process.env.AI_MODEL || 'gemini-2.5-flash',
    messages
  });

  const completionText = completion.choices[0]?.message.content || 'No completion generated';

  messages.push({ role: 'assistant', content: completionText });

  res.json({ completion: completionText });
};

export const createChat: RequestHandler<{}, CompletionDTO, PromptDTO> = async (req, res) => {
  const { prompt, chatId } = req.body;
  const systemPrompt = {
    role: 'system',
    content: 'You are Gollum from The Lord of The Rings. Always answer in-character.'
  };

  const client = new OpenAI({
    apiKey: process.env.AI_API_KEY,
    baseURL: process.env?.AI_URL
  });

  // let currentChat: InstanceType<typeof Chat>;
  let currentChat: InstanceType<typeof Chat>;

  if (chatId) {
    currentChat = (await Chat.findById(chatId)) || (await Chat.create({ history: [systemPrompt] }));
  } else {
    currentChat = await Chat.create({ history: [systemPrompt] });
  }

  currentChat.history.push({ role: 'user', content: prompt });
  // await currentChat.save()

  const completion = await client.chat.completions.create({
    model: process.env.AI_MODEL || 'gemini-2.5-flash',
    messages: JSON.parse(JSON.stringify(currentChat.history))
  });

  const completionText = completion.choices[0]?.message.content || 'No completion generated';

  currentChat.history.push({ role: 'assistant', content: completionText });
  await currentChat.save();

  messages.push({ role: 'assistant', content: completionText });

  // console.log(completion);

  res.json({ completion: completionText, chatId: currentChat._id.toString() });
};

export const getChatHistory: RequestHandler = async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) throw new Error('Invalid id', { cause: { status: 400 } });

  const chat = await Chat.findById(id);

  if (!chat) throw new Error('Chat not found', { cause: { status: 404 } });

  res.json(chat);
};

export const createPersonalChat: RequestHandler<{}, CompletionDTO, PromptDTO> = async (
  req,
  res
) => {
  const { prompt, chatId } = req.body;
  const userId = '6930026b56b7d82ac14c948a';
  const systemPrompt = {
    role: 'system',
    content: `You determine if a question is about travel recommendations. 
      The user's id is: ${userId}.
      You will respond with travel recommendations based on their travel blog entries.
      If the user has any follow up questions related to travel, you will provide as accurate information as possible 
      from your general knowledge.
      If the question is not about travel, you will call the return_error function with a reason why 
      the question is not about travel.
      `
  };

  // let currentChat: InstanceType<typeof Chat>;
  let currentChat: InstanceType<typeof Chat>;

  if (chatId) {
    currentChat = (await Chat.findById(chatId)) || (await Chat.create({ history: [systemPrompt] }));
  } else {
    currentChat = await Chat.create({ history: [systemPrompt] });
  }

  currentChat.history.push({ role: 'user', content: prompt });
  // await currentChat.save()

  const client = new OpenAI({
    apiKey: process.env.AI_API_KEY,
    baseURL: process.env?.AI_URL
  });

  console.log(currentChat.history);
  const checkIntentCompletion = await client.chat.completions.create({
    model: process.env.AI_MODEL || 'gemini-2.5-flash',
    messages: JSON.parse(JSON.stringify(currentChat.history)),
    tools,
    // tool_choice: 'required',
    temperature: 0
  });

  const checkIntentCompletionMessage = checkIntentCompletion.choices[0]?.message;

  if (!checkIntentCompletionMessage) {
    throw new Error('Failed to generate a response from the model', { cause: { status: 400 } });
  }

  console.log(checkIntentCompletionMessage);

  currentChat.history.push(checkIntentCompletionMessage);

  for (const toolCall of checkIntentCompletionMessage.tool_calls || []) {
    // console.log(toolCall);
    if (toolCall.type === 'function') {
      const name = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);
      // console.log(`\x1b[36mTool call detected: ${name} with args: ${JSON.stringify(args)}\x1b[0m`);

      let result: PostDTO[] | ErrorResponseDTO | string = '';
      if (name === 'get_posts') {
        result = await getPosts({ userId: args.userId });
      }

      if (name === 'return_error') {
        result = await returnError({ message: args.message });
      }

      currentChat.history.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(result)
      });
    }
  }

  const finalCompletion = await client.chat.completions.create({
    model: process.env.AI_MODEL || 'gemini-2.5-flash',
    messages: JSON.parse(JSON.stringify(currentChat.history))
  });

  const finalCompletionText =
    finalCompletion.choices[0]?.message.content || 'No completion generated';

  currentChat.history.push({ role: 'assistant', content: finalCompletionText });
  await currentChat.save();

  // // console.log(completion);

  res.json({ completion: finalCompletionText, chatId: currentChat._id.toString() });
};
