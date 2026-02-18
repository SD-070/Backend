import { z } from 'zod';
import { isValidObjectId } from 'mongoose';

export const promptSchema = z.strictObject({
  prompt: z
    .string()
    .min(1, 'Prompt cannot be empty')
    .max(1000, 'Prompt cannot exceed 1000 characters'),
  chatId: z
    .string()
    .refine(val => isValidObjectId(val))
    .optional()
});
