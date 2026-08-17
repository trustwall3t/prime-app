'use client';

import { SettingsIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { logoutAdmin } from '@/actions/auth/admin';
import { useRouter } from 'next/navigation';

export default function AdminMenu() {
	const [open, setOpen] = useState(false);
	const router = useRouter();

	const handleLogout = async () => {
		await logoutAdmin();
		router.push('/admin/login');
	};

	return (
		<div className='relative'>
			<button
				type='button'
				onClick={() => setOpen((prev) => !prev)}
				className='flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800 text-sm font-semibold text-gray-400 transition hover:text-blue-500'
			>
				AD
			</button>
			{open && (
				<div className='absolute top-12 right-0 z-50 w-[200px] space-y-3 rounded-lg border border-zinc-800 bg-zinc-900 p-4 shadow-md'>
					<p className='text-xs text-gray-500'>Admin</p>
					<p className='text-sm font-medium text-white'>Dashboard</p>
					<Link
						href='/admin/dashboard/settings'
						className='flex items-center gap-2 text-gray-400 transition hover:text-blue-500'
						onClick={() => setOpen(false)}
					>
						<SettingsIcon className='h-5 w-5' />
						Settings
					</Link>
					<button
						type='button'
						onClick={handleLogout}
						className='flex w-full items-center gap-2 text-left text-gray-400 transition hover:text-red-400'
					>
						Logout
					</button>
				</div>
			)}
		</div>
	);
}
