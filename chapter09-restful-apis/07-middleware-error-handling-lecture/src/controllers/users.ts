import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';

import { User } from '#models';

type UserInputType = {
	firstName: string;
	lastName: string;
	email: string;
};

const getAllUsers: RequestHandler = async (req, res) => {
	const users = await User.find();
	res.json(users);
};
const createUser: RequestHandler<{}, {}, UserInputType> = async (req, res) => {
	if (!req.body) {
		return res
			.status(400)
			.json({ error: 'Name, image URL, owner, and quote are required' });
	}
	const { firstName, lastName, email } = req.body;

	if (!firstName || !lastName || !email) {
		return res
			.status(400)
			.json({ error: 'First name, last name, and email are required' });
	}

	const newUser = await User.create({
		firstName,
		lastName,
		email
	} satisfies UserInputType);

	res.status(201).json(newUser);
};
const getUserById: RequestHandler<{ id: string }> = async (req, res) => {
	const { id } = req.params;
	if (!isValidObjectId(id)) {
		return res.status(400).json({ error: 'Invalid ID' });
	}
	const user = await User.findById(id);

	if (!user) return res.status(404).json({ error: 'User not found' });
	res.json(user);
};
const updateUser: RequestHandler<{ id: string }, {}, UserInputType> = async (
	req,
	res
) => {
	if (!req.body) {
		return res
			.status(400)
			.json({ error: 'Name, image URL, owner, and quote are required' });
	}

	const { id } = req.params;
	const { firstName, lastName, email } = req.body;

	if (!firstName || !lastName || !email) {
		return res
			.status(400)
			.json({ error: 'First name, last name, and email are required' });
	}

	if (!isValidObjectId(id)) {
		return res.status(400).json({ error: 'Invalid ID' });
	}
	const user = await User.findByIdAndUpdate(
		id,
		{ firstName, lastName, email } satisfies UserInputType,
		{ new: true }
	);

	if (!user) return res.status(404).json({ error: 'User not found' });

	res.json(user);
};
const deleteUser: RequestHandler<{ id: string }> = async (req, res) => {
	const { id } = req.params;

	if (!isValidObjectId(id)) {
		return res.status(400).json({ error: 'Invalid ID' });
	}

	const found = await User.findByIdAndDelete(id);

	if (!found) return res.status(404).json({ error: 'User not found' });

	res.json({ message: 'User deleted' });
};

export { getAllUsers, createUser, getUserById, updateUser, deleteUser };
