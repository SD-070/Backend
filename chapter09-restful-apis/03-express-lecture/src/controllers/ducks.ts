import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';

import { Duck } from '#models';

type DuckInputType = {
	name: string;
	imgUrl: string;
	quote: string;
	owner: string;
};

type DuckUpdateType = Omit<DuckInputType, 'owner'>;

const getAllDucks: RequestHandler = async (req, res) => {
	try {
		const ducks = await Duck.find();
		res.json(ducks);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: 'An unknown error occurred' });
		}
	}
};
const createDuck: RequestHandler<{}, {}, DuckInputType> = async (req, res) => {
	try {
		if (!req.body) {
			return res
				.status(400)
				.json({ error: 'Name, image URL, owner, and quote are required' });
		}
		const { name, imgUrl, quote, owner } = req.body;

		if (!name || !imgUrl || !quote || !owner) {
			return res
				.status(400)
				.json({ error: 'Name, image URL, owner, and quote are required' });
		}

		const newDuck = await Duck.create({
			name,
			imgUrl,
			quote,
			owner
		} satisfies DuckInputType);

		res.status(201).json(newDuck);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: 'An unknown error occurred' });
		}
	}
};
const getDuckById: RequestHandler<{ id: string }> = async (req, res) => {
	try {
		const { id } = req.params;
		if (!isValidObjectId(id)) {
			return res.status(400).json({ error: 'Invalid ID' });
		}
		const duck = await Duck.findById(id);

		if (!duck) return res.status(404).json({ error: 'Duck not found' });
		res.json(duck);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: 'An unknown error occurred' });
		}
	}
};
const updateDuck: RequestHandler<{ id: string }, {}, DuckUpdateType> = async (
	req,
	res
) => {
	try {
		if (!req.body) {
			return res
				.status(400)
				.json({ error: 'Name, image URL, owner, and quote are required' });
		}
		const { name, imgUrl, quote } = req.body;
		const { id } = req.params;

		if (!name || !imgUrl || !quote) {
			return res
				.status(400)
				.json({ error: 'Name, image URL, owner, and quote are required' });
		}

		if (!isValidObjectId(id)) {
			return res.status(400).json({ error: 'Invalid ID' });
		}
		const duck = await Duck.findByIdAndUpdate(
			id,
			{ name, imgUrl, quote } satisfies DuckUpdateType,
			{ new: true }
		);

		if (!duck) return res.status(404).json({ error: 'Duck not found' });

		res.json(duck);
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: 'An unknown error occurred' });
		}
	}
};
const deleteDuck: RequestHandler<{ id: string }> = async (req, res) => {
	try {
		const { id } = req.params;

		if (!isValidObjectId(id)) {
			return res.status(400).json({ error: 'Invalid ID' });
		}

		const found = await Duck.findByIdAndDelete(id);

		if (!found) return res.status(404).json({ error: 'Duck not found' });

		res.json({ message: 'Duck deleted' });
	} catch (error) {
		if (error instanceof Error) {
			res.status(500).json({ message: error.message });
		} else {
			res.status(500).json({ message: 'An unknown error occurred' });
		}
	}
};

export { getAllDucks, createDuck, getDuckById, updateDuck, deleteDuck };
