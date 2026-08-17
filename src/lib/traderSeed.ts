import { db } from '@/lib/db';
import type { MarketType } from '@/generated/prisma';

const DEFAULT_TRADERS = [
	{
		name: 'Trader_Sci',
		description:
			'Quant-focused swing trader specializing in tech and growth stocks with disciplined risk management.',
		strategy: 'Momentum + mean reversion',
		marketType: 'STOCK' as MarketType,
		country: 'USA',
		followers: 12500,
		totalTrades: 8643,
		winRate: 97,
		performanceScore: 94,
	},
	{
		name: 'Crypto_Viper',
		description:
			'High-frequency crypto scalper on major USDT pairs. Active during London and NY sessions.',
		strategy: 'Scalping',
		marketType: 'CRYPTO' as MarketType,
		country: 'UK',
		followers: 18200,
		totalTrades: 12400,
		winRate: 89,
		performanceScore: 88,
	},
	{
		name: 'Alpha_Edge',
		description:
			'Macro-driven trader blending equities and crypto exposure based on volatility regimes.',
		strategy: 'Macro trend',
		marketType: 'STOCK' as MarketType,
		country: 'Singapore',
		followers: 7600,
		totalTrades: 5200,
		winRate: 91,
		performanceScore: 90,
	},
	{
		name: 'Block_Hawk',
		description:
			'On-chain aware crypto trader focusing on large-cap assets and liquidity events.',
		strategy: 'Position trading',
		marketType: 'CRYPTO' as MarketType,
		country: 'Germany',
		followers: 4300,
		totalTrades: 3100,
		winRate: 85,
		performanceScore: 86,
	},
];

export async function ensureDefaultTraders() {
	const admin = await db.admin.findFirst({ orderBy: { createdAt: 'asc' } });
	if (!admin) return;

	const count = await db.trader.count();
	if (count > 0) return;

	await db.trader.createMany({
		data: DEFAULT_TRADERS.map((t) => ({
			...t,
			adminId: admin.id,
			isActive: true,
		})),
	});
}
