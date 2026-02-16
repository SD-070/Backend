import { Router } from 'express';
import { createChat, createInMemoryChat } from '#controllers';
import { validateBody } from '#middleware';
import { promptSchema } from '#schemas';

const completionRoutes = Router();

completionRoutes.post('/in-memory-chat', validateBody(promptSchema), createInMemoryChat);

completionRoutes.post('/db-chat', validateBody(promptSchema), createChat);

export default completionRoutes;
