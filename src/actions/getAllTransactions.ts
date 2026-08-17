'use server';

import { db } from '@/lib/db';
import { getSession } from '@/lib/session';
import { mergeTransactionHistory } from '@/lib/mapTransactions';
import type { Transaction } from '@/app/(user)/dashboard/transaction-history/TransactionCard';

export async function getUserTransactionHistory(): Promise<Transaction[]> {
	const session = await getSession();
	if (!session) {
		throw new Error('Unauthorized');
	}

	const [legacy, trades] = await Promise.all([
		db.transaction.findMany({
			where: { userId: session.userId },
			orderBy: { createdAt: 'desc' },
		}),
		db.trade.findMany({
			where: { userId: session.userId },
			orderBy: { openedAt: 'desc' },
			include: {
				asset: { select: { name: true } },
				trader: { select: { name: true } },
			},
		}),
	]);

	return mergeTransactionHistory(legacy, trades);
}

export const getAllTransactions = async () => {
	const session = await getSession();
	if (!session) {
		throw new Error('Unauthorized');
	}

	return db.transaction.findMany({
		where: { userId: session.userId },
		include: {
			user: {
				select: {
					name: true,
					email: true,
				},
			},
		},
		orderBy: { createdAt: 'desc' },
	});
};

export const getDepositTransactions = async () => {
	const session = await getSession();
	if (!session) {
		throw new Error('Unauthorized');
	}

	return db.transaction.findMany({
		where: {
			userId: session.userId,
			transactionType: 'deposit',
		},
		include: {
			user: {
				select: {
					name: true,
					email: true,
				},
			},
		},
		orderBy: { createdAt: 'desc' },
	});
};

export const getWithdrawalTransactions = async () => {
	const session = await getSession();
	if (!session) {
		throw new Error('Unauthorized');
	}

	return db.transaction.findMany({
		where: {
			userId: session.userId,
			transactionType: 'withdrawal',
		},
		include: {
			user: {
				select: {
					name: true,
					email: true,
				},
			},
		},
		orderBy: { createdAt: 'desc' },
	});
};

export const getTradingTransactions = async () => {
	const session = await getSession();
	if (!session) {
		throw new Error('Unauthorized');
	}

	return db.transaction.findMany({
		where: {
			userId: session.userId,
			transactionType: 'trading',
		},
		include: {
			user: {
				select: {
					name: true,
					email: true,
				},
			},
		},
	});
};
