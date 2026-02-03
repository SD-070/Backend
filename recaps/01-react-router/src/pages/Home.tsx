import { useState, useEffect } from 'react';
import { getAllDucks } from '../data/ducks';

import Header from '../components/Header';
import DuckPond from '../components/DuckPond';
import DuckForm from '../components/DuckForm';

import type { Duck } from '../types';

function Home() {
	const [ducks, setDucks] = useState<Duck[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const abortController = new AbortController();
		(async () => {
			setLoading(true);
			setError(null);
			try {
				const allDucks = await getAllDucks(abortController);

				setDucks(allDucks);
			} catch (error) {
				if (error instanceof Error && error.name === 'AbortError') {
					console.info('Fetch aborted');
				} else {
					console.error(error);
					setError('Error bringing ducks to the pond');
				}
			} finally {
				setLoading(false);
			}
		})();

		return () => {
			abortController.abort();
		};
	}, []);
	return (
		<>
			<Header />
			<DuckPond error={error} loading={loading} ducks={ducks} />
			<DuckForm setDucks={setDucks} />
		</>
	);
}

export default Home;
