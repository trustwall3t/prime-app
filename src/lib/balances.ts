import { roundMoney } from '@/lib/money';

/**
 * Balance rules:
 * - walletBalance: master total — every deposit, withdrawal, stake, and settlement hits here
 * - investmentBalance: deposits only
 * - profitBalance: trade profit/loss only (signed)
 */

/** Approved deposit → investment + wallet */
export function depositBalanceUpdate(amount: number) {
	const amt = roundMoney(amount);
	return {
		walletBalance: { increment: amt },
		investmentBalance: { increment: amt },
	} as const;
}

/** Trade stake placed → lock from wallet only */
export function stakeDeductionUpdate(stake: number) {
	return {
		walletBalance: { decrement: roundMoney(stake) },
	} as const;
}

/** Trade settled → return stake+profit to wallet, record P/L in profitBalance */
export function tradeSettlementUpdate(profit: number, finalReturn: number) {
	return {
		walletBalance: { increment: roundMoney(finalReturn) },
		profitBalance: { increment: roundMoney(profit) },
	} as const;
}

/** Approved withdrawal → deduct wallet only */
export function withdrawalBalanceUpdate(amount: number) {
	return {
		walletBalance: { decrement: roundMoney(amount) },
	} as const;
}

/** Admin manual profit/trade credit */
export function profitCreditUpdate(amount: number) {
	const amt = roundMoney(amount);
	return {
		walletBalance: { increment: amt },
		profitBalance: { increment: amt },
	} as const;
}
