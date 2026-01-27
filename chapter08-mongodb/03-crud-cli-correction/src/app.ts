import { db } from '#db';
import { Command } from 'commander';
import { ObjectId } from 'mongodb';

const program = new Command();
program
	.name('ecommerce-cli')
	.description('Simple product CRUD CLI')
	.version('1.0.0');

const products = db.collection('products');

// CREATE
program
	.command('add')
	.description('Add a new product')
	.argument('<name>', 'Product name')
	.argument('<stock>', 'Stock quantity')
	.argument('<price>', 'Product price')
	.argument('<tags>', 'Comma-separated tags')
	.action(async (name, stockStr, priceStr, tagsStr) => {
		console.log('CLI application was called with add command with arguments:', {
			name,
			stockStr,
			priceStr,
			tagsStr
		});
		// fill with formatted inputs
		// convert strings to numbers if needed
		const stock = +stockStr;
		const price = +priceStr;
		const tags = tagsStr.split(',');
		// const result = await products.insertOne();
		const result = await products.insertOne({
			name,
			price,
			stock,
			tags,
			created_at: new Date()
		});

		console.log(`Product inserted with ID: ${result.insertedId}`);
	});

// READ
program
	.command('list')
	.description('List all products')
	.action(async () => {
		console.log('CLI application was called with list command');
		const allProducts = await products.find().toArray();
		console.log(allProducts);
	});

// READ - Get product by id
program
	.command('get')
	.description('Get product by ID')
	.argument('<id>', 'Product ID')
	.action(async (id) => {
		console.log(
			'CLI application was called with get command with argument:',
			id
		);
		const objId = ObjectId.createFromHexString(id);

		// search by _id using the objId
		const product = await products.findOne({ _id: objId });

		console.log(product);
	});

// SEARCH - search by tags
program
	.command('search')
	.description('Search products by tag')
	.argument('<tag>', 'Product tag')
	.action(async (tag) => {
		console.log(
			'CLI application was called with search command with argument:',
			tag
		);
		const searchResults = await products.find({ tags: tag }).toArray();

		console.log(searchResults);
	});

// UPDATE
program
	.command('update')
	.description('Update a product by ID')
	.argument('<id>', 'Product ID')
	.argument('<name>', 'Product name')
	.argument('<stock>', 'Stock quantity')
	.argument('<price>', 'Product price')
	.argument('<tags>', 'Comma-separated tags')
	.action(async (id, name, stockStr, priceStr, tagsStr) => {
		console.log(
			'CLI application was called with update command with arguments:',
			{
				id,
				name,
				stockStr,
				priceStr,
				tagsStr
			}
		);

		const objId = ObjectId.createFromHexString(id);
		const stock = +stockStr;
		const price = +priceStr;
		const tags = tagsStr.split(',');

		const result = await products.findOneAndUpdate(
			{ _id: objId },
			{ $set: { stock, price, tags } }
		);

		console.log(result);
	});

// DELETE - delete product by id
program
	.command('delete')
	.description('Delete product by ID')
	.argument('<id>', 'Product ID')
	.action(async (id) => {
		console.log(
			'CLI application was called with delete command with argument:',
			id
		);
		const objId = ObjectId.createFromHexString(id);

		const result = await products.findOneAndDelete({ _id: objId });

		console.log(result);
	});

// after all commands
program.hook('postAction', () => process.exit(0));
program.parse();
