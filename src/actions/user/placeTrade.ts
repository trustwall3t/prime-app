'use server';

import { db } from '@/lib/db';
import { getSession } from '@/lib/session';
import { roundMoney, toMoneyNumber } from '@/lib/money';
import { stakeDeductionUpdate } from '@/lib/balances';
import type { Trade } from '@/types';

interface PlaceTradeResult {
	error?: string;
	tradeId?: string;
	balance?: number;
	trade?: Trade;
}

export async function placeTrade(
	formData: FormData,
): Promise<PlaceTradeResult> {
	try {
		const session = await getSession();
		if (!session?.user) {
			return { error: 'You must be logged in to trade.' };
		}

		const assetSymbol = formData.get('assetSymbol');
		const direction = formData.get('direction');
		const stake = Number(formData.get('stake'));
		const durationSeconds = Number(formData.get('durationSeconds'));
		const entryPrice = Number(formData.get('entryPrice'));

		if (typeof assetSymbol !== 'string' || !assetSymbol) {
			return { error: 'Missing asset.' };
		}
		if (direction !== 'up' && direction !== 'down') {
			return { error: 'Invalid trade direction.' };
		}
		if (!Number.isFinite(stake) || stake <= 0) {
			return { error: 'Enter a valid stake amount.' };
		}
		if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
			return { error: 'Invalid duration.' };
		}
		if (!Number.isFinite(entryPrice) || entryPrice <= 0) {
			return { error: 'Price unavailable — refresh and try again.' };
		}

		const stakeAmount = roundMoney(stake);

		const result = await db.$transaction(async (tx) => {
			const [asset, user] = await Promise.all([
				tx.asset.findUnique({ where: { symbol: assetSymbol } }),
				tx.user.findUnique({
					where: { id: session.user.id },
					select: { walletBalance: true },
				}),
			]);

			if (!asset) {
				throw new Error('UNKNOWN_ASSET');
			}
			if (!user || toMoneyNumber(user.walletBalance) < stakeAmount) {
				throw new Error('INSUFFICIENT_BALANCE');
			}

			const updatedUser = await tx.user.update({
				where: { id: session.user.id },
				data: stakeDeductionUpdate(stakeAmount),
				select: { walletBalance: true },
			});

			const created = await tx.trade.create({
				data: {
					userId: session.user.id,
					assetSymbol: asset.symbol,
					direction,
					stake: stakeAmount,
					durationSeconds,
					entryPrice,
					status: 'open',
					openedAt: new Date(),
					expiresAt: new Date(Date.now() + durationSeconds * 1000),
				},
			});

			return { asset, created, balance: updatedUser.walletBalance };
		});

		return {
			tradeId: result.created.id,
			balance: toMoneyNumber(result.balance),
			trade: {
				id: result.created.id,
				assetSymbol: result.asset.symbol,
				assetName: result.asset.name,
				direction: direction as Trade['direction'],
				stake: stakeAmount,
				durationSeconds,
				entryPrice,
				exitPrice: null,
				profit: null,
				status: 'open',
				openedAt: result.created.openedAt.toISOString(),
				expiresAt: result.created.expiresAt.toISOString(),
				closedAt: null,
			},
		};
	} catch (err) {
		if (err instanceof Error) {
			if (err.message === 'INSUFFICIENT_BALANCE') {
				return { error: 'Insufficient balance.' };
			}
			if (err.message === 'UNKNOWN_ASSET') {
				return { error: 'Unknown asset.' };
			}
		}
		console.error('placeTrade failed:', err);
		return { error: 'Something went wrong placing the trade.' };
	}
}
