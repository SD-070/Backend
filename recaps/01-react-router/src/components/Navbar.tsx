import { useState } from 'react';
import { NavLink } from 'react-router';
const Navbar = () => {
	const [isSignedIn, setIsSignedIn] = useState(false);
	const handleClick = () => setIsSignedIn((prev) => !prev);
	const showActive = ({ isActive }: { isActive: boolean }) =>
		isActive ? 'menu-active' : '';
	return (
		<nav className='flex justify-end bg-slate-800 py-2 px-8 text-2xl mb-6'>
			<ul className='menu'>
				<li className='p-2 rounded-lg hover:bg-slate-600'>
					<NavLink className={showActive} to='/'>
						Home
					</NavLink>
				</li>
				<li className='p-2 rounded-lg hover:bg-slate-600'>
					<NavLink className={showActive} to='/mypond'>
						My Pond
					</NavLink>
				</li>
				<li className='p-2 rounded-lg hover:bg-slate-600'>
					{isSignedIn ? (
						<button onClick={handleClick}>Sign Out</button>
					) : (
						<button onClick={handleClick}>Sign In</button>
					)}
				</li>
			</ul>
		</nav>
	);
};

export default Navbar;
