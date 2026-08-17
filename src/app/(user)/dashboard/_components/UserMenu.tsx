'use client';
import React from 'react';
import { useUser } from '@/lib/context/UserContext';

import Link from 'next/link';
import { Logout } from './Logout';
import { BellDotIcon, MessageCircleIcon, SettingsIcon } from 'lucide-react';

export const UserMenu = () => {
	const { user, loading } = useUser();
	const [menuOpen, setMenuOpen] = React.useState(false);
	if (loading) {
		return (
			<div className='w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full animate-pulse' />
		);
	}

	return (
		<>
		{menuOpen && <MoreMenu />}
			<div className='flex items-center gap-5'>
				<Link href={'/dashboard/notification'}>
					<BellDotIcon className='w-6 h-6 text-gray-400' />
				</Link>
				<div
					className='w-10 h-10 bg-zinc-800 rounded-full text-gray-400 flex items-center justify-center text-sm font-semibold cursor-pointer hover:text-blue-500 transition'
					onClick={() => setMenuOpen((prev) => !prev)}
				>
					{user?.name?.charAt(0).toUpperCase()}
					{user?.name?.split(' ')[1]?.charAt(0).toUpperCase()}
				</div>
			</div>
		</>
	);
};

const MoreMenu = () => {
	
	return (
		<div className='absolute top-16 right-2 w-[200px] bg-zinc-900 border border-zinc-800 rounded-lg shadow-md p-4 space-y-3'>
			<Link
				href='/dashboard/settings'
				className='flex items-center gap-2 text-gray-400 hover:text-blue-500 transition'
			>
				<SettingsIcon className='w-5 h-5 ' />
				Settings
			</Link>
			<Link
				href='/dashboard/settings'
				className='flex items-center gap-2 text-gray-400 hover:text-blue-500 transition'
			>
				<MessageCircleIcon className='w-5 h-5 ' />
				Support
			</Link>
		</div>
	);
}