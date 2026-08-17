import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { XCircleIcon, PencilIcon, EyeIcon } from 'lucide-react';
import { deleteUser, getAllUsers } from '@/actions/admin/users';
import Link from 'next/link';
import {
	AdminIconButton,
	AdminPageHeader,
	AdminTableWrap,
} from '@/app/(admin)/components/admin-ui';

const Users = async () => {
	const users = await getAllUsers();

	return (
		<div className='flex flex-col gap-6'>
			<AdminPageHeader
				title='Users'
				description='View and manage registered accounts.'
			/>

			<AdminTableWrap>
				<Table>
					<TableHeader>
						<TableRow className='border-zinc-800 hover:bg-transparent'>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Phone</TableHead>
							<TableHead>Balance</TableHead>
							<TableHead>Referral Code</TableHead>
							<TableHead>KYC Status</TableHead>
							<TableHead>Registration Date</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.map((user) => (
							<TableRow key={user.id} className='border-zinc-800'>
								<TableCell>{user.name}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{user.phone}</TableCell>
								<TableCell>
									$
									<span className='text-emerald-400'>
										{user.walletBalance?.toFixed(2)}
									</span>
								</TableCell>
								<TableCell>{user.refcode}</TableCell>
								<TableCell>
									{user.isVerified ? (
										<span className='text-emerald-400'>
											Verified
										</span>
									) : (
										<span className='text-red-400'>
											Not Verified
										</span>
									)}
								</TableCell>
								<TableCell>
									{user.createdAt.toLocaleDateString()}
								</TableCell>
								<TableCell>
									<div className='flex flex-wrap items-center gap-2'>
										<Link
											href={`/admin/dashboard/users/${user.id}`}
										>
											<AdminIconButton
												variant='success'
												title='View user'
											>
												<EyeIcon className='h-4 w-4' />
											</AdminIconButton>
										</Link>
										<AdminIconButton
											variant='primary'
											title='Edit user'
										>
											<PencilIcon className='h-4 w-4' />
										</AdminIconButton>
										<form
											action={async () => {
												'use server';
												await deleteUser(user.id);
											}}
										>
											<AdminIconButton
												variant='danger'
												title='Delete user'
												type='submit'
											>
												<XCircleIcon className='h-4 w-4' />
											</AdminIconButton>
										</form>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</AdminTableWrap>
		</div>
	);
};

export default Users;
