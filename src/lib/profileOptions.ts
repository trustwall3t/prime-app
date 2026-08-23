export const ACCOUNT_TYPES = [
	'Individual',
	'Joint',
	'Corporate',
	'Trust',
	'Retirement / IRA',
] as const;

export const INCOME_RANGES = [
	'Under $25,000',
	'$25,000 – $50,000',
	'$50,000 – $100,000',
	'$100,000 – $250,000',
	'$250,000 – $500,000',
	'$500,000 – $1,000,000',
	'Over $1,000,000',
	'Prefer not to say',
] as const;

export type AccountType = (typeof ACCOUNT_TYPES)[number];
export type IncomeRange = (typeof INCOME_RANGES)[number];
