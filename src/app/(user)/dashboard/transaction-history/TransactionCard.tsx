import React from 'react';
import { dashboardMoneyClass } from '@/lib/userFormStyles';

// Shared shape + presentational pieces used by AllTransactions,
// DepositHistory, and WithdrawalHistory. Adjust the field names here
// if your actual data (from getAllTransactions / getDepositHistory /
// getWithdrawalHistory) differs.
export interface Transaction {
	transactionId: string;
	createdAt: Date;
	amount: number;
	type: 'deposit' | 'withdrawal' | 'trade';
	status: 'success' | 'pending' | 'cancelled' | 'expired';
	/** Asset pair, copy trader name, payment method, etc. */
	subtitle?: string;
	/** Override debit/credit badge (e.g. trade loss) */
	isDebit?: boolean;
}

export function formatDate(date: Date): string {
	return date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

export function formatTime(date: Date): string {
	return date.toLocaleTimeString('en-US', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	});
}

export function formatAmount(amount: number): string {
	return `$${amount.toFixed(2)}`;
}

export const DirectionBadge = ({
	type,
	isDebit,
}: {
	type: Transaction['type'];
	isDebit?: boolean;
}) => {
	const debit = isDebit ?? type === 'withdrawal';
	return (
		<span
			className={`rounded-full px-3 py-1 text-sm font-medium ${
				debit
					? 'bg-red-900/60 text-red-300'
					: 'bg-emerald-900/60 text-emerald-300'
			}`}
		>
			{debit ? 'DEBIT' : 'CREDIT'}
		</span>
	);
};

export const StatusBadge = ({ status }: { status: Transaction['status'] }) => {
	const styles: Record<Transaction['status'], string> = {
		success: 'bg-emerald-900/60 text-emerald-300',
		pending: 'bg-amber-900/60 text-amber-300',
		cancelled: 'bg-zinc-700 text-gray-300',
		expired: 'bg-zinc-700 text-gray-300',
	};
	const labels: Record<Transaction['status'], string> = {
		success: 'Completed',
		pending: 'Pending',
		cancelled: 'Cancelled',
		expired: 'Expired',
	};
	return (
		<span
			className={`rounded-full px-3 py-1 text-sm font-medium ${styles[status]}`}
		>
			{labels[status]}
		</span>
	);
};

export const TransactionCard = ({
	transaction,
}: {
	transaction: Transaction;
}) => (
	<div className='rounded-md border border-zinc-700 bg-zinc-800 p-6 space-y-4'>
		<div className='flex items-start justify-between'>
			<div>
				<p className='text-xs uppercase tracking-wide text-gray-400'>
					Date
				</p>
				<p className='text-sm font-medium text-white'>
					{formatDate(transaction.createdAt)}
				</p>
				<p className='text-sm text-gray-400'>
					{formatTime(transaction.createdAt)}
				</p>
			</div>

			<div className='flex flex-col items-end gap-2'>
				<DirectionBadge
					type={transaction.type}
					isDebit={transaction.isDebit}
				/>
				<StatusBadge status={transaction.status} />
			</div>
		</div>

		<div className='border-t border-zinc-700 pt-4'>
			<p className='text-xs uppercase tracking-wide text-gray-400'>
				Type
			</p>
			<p className='text-sm font-medium uppercase text-white'>
				{transaction.type}
			</p>
			{transaction.subtitle && (
				<p className='mt-1 text-sm text-gray-400'>{transaction.subtitle}</p>
			)}
		</div>

		<div className='flex items-center justify-between border-t border-dashed border-zinc-700 pt-4'>
			<p className='text-gray-400'>Amount</p>
			<p className={dashboardMoneyClass}>
				{formatAmount(transaction.amount)}
			</p>
		</div>
	</div>
);

export const TransactionCardList = ({
	transactions,
	emptyMessage = 'No transactions found.',
}: {
	transactions: Transaction[];
	emptyMessage?: string;
}) => {
	if (transactions.length === 0) {
		return <p className='py-8 text-center text-gray-500'>{emptyMessage}</p>;
	}

	return (
		<div className='space-y-4'>
			{transactions.map((transaction) => (
				<TransactionCard
					key={transaction.transactionId}
					transaction={transaction}
				/>
			))}
		</div>
	);
};
