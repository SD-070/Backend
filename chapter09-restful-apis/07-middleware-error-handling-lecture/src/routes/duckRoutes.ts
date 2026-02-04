import { Router, type RequestHandler } from 'express';
import {
	getAllDucks,
	createDuck,
	getDuckById,
	updateDuck,
	deleteDuck
} from '#controllers';
const validateDuck: RequestHandler = (req, res, next) => {
	// body validation logic here...
	console.log('Validation passed!');
	next();
};

const verifyToken: RequestHandler = (req, res, next) => {
	// token verification logic here...
	console.log('Verifying token...');
	req.userId = '6979e26a38f146f7fed5e8eb';
	next();
};

const duckRoutes = Router();

duckRoutes.use(validateDuck);

duckRoutes.route('/').get(getAllDucks).post(createDuck);
duckRoutes
	.route('/:id')
	.get(getDuckById)
	.put(verifyToken, validateDuck, updateDuck)
	.delete(verifyToken, deleteDuck);

export default duckRoutes;
