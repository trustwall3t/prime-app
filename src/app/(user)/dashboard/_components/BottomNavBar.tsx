'use client';

import DepositIcon from '@/components/ui/DepositIcon';
import { Logout } from './Logout';
import {
	BarChart,
	BookCheck,
	CreditCardIcon,
	HomeIcon,
	LightbulbIcon,
	LinkIcon,
	MoreHorizontal,
	SettingsIcon,
	UsersIcon,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';
import WithdrawIcon from '@/components/ui/WithdrawIcon';
import { useClickOutside } from '@/hooks/useClickOutside';

const BottomNavBar = () => {
	const items = [
		{
			label: 'Home',
			href: '/dashboard',
			icon: <HomeIcon />,
		},
		{
			label: 'Markets',
			href: '/dashboard/live-trading',
			icon: <BarChart />,
		},
		{
			label: 'Deposit',
			href: '/dashboard/deposit',
			icon: <DepositIcon />,
		},
		{
			label: 'Withdraw',
			href: '/dashboard/withdraw',
			icon: <WithdrawIcon />,
		},
		{
			label: 'More',
			href: '/dashboard/plans',
			icon: <MoreHorizontal />,
		},
	];
	const [showMenu, setShowMenu] = React.useState(false);
	const navRef = React.useRef<HTMLDivElement>(null);

	useClickOutside(navRef, () => setShowMenu(false), showMenu);

	return (
		<div
			ref={navRef}
			className='fixed bottom-2 left-0 right-0 z-50 flex max-w-[99%] items-center justify-center rounded-lg border border-zinc-800 bg-zinc-950/90 shadow-md backdrop-blur-md sm:hidden'
		>
			{showMenu && (
				<div className='absolute bottom-20 right-0 z-50 w-[200px] rounded-lg border border-zinc-800 bg-zinc-900 p-4 shadow-md backdrop-blur-md'>
					<div className='flex flex-col gap-3'>
						<Link
							href='/dashboard/traders'
							onClick={() => setShowMenu(false)}
							className='text-gray-400 transition hover:text-blue-500'
						>
							<UsersIcon className='mr-2 inline-block h-5 w-5' />
							Copy Traders
						</Link>
						<Link
							href='/dashboard/trading-history'
							onClick={() => setShowMenu(false)}
							className='text-gray-400 transition hover:text-blue-500'
						>
							<svg
								width='20'
								height='20'
								viewBox='0 0 15 15'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
								className='mr-2 inline-block'
							>
								<path
									d='M2 3.5C2 3.22386 2.22386 3 2.5 3H12.5C12.7761 3 13 3.22386 13 3.5V9.5C13 9.77614 12.7761 10 12.5 10H2.5C2.22386 10 2 9.77614 2 9.5V3.5ZM2 10.9146C1.4174 10.7087 1 10.1531 1 9.5V3.5C1 2.67157 1.67157 2 2.5 2H12.5C13.3284 2 14 2.67157 14 3.5V9.5C14 10.1531 13.5826 10.7087 13 10.9146V11.5C13 12.3284 12.3284 13 11.5 13H3.5C2.67157 13 2 12.3284 2 11.5V10.9146ZM12 11V11.5C12 11.7761 11.7761 12 11.5 12H3.5C3.22386 12 3 11.7761 3 11.5V11H12Z'
									fill='currentColor'
									fillRule='evenodd'
									clipRule='evenodd'
								/>
							</svg>
							Copy Trading
						</Link>
						<Link
							href='/dashboard/referrals'
							onClick={() => setShowMenu(false)}
							className='text-gray-400 transition hover:text-blue-500'
						>
							<LinkIcon className='mr-2 inline-block h-5 w-5' />
							Referrals
						</Link>
						<Link
							href='/dashboard/ranking'
							onClick={() => setShowMenu(false)}
							className='text-gray-400 transition hover:text-blue-500'
						>
							<LightbulbIcon className='mr-2 inline-block h-5 w-5' />
							Ranking
						</Link>
						<Link
							href='/dashboard/kyc'
							onClick={() => setShowMenu(false)}
							className='text-gray-400 transition hover:text-blue-500'
						>
							<CreditCardIcon className='mr-2 inline-block h-5 w-5' />
							KYC Verification
						</Link>
						<Link
							href='/dashboard/login-tracking'
							onClick={() => setShowMenu(false)}
							className='text-gray-400 transition hover:text-blue-500'
						>
							<BookCheck className='mr-2 inline-block h-5 w-5' />
							Login History
						</Link>
						<Link
							href='/dashboard/settings'
							onClick={() => setShowMenu(false)}
							className='text-gray-400 transition hover:text-blue-500'
						>
							<SettingsIcon className='mr-2 inline-block h-5 w-5' />
							Settings
						</Link>

						<Logout />
					</div>
				</div>
			)}
			<div className='mx-2 flex items-center justify-evenly gap-4 rounded-lg px-4 py-2 text-white shadow-md'>
				{items.map((item) => (
					<div className='p-2 text-gray-400' key={item.label}>
						{item.label === 'More' ? (
							<button
								type='button'
								onClick={() => setShowMenu((prev) => !prev)}
								className='flex flex-col items-center justify-center gap-1 text-sm text-gray-400 transition hover:text-blue-500'
								aria-expanded={showMenu}
								aria-label='More menu'
							>
								{item.icon}
								<span className='text-xs'>More</span>
							</button>
						) : (
							<a
								href={item.href}
								className='flex flex-col items-center justify-center gap-1 text-sm text-gray-400 transition hover:text-blue-500'
							>
								{item.icon}
								<span className='text-xs'>{item.label}</span>
							</a>
						)}
					</div>
				))}
			</div>
		</div>
	);
};

export default BottomNavBar;
