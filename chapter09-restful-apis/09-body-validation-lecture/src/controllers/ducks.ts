import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import type { z } from 'zod/v4';
import { Duck } from '#models';
import type {
	duckInputSchema,
	duckUpdateInputSchema,
	duckSchema
} from '#schemas';

type DuckInputDTO = z.infer<typeof duckInputSchema>;

type DuckUpdateDTO = z.infer<typeof duckUpdateInputSchema>;

type DuckDTO = z.infer<typeof duckSchema>;

const getAllDucks: RequestHandler<{}, DuckDTO[]> = async (req, res) => {
	const ducks = await Duck.find();
	res.json(ducks);
};
const createDuck: RequestHandler<{}, DuckDTO, DuckInputDTO> = async (
	req,
	res
) => {
	const { name, imgUrl, quote, owner } = req.body;

	const newDuck = await Duck.create({
		name,
		imgUrl,
		quote,
		owner
	} satisfies DuckInputDTO);

	res.status(201).json(newDuck);
};
const getDuckById: RequestHandler<{ id: string }, DuckDTO> = async (
	req,
	res
) => {
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
const updateDuck: RequestHandler<
	{ id: string },
	DuckDTO,
	DuckUpdateDTO
> = async (req, res) => {
	const { userId } = req;
	console.log('userId:', userId);

	const { name, imgUrl, quote } = req.body;
	const { id } = req.params;

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
const deleteDuck: RequestHandler<{ id: string }, { message: string }> = async (
	req,
	res
) => {
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
