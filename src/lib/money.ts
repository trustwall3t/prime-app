/** Round to 2 decimal places for USD amounts. */
export function roundMoney(amount: number): number {
	return Math.round(amount * 100) / 100;
}

export function toMoneyNumber(value: unknown): number {
	if (value == null) return 0;
	return roundMoney(Number(value));
}

/** Safe display formatter — handles Prisma Decimal, string, or number. */
export function formatMoney(value: unknown, decimals = 2): string {
	return toMoneyNumber(value).toFixed(decimals);
}
