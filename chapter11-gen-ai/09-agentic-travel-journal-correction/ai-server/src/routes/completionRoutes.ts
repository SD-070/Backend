import { Router } from 'express';
import { createChat, getChatHistory } from '#controllers';
import { validateBody, authenticate } from '#middleware';
import { promptSchema } from '#schemas';

const completionRoutes = Router();

completionRoutes.get('/history/:id', getChatHistory);

completionRoutes.post('/chat', authenticate, validateBody(promptSchema), createChat);

export default completionRoutes;
