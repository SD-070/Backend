import { type ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	process.env.NODE_ENV === 'development' &&
		console.log(`\x1b[31m${err.stack}\x1b[0m`);

	if (err instanceof Error) {
		if (err.cause) {
			const cause = err.cause as { status: number };
			if (!cause.status) cause.status = 500;
			res.status(cause.status).json({ error: err.message });
			return;
		}
		res.status(500).json({ error: err.message });
		return;
	}
	res.status(500).json({ error: 'Internal server error' });
	return;
};

export default errorHandler;
