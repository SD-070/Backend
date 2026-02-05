import { Router, type RequestHandler } from 'express';
import {
	getAllDucks,
	createDuck,
	getDuckById,
	updateDuck,
	deleteDuck
} from '#controllers';
import { validateBody } from '#middleware';
import { duckInputSchema, duckUpdateInputSchema } from '#schemas';

const verifyToken: RequestHandler = (req, res, next) => {
	// token verification logic here...
	console.log('Verifying token...');
	req.userId = '6979e26a38f146f7fed5e8eb';
	next();
};

const duckRoutes = Router();

duckRoutes
	.route('/')
	.get(getAllDucks)
	.post(validateBody(duckInputSchema), createDuck);
duckRoutes
	.route('/:id')
	.get(getDuckById)
	.put(verifyToken, validateBody(duckUpdateInputSchema), updateDuck)
	.delete(verifyToken, deleteDuck);

export default duckRoutes;
