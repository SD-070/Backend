const args = process.argv.slice(2);

// console.log(args);

if (args.length !== 2) {
	console.error('Please provide exactly 2 numbers');
	process.exit(1);
}

const num1 = parseFloat(args[0]);
const num2 = +args[1];

console.log(num1, num2);

if (isNaN(num1) || isNaN(num2)) {
	console.error('Both arguments must be numbers');
	process.exit(2);
}

const sum = num1 + num2;

console.log(`The sum of ${num1} and ${num2} is ${sum}`);

process.exit(0);
