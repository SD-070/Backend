import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';

import { Duck } from '#models';
import { nextTick } from 'process';

type DuckInputType = {
	name: string;
	imgUrl: string;
	quote: string;
	owner: string;
};

type DuckUpdateType = Omit<DuckInputType, 'owner'>;

const getAllDucks: RequestHandler = async (req, res) => {
	const ducks = await Duck.find();
	res.json(ducks);
};
const createDuck: RequestHandler<{}, {}, DuckInputType> = async (req, res) => {
	if (!req.body)
		throw new Error('Name, image URL, owner, and quote are required', {
			cause: { status: 400 }
		});

	const { name, imgUrl, quote, owner } = req.body;

	if (!name || !imgUrl || !quote || !owner)
		throw new Error('Name, image URL, owner, and quote are required', {
			cause: { status: 400 }
		});

	const newDuck = await Duck.create({
		name,
		imgUrl,
		quote,
		owner
	} satisfies DuckInputType);

	res.status(201).json(newDuck);
};
const getDuckById: RequestHandler<{ id: string }> = async (req, res) => {
	const { id } = req.params;
	if (!isValidObjectId(id))
		throw new Error('Invalid ID', {
			cause: { status: 400 }
		});

	const duck = await Duck.findById(id);

	if (!duck)
		throw new Error('Duck not found', {
			cause: { status: 404 }
		});
	res.json(duck);
};
const updateDuck: RequestHandler<{ id: string }, {}, DuckUpdateType> = async (
	req,
	res
) => {
	const { userId } = req;
	console.log('userId:', userId);
	if (!req.body)
		throw new Error('Name, image URL, owner, and quote are required', {
			cause: { status: 400 }
		});
	const { name, imgUrl, quote } = req.body;
	const { id } = req.params;

	if (!name || !imgUrl || !quote)
		throw new Error('Name, image URL, owner, and quote are required', {
			cause: { status: 400 }
		});

	if (!isValidObjectId(id))
		throw new Error('Invalid ID', {
			cause: { status: 400 }
		});
	const duck = await Duck.findById(id);
	// const duck = await Duck.findByIdAndUpdate(
	// 	id,
	// 	{ name, imgUrl, quote } satisfies DuckUpdateType,
	// 	{ new: true }
	// );

	if (!duck)
		throw new Error('Duck not found', {
			cause: { status: 404 }
		});

	if (userId !== duck.owner.toString())
		throw new Error('You are not authorized to update this duck', {
			cause: { status: 403 }
		});

	duck.name = name;
	duck.imgUrl = imgUrl;
	duck.quote = quote;

	await duck.save();

	res.json(duck);
};
const deleteDuck: RequestHandler<{ id: string }> = async (req, res) => {
	const { id } = req.params;

	if (!isValidObjectId(id))
		throw new Error('Invalid ID', {
			cause: { status: 400 }
		});

	const found = await Duck.findByIdAndDelete(id);

	if (!found)
		throw new Error('Duck not found', {
			cause: { status: 404 }
		});

	res.json({ message: 'Duck deleted' });
};

export { getAllDucks, createDuck, getDuckById, updateDuck, deleteDuck };
