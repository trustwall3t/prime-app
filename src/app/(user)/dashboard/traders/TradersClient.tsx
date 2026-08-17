'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, TrendingUp } from 'lucide-react';
import type { PublicTrader } from '@/types/copyTrading';
import {
	dashboardCardTitleClass,
	dashboardPageTitleClass,
	dashboardPageWrapClass,
} from '@/lib/userFormStyles';

function initialsFromName(name: string): string {
	return name?.trim()?.charAt(0)?.toUpperCase() || '?';
}

function formatCount(n: number): string {
	return new Intl.NumberFormat('en-US').format(n);
}

const TraderCard = ({
	trader,
	onViewProfile,
}: {
	trader: PublicTrader;
	onViewProfile: (id: string) => void;
}) => (
	<div className='rounded-md border border-zinc-700 bg-zinc-800 p-5 space-y-4'>
		<div className='flex items-start justify-between'>
			<div className='flex items-center gap-4'>
				<div className='flex h-12 w-12 items-center justify-center rounded-md bg-zinc-700 text-base font-semibold text-white sm:h-14 sm:w-14 sm:text-lg'>
					{initialsFromName(trader.name)}
				</div>
				<div>
					<h3 className={dashboardCardTitleClass}>
						{trader.name}
					</h3>
					<p className='text-sm text-gray-400'>{trader.country}</p>
				</div>
			</div>
			{trader.isActive && (
				<span className='rounded-full bg-emerald-900/60 px-3 py-1 text-xs font-medium text-emerald-300'>
					Online
				</span>
			)}
		</div>

		<div className='grid grid-cols-2 gap-3'>
			<div className='rounded-md border border-zinc-700 bg-zinc-900/40 p-3'>
				<p className='text-xs text-gray-400'>Followers</p>
				<p className='mt-1 text-base font-semibold text-white'>
					{formatCount(trader.followers)}
				</p>
			</div>
			<div className='rounded-md border border-zinc-700 bg-zinc-900/40 p-3'>
				<p className='text-xs text-gray-400'>Trades</p>
				<p className='mt-1 text-base font-semibold text-white'>
					{formatCount(trader.totalTrades)}
				</p>
			</div>
		</div>

		<div className='flex items-center gap-2 text-emerald-400'>
			<TrendingUp size={16} />
			<span className='text-sm font-medium'>
				Profit rate: {trader.winRate.toFixed(0)}%
			</span>
		</div>

		<button
			type='button'
			onClick={() => onViewProfile(trader.id)}
			className='w-full rounded-md bg-indigo-500 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 active:scale-[0.99]'
		>
			View profile
		</button>
	</div>
);

export default function TradersClient({
	traders,
}: {
	traders: PublicTrader[];
}) {
	const router = useRouter();
	const [query, setQuery] = useState('');

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return traders;
		return traders.filter(
			(t) =>
				t.name.toLowerCase().includes(q) ||
				t.id.toLowerCase().includes(q) ||
				t.country.toLowerCase().includes(q),
		);
	}, [traders, query]);

	return (
		<div className={dashboardPageWrapClass}>
			<div className='space-y-1'>
				<h1 className={dashboardPageTitleClass}>Expert traders</h1>
				<p className='text-gray-400 text-sm'>
					Browse top performers and choose who to follow.
				</p>
			</div>

			<div className='rounded-md bg-zinc-700 p-6 space-y-2'>
				<h2 className='uppercase text-gray-200 text-sm'>Discover</h2>
				<p className='text-white font-medium'>
					Copy the strategy that fits your goals
				</p>
				<p className='text-gray-400 text-sm'>
					View profiles, compare stats, and start copying with one tap
				</p>
			</div>

			<div className='space-y-4'>
				<h4 className='text-white font-medium'>Search traders</h4>
				<div className='relative'>
					<Search
						size={18}
						className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'
					/>
					<input
						type='text'
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder='Name or country...'
						className='w-full rounded-md border border-zinc-700 bg-zinc-800 py-2.5 pl-10 pr-4 text-white placeholder-gray-500 outline-none focus:border-indigo-500'
					/>
				</div>

				<div className='space-y-4'>
					{filtered.length === 0 ? (
						<p className='py-8 text-center text-gray-500'>
							No traders found.
						</p>
					) : (
						filtered.map((trader) => (
							<TraderCard
								key={trader.id}
								trader={trader}
								onViewProfile={(id) =>
									router.push(`/dashboard/traders/${id}`)
								}
							/>
						))
					)}
				</div>
			</div>
		</div>
	);
}
