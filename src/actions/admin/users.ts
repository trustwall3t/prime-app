import { db } from '@/lib/db';
import { toMoneyNumber } from '@/lib/money';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';

export type UserByIdResult = {
	id: string;
	name: string;
	email: string;
	phone: string;
	address: string | null;
	country: string;
	AccountType: string | null;
	yearlyIncomeRange: string | null;
	walletBalance: number | null;
	profitBalance: number | null;
	investmentBalance: number | null;
	targetBalance: number | null;
	refcode: string | null;
	isVerified: boolean;
	btcAddress: string | null;
	ethAddress: string | null;
	usdtAddress: string | null;
	createdAt: Date;
};

export const getAllUsers = async () => {
	noStore();
	try {
		const users = await db.user.findMany({
			select: {
				id: true,
				name: true,
				email: true,
				phone: true,
				walletBalance: true,
				profitBalance: true,
				investmentBalance: true,
				targetBalance: true,
				refcode: true,
				isVerified: true,
				createdAt: true,
			},
		});
		return users.map((user) => ({
			...user,
			walletBalance: toMoneyNumber(user.walletBalance),
			investmentBalance: toMoneyNumber(user.investmentBalance),
			profitBalance: toMoneyNumber(user.profitBalance),
		}));
	} catch (error) {
		console.error('Error fetching users:', error);
		throw error;
	}
};

export const getUserById = async (id: string): Promise<UserByIdResult | null> => {
	const user = await db.user.findUnique({
		where: { id },
		select: {
			id: true,
			name: true,
			email: true,
			phone: true,
			address: true,
			country: true,
			AccountType: true,
			yearlyIncomeRange: true,
			walletBalance: true,
			profitBalance: true,
			investmentBalance: true,
			targetBalance: true,
			refcode: true,
			isVerified: true,
			btcAddress: true,
			ethAddress: true,
			usdtAddress: true,
			createdAt: true,
		},
	});
	if (!user) return null;
	return {
		...user,
		walletBalance: toMoneyNumber(user.walletBalance),
		investmentBalance: toMoneyNumber(user.investmentBalance),
		profitBalance: toMoneyNumber(user.profitBalance),
	};
};

export const deleteUser = async (id: string) => {
	await db.session.deleteMany({ where: { userId: id } });
	const user = await db.user.delete({ where: { id } });
	revalidatePath('/admin/users');
	return user;
};
