'use server';

import { getSession } from '@/lib/session';
import {
	buildRankingView,
	getRankMetrics,
	RANK_TIERS,
} from '@/lib/ranking';
import { toMoneyNumber } from '@/lib/money';
import { db } from '@/lib/db';
import { unstable_noStore as noStore } from 'next/cache';

export async function getUserRankingData() {
	noStore();
	const session = await getSession();
	if (!session?.user) {
		return { error: 'Unauthorized' as const };
	}

	const metrics = await getRankMetrics(session.user.id);
	const view = buildRankingView(metrics);

	const user = await db.user.findUnique({
		where: { id: session.user.id },
		select: { referralBonusTotal: true, rankTier: true },
	});

	return {
		...view,
		referralBonusTotal: toMoneyNumber(user?.referralBonusTotal),
		rankTier: user?.rankTier ?? 'SILVER',
		tierDefinitions: RANK_TIERS,
	};
}
