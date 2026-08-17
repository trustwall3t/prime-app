'use client';

import React from 'react';
import { Award, Lock, CheckCircle } from 'lucide-react';

interface ProgressMetric {
	current: number;
	target: number;
}

interface CurrentRankProgress {
	rankName: string;
	myInvest: ProgressMetric;
	directReferral: ProgressMetric;
	teamInvest: ProgressMetric;
	bonus: number;
}

interface RankTier {
	id: string;
	name: string;
	level: number;
	locked: boolean;
	achieved?: boolean;
	minimumDeposit: number;
	directReferral: number;
	referralDeposits: number;
	bonus: number;
}

function formatCurrency(n: number): string {
	return `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatCount(n: number): string {
	return n.toLocaleString('en-US');
}

const TIER_COLORS: Record<number, string> = {
	1: 'bg-slate-400/20 text-slate-300',
	2: 'bg-zinc-400/20 text-zinc-300',
	3: 'bg-amber-500/20 text-amber-400',
	4: 'bg-yellow-500/20 text-yellow-400',
	5: 'bg-cyan-500/20 text-cyan-400',
	6: 'bg-purple-500/20 text-purple-400',
};

const ProgressStatBox = ({
	label,
	current,
	target,
	kind,
}: {
	label: string;
	current: number;
	target: number;
	kind: 'currency' | 'count';
}) => {
	const remaining = Math.max(target - current, 0);
	const format = kind === 'currency' ? formatCurrency : formatCount;
	const pct = target > 0 ? Math.min(100, (current / target) * 100) : 0;
	const unlockMessage =
		remaining === 0
			? 'Requirement met'
			: kind === 'currency'
				? `${format(remaining)} to unlock next rank`
				: `${format(remaining)} more to unlock next rank`;

	return (
		<div className='rounded-md border border-zinc-700 bg-zinc-900/40 p-4 space-y-2'>
			<div className='flex items-center justify-between'>
				<p className='text-xs uppercase tracking-wide text-gray-400'>
					{label}
				</p>
				<p className='text-xs text-gray-500'>{Math.round(pct)}%</p>
			</div>
			<p className='text-2xl font-bold text-white'>
				{format(current)}{' '}
				<span className='text-lg font-normal text-gray-500'>
					/ {format(target)}
				</span>
			</p>
			<div className='h-1.5 rounded-full bg-zinc-700 overflow-hidden'>
				<div
					className='h-full rounded-full bg-indigo-500 transition-all'
					style={{ width: `${pct}%` }}
				/>
			</div>
			<p className='text-sm text-gray-400'>{unlockMessage}</p>
		</div>
	);
};

const BonusBox = ({ amount }: { amount: number }) => (
	<div className='rounded-md border border-zinc-700 bg-zinc-900/40 p-4 space-y-1'>
		<p className='text-xs uppercase tracking-wide text-gray-400'>
			Next rank bonus
		</p>
		<p className='text-xl font-semibold text-blue-400'>
			{formatCurrency(amount)}
		</p>
	</div>
);

const RankIcon = ({
	level,
	locked,
	achieved,
}: {
	level: number;
	locked?: boolean;
	achieved?: boolean;
}) => (
	<div
		className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${
			locked
				? 'bg-zinc-700'
				: TIER_COLORS[level] ?? 'bg-amber-500/20'
		}`}
	>
		{achieved ? (
			<CheckCircle className='h-8 w-8 text-green-400' />
		) : (
			<Award
				className={`h-8 w-8 ${locked ? 'text-gray-500' : 'text-amber-400'}`}
			/>
		)}
	</div>
);

