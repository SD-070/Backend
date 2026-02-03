import { Router } from 'express';
import {
	getAllDucks,
	createDuck,
	getDuckById,
	updateDuck,
	deleteDuck
} from '#controllers';

const duckRoutes = Router();

duckRoutes.route('/').get(getAllDucks).post(createDuck);
duckRoutes.route('/:id').get(getDuckById).put(updateDuck).delete(deleteDuck);

export default duckRoutes;
