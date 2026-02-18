import type { RequestHandler } from 'express';
import Pokedex, { type Pokemon } from 'pokedex-promise-v2';
import { zodResponseFormat } from 'openai/helpers/zod';
import type { ChatCompletionMessageParam } from 'openai/resources';
import { Intent, FinalResponse } from '#schemas';
import OpenAI from 'openai';
import type { IncomingPrompt, FinalResponseDTO, ErrorResponseDTO } from '#types';
import { tools, getPokemon, returnError } from '#utils';

export const createCompletionTool: RequestHandler<
  unknown,
  FinalResponseDTO,
  IncomingPrompt
> = async (req, res) => {
  const { prompt } = req.body;
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_URL
  });

  //TODO: runtime check to save sanity
  const model = process.env.OPENAI_API_MODEL!;

  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: `You determine if a question is about Pokémon. 
       If the user asks about a Pokémon, you will call the get_pokemon function to fetch data about it.
       If the question is not about Pokémon, you will call the return_error function with a reason why 
       the question is not about Pokémon.
      `
    },
    {
      role: 'user',
      content: prompt
    }
  ];
  // console.log(model);
  // Step 1: Check if the prompt is about Pokémon
  const checkIntentCompletion = await client.chat.completions.create({
    model,
    tools,
    tool_choice: 'required',
    messages,
    temperature: 0
  });

  // Check if the completion has a message
  const checkIntentCompletionMessage = checkIntentCompletion.choices[0]?.message;
  // Early return if no message is found
  if (!checkIntentCompletionMessage) {
    res.status(500).json({
      success: false,
      error: 'Failed to generate a response from the model.'
    });
    return;
  }
  // console.log(checkIntentCompletionMessage);

  messages.push(checkIntentCompletionMessage);

  // Since a model response can contain zero, one, or multiple tool calls, we iterate through them
  // This is the official recommendation from OpenAI to handle tool calls <https://platform.openai.com/docs/guides/function-calling#handling-function-calls>
  for (const toolCall of checkIntentCompletionMessage.tool_calls || []) {
    // console.log(toolCall);
    if (toolCall.type === 'function') {
      const name = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments);
      console.log(`\x1b[36mTool call detected: ${name} with args: ${JSON.stringify(args)}\x1b[0m`);

      let result: Pokemon | ErrorResponseDTO | string = '';
      if (name === 'get_pokemon') {
        result = await getPokemon({ pokemonName: args.pokemonName });
      }

      if (name === 'return_error') {
        result = await returnError({ message: args.message });
      }

      messages.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(result)
      });
    }
  }
  console.log(messages);
  const finalCompletion = await client.chat.completions.parse({
    model,
    messages,
    temperature: 0,
    response_format: zodResponseFormat(FinalResponse, 'FinalResponse')
  });

  const finalResponse = finalCompletion.choices[0]?.message.parsed;

  if (!finalResponse) {
    res.status(500).json({
      completion: 'Failed to generate a final response.'
    });
    return;
  }

  res.json(finalResponse);
};
export const createCompletion: RequestHandler<unknown, FinalResponseDTO, IncomingPrompt> = async (
  req,
  res
) => {
  const { prompt } = req.body;
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENAI_URL
  });

  //TODO: runtime check to save sanity
  const model = process.env.OPENAI_API_MODEL!;

  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content:
        'You determine if a question is about Pokémon. You can only answer questions about a single Pokémon and not open-ended questions.'
    },
    {
      role: 'user',
      content: prompt
    }
  ];
  // console.log(model);
  // Step 1: Check if the prompt is about Pokémon
  const checkIntentCompletion = await client.chat.completions.parse({
    model,
    messages,
    temperature: 0,
    response_format: zodResponseFormat(Intent, 'Intent')
  });

  const intent = checkIntentCompletion.choices[0]?.message.parsed;
  console.log(intent);

  if (!intent?.isPokemon) {
    res.status(400).json({
      completion: intent?.reason || 'I cannot answer this question, try asking about a Pokémon.'
    });
    return;
  }

  console.log(`\x1b[34mIntent detected. Received a question about: ${intent.pokemonName}\x1b[0m`);

  // Step 2: Fetch the Pokémon data from the PokeAPI
  const P = new Pokedex();
  const pokemonData = await P.getPokemonByName(intent.pokemonName.toLowerCase());

  if (!pokemonData) {
    res.status(404).json({
      completion: `Pokémon ${intent.pokemonName} not found.`
    });
    return;
  }
  console.log(`\x1b[32mFetched data for Pokémon: ${pokemonData.name}\x1b[0m`);

  // Step 3: Add the Pokémon data to the messages and generate a final response
  messages.push({
    role: 'assistant',
    content: `This is all the relevant data about the Pokémon: ${
      intent.pokemonName
    }: ${JSON.stringify(pokemonData, null, 2)}
    Combine it with what you know about it to give the user a complete answer.`
  });
  console.log(`\x1b[33mAdded Pokémon data to messages for further processing.\x1b[0m`);

  const finalCompletion = await client.chat.completions.parse({
    model,
    messages,
    temperature: 0,
    response_format: zodResponseFormat(FinalResponse, 'FinalResponse')
  });

  const finalResponse = finalCompletion.choices[0]?.message.parsed;

  if (!finalResponse) {
    res.status(500).json({
      completion: 'Failed to generate a final response.'
    });
    return;
  }

  res.json(finalResponse);
};
