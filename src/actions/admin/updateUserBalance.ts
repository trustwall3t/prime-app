'use server';
import { db } from '@/lib/db';
import { roundMoney, toMoneyNumber } from '@/lib/money';
import { BalanceSchema } from '../../../schema/balanceSchema';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { generateTransactionId } from '@/lib/generateTransactionId';
import { refreshRankingChain } from '@/lib/ranking';
export const updateUserBalance = async (
	data: z.infer<typeof BalanceSchema>
) => {
	const validatedFields = BalanceSchema.safeParse(data);
	if (!validatedFields.success) {
		return { error: 'Invalid fields' };
	}
	const user = await db.user.findUnique({
		where: {
			id: validatedFields.data.userId,
		},
	});
	if (!user) {
		return { error: 'User not found' };
	}
	const balance = validatedFields.data.balance
		? roundMoney(parseFloat(validatedFields.data.balance))
		: 0;
	const profit = validatedFields.data.profit
		? roundMoney(parseFloat(validatedFields.data.profit))
		: 0;
	const investment = validatedFields.data.investment
		? roundMoney(parseFloat(validatedFields.data.investment))
		: 0;
	const credit = validatedFields.data.credit;
	const target = validatedFields.data.target
		? parseInt(validatedFields.data.target)
		: 0;
	const wallet = toMoneyNumber(user.walletBalance);
	const walletDelta = balance + profit + investment;
	const updatedUser = await db.user.update({
		where: { id: user.id },
		data: {
			walletBalance: credit
				? roundMoney(wallet + walletDelta)
				: roundMoney(wallet - walletDelta),
			profitBalance: credit
				? roundMoney(toMoneyNumber(user.profitBalance) + profit)
				: roundMoney(toMoneyNumber(user.profitBalance) - profit),
			investmentBalance: credit
				? roundMoney(toMoneyNumber(user.investmentBalance) + investment)
				: roundMoney(
						toMoneyNumber(user.investmentBalance) - investment,
					),
			targetBalance: credit
				? (user.targetBalance ?? 0) + target
				: (user.targetBalance ?? 0) - target,
		},
	});
	if (updatedUser) {
		await db.transaction.create({
			data: {
				userId: user.id,
				amount: investment > 0 ? investment : profit > 0 ? profit : balance > 0 ? balance : target,
				type: investment > 0 ? 'Deposit' : profit > 0 ? 'Profit' : balance > 0 ? 'Balance' : 'Target',
				status: 'success',
				paymentMethod: investment > 0 ? 'deposit' : profit > 0 ? 'Profit' : balance > 0 ? 'Balance' : 'Target',
				transactionType: investment > 0 ? 'deposit' : profit > 0 ? 'Profit' : balance > 0 ? 'Balance' : 'Target',
				postType: 'live trade',
				transactionId: generateTransactionId(),
				createdAt: new Date(),
				date: new Date(),
			},
		});
		if (investment !== 0) {
			await refreshRankingChain(user.id);
			revalidatePath('/dashboard/ranking');
			revalidatePath('/dashboard/referrals');
		}
		revalidatePath('/admin/dashboard/livetrade');
		return { success: 'Balance updated successfully' };
	}
	return { error: 'Failed to update balance' };
};
