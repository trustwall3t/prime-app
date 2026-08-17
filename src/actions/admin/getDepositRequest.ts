import { db } from '@/lib/db';
import { depositBalanceUpdate } from '@/lib/balances';
import { refreshRankingChain } from '@/lib/ranking';
import { revalidatePath } from 'next/cache';
import { sendEmail } from '@/lib/email';
import { unstable_noStore as noStore } from 'next/cache';
export const getDepositRequest = async () => {
	noStore();
	const depositRequest = await db.transaction.findMany({
		where: {
			transactionType: 'deposit',
		},
		include: {
			user: {
				select: {
					name: true,
					email: true,
				},
			},
		},
		orderBy: {
			createdAt: 'desc',
		},
	});
	return depositRequest;
};

export const approveDepositRequest = async (
	transactionId: string,
	userId: string
) => {
	// First get the transaction details to get the amount
	const transaction = await db.transaction.findUnique({
		where: {
			id: transactionId,
		},
	});

	if (!transaction) {
		return {
			error: 'Transaction not found',
		};
	}

	// Get current user data
	const user = await db.user.findUnique({
		where: {
			id: userId,
		},
	});

	if (!user) {
		return {
			error: 'User not found',
		};
	}

	// Update transaction status
	 await db.transaction.update({
		where: {
			id: transactionId,
		},
		data: {
			status: 'success',
		},
	});

	// Update user balance — deposit goes to wallet + investment
	await db.user.update({
		where: {
			id: userId,
		},
		data: depositBalanceUpdate(Number(transaction.amount)),
	});

	await refreshRankingChain(userId);

	revalidatePath('/admin/dashboard/deposit');
	revalidatePath('/dashboard/ranking');
	revalidatePath('/dashboard/referrals');
	await sendEmail(user.email, 'confirmDeposit', {
		amount: Number(transaction.amount),
	});
	return {
		success: 'Deposit request approved successfully',
	};
};

export const rejectDepositRequest = async (transactionId: string) => {
	// First verify the transaction exists
	const transaction = await db.transaction.findUnique({
		where: {
			id: transactionId,
		},
	});

	if (!transaction) {
		return {
			error: 'Transaction not found',
		};
	}

	// Update transaction status to rejected
	await db.transaction.update({
		where: {
			id: transactionId,
		},
		data: {
			status: 'rejected',
		},
	});

	revalidatePath('/admin/dashboard/deposit');

	return {
		success: 'Deposit request rejected successfully',
	};
};

export const deleteDepositRequest = async (transactionId: string) => {
	await db.transaction.delete({
		where: {
			id: transactionId,
		},
	});
	revalidatePath('/admin/dashboard/deposit');
	return {
		success: 'Deposit request deleted successfully',
	};
};