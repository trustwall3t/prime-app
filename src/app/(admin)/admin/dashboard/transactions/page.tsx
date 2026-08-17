import {
	Table,
	TableHead,
	TableRow,
	TableHeader,
	TableCell,
	TableBody,
} from '@/components/ui/table';
import SuccessBadge from '@/app/(admin)/components/SuccessBadge';
import { getAllTransactions } from '@/actions/admin/getAlltransactions';
import PendingBadge from '@/app/(admin)/components/PendingBadge';
import CancelledBadge from '@/app/(admin)/components/CancelledBadge';
import {
	AdminPageHeader,
	AdminTableWrap,
} from '@/app/(admin)/components/admin-ui';

const Transactions = async () => {
	const transactions = await getAllTransactions();

	return (
		<div className='flex flex-col gap-6'>
			<AdminPageHeader
				title='Transactions'
				description='Full history of deposits, withdrawals, and trades.'
			/>
			<AdminTableWrap>
				<Table>
					<TableHeader>
						<TableRow className='border-zinc-800 hover:bg-transparent'>
							<TableHead>Date</TableHead>
							<TableHead>Transaction ID</TableHead>
							<TableHead>User</TableHead>
							<TableHead>Amount</TableHead>
							<TableHead>Transaction Type</TableHead>
							<TableHead>Payment Method</TableHead>
							<TableHead>Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{transactions.map((transaction) => (
							<TableRow
								key={transaction.transactionId}
								className='border-zinc-800'
							>
								<TableCell>
									{transaction.createdAt.toLocaleDateString(
										'en-US',
										{
											year: 'numeric',
											month: 'long',
											day: 'numeric',
										},
									)}
								</TableCell>
								<TableCell>{transaction.transactionId}</TableCell>
								<TableCell>{transaction.user.name}</TableCell>
								<TableCell>{transaction.amount}</TableCell>
								<TableCell>
									{transaction.transactionType}
								</TableCell>
								<TableCell>{transaction.paymentMethod}</TableCell>
								<TableCell>
									{transaction.status === 'success' ? (
										<SuccessBadge />
									) : transaction.status === 'pending' ? (
										<PendingBadge />
									) : (
										<CancelledBadge />
									)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</AdminTableWrap>
		</div>
	);
};

export default Transactions;