const CurrentRankCard = ({
	progress,
	bonusEarned,
}: {
	progress: CurrentRankProgress;
	bonusEarned: number;
}) => (
	<div className='rounded-md border border-zinc-700 bg-zinc-800 p-6 space-y-6'>
		<div className='flex items-center gap-4'>
			<RankIcon level={1} />
			<div>
				<p className='text-xs uppercase tracking-wide text-gray-400'>
					Current rank
				</p>
				<h2 className='text-2xl font-bold text-white'>
					{progress.rankName}
				</h2>
				{bonusEarned > 0 && (
					<p className='text-sm text-green-400 mt-1'>
						Total rank bonuses earned: {formatCurrency(bonusEarned)}
					</p>
				)}
			</div>
		</div>

		<div className='space-y-2'>
			<ProgressStatBox
				label='My invest'
				current={progress.myInvest.current}
				target={progress.myInvest.target}
				kind='currency'
			/>
			<ProgressStatBox
				label='No. of direct referral'
				current={progress.directReferral.current}
				target={progress.directReferral.target}
				kind='count'
			/>
			<ProgressStatBox
				label='Team invest'
				current={progress.teamInvest.current}
				target={progress.teamInvest.target}
				kind='currency'
			/>
			<BonusBox amount={progress.bonus} />
		</div>
	</div>
);

const RankTierRow = ({ label, value }: { label: string; value: string }) => (
	<div className='flex items-center justify-between py-2'>
		<p className='text-gray-400'>{label}</p>
		<p className='font-semibold text-white'>{value}</p>
	</div>
);

const RankTierCard = ({ tier }: { tier: RankTier }) => (
	<div
		className={`relative rounded-md border p-6 space-y-4 ${
			tier.achieved
				? 'border-green-500/40 bg-green-950/20'
				: 'border-zinc-700 bg-zinc-800'
		}`}
	>
		{tier.locked && !tier.achieved && (
			<div className='absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900'>
				<Lock size={16} className='text-gray-400' />
			</div>
		)}
		{tier.achieved && (
			<div className='absolute right-4 top-4 flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-1 text-xs font-medium text-green-400'>
				<CheckCircle size={12} />
				Achieved
			</div>
		)}

		<div className='flex items-center gap-4'>
			<RankIcon
				level={tier.level}
				locked={tier.locked}
				achieved={tier.achieved}
			/>
			<div>
				<h3 className='text-xl font-bold text-white'>{tier.name}</h3>
				<p className='text-sm text-gray-400'>Level {tier.level}</p>
			</div>
		</div>

		<div className='divide-y divide-zinc-700 border-t border-zinc-700'>
			<RankTierRow
				label='Minimum deposit'
				value={formatCurrency(tier.minimumDeposit)}
			/>
			<RankTierRow
				label='Direct referral'
				value={formatCount(tier.directReferral)}
			/>
			<RankTierRow
				label='Referral deposits'
				value={formatCurrency(tier.referralDeposits)}
			/>
		</div>

		<div className='flex items-center justify-between border-t border-zinc-700 pt-4'>
			<p className='text-gray-400'>Bonus</p>
			<p className='text-lg font-medium text-blue-400'>
				{formatCurrency(tier.bonus)}
			</p>
		</div>
	</div>
);

export default function RankingClient({
	currentRank,
	tiers,
	bonusEarned,
}: {
	currentRank: CurrentRankProgress;
	tiers: RankTier[];
	bonusEarned: number;
}) {
	return (
		<div className='space-y-8'>
			<div className='space-y-2'>
				<h1 className='text-2xl font-medium text-white'>
					Trade ranking list
				</h1>
				<p className='text-gray-400 text-sm max-w-lg'>
					Climb 6 ranks by investing, inviting friends, and growing
					your team&apos;s deposit volume. All three requirements
					must be met to unlock each rank.
				</p>
			</div>

			<CurrentRankCard progress={currentRank} bonusEarned={bonusEarned} />

			<div className='space-y-4'>
				<h2 className='text-2xl font-bold text-white'>Rank tiers</h2>
				<div className='space-y-4'>
					{tiers.map((tier) => (
						<RankTierCard key={tier.id} tier={tier} />
					))}
				</div>
			</div>
		</div>
	);
}
