'use server';

import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/admin-auth';
import { roundMoney, toMoneyNumber } from '@/lib/money';
import { unstable_noStore as noStore } from 'next/cache';
import type {
	AdminTradeRecord,
	AdminTradingHistoryResult,
} from '@/types/adminTradingHistory';

export async function getAdminTradingHistory(): Promise<
	AdminTradingHistoryResult | { error: string }
> {
	noStore();

	const session = await getAdminSession();
	if (!session) {
		return { error: 'Unauthorized' };
	}

	try {
		const [liveTrades, adminTrades, copyCount, userCount, adminCount] =
			await Promise.all([
				db.trade.findMany({
					orderBy: { openedAt: 'desc' },
					take: 300,
					include: {
						asset: { select: { name: true } },
						trader: { select: { name: true } },
						user: { select: { name: true, email: true } },
					},
				}),
				db.transaction.findMany({
					where: { transactionType: 'trading' },
					orderBy: { createdAt: 'desc' },
					take: 300,
					include: {
						user: { select: { name: true, email: true } },
					},
				}),
				db.trade.count({ where: { traderId: { not: null } } }),
				db.trade.count({ where: { traderId: null } }),
				db.transaction.count({
					where: { transactionType: 'trading' },
				}),
			]);

		const fromLive: AdminTradeRecord[] = liveTrades.map((trade) => ({
			id: trade.id,
			source: trade.traderId ? 'copy' : 'user',
			openedAt: trade.openedAt.toISOString(),
			userName: trade.user.name,
			userEmail: trade.user.email,
			assetOrPair: trade.asset?.name ?? trade.assetSymbol,
			direction: trade.direction,
			amount: toMoneyNumber(trade.stake),
			status: trade.status,
			profit:
				trade.profit != null
					? roundMoney(toMoneyNumber(trade.profit))
					: null,
			traderName: trade.trader?.name ?? null,
		}));

		const fromAdmin: AdminTradeRecord[] = adminTrades.map((trade) => ({
			id: trade.id,
			source: 'admin',
			openedAt: (trade.date ?? trade.createdAt).toISOString(),
			userName: trade.user.name,
			userEmail: trade.user.email,
			assetOrPair: trade.postType || trade.pair || '—',
			direction: trade.type,
			amount: trade.amount,
			status: trade.status,
			profit: null,
			traderName: null,
		}));

		const trades = [...fromLive, ...fromAdmin].sort(
			(a, b) =>
				new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime(),
		);

		return {
			trades,
			stats: {
				total: copyCount + userCount + adminCount,
				copy: copyCount,
				user: userCount,
				admin: adminCount,
			},
		};
	} catch (err) {
		console.error('getAdminTradingHistory failed:', err);
		return { error: 'Could not load trading history.' };
	}
}
