'use server';

import { db } from '@/lib/db';
import { toMoneyNumber } from '@/lib/money';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

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
	const existing = await db.user.findUnique({
		where: { id },
		select: { id: true },
	});

	if (!existing) {
		revalidatePath('/admin/dashboard/users');
		return { success: true as const, alreadyDeleted: true as const };
	}

	await db.$transaction(async (tx) => {
		await tx.user.updateMany({
			where: { referrerId: id },
			data: { referrerId: null },
		});

		await tx.trade.deleteMany({ where: { userId: id } });
		await tx.wallet.deleteMany({ where: { userId: id } });
		await tx.session.deleteMany({ where: { userId: id } });
		await tx.kyc.deleteMany({ where: { userId: id } });
		await tx.transaction.deleteMany({ where: { userId: id } });
		await tx.copyTrading.deleteMany({ where: { userId: id } });
		await tx.liveTrade.deleteMany({ where: { userId: id } });
		await tx.userRanking.deleteMany({ where: { userId: id } });
		await tx.walletConnection.deleteMany({ where: { userId: id } });

		const deleted = await tx.user.deleteMany({ where: { id } });
		if (deleted.count === 0) {
			throw new Error('USER_NOT_FOUND');
		}
	});

	revalidatePath('/admin/dashboard/users');
	return { success: true as const };
};

export const deleteUserAction = async (id: string) => {
	try {
		await deleteUser(id);
	} catch (error) {
		if (error instanceof Error && error.message === 'USER_NOT_FOUND') {
			revalidatePath('/admin/dashboard/users');
			redirect('/admin/dashboard/users');
		}
		throw error;
	}

	redirect('/admin/dashboard/users');
};
