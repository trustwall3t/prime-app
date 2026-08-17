'use server';

import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/admin-auth';
import { unstable_noStore as noStore } from 'next/cache';

const ONLINE_WINDOW_MS = 15 * 60 * 1000;

export type AdminDashboardStats = {
	totalUsers: number;
	totalTrades: number;
	totalDeposits: number;
	totalWithdrawals: number;
	onlineUsers: number;
	pendingDeposits: number;
	pendingWithdrawals: number;
};

export async function getAdminDashboardStats(): Promise<
	AdminDashboardStats | { error: string }
> {
	noStore();

	const session = await getAdminSession();
	if (!session) {
		return { error: 'Unauthorized' };
	}

	const now = new Date();
	const onlineSince = new Date(Date.now() - ONLINE_WINDOW_MS);

	try {
		const [
			totalUsers,
			liveTradeCount,
			adminTradeCount,
			totalDeposits,
			totalWithdrawals,
			pendingDeposits,
			pendingWithdrawals,
			onlineSessions,
		] = await Promise.all([
			db.user.count(),
			db.trade.count(),
			db.transaction.count({ where: { transactionType: 'trading' } }),
			db.transaction.count({
				where: { transactionType: 'deposit', status: 'success' },
			}),
			db.transaction.count({
				where: { transactionType: 'withdrawal', status: 'success' },
			}),
			db.transaction.count({
				where: { transactionType: 'deposit', status: 'pending' },
			}),
			db.transaction.count({
				where: { transactionType: 'withdrawal', status: 'pending' },
			}),
			db.session.groupBy({
				by: ['userId'],
				where: {
					expiresAt: { gt: now },
					lastActive: { gte: onlineSince },
				},
			}),
		]);

		return {
			totalUsers,
			totalTrades: liveTradeCount + adminTradeCount,
			totalDeposits,
			totalWithdrawals,
			onlineUsers: onlineSessions.length,
			pendingDeposits,
			pendingWithdrawals,
		};
	} catch (err) {
		console.error('getAdminDashboardStats failed:', err);
		return { error: 'Could not load dashboard stats.' };
	}
}
