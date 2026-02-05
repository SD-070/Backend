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
	if (!req.body)
		throw new Error('First name, last name, and email are required', {
			cause: { status: 400 }
		});
	const { firstName, lastName, email } = req.body;

	if (!firstName || !lastName || !email)
		throw new Error('First name, last name, and email are required', {
			cause: { status: 400 }
		});

	const newUser = await User.create({
		firstName,
		lastName,
		email
	} satisfies UserInputType);

	res.status(201).json(newUser);
};
const getUserById: RequestHandler<{ id: string }> = async (req, res) => {
	const { id } = req.params;
	if (!isValidObjectId(id))
		throw new Error('Invalid ID', {
			cause: { status: 400 }
		});
	const user = await User.findById(id);

	if (!user)
		throw new Error('User not found', {
			cause: { status: 404 }
		});
	res.json(user);
};
const updateUser: RequestHandler<{ id: string }, {}, UserInputType> = async (
	req,
	res
) => {
	if (!req.body)
		throw new Error('First name, last name, and email are required', {
			cause: { status: 400 }
		});

	const { id } = req.params;
	const { firstName, lastName, email } = req.body;

	if (!firstName || !lastName || !email)
		throw new Error('First name, last name, and email are required', {
			cause: { status: 400 }
		});

	if (!isValidObjectId(id))
		throw new Error('Invalid ID', {
			cause: { status: 400 }
		});
	const user = await User.findByIdAndUpdate(
		id,
		{ firstName, lastName, email } satisfies UserInputType,
		{ new: true }
	);

	if (!user)
		throw new Error('User not found', {
			cause: { status: 404 }
		});

	res.json(user);
};
const deleteUser: RequestHandler<{ id: string }> = async (req, res) => {
	const { id } = req.params;

	if (!isValidObjectId(id))
		throw new Error('Invalid ID', {
			cause: { status: 400 }
		});

	const found = await User.findByIdAndDelete(id);

	if (!found)
		throw new Error('User not found', {
			cause: { status: 404 }
		});

	res.json({ message: 'User deleted' });
};

export { getAllUsers, createUser, getUserById, updateUser, deleteUser };
