'use client';

import React, { useState, useTransition } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import type { PublicTrader, UserCopySubscription } from '@/types/copyTrading';
import {
	startCopyTrading,
	stopCopyTrading,
} from '@/actions/user/copyTrading';

const ALLOCATION_OPTIONS = [10, 25, 50, 75, 100];

function initialsFromName(name: string): string {
	return name?.trim()?.charAt(0)?.toUpperCase() || '?';
}

function formatCount(n: number): string {
	return new Intl.NumberFormat('en-US').format(n);
}

const StatBox = ({ value, label }: { value: string; label: string }) => (
	<div className='rounded-md border border-zinc-700 bg-zinc-900/40 p-4 text-center'>
		<p className='text-lg font-bold text-white'>{value}</p>
		<p className='mt-1 text-xs uppercase tracking-wide text-gray-400'>
			{label}
		</p>
	</div>
);

const RatingBar = ({
	label,
	value,
	color,
}: {
	label: string;
	value: number;
	color: string;
}) => (
	<div className='space-y-2'>
		<div className='flex items-center justify-between'>
			<p className='text-white font-medium'>{label}</p>
			<p
				className='font-semibold'
				style={{ color }}
			>
				{value.toFixed(0)}%
			</p>
		</div>
		<div className='h-2 w-full rounded-full bg-zinc-700'>
			<div
				className='h-2 rounded-full'
				style={{
					width: `${Math.min(100, value)}%`,
					backgroundColor: color,
				}}
			/>
		</div>
	</div>
);

export default function TraderProfileClient({
	trader,
	existingCopy,
	walletBalance,
}: {
	trader: PublicTrader;
	existingCopy: UserCopySubscription | null;
	walletBalance: number;
}) {
	const router = useRouter();
	const [allocation, setAllocation] = useState(
		existingCopy?.allocationPercentage ?? 25,
	);
	const [copy, setCopy] = useState(existingCopy);
	const [isPending, startTransition] = useTransition();

	const handleCopy = () => {
		startTransition(async () => {
			const result = await startCopyTrading(trader.id, allocation);
			if (result.error) {
				toast.error(result.error);
				return;
			}
			toast.success(result.success);
			setCopy({
				id: result.copyId ?? copy?.id ?? '',
				traderId: trader.id,
				traderName: trader.name,
				allocationPercentage: allocation,
				status: 'ACTIVE',
				startedAt: new Date().toISOString(),
				winRate: trader.winRate,
				marketType: trader.marketType,
			});
		});
	};

	const handleStop = () => {
		if (!copy) return;
		startTransition(async () => {
			const result = await stopCopyTrading(copy.id);
			if (result.error) {
				toast.error(result.error);
				return;
			}
			toast.success(result.success);
			setCopy(null);
		});
	};

	const riskScore = Math.max(
		5,
		Math.min(95, 100 - trader.performanceScore * 0.4),
	);

	const estimatedStake = Math.round(walletBalance * (allocation / 100) * 100) / 100;

	return (
		<div className='space-y-6'>
			<button
				type='button'
				onClick={() => router.push('/dashboard/traders')}
				className='flex items-center gap-1 text-gray-400 hover:text-white'
			>
				<ChevronLeft size={20} />
				<span>Copy traders</span>
			</button>

			<div className='rounded-md border border-zinc-700 bg-zinc-800 p-2 space-y-6'>
				<div className='flex flex-col items-center space-y-3 text-center px-4 pt-4'>
					<div className='flex h-20 w-20 items-center justify-center rounded-xl bg-zinc-700 text-2xl font-semibold text-white'>
						{initialsFromName(trader.name)}
					</div>
					<h1 className='text-2xl font-bold text-white'>{trader.name}</h1>
					<span className='rounded-full bg-emerald-900/60 px-3 py-1 text-sm font-medium text-emerald-300'>
						{trader.marketType === 'CRYPTO' ? 'Crypto' : 'Stocks'}
					</span>
					<p className='text-sm text-gray-400'>{trader.country}</p>
					{trader.description && (
						<p className='text-sm text-gray-400 max-w-sm'>
							{trader.description}
						</p>
					)}
					{trader.strategy && (
						<p className='text-xs text-indigo-300'>
							Strategy: {trader.strategy}
						</p>
					)}
				</div>

				<div className='border-t border-zinc-700 pt-6 grid grid-cols-3 gap-3 px-4'>
					<StatBox
						value={formatCount(trader.followers)}
						label='Followers'
					/>
					<StatBox
						value={formatCount(trader.totalTrades)}
						label='Trades'
					/>
					<StatBox
						value={`${trader.performanceScore.toFixed(0)}%`}
						label='Score'
					/>
				</div>

				<div className='border-t border-zinc-700 pt-6 space-y-6 px-4'>
					<RatingBar
						label='Risk score'
						value={riskScore}
						color='#60a5fa'
					/>
					<RatingBar
						label='Profit rate'
						value={trader.winRate}
						color='#6366f1'
					/>
				</div>

				<div className='border-t border-zinc-700 pt-6 space-y-4 px-4 pb-4'>
					<p className='text-sm text-gray-400'>
						Allocation (% of your ${walletBalance.toFixed(2)} balance
						used per copied signal)
					</p>
					<p className='text-sm text-indigo-300'>
						Each signal stakes ~${estimatedStake.toFixed(2)} at{' '}
						{allocation}% · trades run at least 15 minutes
					</p>
					<div className='flex flex-wrap gap-2'>
						{ALLOCATION_OPTIONS.map((pct) => (
							<button
								key={pct}
								type='button'
								onClick={() => setAllocation(pct)}
								className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
									allocation === pct
										? 'border-indigo-500 bg-indigo-500 text-white'
										: 'border-zinc-700 bg-zinc-900 text-gray-300 hover:border-zinc-600'
								}`}
							>
								{pct}%
							</button>
						))}
					</div>

					{copy?.status === 'ACTIVE' ? (
						<div className='space-y-3'>
							<p className='text-center text-sm text-emerald-400'>
								Copying at {copy.allocationPercentage}% allocation
							</p>
							<button
								type='button'
								disabled={isPending}
								onClick={handleStop}
								className='w-full rounded-md bg-red-600 py-3 text-base font-semibold text-white transition hover:bg-red-500 disabled:opacity-50'
							>
								Stop copying
							</button>
							<button
								type='button'
								disabled={isPending}
								onClick={handleCopy}
								className='w-full rounded-md border border-indigo-500 py-3 text-base font-semibold text-indigo-400 transition hover:bg-indigo-500/10 disabled:opacity-50'
							>
								Update allocation
							</button>
						</div>
					) : (
						<button
							type='button'
							disabled={isPending}
							onClick={handleCopy}
							className='w-full rounded-md bg-indigo-500 py-3 text-base font-semibold text-white transition hover:bg-indigo-400 disabled:opacity-50'
						>
							{isPending
								? 'Starting...'
								: `Copy trade at ${allocation}%`}
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
