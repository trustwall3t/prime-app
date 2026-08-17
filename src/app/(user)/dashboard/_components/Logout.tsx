'use client'
import { logout } from "@/actions/auth/login";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
export const Logout = () => {
	const router = useRouter();
    const handleLogout = async () => {
        await logout();
        router.push('/login');
    }
	return (
		<div
			onClick={handleLogout}
		    className='flex items-center gap-2 text-gray-400 hover:text-blue-500 transition cursor-pointer'
		>
			<LogOutIcon className='text-gray-400 w-5 h-5' />
			Logout
		</div>
	);
};
