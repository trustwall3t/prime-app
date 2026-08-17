import { db } from '@/lib/db';
import { toMoneyNumber } from '@/lib/money';
import { getReferralLink as buildReferralLink } from '@/lib/referrals';
import type { RankingTier } from '@/generated/prisma';

export type RankTierConfig = {
	tier: RankingTier;
	id: string;
	name: string;
	level: number;
	minimumDeposit: number;
	directReferral: number;
	referralDeposits: number;
	bonus: number;
};

/** Six rank levels — participation (invest) + invitations (referrals + team volume). */
export const RANK_TIERS: RankTierConfig[] = [
	{
		tier: 'SILVER',
		id: 'silver',
		name: 'Silver',
		level: 1,
		minimumDeposit: 3_000,
		directReferral: 2,
		referralDeposits: 25_000,
		bonus: 50,
	},
	{
		tier: 'SILVERPRO',
		id: 'silver-pro',
		name: 'Silver Pro',
		level: 2,
		minimumDeposit: 10_000,
		directReferral: 10,
		referralDeposits: 100_000,
		bonus: 200,
	},
	{
		tier: 'GOLD',
		id: 'gold',
		name: 'Gold',
		level: 3,
		minimumDeposit: 25_000,
		directReferral: 20,
		referralDeposits: 250_000,
		bonus: 500,
	},
	{
		tier: 'GOLDPRO',
		id: 'gold-pro',
		name: 'Gold Pro',
		level: 4,
		minimumDeposit: 50_000,
		directReferral: 35,
		referralDeposits: 500_000,
		bonus: 1_000,
	},
	{
		tier: 'DIAMOND',
		id: 'diamond',
		name: 'Diamond',
		level: 5,
		minimumDeposit: 100_000,
		directReferral: 50,
		referralDeposits: 1_000_000,
		bonus: 2_500,
	},
	{
		tier: 'PLATINUM',
		id: 'platinum',
		name: 'Platinum',
		level: 6,
		minimumDeposit: 250_000,
		directReferral: 100,
		referralDeposits: 2_500_000,
		bonus: 5_000,
	},
];

export type RankMetrics = {
	myInvest: number;
	directReferral: number;
	teamInvest: number;
};

export function getTierConfig(tier: RankingTier): RankTierConfig | undefined {
	return RANK_TIERS.find((t) => t.tier === tier);
}

export function meetsTierRequirements(
	metrics: RankMetrics,
	config: RankTierConfig,
): boolean {
	return (
		metrics.myInvest >= config.minimumDeposit &&
		metrics.directReferral >= config.directReferral &&
		metrics.teamInvest >= config.referralDeposits
	);
}

/** Highest tier where all three requirements are met. */
export function computeAchievedTier(metrics: RankMetrics): RankTierConfig | null {
	let achieved: RankTierConfig | null = null;
	for (const tier of RANK_TIERS) {
		if (meetsTierRequirements(metrics, tier)) {
			achieved = tier;
		}
	}
	return achieved;
}

export function getNextTier(
	achieved: RankTierConfig | null,
): RankTierConfig | null {
	if (!achieved) return RANK_TIERS[0];
	const idx = RANK_TIERS.findIndex((t) => t.tier === achieved.tier);
	if (idx < 0 || idx >= RANK_TIERS.length - 1) return null;
	return RANK_TIERS[idx + 1];
}

export async function getTeamInvestVolume(userId: string): Promise<number> {
	const result = await db.user.aggregate({
		where: { referrerId: userId },
		_sum: { investmentBalance: true },
	});
	return toMoneyNumber(result._sum.investmentBalance);
}

export async function getRankMetrics(userId: string): Promise<RankMetrics> {
	const user = await db.user.findUnique({
		where: { id: userId },
		select: {
			investmentBalance: true,
			referralsCount: true,
		},
	});
	if (!user) {
		return { myInvest: 0, directReferral: 0, teamInvest: 0 };
	}

	const teamInvest = await getTeamInvestVolume(userId);

	return {
		myInvest: toMoneyNumber(user.investmentBalance),
		directReferral: user.referralsCount ?? 0,
		teamInvest,
	};
}

export async function updateUserRanking(userId: string): Promise<RankingTier | null> {
	const user = await db.user.findUnique({
		where: { id: userId },
		select: {
			rank: true,
			referralBonusTotal: true,
		},
	});
	if (!user) return null;

	const metrics = await getRankMetrics(userId);
	const achieved = computeAchievedTier(metrics);
	const previousLevel = user.rank ?? 0;
	const newLevel = achieved?.level ?? 0;
	const newTier = achieved?.tier ?? 'SILVER';
	const tierUpgraded = newLevel > previousLevel;

	const bonusDelta =
		tierUpgraded && achieved ? achieved.bonus - getPreviousBonusTotal(previousLevel) : 0;

	await db.user.update({
		where: { id: userId },
		data: {
			rankTier: newTier,
			rank: newLevel,
			rankingScore: Math.round(
				metrics.myInvest + metrics.teamInvest + metrics.directReferral * 100,
			),
			...(bonusDelta > 0
				? { referralBonusTotal: { increment: bonusDelta } }
				: {}),
		},
	});

	const score = Math.round(
		metrics.myInvest + metrics.teamInvest + metrics.directReferral * 100,
	);

	await db.userRanking.upsert({
		where: { userId },
		create: {
			userId,
			rank: newLevel,
			score,
			tier: newTier.toLowerCase(),
		},
		update: {
			rank: newLevel,
			score,
			tier: newTier.toLowerCase(),
		},
	});

	return newTier;
}

function getPreviousBonusTotal(previousLevel: number): number {
	if (previousLevel <= 0) return 0;
	const prev = RANK_TIERS.find((t) => t.level === previousLevel);
	return prev?.bonus ?? 0;
}

/** Recompute rank for user and their referrer (team volume may change). */
export async function refreshRankingChain(userId: string) {
	await updateUserRanking(userId);

	const user = await db.user.findUnique({
		where: { id: userId },
		select: { referrerId: true },
	});

	if (user?.referrerId) {
		await updateUserRanking(user.referrerId);
	}
}

export function buildRankingView(metrics: RankMetrics) {
	const achieved = computeAchievedTier(metrics);
	const nextTier = getNextTier(achieved);
	const progressTarget = nextTier ?? achieved ?? RANK_TIERS[0];

	return {
		achieved,
		nextTier,
		currentRank: {
			rankName: achieved?.name ?? 'Starter',
			myInvest: {
				current: metrics.myInvest,
				target: progressTarget.minimumDeposit,
			},
			directReferral: {
				current: metrics.directReferral,
				target: progressTarget.directReferral,
			},
			teamInvest: {
				current: metrics.teamInvest,
				target: progressTarget.referralDeposits,
			},
			bonus: nextTier?.bonus ?? achieved?.bonus ?? RANK_TIERS[0].bonus,
		},
		tiers: RANK_TIERS.map((tier) => ({
			id: tier.id,
			name: tier.name,
			level: tier.level,
			locked: tier.level > (achieved?.level ?? 0),
			minimumDeposit: tier.minimumDeposit,
			directReferral: tier.directReferral,
			referralDeposits: tier.referralDeposits,
			bonus: tier.bonus,
			achieved: achieved ? tier.level <= achieved.level : false,
		})),
	};
}

export { buildReferralLink as getReferralLink };
