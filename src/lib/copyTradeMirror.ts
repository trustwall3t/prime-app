'use server';

import { db } from '@/lib/db';
import { roundMoney, toMoneyNumber } from '@/lib/money';
import { stakeDeductionUpdate } from '@/lib/balances';
import { listTradingAssets } from '@/lib/tradingAssets';
import { notifyCopyTradeOpened } from '@/lib/tradeSettlement';
import {
	COPY_TRADE_DURATIONS,
	COPY_TRADE_MIN_DURATION_SECONDS,
} from '@/types';

interface MirrorResult {
	placed: number;
	skipped: number;
	errors: string[];
	copierUserIds: string[];
}

/** Stake for one copier = wallet balance × (allocation% / 100). */
function computeCopyStake(
	walletBalance: number,
	allocationPercentage: number,
): number {
	if (allocationPercentage <= 0 || walletBalance <= 0) return 0;
	return roundMoney(walletBalance * (allocationPercentage / 100));
}

/**
 * Places a mirrored live trade for every active copier of a trader.
 * Each copier's stake follows their chosen allocation percentage.
 */
export async function mirrorTraderSignal(
	traderId: string,
	params: {
		assetSymbol: string;
		direction: 'up' | 'down';
		durationSeconds: number;
		entryPrice: number;
	},
): Promise<MirrorResult> {
	const result: MirrorResult = {
		placed: 0,
		skipped: 0,
		errors: [],
		copierUserIds: [],
	};

	const [trader, copies, asset] = await Promise.all([
		db.trader.findUnique({ where: { id: traderId } }),
		db.copyTrading.findMany({
			where: { traderId, status: 'ACTIVE' },
			select: {
				id: true,
				userId: true,
				allocationPercentage: true,
				user: {
					select: { id: true, walletBalance: true, email: true },
				},
			},
		}),
		db.asset.findUnique({ where: { symbol: params.assetSymbol } }),
	]);

	if (!trader) {
		result.errors.push('Trader not found.');
		return result;
	}
	if (!asset) {
		result.errors.push('Unknown asset.');
		return result;
	}
	if (copies.length === 0) {
		return result;
	}

	const durationSeconds = Math.max(
		COPY_TRADE_MIN_DURATION_SECONDS,
		params.durationSeconds,
	);
	const entryPrice = roundMoney(params.entryPrice);
	const expiresAt = new Date(Date.now() + durationSeconds * 1000);

	for (const copy of copies) {
		const balance = toMoneyNumber(copy.user.walletBalance);
		const stake = computeCopyStake(balance, copy.allocationPercentage);

		if (stake <= 0 || balance < stake) {
			result.skipped += 1;
			continue;
		}

		try {
			await db.$transaction(async (tx) => {
				const user = await tx.user.findUnique({
					where: { id: copy.userId },
					select: { walletBalance: true },
				});
				if (!user || toMoneyNumber(user.walletBalance) < stake) {
					throw new Error('INSUFFICIENT');
				}

				await tx.user.update({
					where: { id: copy.userId },
					data: stakeDeductionUpdate(stake),
				});

				await tx.trade.create({
					data: {
						userId: copy.userId,
						traderId,
						assetSymbol: asset.symbol,
						direction: params.direction,
						stake,
						durationSeconds,
						entryPrice,
						status: 'open',
						openedAt: new Date(),
						expiresAt,
					},
				});
			});

			result.placed += 1;
			result.copierUserIds.push(copy.userId);

			if (copy.user.email) {
				await notifyCopyTradeOpened({
					email: copy.user.email,
					traderName: trader.name,
					assetSymbol: asset.symbol,
					assetName: asset.name,
					direction: params.direction,
					stake,
					durationSeconds,
					expiresAt,
				});
			}
		} catch (err) {
			console.error('mirrorTraderSignal trade failed:', err);
			result.skipped += 1;
		}
	}

	return result;
}

/** Picks a random asset matching the trader market and emits a signal. */
export async function emitRandomTraderSignal(
	traderId: string,
): Promise<{
	success?: string;
	error?: string;
	placed?: number;
	copierUserIds?: string[];
}> {
	const trader = await db.trader.findUnique({ where: { id: traderId } });
	if (!trader) return { error: 'Trader not found.' };

	const category = trader.marketType === 'CRYPTO' ? 'crypto' : 'stocks';
	const assets = (await listTradingAssets()).filter(
		(a) => a.category === category,
	);
	if (assets.length === 0) return { error: 'No assets available.' };

	const asset =
		assets[Math.floor(Math.random() * assets.length)];
	const direction = Math.random() > 0.5 ? 'up' : 'down';
	const durationSeconds =
		COPY_TRADE_DURATIONS[
			Math.floor(Math.random() * COPY_TRADE_DURATIONS.length)
		].seconds;

	// Placeholder entry — syncTrade will settle using live prices.
	const entryPrice = category === 'crypto' ? 1 : 100;

	const mirror = await mirrorTraderSignal(traderId, {
		assetSymbol: asset.symbol,
		direction,
		durationSeconds,
		entryPrice,
	});

	if (mirror.placed === 0) {
		return {
			error:
				mirror.skipped > 0
					? 'No copiers had enough balance for a mirrored trade.'
					: 'No active copiers for this trader.',
		};
	}

	return {
		success: `Mirrored ${mirror.placed} trade(s) for ${trader.name}.`,
		placed: mirror.placed,
		copierUserIds: mirror.copierUserIds,
	};
}
