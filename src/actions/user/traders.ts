'use server';

import { db } from '@/lib/db';
import { ensureDefaultTraders } from '@/lib/traderSeed';
import type { PublicTrader } from '@/types/copyTrading';

function serializeTrader(
	trader: {
		id: string;
		name: string;
		description: string | null;
		strategy: string | null;
		marketType: string;
		country: string | null;
		followers?: number;
		totalTrades: number;
		winRate: number | null;
		performanceScore: number | null;
		isActive: boolean;
		copiedBy?: { id: string }[];
	},
): PublicTrader {
	return {
		id: trader.id,
		name: trader.name,
		description: trader.description,
		strategy: trader.strategy,
		marketType: trader.marketType as PublicTrader['marketType'],
		country: trader.country ?? 'Global',
		totalTrades: trader.totalTrades,
		winRate: trader.winRate ?? 0,
		performanceScore: trader.performanceScore ?? 0,
		followers: (trader.followers ?? 0) + (trader.copiedBy?.length ?? 0),
		isActive: trader.isActive,
	};
}

const traderInclude = {
	copiedBy: {
		where: { status: 'ACTIVE' as const },
		select: { id: true },
	},
};

export async function getPublicTraders(): Promise<PublicTrader[]> {
	await ensureDefaultTraders();

	const traders = await db.trader.findMany({
		where: { isActive: true },
		orderBy: { performanceScore: 'desc' },
		include: traderInclude,
	});

	return traders.map(serializeTrader);
}

export async function getPublicTraderById(
	id: string,
): Promise<PublicTrader | null> {
	await ensureDefaultTraders();

	const trader = await db.trader.findFirst({
		where: { id, isActive: true },
		include: traderInclude,
	});

	if (!trader) return null;
	return serializeTrader(trader);
}
