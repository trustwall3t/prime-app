'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { MenuIcon, ChevronDown } from 'lucide-react';

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

	const toggleDropdown = (dropdownName: string) => {
		setActiveDropdown(
			activeDropdown === dropdownName ? null : dropdownName
		);
	};

	return (
		<div className='site-top-2'>
			<header
				className='header-standard header-light'
				id='header'
			>
				<div className='container'>
					<div className='site-nav-inner'>
						<nav className='navbar navbar-expand-lg'>
							<div className='navbar-brand navbar-header'>
								<div className='logo'>
									<Link href='/'>
										<Image
											src='/logo-black.png'
											width={100}
											height={50}
											alt='Tinkan trust'
										/>
									</Link>
								</div>
							</div>

							<button
								className='navbar-toggler'
								type='button'
								onClick={() => setIsMenuOpen(!isMenuOpen)}
							>
								<MenuIcon className='w-10 h-10 text-blue-600' />
							</button>

							<div
								className={`bg-black/10 w-full h-screen fixed top-0 left-0 z-10 flex flex-col ${
									isMenuOpen ? 'flex' : 'hidden'
								}`}
								onClick={(e) => {
									e.stopPropagation();
									setIsMenuOpen(!isMenuOpen);
								}}
							>
								<ul className='flex flex-col gap-4 items-start w-[300px] h-[100svh]  bg-white p-4'>
									<li className='w-full'>
										<Link
											href='/about-us'
											className='text-blue-700 block py-2'
										>
											About
										</Link>
									</li>

									<li className='w-full'>
										<button
											onClick={(e) => {
												e.stopPropagation();
												toggleDropdown('mirror');
											}}
											className='flex items-center justify-between w-full py-2 text-left'
										>
											<span>Mirror Trades</span>
											<ChevronDown
												className={`w-4 h-4 transition-transform ${
													activeDropdown === 'mirror'
														? 'rotate-180'
														: ''
												}`}
											/>
										</button>
										{activeDropdown === 'mirror' && (
											<ul className='pl-4 space-y-2 mt-2'>
												<li>
													<Link
														href='/options'
														className='block py-1 hover:text-blue-600'
													>
														Options Copy trading
													</Link>
												</li>
												<li>
													<Link
														href='/stocks'
														className='block py-1 hover:text-blue-600'
													>
														Stocks
													</Link>
												</li>
												<li>
													<Link
														href='/forex'
														className='block py-1 hover:text-blue-600'
													>
														Forex
													</Link>
												</li>
												<li>
													<Link
														href='/indices'
														className='block py-1 hover:text-blue-600'
													>
														Indices
													</Link>
												</li>
											</ul>
										)}
									</li>

									<li className='w-full'>
										<button
											onClick={(e) =>{
												e.stopPropagation();
												toggleDropdown('services')
											}}
											className='flex items-center justify-between w-full py-2 text-left'
										>
											<span>Our Services</span>
											<ChevronDown
												className={`w-4 h-4 transition-transform ${
													activeDropdown ===
													'services'
														? 'rotate-180'
														: ''
												}`}
											/>
										</button>
										{activeDropdown === 'services' && (
											<ul className='pl-4 space-y-2 mt-2'>
												<li>
													<Link
														href='/mutual-funds'
														className='block py-1 hover:text-blue-600'
													>
														Mutual Funds
													</Link>
												</li>
												<li>
													<Link
														href='/real-estate'
														className='block py-1 hover:text-blue-600'
													>
														Real Estate
													</Link>
												</li>
												<li>
													<Link
														href='/retirement'
														className='block py-1 hover:text-blue-600'
													>
														Retirement
													</Link>
												</li>
												<li>
													<Link
														href='/infrastructure'
														className='block py-1 hover:text-blue-600'
													>
														Infrastructure
													</Link>
												</li>
												<li>
													<Link
														href='/agriculture'
														className='block py-1 hover:text-blue-600'
													>
														Agriculture
													</Link>
												</li>
												<li>
													<Link
														href='/stocks'
														className='block py-1 hover:text-blue-600'
													>
														Stock Market
													</Link>
												</li>
												<li>
													<Link
														href='/commodities'
														className='block py-1 hover:text-blue-600'
													>
														Commodities
													</Link>
												</li>
												<li>
													<Link
														href='/oil-and-gas'
														className='block py-1 hover:text-blue-600'
													>
														Oil & Gas
													</Link>
												</li>
												<li>
													<Link
														href='/bitcoin-mining'
														className='block py-1 hover:text-blue-600'
													>
														Bitcoin Mining
													</Link>
												</li>
											</ul>
										)}
									</li>

									

									<li className='w-full'>
										<button
											onClick={(e) => {
												e.stopPropagation();
												toggleDropdown('user');
											}}
											className='flex items-center justify-between w-full py-2 text-left'
										>
											<span>User</span>
											<ChevronDown
												className={`w-4 h-4 transition-transform ${
													activeDropdown === 'user'
														? 'rotate-180'
														: ''
												}`}
											/>
										</button>
										{activeDropdown === 'user' && (
											<ul className='pl-4 space-y-2 mt-2'>
												<li>
													<Link
														href='/auth/signup'
														className='block py-1 hover:text-blue-600'
													>
														Sign Up
													</Link>
												</li>
												<li>
													<Link
														href='/login'
														className='block py-1 hover:text-blue-600'
													>
														Log In
													</Link>
												</li>
											</ul>
										)}
									</li>
								</ul>
							</div>
						</nav>
					</div>
				</div>
			</header>
		</div>
	);
}
