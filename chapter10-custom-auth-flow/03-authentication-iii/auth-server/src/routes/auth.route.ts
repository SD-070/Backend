import { Router } from 'express';
import { login, logout, me, refresh, register } from '#controllers';
import { validateBodyZod } from '#middlewares';
import { loginSchema, registerSchema, refreshTokenSchema } from '#schemas'; // TODO: use the schemas for validation

const authRouter = Router();

authRouter.post('/register', validateBodyZod(registerSchema), register);

authRouter.post('/login', validateBodyZod(loginSchema), login);

authRouter.post('/refresh', validateBodyZod(refreshTokenSchema), refresh);

authRouter.post('/logout', validateBodyZod(refreshTokenSchema), logout);

authRouter.get('/me', me);

export default authRouter;
