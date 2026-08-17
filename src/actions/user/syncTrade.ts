'use server';

import { db } from '@/lib/db';
import { getSession } from '@/lib/session';
import { roundMoney, toMoneyNumber } from '@/lib/money';
import { settleDueTrades } from '@/lib/tradeSettlement';
import type { Trade } from '@/types';

export type SerializedTrade = Trade;

export interface TradingData {
	balance: number;
	openTrades: SerializedTrade[];
	history: SerializedTrade[];
}

type SyncResult = TradingData | { error: string };

export async function syncTrades(userId?: string): Promise<SyncResult> {
	let resolvedUserId = userId;

	if (!resolvedUserId) {
		const session = await getSession(false);
		if (!session?.user) {
			return { error: 'Not authenticated.' };
		}
		resolvedUserId = session.user.id;
	}

	await settleDueTrades({ userId: resolvedUserId });

	const [user, openTrades, history] = await Promise.all([
		db.user.findUnique({
			where: { id: resolvedUserId },
			select: { walletBalance: true },
		}),
		db.trade.findMany({
			where: { userId: resolvedUserId, status: 'open' },
			orderBy: { openedAt: 'desc' },
			include: { asset: true },
		}),
		db.trade.findMany({
			where: {
				userId: resolvedUserId,
				status: { in: ['won', 'lost', 'even'] },
			},
			orderBy: { closedAt: 'desc' },
			take: 50,
			include: { asset: true },
		}),
	]);

	return {
		balance: toMoneyNumber(user?.walletBalance),
		openTrades: openTrades.map(serializeTrade),
		history: history.map(serializeTrade),
	};
}

function serializeTrade(trade: {
	id: string;
	assetSymbol: string;
	direction: string;
	stake: unknown;
	durationSeconds: number;
	entryPrice: unknown;
	exitPrice: unknown;
	profit: unknown;
	status: string;
	openedAt: Date;
	expiresAt: Date;
	closedAt: Date | null;
	asset?: { name: string } | null;
}): SerializedTrade {
	return {
		id: trade.id,
		assetSymbol: trade.assetSymbol,
		assetName: trade.asset?.name ?? trade.assetSymbol,
		direction: trade.direction as SerializedTrade['direction'],
		stake: Number(trade.stake),
		durationSeconds: trade.durationSeconds,
		entryPrice: Number(trade.entryPrice),
		exitPrice: trade.exitPrice != null ? Number(trade.exitPrice) : null,
		profit: trade.profit != null ? roundMoney(Number(trade.profit)) : null,
		status: trade.status as SerializedTrade['status'],
		openedAt: trade.openedAt.toISOString(),
		expiresAt: trade.expiresAt.toISOString(),
		closedAt: trade.closedAt ? trade.closedAt.toISOString() : null,
	};
}
