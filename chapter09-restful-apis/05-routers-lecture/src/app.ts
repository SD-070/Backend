import express from 'express';
import '#db';
import { duckRoutes, userRoutes } from '#routes';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/ducks', duckRoutes);
app.use('/users', userRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));
