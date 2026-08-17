'use client';

import React from 'react';
import { useUser } from '@/lib/context/UserContext';
import Link from 'next/link';
import { BellDotIcon, MessageCircleIcon, SettingsIcon } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';

export const UserMenu = () => {
	const { user, loading } = useUser();
	const [menuOpen, setMenuOpen] = React.useState(false);
	const menuRef = React.useRef<HTMLDivElement>(null);

	useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

	if (loading) {
		return (
			<div className='h-8 w-8 animate-pulse rounded-full bg-gray-200 sm:h-10 sm:w-10' />
		);
	}

	return (
		<div ref={menuRef} className='relative'>
			{menuOpen && (
				<div className='absolute right-0 top-full z-50 mt-2 w-[200px] space-y-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4 shadow-md'>
					<Link
						href='/dashboard/settings'
						onClick={() => setMenuOpen(false)}
						className='flex items-center gap-2 text-gray-400 transition hover:text-blue-500'
					>
						<SettingsIcon className='h-5 w-5' />
						Settings
					</Link>
					<Link
						href='/dashboard'
						onClick={() => setMenuOpen(false)}
						className='flex items-center gap-2 text-gray-400 transition hover:text-blue-500'
					>
						<MessageCircleIcon className='h-5 w-5' />
						Support
					</Link>
				</div>
			)}
			<div className='flex items-center gap-5'>
				<Link href='/dashboard/notification'>
					<BellDotIcon className='h-6 w-6 text-gray-400' />
				</Link>
				<button
					type='button'
					className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-gray-400 transition hover:text-blue-500'
					onClick={() => setMenuOpen((prev) => !prev)}
					aria-expanded={menuOpen}
					aria-label='User menu'
				>
					{user?.name?.charAt(0).toUpperCase()}
					{user?.name?.split(' ')[1]?.charAt(0).toUpperCase()}
				</button>
			</div>
		</div>
	);
};
