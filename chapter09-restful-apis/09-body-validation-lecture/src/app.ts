import express from 'express';
import '#db';
import { duckRoutes, userRoutes } from '#routes';
import { errorHandler } from '#middleware';

const app = express();
const port = 3000;

app.use(express.json());

app.use((req, res, next) => {
	console.log('Time:', Date.now());
	next();
});

app.use('/ducks', duckRoutes);
app.use('/users', userRoutes);

app.use('*splat', (req, res) => {
	throw new Error('Not found', { cause: { status: 404 } });
});

app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
