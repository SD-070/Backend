import { Router } from 'express';
import { createChat, createInMemoryChat, getChatHistory, createPersonalChat } from '#controllers';
import { validateBody } from '#middleware';
import { promptSchema } from '#schemas';

const completionRoutes = Router();

completionRoutes.get('/history/:id', getChatHistory);

completionRoutes.post('/in-memory-chat', validateBody(promptSchema), createInMemoryChat);

completionRoutes.post('/db-chat', validateBody(promptSchema), createChat);
completionRoutes.post('/personal-chat', validateBody(promptSchema), createPersonalChat);

export default completionRoutes;
