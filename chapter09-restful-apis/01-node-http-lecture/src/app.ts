import http, {
	type IncomingMessage,
	type RequestListener,
	type ServerResponse
} from 'node:http';
import '#db';
import { User, Duck } from '#models';

type UserInputType = {
	firstName: string;
	lastName: string;
	email: string;
};

const parseJsonBody = <T>(req: IncomingMessage): Promise<T> => {
	return new Promise((resolve, reject) => {
		let body = '';
		req.on('data', (chunk) => {
			body += chunk.toString();
		});

		req.on('end', async () => {
			try {
				resolve(JSON.parse(body) as T);
			} catch (error) {
				reject(new Error('Invalid JSON'));
			}
		});
	});
};

const createResponse = (
	res: ServerResponse,
	statusCode: number,
	message: unknown
) => {
	res.writeHead(statusCode, { 'Content-Type': 'application/json' });
	res.end(
		typeof message === 'string'
			? JSON.stringify({ message })
			: JSON.stringify(message)
	);
};

const port = 3000;
const requestHandler: RequestListener = async (req, res) => {
	const { method, url } = req;
	console.log(method, url);
	const singleUserRegex = /^\/users\/[0-9a-zA-Z]+$/;

	// /users
	if (url === '/users') {
		if (method === 'GET') {
			const users = await User.find();
			console.log(users);
			return createResponse(res, 200, users);
		}
		if (method === 'POST') {
			const body = await parseJsonBody<UserInputType>(req);
			console.log(body);
			const newUser = await User.create(body);

			return createResponse(res, 201, newUser);
		}
		return createResponse(res, 405, 'Method not allowed');
	}

	if (singleUserRegex.test(url!)) {
		if (method === 'GET') {
			return createResponse(res, 200, `GET request on ${url}`);
		}
		if (method === 'PUT') {
			return createResponse(res, 200, `PUT request on ${url}`);
		}
		if (method === 'DELETE') {
			return createResponse(res, 200, `DELETE request on ${url}`);
		}
		return createResponse(res, 405, 'Method not allowed');
	}

	return createResponse(res, 404, 'Not found');
};

const server = http.createServer(requestHandler);

server.listen(port, () => {
	console.log(`Server running at http://localhost:${port}/`);
});

// try {
// 	// CREATE
// 	// const newUser = new User({
// 	// 	firstName: 'Aang',
// 	// 	lastName: 'Air',
// 	// 	email: 'aang@air.com'
// 	// });
// 	// await newUser.save();
// 	// const newUser = await User.create({
// 	// 	firstName: 'Katara',
// 	// 	lastName: 'Water',
// 	// 	email: 'katara@water.com'
// 	// });
// 	// console.log(newUser);
// 	//READ
// 	// const users = await User.find();
// 	// console.log(users);
// 	// const usersAir = await User.find({ lastName: 'Air' });
// 	// console.log(usersAir);
// 	// const firstAir = await User.findOne({ lastName: 'Air' });
// 	// console.log(firstAir);
// 	// const user = await User.findById('6979dda6636e3c1f3606db1a');
// 	// console.log(user);
// 	// UPDATE
// 	// const updatedAang = await User.findByIdAndUpdate(
// 	// 	'6979dda6636e3c1f3606db1a',
// 	// 	{
// 	// 		firstName: 'Aang',
// 	// 		lastName: 'Avatar',
// 	// 		email: 'aang@air.com'
// 	// 	},
// 	// 	{ new: true }
// 	// );
// 	// console.log(updatedAang);
// 	//DELETE
// 	// const deletedUser = await User.findByIdAndDelete('6979de1517a14f4ebb7b08df');
// 	// console.log(deletedUser);
// 	// if (deletedUser) {
// 	// 	console.log('User deleted');
// 	// } else {
// 	// 	console.log('User not found');
// 	// }
// 	// const newDuck = await Duck.create({
// 	// 	name: 'The Mad Quacker',
// 	// 	imgUrl:
// 	// 		'https://duckycity.com/cdn/shop/products/SG-REYTD-JCNYO_1024x1024_clipped_rev_1-min_540x.jpeg?v=1505504539',
// 	// 	quote: 'Be careful, or I might just make your bugs into SUPER bugs!',
// 	// 	owner: '6979e26a38f146f7fed5e8eb'
// 	// });
// 	// console.log(newDuck);
// 	// const ducks = await Duck.find().populate(
// 	// 	'owner',
// 	// 	'firstName lastName email -_id'
// 	// );
// 	// console.log(ducks);
// } catch (error) {
// 	console.error(error);
// }
