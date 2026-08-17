import { toMoneyNumber } from '@/lib/money';

/** Convert Prisma Decimal balance fields to plain numbers for UI/JSON. */
export function serializeUserBalances<
	T extends {
		walletBalance?: unknown;
		investmentBalance?: unknown;
		profitBalance?: unknown;
	},
>(
	user: T,
): T & {
	walletBalance: number | null;
	investmentBalance: number | null;
	profitBalance: number | null;
} {
	return {
		...user,
		walletBalance:
			user.walletBalance != null
				? toMoneyNumber(user.walletBalance)
				: null,
		investmentBalance:
			user.investmentBalance != null
				? toMoneyNumber(user.investmentBalance)
				: null,
		profitBalance:
			user.profitBalance != null
				? toMoneyNumber(user.profitBalance)
				: null,
	};
}
