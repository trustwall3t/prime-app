import { roundMoney, toMoneyNumber } from '@/lib/money';
import type { Transaction } from '@/app/(user)/dashboard/transaction-history/TransactionCard';

type DbTransaction = {
	id: string;
	transactionId: string;
	createdAt: Date;
	amount: number;
	status: string;
	transactionType: string;
	type: string;
	pair: string | null;
	postType: string;
};

type DbTrade = {
	id: string;
	assetSymbol: string;
	direction: string;
	stake: unknown;
	profit: unknown;
	status: string;
	openedAt: Date;
	closedAt: Date | null;
	traderId: string | null;
	trader?: { name: string } | null;
	asset?: { name: string } | null;
};

function normalizeStatus(status: string): Transaction['status'] {
	const s = status.toLowerCase();
	if (s === 'success' || s === 'approved') return 'success';
	if (s === 'pending') return 'pending';
	if (s === 'cancelled' || s === 'rejected') return 'cancelled';
	if (s === 'expired') return 'expired';
	return 'pending';
}

export function mapDbTransaction(row: DbTransaction): Transaction {
	const isDeposit = row.transactionType === 'deposit';
	const isWithdrawal = row.transactionType === 'withdrawal';

	return {
		transactionId: row.transactionId || row.id,
		createdAt: row.createdAt,
		amount: row.amount,
		type: isDeposit ? 'deposit' : isWithdrawal ? 'withdrawal' : 'trade',
		status: normalizeStatus(row.status),
		subtitle: row.pair || row.postType || row.type,
		isDebit: isWithdrawal,
	};
}

export function mapLiveTrade(row: DbTrade): Transaction {
	const stake = toMoneyNumber(row.stake);
	const profit =
		row.profit != null ? roundMoney(toMoneyNumber(row.profit)) : null;
	const isOpen = row.status === 'open';
	const isLoss = row.status === 'lost';
	const asset = row.asset?.name ?? row.assetSymbol;
	const side = row.direction === 'up' ? 'UP' : 'DOWN';
	const copyLabel = row.trader?.name ? ` · Copy: ${row.trader.name}` : '';

	let status: Transaction['status'] = 'success';
	if (isOpen) status = 'pending';
	else if (row.status === 'even') status = 'success';

	const amount = isOpen ? stake : Math.abs(profit ?? 0);

	return {
		transactionId: row.id,
		createdAt: row.closedAt ?? row.openedAt,
		amount,
		type: 'trade',
		status,
		subtitle: `${asset} ${side}${copyLabel}`,
		isDebit: isLoss || isOpen,
	};
}

export function mergeTransactionHistory(
	legacy: DbTransaction[],
	trades: DbTrade[],
): Transaction[] {
	const combined = [
		...legacy.map(mapDbTransaction),
		...trades.map(mapLiveTrade),
	];
	return combined.sort(
		(a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
	);
}
