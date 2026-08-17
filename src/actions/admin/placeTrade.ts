'use server';

import { db } from '@/lib/db';
import { z } from 'zod';
import { TradeSchema } from '../../../schema/TradeSchema';
import { generateTransactionId } from '../../lib/generateTransactionId';
import { sendEmail } from '@/lib/email';
import { profitCreditUpdate } from '@/lib/balances';
import { roundMoney } from '@/lib/money';
import { revalidatePath } from 'next/cache';

export const placeTrade = async (data: z.infer<typeof TradeSchema>) => {
	const validatedFields = TradeSchema.safeParse(data);
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
	const amount = roundMoney(parseFloat(validatedFields.data.amount));

	const trade = await db.transaction.create({
		data: {
			paymentMethod: 'trading',
			transactionId: generateTransactionId(),
			status: 'success',
			transactionType: 'trading',
			postType: validatedFields.data.pair,
			amount: Math.round(amount),
			type: validatedFields.data.type,
			userId: user.id,
			date: new Date(),
		},
	});

	if (trade) {
		const updatedUser = await db.user.update({
			where: { id: user.id },
			data: profitCreditUpdate(amount),
		});

		if (updatedUser) {
			await sendEmail(user.email, 'trade', {
				amount: amount,
				symbol: validatedFields.data.pair,
				type: validatedFields.data.type,
			});
			revalidatePath('/admin/dashboard/trade');
			revalidatePath('/admin/dashboard/transactions');
			return { success: 'Trade placed successfully' };
		}
	}
	return { error: 'Failed to place trade' };
};
