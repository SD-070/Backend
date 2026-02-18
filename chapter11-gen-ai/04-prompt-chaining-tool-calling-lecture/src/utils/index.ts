import Pokedex, { type Pokemon } from 'pokedex-promise-v2';
import type { ChatCompletionTool } from 'openai/resources';
import type { ErrorResponseDTO } from '#types';

export const tools: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      strict: true,
      name: 'get_pokemon',
      description: 'Get details for a single Pokémon by name',
      parameters: {
        type: 'object',
        description: 'The name of the Pokémon to get details for',
        properties: {
          pokemonName: {
            type: 'string',
            description: 'The name of the Pokémon to get details for',
            example: 'Pikachu'
          }
        },
        required: ['pokemonName'],
        additionalProperties: false
      }
    }
  },
  {
    type: 'function',
    function: {
      strict: true,
      name: 'return_error',
      description: 'Return an error when the user asks something that is NOT about pokemon.',
      parameters: {
        type: 'object',
        description: 'The reason why the question is not about Pokémon',
        properties: {
          message: {
            type: 'string',
            description: 'The reason why the question is not about Pokémon',
            example: 'This question is not about Pokémon.'
          }
        },
        required: ['message'],
        additionalProperties: false
      }
    }
  }
];

export const getPokemon = async ({ pokemonName }: { pokemonName: string }): Promise<Pokemon> => {
  console.log(`\x1b[35mFunction get_pokemon called with: ${pokemonName}\x1b[0m`);
  const P = new Pokedex();
  return await P.getPokemonByName(pokemonName.toLowerCase());
};

export const returnError = async ({ message }: { message: string }): Promise<ErrorResponseDTO> => {
  console.error(`\x1b[31mError: ${message}\x1b[0m`);
  return {
    success: false,
    error: message
  };
};
