'use client';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';

type UserData = {
	id: string;
	name: string;
	email: string;
	phone: string;
	walletBalance: number | null;
	profitBalance: number | null;
	investmentBalance: number | null;
	targetBalance: number | null;
	refcode: string | null;
	isVerified: boolean;
	createdAt: Date;
};

interface UserSelectProps {
	users: UserData[];
	defaultUserId?: string;
}

const UserSelect = ({ users, defaultUserId }: UserSelectProps) => {
	const router = useRouter();

	const handleUserChange = (userId: string) => {
		router.push(`/admin/dashboard/livetrade?userId=${userId}`);
	};

	return (
		<Select
			defaultValue={defaultUserId}
			onValueChange={handleUserChange}
		>
			<SelectTrigger className='mb-4 w-full border-zinc-700 bg-zinc-800 text-white md:mb-0 md:w-1/3'>
				<SelectValue placeholder='Select a user' />
			</SelectTrigger>
			<SelectContent>
				{users.map((user) => (
					<SelectItem
						key={user.id}
						value={user.id}
					>
						{user.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

export default UserSelect;
