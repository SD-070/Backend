import type { RequestHandler } from 'express';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources';
import type { z } from 'zod';
import type { promptSchema } from '#schemas';
import { Chat } from '#models';

type PromptDTO = z.infer<typeof promptSchema>;
type CompletionDTO = { completion: string } | { completion: string; chatId: string };

// declared outside of function, to persist across API calls. Will reset if server stops/restarts
const messages: ChatCompletionMessageParam[] = [
  { role: 'developer', content: 'You are a helpful assistant' }
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

  messages.push({ role: 'user', content: prompt });

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
