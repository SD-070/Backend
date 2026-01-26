// import { db } from '#db';
import { Command } from 'commander';

// console.log('Databases:');
// const databases = await db.admin().listDatabases();
// databases.databases.forEach((database) => {
// 	console.log(`- ${database.name}`);
// });
// process.exit(0);

const program = new Command();
program
	.name('ecommerce-cli')
	.description('Simple product CRUD CLI')
	.version('1.0.0');

// CREATE
program
	.command('add')
	.description('Add a new product')
	.argument('<name>', 'Product name')
	.argument('<stock>', 'Stock quantity')
	.argument('<price>', 'Product price')
	.action(async (name, stockStr, priceStr) => {
		console.log('CLI application was called with add command with arguments:', {
			name,
			stockStr,
			priceStr
		});
	});

// READ
program
	.command('list')
	.description('List all products')
	.action(async () => {
		console.log('CLI application was called with list command');
	});

program.hook('postAction', () => process.exit(0));
program.parse();
