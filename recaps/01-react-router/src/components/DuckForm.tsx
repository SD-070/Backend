import {
	useState,
	type ChangeEventHandler,
	type SubmitEventHandler
} from 'react';
import type { Duck, SetDucks } from '../types';
const DuckForm = ({ setDucks }: { setDucks: SetDucks }) => {
	const [form, setForm] = useState({
		name: '',
		imgUrl: '',
		quote: ''
	});
	const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};
	const handleSubmit: SubmitEventHandler = (e) => {
		e.preventDefault();
		try {
			if (!form.name.trim()) {
				throw new Error('Name is required');
			}
			if (!form.imgUrl.trim()) {
				throw new Error('Image URL is required');
			}
			if (!form.quote.trim()) {
				throw new Error('Quote is required');
			}
			const newDuck: Duck = { ...form, _id: crypto.randomUUID() };
			console.log(newDuck);

			setDucks((prev) => [...prev, newDuck]);
			setForm({
				name: '',
				imgUrl: '',
				quote: ''
			});
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		}
	};
	return (
		<section
			onSubmit={handleSubmit}
			className='flex flex-col items-center gap-4 border-2 rounded-lg p-4 mx-8'
		>
			<h2 className='text-4xl'>Add a new duck to my pond!</h2>
			<form id='add-form' className='flex flex-col gap-4 w-3/4'>
				<label className='w-full flex gap-2 items-baseline'>
					<span className='text-xl'>Name:</span>
					<input
						onChange={handleChange}
						value={form.name}
						name='name'
						type='text'
						placeholder="What is your duck's name?"
						className='bg-inherit border-solid border-2 border-slate-700 rounded-lg p-2 flex-grow'
					/>
				</label>
				<label className='w-full flex gap-2 items-baseline'>
					<span className='text-xl'>Image:</span>
					<input
						onChange={handleChange}
						value={form.imgUrl}
						name='imgUrl'
						type='url'
						placeholder='What does your duck look like?'
						className='bg-inherit border-solid border-2 border-slate-700 rounded-lg p-2 w-full'
					/>
				</label>
				<label className='w-full flex gap-2 items-baseline'>
					<span className='text-xl'>Quote:</span>
					<input
						onChange={handleChange}
						value={form.quote}
						name='quote'
						type='text'
						placeholder='What does your duck say?'
						className='bg-inherit border-solid border-2 border-slate-700 rounded-lg p-2 w-full'
					/>
				</label>
				<button type='submit' className='bg-green-600 p-2 rounded-lg font-bold'>
					Add duck
				</button>
			</form>
		</section>
	);
};

export default DuckForm;
