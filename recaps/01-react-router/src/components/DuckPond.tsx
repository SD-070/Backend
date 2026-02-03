import { Link } from 'react-router';
import type { Duck } from '../types';
import DuckCard from './DuckCard';

type DuckPondProps = {
	ducks: Duck[];
	loading?: boolean;
	error?: string | null;
};

const DuckPond = ({ ducks, loading, error }: DuckPondProps) => {
	return (
		<section
			id='pond'
			className='flex justify-center flex-wrap gap-4 p-4 w-full'
		>
			{loading && <p className='text-center font-medium'>Loading...</p>}
			{error && (
				<p className='text-center text-red-500 font-semibold'>{error}</p>
			)}
			{!loading &&
				!error &&
				ducks.map((duck) => (
					<Link key={duck._id} to={`ducks/${duck._id}`}>
						<DuckCard duck={duck} />
					</Link>
				))}
		</section>
	);
};

export default DuckPond;
