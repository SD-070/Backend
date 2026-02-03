import type { Duck } from '../types';

const getAllDucks = async (abortCont: AbortController) => {
	const res = await fetch('https://duckpond-89zn.onrender.com/wild-ducks', {
		signal: abortCont.signal
	});
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);
	const data = await res.json();
	// console.log(data);

	return data;
};

const getDuckById = async (id: string, abortCont: AbortController) => {
	const res = await fetch(
		`https://duckpond-89zn.onrender.com/wild-ducks/${id}`,
		{
			signal: abortCont.signal
		}
	);
	if (!res.ok) throw new Error(`${res.status}. Something went wrong!`);

	const data = await res.json();

	return data;
};

const duck: Duck = {
	_id: '1',
	name: 'Sir Quacks-a-lot',
	imgUrl:
		'https://cdn11.bigcommerce.com/s-nf2x4/images/stencil/1280x1280/products/430/7841/Knight-Rubber-Duck-Yarto-2__93062.1576270637.jpg?c=2',
	quote: 'I will slay your bugs!'
};

export { getAllDucks, getDuckById, duck };
