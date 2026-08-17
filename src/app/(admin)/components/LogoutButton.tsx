'use client';
import { logoutAdmin } from '@/actions/auth/admin';
import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
export default function LogoutButton() {
	const router = useRouter();
	const handleLogout = async () => {
		await logoutAdmin();
		router.push('/admin/login');
	};
	return (
		<button onClick={handleLogout} className='flex items-center gap-2'>
			<LogOutIcon className='w-4 h-4 text-gray-700' />
			Logout
		</button>
	);
}
