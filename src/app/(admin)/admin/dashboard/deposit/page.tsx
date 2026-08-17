
import {
	Table,
	TableRow,
	TableHead,
	TableHeader,
	TableBody,
	TableCell,
} from '@/components/ui/table';
import SuccessBadge from '@/app/(admin)/components/SuccessBadge';
import CancelledBadge from '@/app/(admin)/components/CancelledBadge';
import { getDepositRequest } from '@/actions/admin/getDepositRequest';
import PendingBadge from '@/app/(admin)/components/PendingBadge';
import HandleButton from './HandleButton';
import {
	AdminPageHeader,
	AdminTableWrap,
} from '@/app/(admin)/components/admin-ui';

const Deposit = async () => {
	const depositRequest = await getDepositRequest();

	return (
		<div className='flex flex-col gap-6'>
			<AdminPageHeader
				title='Deposit requests'
				description='Review and approve incoming deposit requests.'
			/>
			<AdminTableWrap>
				<Table>
					<TableHeader>
						<TableRow className='border-zinc-800 hover:bg-transparent'>
							<TableHead>Date</TableHead>
							<TableHead>User</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Method</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{depositRequest.map((deposit) => (
							<TableRow
								key={deposit.id}
								className='border-zinc-800'
							>
								<TableCell>
									{deposit.createdAt.toLocaleDateString(
										'en-US',
										{
											year: 'numeric',
											month: 'long',
											day: 'numeric',
										},
									)}
								</TableCell>
								<TableCell>{deposit.user.name}</TableCell>
								<TableCell>{deposit.amount}</TableCell>
								<TableCell>{deposit.paymentMethod}</TableCell>
								<TableCell>
									{deposit.status === 'pending' ? (
										<PendingBadge />
									) : deposit.status === 'success' ? (
										<SuccessBadge />
									) : (
										<CancelledBadge />
									)}
								</TableCell>
								<TableCell>
									<HandleButton
										depositId={deposit.id}
										userId={deposit.userId}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</AdminTableWrap>
		</div>
	);
};

export default Deposit;
