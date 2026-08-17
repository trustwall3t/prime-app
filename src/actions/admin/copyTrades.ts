'use server';

import { db } from '@/lib/db';
import { roundMoney, toMoneyNumber } from '@/lib/money';
import type { CopiedTradeRecord } from '@/types/copyTrading';

function serializeCopiedTrade(trade: {
	id: string;
	traderId: string | null;
	assetSymbol: string;
	direction: string;
	stake: unknown;
	entryPrice: unknown;
	exitPrice: unknown;
	profit: unknown;
	status: string;
	openedAt: Date;
	expiresAt: Date;
	closedAt: Date | null;
	asset?: { name: string } | null;
	trader?: { name: string } | null;
	user?: { name: string; email: string } | null;
}): CopiedTradeRecord {
	return {
		id: trade.id,
		traderId: trade.traderId,
		traderName: trade.trader?.name ?? null,
		userName: trade.user?.name,
		userEmail: trade.user?.email,
		assetSymbol: trade.assetSymbol,
		assetName: trade.asset?.name ?? trade.assetSymbol,
		direction: trade.direction as 'up' | 'down',
		stake: toMoneyNumber(trade.stake),
		entryPrice: toMoneyNumber(trade.entryPrice),
		exitPrice:
			trade.exitPrice != null ? toMoneyNumber(trade.exitPrice) : null,
		profit:
			trade.profit != null ? roundMoney(toMoneyNumber(trade.profit)) : null,
		status: trade.status,
		openedAt: trade.openedAt.toISOString(),
		expiresAt: trade.expiresAt.toISOString(),
		closedAt: trade.closedAt ? trade.closedAt.toISOString() : null,
	};
}

const copiedTradeInclude = {
	asset: { select: { name: true } },
	trader: { select: { name: true } },
	user: { select: { name: true, email: true } },
};

/** Admin: all trades emitted via copy-trader signals. */
export async function getEmittedCopyTrades(limit = 50) {
	const trades = await db.trade.findMany({
		where: { traderId: { not: null } },
		orderBy: { openedAt: 'desc' },
		take: limit,
		include: copiedTradeInclude,
	});

	return trades.map(serializeCopiedTrade);
}

/** Admin: emitted trades for one trader. */
export async function getTraderEmittedTrades(traderId: string, limit = 30) {
	const trades = await db.trade.findMany({
		where: { traderId },
		orderBy: { openedAt: 'desc' },
		take: limit,
		include: copiedTradeInclude,
	});

	return trades.map(serializeCopiedTrade);
}
