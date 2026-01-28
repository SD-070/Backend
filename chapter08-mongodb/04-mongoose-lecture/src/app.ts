import '#db';
import { User, Duck } from '#models';

// type UserInputType = {
// 	firstName: string;
// 	lastName: string;
// 	email: string;
// };

try {
	// CREATE
	// const newUser = new User({
	// 	firstName: 'Aang',
	// 	lastName: 'Air',
	// 	email: 'aang@air.com'
	// });
	// await newUser.save();
	// const newUser = await User.create({
	// 	firstName: 'Katara',
	// 	lastName: 'Water',
	// 	email: 'katara@water.com'
	// });
	// console.log(newUser);
	//READ
	// const users = await User.find();
	// console.log(users);
	// const usersAir = await User.find({ lastName: 'Air' });
	// console.log(usersAir);
	// const firstAir = await User.findOne({ lastName: 'Air' });
	// console.log(firstAir);
	// const user = await User.findById('6979dda6636e3c1f3606db1a');
	// console.log(user);
	// UPDATE
	// const updatedAang = await User.findByIdAndUpdate(
	// 	'6979dda6636e3c1f3606db1a',
	// 	{
	// 		firstName: 'Aang',
	// 		lastName: 'Avatar',
	// 		email: 'aang@air.com'
	// 	},
	// 	{ new: true }
	// );
	// console.log(updatedAang);
	//DELETE
	// const deletedUser = await User.findByIdAndDelete('6979de1517a14f4ebb7b08df');
	// console.log(deletedUser);
	// if (deletedUser) {
	// 	console.log('User deleted');
	// } else {
	// 	console.log('User not found');
	// }
	// const newDuck = await Duck.create({
	// 	name: 'The Mad Quacker',
	// 	imgUrl:
	// 		'https://duckycity.com/cdn/shop/products/SG-REYTD-JCNYO_1024x1024_clipped_rev_1-min_540x.jpeg?v=1505504539',
	// 	quote: 'Be careful, or I might just make your bugs into SUPER bugs!',
	// 	owner: '6979e26a38f146f7fed5e8eb'
	// });
	// console.log(newDuck);
	// const ducks = await Duck.find().populate(
	// 	'owner',
	// 	'firstName lastName email -_id'
	// );
	// console.log(ducks);
} catch (error) {
	console.error(error);
}
