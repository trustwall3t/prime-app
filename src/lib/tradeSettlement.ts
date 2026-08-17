import { db } from '@/lib/db';
import { getBatchPriceQuotes } from '@/lib/priceFeed';
import { roundMoney, toMoneyNumber } from '@/lib/money';
import { tradeSettlementUpdate } from '@/lib/balances';
import { sendEmail } from '@/lib/email';
import type { AssetCategory } from '@/types';

export function computeSettlement(
	entryPrice: number,
	exitPrice: number,
	stake: number,
	direction: string,
) {
	const rawPctChange = (exitPrice - entryPrice) / entryPrice;
	const signedPctChange =
		direction === 'up' ? rawPctChange : -rawPctChange;
	const profit = roundMoney(Math.max(stake * signedPctChange, -stake));
	const finalReturn = roundMoney(stake + profit);
	const status = profit > 0 ? 'won' : profit < 0 ? 'lost' : 'even';
	return { profit, finalReturn, status };
}

function formatDuration(seconds: number): string {
	if (seconds >= 86400) return `${Math.round(seconds / 86400)}d`;
	if (seconds >= 3600) return `${Math.round(seconds / 3600)}h`;
	if (seconds >= 60) return `${Math.round(seconds / 60)}m`;
	return `${seconds}s`;
}

type DueTrade = {
	id: string;
	userId: string;
	traderId: string | null;
	assetSymbol: string;
	direction: string;
	stake: unknown;
	entryPrice: unknown;
	asset: {
		name: string;
		externalSymbol: string;
		category: string;
	};
	trader: { name: string } | null;
	user: { email: string; id: string } | null;
};

async function settleTradeBatch(trades: DueTrade[]): Promise<number> {
	if (trades.length === 0) return 0;

	const quotes = await getBatchPriceQuotes(
		trades.map((trade) => ({
			symbol: trade.assetSymbol,
			externalSymbol: trade.asset.externalSymbol,
			category: trade.asset.category as AssetCategory,
		})),
		true,
	);

	let settled = 0;

	for (const trade of trades) {
		const entryPrice = Number(trade.entryPrice);
		const stake = Number(trade.stake);
		const quote = quotes.get(trade.assetSymbol);
		const exitPrice = quote?.price ?? entryPrice;

		const { profit, finalReturn, status } = computeSettlement(
			entryPrice,
			exitPrice,
			stake,
			trade.direction,
		);

		let didSettle = false;

		await db.$transaction(async (tx) => {
			const current = await tx.trade.findUnique({
				where: { id: trade.id },
				select: { status: true },
			});
			if (!current || current.status !== 'open') return;

			await tx.trade.update({
				where: { id: trade.id },
				data: {
					status,
					exitPrice,
					profit,
					closedAt: new Date(),
				},
			});

			await tx.user.update({
				where: { id: trade.userId },
				data: tradeSettlementUpdate(profit, finalReturn),
			});

			didSettle = true;
		});

		if (!didSettle) continue;

		if (trade.traderId && trade.trader && trade.user?.email) {
			const emailResult = await sendEmail(
				trade.user.email,
				'copyTradeSettlement',
				{
					traderName: trade.trader.name,
					assetSymbol: trade.assetSymbol,
					assetName: trade.asset.name,
					direction: trade.direction,
					stake,
					profit,
					status: status as 'won' | 'lost' | 'even',
					finalReturn,
				},
			);
			if (emailResult.error) {
				console.error(
					'copyTradeSettlement email failed:',
					emailResult.error,
					emailResult.details,
				);
			}
		}

		settled += 1;
	}

	return settled;
}

/** Settle expired open trades, optionally scoped to one or more users. */
export async function settleDueTrades(options?: {
	userId?: string;
	userIds?: string[];
}): Promise<{ settled: number }> {
	const userFilter =
		options?.userId != null
			? { userId: options.userId }
			: options?.userIds?.length
				? { userId: { in: options.userIds } }
				: {};

	const dueTrades = await db.trade.findMany({
		where: {
			status: 'open',
			expiresAt: { lte: new Date() },
			...userFilter,
		},
		include: {
			asset: true,
			trader: { select: { name: true } },
			user: { select: { email: true, id: true } },
		},
		orderBy: { expiresAt: 'asc' },
		take: 200,
	});

	const settled = await settleTradeBatch(dueTrades);
	return { settled };
}

/** Notify a copier that a new mirrored trade was opened. */
export async function notifyCopyTradeOpened(params: {
	email: string;
	traderName: string;
	assetSymbol: string;
	assetName: string;
	direction: string;
	stake: number;
	durationSeconds: number;
	expiresAt: Date;
}) {
	const emailResult = await sendEmail(params.email, 'copyTradeOpened', {
		traderName: params.traderName,
		assetSymbol: params.assetSymbol,
		assetName: params.assetName,
		direction: params.direction,
		stake: params.stake,
		duration: formatDuration(params.durationSeconds),
		expiresAt: params.expiresAt.toLocaleString('en-US', {
			dateStyle: 'medium',
			timeStyle: 'short',
		}),
	});

	if (emailResult.error) {
		console.error(
			'copyTradeOpened email failed:',
			emailResult.error,
			emailResult.details,
		);
	}
}
