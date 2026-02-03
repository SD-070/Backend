import DuckPond from '../components/DuckPond';
import DuckForm from '../components/DuckForm';

import { useState } from 'react';
import type { Duck } from '../types';

const MyPond = () => {
	const [myDucks, setMyDucks] = useState<Duck[]>(
		localStorage.getItem('myDucks')
			? JSON.parse(localStorage.getItem('myDucks')!)
			: []
	);
	return (
		<>
			<DuckPond ducks={myDucks} />
			<DuckForm setDucks={setMyDucks} />
		</>
	);
};

export default MyPond;
