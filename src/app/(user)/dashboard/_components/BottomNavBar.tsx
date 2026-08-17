'use client';
import DepositIcon from '@/components/ui/DepositIcon';
import { Logout } from './Logout';
import {  BarChart, HomeIcon, MoreHorizontal, UserIcon,SettingsIcon,
	CreditCardIcon,
    Receipt,
    BookCheck,
    LightbulbIcon,
    LinkIcon,
    UsersIcon, } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import WithdrawIcon from '@/components/ui/WithdrawIcon';

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
            icon:<BarChart />,
		},
		{
			label: 'Deposit',
			href: '/dashboard/deposit',
            icon:<DepositIcon />,
		},
		{
			label: 'Withdraw',
			href: '/dashboard/withdraw',
            icon:<WithdrawIcon />,
		},
		{
			label: 'More',
			href: '/dashboard/plans',
            icon:<MoreHorizontal />,
		},
	];
    const[showMenu, setShowMenu] = React.useState(false);
    
  return (
		<div className='sm:hidden max-w-[99%] fixed bottom-2 left-0 right-0  flex justify-center items-center z-50 bg-zinc-950/90 backdrop-blur-md border border-zinc-800 rounded-lg shadow-md'>
			{showMenu && <MoreMenu />}
			<div className='flex justify-space-around items-center gap-3  text-white py-2 px-4 mx-2 rounded-lg shadow-md'>
				{items.map((item) => (
					<div className='text-gray-400 p-2'>
						{item.label === 'More' ? (
							<div
								onClick={() => setShowMenu((prev) => !prev)}
								className='flex flex-col justify-center items-center gap-1 text-sm text-gray-400 hover:text-blue-500 transition'
							>
								{item.icon}
								<span className='text-xs '>More</span>
							</div>
						) : (
							<a
								key={item.label}
								href={item.href}
								className='flex flex-col justify-center items-center gap-1 text-sm text-gray-400 hover:text-blue-500 transition'
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
}
  
const MoreMenu = () => {
    return (
		<div className='absolute bottom-20 right-0  bg-zinc-900 backdrop-blur-md border border-zinc-800 rounded-lg z-50 shadow-md p-4 w-[200px]'>
			<div className='flex flex-col gap-3'>
				<Link
					href='/dashboard/traders'
					className='text-gray-400 hover:text-blue-500 transition'
				>
					<UsersIcon className='w-5 h-5 mr-2 inline-block' />
					Copy Traders
				</Link>
				<Link
					href='/dashboard/trading-history'
					className='text-gray-400 hover:text-blue-500 transition'
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
							fill-rule='evenodd'
							clip-rule='evenodd'
						></path>
					</svg>
					Copy Trading
				</Link>
				<Link
					href='/dashboard/referrals'
					className='text-gray-400 hover:text-blue-500 transition'
				>
					<LinkIcon className='w-5 h-5 mr-2 inline-block' />
					Referrals
				</Link>
				<Link
					href='/dashboard/ranking'
					className='text-gray-400 hover:text-blue-500 transition'
				>
					<LightbulbIcon className='w-5 h-5 mr-2 inline-block' />
					Ranking
				</Link>
				<Link
					href='/dashboard/kyc'
					className='text-gray-400 hover:text-blue-500 transition'
				>
					<CreditCardIcon className='w-5 h-5 mr-2 inline-block' />
					KYC Verification
				</Link>
				<Link
					href='/dashboard/login-tracking'
					className='text-gray-400 hover:text-blue-500 transition'
				>
					<BookCheck className='w-5 h-5 mr-2 inline-block' />
					Login History
				</Link>
				<Link
					href='/dashboard/settings'
					className='text-gray-400 hover:text-blue-500 transition'
				>
					<SettingsIcon className='w-5 h-5 mr-2 inline-block' />
					Settings
				</Link>

				<Logout />
			</div>
		</div>
	);
}   

export default BottomNavBar