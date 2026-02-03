import { getDuckById } from '../data/ducks';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import type { Duck } from '../types';

const DuckPage = () => {
	const { duckId } = useParams();
	const navigate = useNavigate();
	const [currDuck, setCurrDuck] = useState<Duck | null>(null);

	const handleGoBack = () => navigate(-1);
	useEffect(() => {
		const abortController = new AbortController();
		(async () => {
			try {
				const duckData = await getDuckById(duckId!, abortController);

				setCurrDuck(duckData);
			} catch (error) {
				if (error instanceof Error && error.name === 'AbortError') {
					console.info('Fetch aborted');
				} else {
					console.error(error);
				}
			}
		})();

		return () => {
			abortController.abort();
		};
	}, [duckId]);
	return (
		<div className='hero bg-base-100 min-h-screen'>
			<div className='hero-content flex-col lg:flex-row'>
				<img
					src={currDuck?.imgUrl}
					className='max-w-sm rounded-lg shadow-2xl'
				/>
				<div>
					<h1 className='text-5xl font-bold'>{currDuck?.name}</h1>
					<p className='py-6'>{currDuck?.quote}</p>
					<button onClick={handleGoBack} className='btn btn-primary'>
						Go back
					</button>
				</div>
			</div>
		</div>
	);
};

export default DuckPage;
