import type { Duck } from '../types';
type DuckCardProps = {
	duck: Duck;
};
const DuckCard = ({ duck }: DuckCardProps) => {
	const { name, imgUrl, quote } = duck;
	return (
		<div className='shadow-xl hover:shadow-2xl hover:cursor-pointer w-96 rounded-md m-auto flex-flex-col'>
			<figure className='rounded-t-md overflow-hidden w-full h-96'>
				<img className='w-full h-full' src={imgUrl} alt={name} />
			</figure>
			<div className='flex flex-col p-6 pt-2 rounded-b-md bg-slate-800 h-40'>
				<h2 className='text-3xl border-b-2 mb-4 border-b-gray-400'>{name}</h2>
				<p>{quote}</p>
			</div>
		</div>
	);
};

export default DuckCard;
