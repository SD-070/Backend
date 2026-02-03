import { Router } from 'express';
import {
	getAllUsers,
	createUser,
	getUserById,
	updateUser,
	deleteUser
} from '#controllers';

const userRoutes = Router();

userRoutes.route('/').get(getAllUsers).post(createUser);
userRoutes.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

export default userRoutes;
