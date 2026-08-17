'use server';

import { getSession } from '@/lib/session';
import { db } from '@/lib/db';
import {
	ensureUserRefcode,
	getReferralLink,
} from '@/lib/referrals';
import { toMoneyNumber } from '@/lib/money';
import { unstable_noStore as noStore } from 'next/cache';

export async function getUserReferralData() {
	noStore();
	const session = await getSession();
	if (!session?.user?.id) {
		return { error: 'Unauthorized' as const };
	}

	const refcode = await ensureUserRefcode(session.user.id);

	const user = await db.user.findUnique({
		where: { id: session.user.id },
		select: {
			refcode: true,
			referralsCount: true,
			referralBonusTotal: true,
			referredUsers: {
				select: {
					id: true,
					name: true,
					createdAt: true,
					investmentBalance: true,
				},
				orderBy: { createdAt: 'desc' },
			},
		},
	});

	if (!user) {
		return { error: 'User not found' as const };
	}

	const now = new Date();
	const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

	const thisMonthReferrals = user.referredUsers.filter(
		(r) => r.createdAt >= monthStart,
	).length;

	const teamInvest = user.referredUsers.reduce(
		(sum, r) => sum + toMoneyNumber(r.investmentBalance),
		0,
	);

	const activeRefcode = user.refcode ?? refcode;

	return {
		referralLink: getReferralLink(activeRefcode),
		refcode: activeRefcode,
		stats: {
			totalReferrals: user.referralsCount ?? user.referredUsers.length,
			thisMonthReferrals,
			teamInvest,
			bonusEarned: toMoneyNumber(user.referralBonusTotal),
		},
		referrals: user.referredUsers.map((r) => ({
			id: r.id,
			name: r.name,
			joinedAt: r.createdAt.toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			}),
			invested: toMoneyNumber(r.investmentBalance),
		})),
	};
}
