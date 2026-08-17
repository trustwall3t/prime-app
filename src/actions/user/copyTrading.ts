'use server';

import { db } from '@/lib/db';
import { getSession } from '@/lib/session';
import { roundMoney, toMoneyNumber } from '@/lib/money';
import { unstable_noStore as noStore } from 'next/cache';
import type { CopyStatus, CopiedTradeRecord, UserCopySubscription } from '@/types/copyTrading';

function serializeCopy(
	copy: {
		id: string;
		traderId: string;
		allocationPercentage: number;
		status: string;
		startedAt: Date;
		trader: {
			name: string;
			winRate: number | null;
			marketType: string;
		};
	},
): UserCopySubscription {
	return {
		id: copy.id,
		traderId: copy.traderId,
		traderName: copy.trader.name,
		allocationPercentage: copy.allocationPercentage,
		status: copy.status as CopyStatus,
		startedAt: copy.startedAt.toISOString(),
		winRate: copy.trader.winRate ?? 0,
		marketType: copy.trader.marketType as UserCopySubscription['marketType'],
	};
}

export async function getMyCopyTrades(): Promise<
	UserCopySubscription[] | { error: string }
> {
	noStore();
	const session = await getSession();
	if (!session?.user?.id) return { error: 'Not authenticated.' };

	const copies = await db.copyTrading.findMany({
		where: {
			userId: session.user.id,
			status: { in: ['ACTIVE', 'PAUSED'] },
		},
		include: { trader: true },
		orderBy: { startedAt: 'desc' },
	});

	return copies.map(serializeCopy);
}

export async function startCopyTrading(
	traderId: string,
	allocationPercentage: number,
): Promise<{ success?: string; error?: string; copyId?: string }> {
	const session = await getSession();
	if (!session?.user) return { error: 'You must be logged in.' };

	const allocation = roundMoney(allocationPercentage);
	if (!Number.isFinite(allocation) || allocation <= 0 || allocation > 100) {
		return { error: 'Allocation must be between 1% and 100%.' };
	}

	const trader = await db.trader.findFirst({
		where: { id: traderId, isActive: true },
	});
	if (!trader) return { error: 'Trader not found.' };

	const user = await db.user.findUnique({
		where: { id: session.user.id },
		select: { walletBalance: true },
	});
	if (!user || toMoneyNumber(user.walletBalance) <= 0) {
		return { error: 'You need a positive balance to start copying.' };
	}

	try {
		const copy = await db.copyTrading.upsert({
			where: {
				userId_traderId: {
					userId: session.user.id,
					traderId,
				},
			},
			create: {
				userId: session.user.id,
				traderId,
				allocationPercentage: allocation,
				status: 'ACTIVE',
			},
			update: {
				allocationPercentage: allocation,
				status: 'ACTIVE',
				startedAt: new Date(),
			},
		});

		return {
			success: `You are now copying ${trader.name} at ${allocation}% allocation.`,
			copyId: copy.id,
		};
	} catch (err) {
		console.error('startCopyTrading failed:', err);
		return { error: 'Could not start copy trading.' };
	}
}

export async function stopCopyTrading(
	copyId: string,
): Promise<{ success?: string; error?: string }> {
	const session = await getSession();
	if (!session?.user) return { error: 'Not authenticated.' };

	const copy = await db.copyTrading.findFirst({
		where: { id: copyId, userId: session.user.id },
		include: { trader: true },
	});
	if (!copy) return { error: 'Copy subscription not found.' };

	await db.copyTrading.update({
		where: { id: copyId },
		data: { status: 'STOPPED' },
	});

	return { success: `Stopped copying ${copy.trader.name}.` };
}

export async function getMyCopiedTradeHistory(): Promise<
	CopiedTradeRecord[] | { error: string }
> {
	noStore();
	const session = await getSession();
	if (!session?.user?.id) return { error: 'Not authenticated.' };

	const userId = session.user.id;

	try {
		const trades = await db.trade.findMany({
			where: {
				userId,
				traderId: { not: null },
			},
			orderBy: { openedAt: 'desc' },
			take: 50,
			include: {
				asset: { select: { name: true } },
				trader: { select: { name: true } },
			},
		});

		return trades.map((trade) => ({
			id: trade.id,
			traderId: trade.traderId,
			traderName: trade.trader?.name ?? null,
			assetSymbol: trade.assetSymbol,
			assetName: trade.asset?.name ?? trade.assetSymbol,
			direction: trade.direction as 'up' | 'down',
			stake: toMoneyNumber(trade.stake),
			entryPrice: toMoneyNumber(trade.entryPrice),
			exitPrice:
				trade.exitPrice != null ? toMoneyNumber(trade.exitPrice) : null,
			profit:
				trade.profit != null
					? roundMoney(toMoneyNumber(trade.profit))
					: null,
			status: trade.status,
			openedAt: trade.openedAt.toISOString(),
			expiresAt: trade.expiresAt.toISOString(),
			closedAt: trade.closedAt ? trade.closedAt.toISOString() : null,
		}));
	} catch (err) {
		console.error('getMyCopiedTradeHistory failed:', err);
		return { error: 'Could not load copied trade history.' };
	}
}
