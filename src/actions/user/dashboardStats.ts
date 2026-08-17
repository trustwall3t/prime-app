'use server';

import { db } from '@/lib/db';
import { roundMoney, toMoneyNumber } from '@/lib/money';

export type UserDashboardFinancials = {
	totalWithdrawals: number;
	tradeInterest: number;
};

/** Lifetime successful withdrawals and net trade profit for the dashboard. */
export async function getUserDashboardFinancials(
	userId: string,
): Promise<UserDashboardFinancials> {
	const [withdrawalAgg, liveTradeProfitAgg, legacyTradeAgg] =
		await Promise.all([
			db.transaction.aggregate({
				where: {
					userId,
					transactionType: 'withdrawal',
					status: 'success',
				},
				_sum: { amount: true },
			}),
			db.trade.aggregate({
				where: {
					userId,
					status: { in: ['won', 'lost', 'even'] },
					profit: { not: null },
				},
				_sum: { profit: true },
			}),
			db.transaction.aggregate({
				where: {
					userId,
					transactionType: 'trading',
					status: 'success',
				},
				_sum: { amount: true },
			}),
		]);

	const liveTradeProfit = toMoneyNumber(liveTradeProfitAgg._sum.profit);
	const legacyTradeProfit = toMoneyNumber(legacyTradeAgg._sum.amount);

	return {
		totalWithdrawals: toMoneyNumber(withdrawalAgg._sum.amount),
		tradeInterest: roundMoney(liveTradeProfit + legacyTradeProfit),
	};
}
