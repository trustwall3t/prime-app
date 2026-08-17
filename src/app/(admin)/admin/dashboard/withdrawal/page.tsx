import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from '@/components/ui/table';
import { CheckCircleIcon, TrashIcon, XCircleIcon } from 'lucide-react';
import PendingBadge from '@/app/(admin)/components/PendingBadge';
import {
	approveWithdrawalRequest,
	deleteWithdrawalRequest,
	getAllWithdrawalRequest,
	rejectWithdrawalRequest,
} from '@/actions/admin/getWithdrawalRequest';
import SuccessBadge from '@/app/(admin)/components/SuccessBadge';
import CancelledBadge from '@/app/(admin)/components/CancelledBadge';
import {
	AdminIconButton,
	AdminPageHeader,
	AdminTableWrap,
} from '@/app/(admin)/components/admin-ui';

const Withdrawal = async () => {
	const withdrawalRequest = await getAllWithdrawalRequest();

	return (
		<div className='flex flex-col gap-6'>
			<AdminPageHeader
				title='Withdrawal requests'
				description='Approve, reject, or remove withdrawal requests.'
			/>
			<AdminTableWrap>
				<Table>
					<TableHeader>
						<TableRow className='border-zinc-800 hover:bg-transparent'>
							<TableHead>Date</TableHead>
							<TableHead>User</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Wallet Address</TableHead>
							<TableHead>Method</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{withdrawalRequest.map((request) => (
							<TableRow
								key={request.id}
								className='border-zinc-800'
							>
								<TableCell>
									{request.createdAt.toLocaleDateString(
										'en-US',
										{
											year: 'numeric',
											month: 'long',
											day: 'numeric',
										},
									)}
								</TableCell>
								<TableCell>{request.user.name}</TableCell>
								<TableCell>{request.amount}</TableCell>
								<TableCell>{request.postType}</TableCell>
								<TableCell>{request.paymentMethod}</TableCell>
								<TableCell>
									{request.status === 'pending' ? (
										<PendingBadge />
									) : request.status === 'success' ? (
										<SuccessBadge />
									) : (
										<CancelledBadge />
									)}
								</TableCell>
								<TableCell>
									<div className='flex gap-2'>
										<form
											action={async () => {
												'use server';
												await approveWithdrawalRequest(
													request.id,
												);
											}}
										>
											<AdminIconButton
												variant='success'
												type='submit'
												title='Approve'
											>
												<CheckCircleIcon className='h-4 w-4' />
											</AdminIconButton>
										</form>
										<form
											action={async () => {
												'use server';
												await rejectWithdrawalRequest(
													request.id,
												);
											}}
										>
											<AdminIconButton
												variant='warning'
												type='submit'
												title='Reject'
											>
												<XCircleIcon className='h-4 w-4' />
											</AdminIconButton>
										</form>
										<form
											action={async () => {
												'use server';
												await deleteWithdrawalRequest(
													request.id,
												);
											}}
										>
											<AdminIconButton
												variant='danger'
												type='submit'
												title='Delete'
											>
												<TrashIcon className='h-4 w-4' />
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

export default Withdrawal;
