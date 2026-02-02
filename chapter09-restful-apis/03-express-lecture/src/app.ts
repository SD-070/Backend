import express from 'express';
import '#db';
import {
	getAllDucks,
	createDuck,
	getDuckById,
	updateDuck,
	deleteDuck
} from '#controllers';

const app = express();
const port = 3000;

app.use(express.json());

app.route('/ducks').get(getAllDucks).post(createDuck);
// app.get('/ducks', getAllDucks);
// app.post('/ducks', createDuck);

app.route('/ducks/:id').get(getDuckById).put(updateDuck).delete(deleteDuck);
// app.get('/ducks/:id', getDuckById);
// app.put('/ducks/:id', updateDuck);
// app.delete('/ducks/:id', deleteDuck);

app.listen(port, () => console.log(`Server is running on port ${port}`));
