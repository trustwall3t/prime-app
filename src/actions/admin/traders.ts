'use server';

import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/admin-auth';
import { revalidatePath } from 'next/cache';
import type { MarketType } from '@/generated/prisma';
import { emitRandomTraderSignal } from '@/lib/copyTradeMirror';
import { settleDueTrades } from '@/lib/tradeSettlement';

export async function getAdminTraders() {
	const session = await getAdminSession();
	if (!session) return { error: 'Unauthorized' as const };

	const traders = await db.trader.findMany({
		orderBy: { createdAt: 'desc' },
		include: {
			copiedBy: {
				where: { status: 'ACTIVE' },
				select: { id: true },
			},
		},
	});

	return {
		traders: traders.map((t) => ({
			...t,
			followers: t.followers ?? 0,
			activeCopiers: t.copiedBy.length,
		})),
	};
}

export async function createTrader(data: {
	name: string;
	description?: string;
	strategy?: string;
	marketType: MarketType;
	country?: string;
	winRate?: number;
	totalTrades?: number;
	followers?: number;
}) {
	const session = await getAdminSession();
	if (!session) return { error: 'Unauthorized' };

	if (!data.name.trim()) return { error: 'Name is required.' };

	const trader = await db.trader.create({
		data: {
			adminId: session.adminId,
			name: data.name.trim(),
			description: data.description?.trim() || null,
			strategy: data.strategy?.trim() || null,
			marketType: data.marketType,
			country: data.country?.trim() || 'Global',
			followers: Math.max(0, Math.floor(data.followers ?? 0)),
			winRate: data.winRate ?? 0,
			totalTrades: data.totalTrades ?? 0,
			performanceScore: data.winRate ?? 0,
			isActive: true,
		},
	});

	revalidatePath('/dashboard/traders');
	revalidatePath('/admin/dashboard/traders');
	return { trader };
}

export async function toggleTraderActive(traderId: string, isActive: boolean) {
	const session = await getAdminSession();
	if (!session) return { error: 'Unauthorized' };

	await db.trader.update({
		where: { id: traderId },
		data: { isActive },
	});

	revalidatePath('/dashboard/traders');
	revalidatePath('/admin/dashboard/traders');
	return { success: true };
}

export async function deleteTrader(traderId: string) {
	const session = await getAdminSession();
	if (!session) return { error: 'Unauthorized' };

	await db.trader.delete({ where: { id: traderId } });

	revalidatePath('/dashboard/traders');
	revalidatePath('/admin/dashboard/traders');
	return { success: true };
}

export async function emitTraderCopySignal(traderId: string) {
	const session = await getAdminSession();
	if (!session) return { error: 'Unauthorized' };

	const result = await emitRandomTraderSignal(traderId);

	if (!result.error && result.copierUserIds?.length) {
		await settleDueTrades({ userIds: result.copierUserIds });
	}

	if (!result.error) {
		revalidatePath('/admin/dashboard/traders');
		revalidatePath('/admin/dashboard/trade');
		revalidatePath('/dashboard/trading-history');
		revalidatePath('/dashboard/live-trading');
		revalidatePath('/dashboard/transaction-history');
	}

	return result;
}
