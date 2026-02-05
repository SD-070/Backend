import { Router } from 'express';
import {
	getAllUsers,
	createUser,
	getUserById,
	updateUser,
	deleteUser
} from '#controllers';
import { validateBody } from '#middleware';

const userRoutes = Router();

userRoutes.route('/').get(getAllUsers).post(validateBody('user'), createUser);
userRoutes
	.route('/:id')
	.get(getUserById)
	.put(validateBody('user'), updateUser)
	.delete(deleteUser);

export default userRoutes;
