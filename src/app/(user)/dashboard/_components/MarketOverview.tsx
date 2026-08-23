'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
	ActivityIcon,
	LayoutGridIcon,
	TrendingDownIcon,
	TrendingUpIcon,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { refreshAssetPrices } from '@/actions/user/refreshPrices';
import {
	dashboardSectionTitleClass,
	dashboardTabsListClass,
	dashboardTabTriggerClass,
} from '@/lib/userFormStyles';
import type { Asset } from '@/types';
import MarketAssetRow from './MarketAssetRow';
import { cn } from '@/lib/utils';

const PRICE_POLL_INTERVAL_MS = 60_000;
const LIST_SIZE = 8;

const CORE_SYMBOLS = [
	'GOOGL',
	'AMZN',
	'AAPL',
	'MSFT',
	'TSLA',
	'META',
	'NVDA',
	'BTC',
] as const;

type MarketOverviewProps = {
	initialAssets: Asset[];
};

function mergePriceUpdates(
	assets: Asset[],
	updates: Awaited<ReturnType<typeof refreshAssetPrices>>,
) {
	const bySymbol = new Map(updates.map((u) => [u.symbol, u]));
	return assets.map((asset) => {
		const update = bySymbol.get(asset.symbol);
		if (!update) return asset;
		return {
			...asset,
			price: update.price,
			changePercent: update.changePercent,
			iconUrl: update.iconUrl ?? asset.iconUrl,
		};
	});
}

function sortByChange(assets: Asset[], direction: 'gainers' | 'losers') {
	return [...assets]
		.filter((a) => a.price > 0)
		.sort((a, b) =>
			direction === 'gainers'
				? b.changePercent - a.changePercent
				: a.changePercent - b.changePercent,
		)
		.slice(0, LIST_SIZE);
}

function pickCoreAssets(assets: Asset[]) {
	const bySymbol = new Map(assets.map((a) => [a.symbol, a]));
	return CORE_SYMBOLS.map((symbol) => bySymbol.get(symbol)).filter(
		(asset): asset is Asset => Boolean(asset),
	);
}

function LiveStatus({ refreshing }: { refreshing: boolean }) {
	return (
		<div className='flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/80 px-3 py-1.5'>
			<span className='relative flex h-2 w-2'>
				<span
					className={cn(
						'absolute inline-flex h-full w-full rounded-full opacity-75',
						refreshing ? 'animate-ping bg-amber-400' : 'animate-ping bg-emerald-400',
					)}
				/>
				<span
					className={cn(
						'relative inline-flex h-2 w-2 rounded-full',
						refreshing ? 'bg-amber-400' : 'bg-emerald-400',
					)}
				/>
			</span>
			<span className='text-xs font-medium text-zinc-400'>
				{refreshing ? 'Updating' : 'Live'}
			</span>
		</div>
	);
}

function MarketTableHeader({ showRank }: { showRank?: boolean }) {
	return (
		<>
			<div className='grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 border-b border-zinc-800/80 bg-zinc-950/40 px-4 py-2 sm:hidden'>
				<span className='text-[11px] font-medium uppercase tracking-wider text-zinc-500'>
					{showRank ? '# · Asset' : 'Asset'}
				</span>
				<span className='text-right text-[11px] font-medium uppercase tracking-wider text-zinc-500'>
					Price · 24h
				</span>
			</div>
			<div className='hidden border-b border-zinc-800/80 bg-zinc-950/40 px-5 py-2.5 sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)_88px] sm:gap-x-4'>
				<span className='text-[11px] font-medium uppercase tracking-wider text-zinc-500'>
					{showRank ? '# · Asset' : 'Asset'}
				</span>
				<span className='text-right text-[11px] font-medium uppercase tracking-wider text-zinc-500'>
					Price
				</span>
				<span className='text-right text-[11px] font-medium uppercase tracking-wider text-zinc-500'>
					24h change
				</span>
				<span className='text-right text-[11px] font-medium uppercase tracking-wider text-zinc-500'>
					Trend
				</span>
			</div>
		</>
	);
}

function MarketList({
	assets,
	emptyMessage,
	showRank = false,
}: {
	assets: Asset[];
	emptyMessage: string;
	showRank?: boolean;
}) {
	if (assets.length === 0) {
		return (
			<div className='flex flex-col items-center justify-center gap-2 px-6 py-14 text-center'>
				<ActivityIcon className='h-8 w-8 text-zinc-600' />
				<p className='text-sm text-zinc-400'>{emptyMessage}</p>
			</div>
		);
	}

	return (
		<div>
			<MarketTableHeader showRank={showRank} />
			{assets.map((asset, index) => (
				<MarketAssetRow
					key={asset.symbol}
					asset={asset}
					rank={showRank ? index + 1 : undefined}
				/>
			))}
		</div>
	);
}

export default function MarketOverview({ initialAssets }: MarketOverviewProps) {
	const [assets, setAssets] = useState(initialAssets);
	const [refreshing, setRefreshing] = useState(false);

	const coreAssets = useMemo(() => pickCoreAssets(assets), [assets]);
	const topGainers = useMemo(
		() => sortByChange(assets, 'gainers'),
		[assets],
	);
	const topLosers = useMemo(() => sortByChange(assets, 'losers'), [assets]);

	useEffect(() => {
		setAssets(initialAssets);
	}, [initialAssets]);

	useEffect(() => {
		const refreshPrices = async () => {
			setRefreshing(true);
			try {
				const updates = await refreshAssetPrices();
				if (!updates.length) return;
				setAssets((prev) => mergePriceUpdates(prev, updates));
			} catch (err) {
				console.error('Market overview price refresh failed:', err);
			} finally {
				setRefreshing(false);
			}
		};

		const interval = setInterval(refreshPrices, PRICE_POLL_INTERVAL_MS);
		return () => clearInterval(interval);
	}, []);

	return (
		<section className='overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/90 shadow-sm'>
			<div className='flex items-start justify-between gap-3 border-b border-zinc-800 px-4 py-4 sm:items-center sm:px-5 sm:py-5'>
				<div className='min-w-0'>
					<h2 className={dashboardSectionTitleClass}>Market overview</h2>
					<p className='mt-0.5 text-xs text-zinc-500'>
						Live stocks & crypto
					</p>
				</div>
				<LiveStatus refreshing={refreshing} />
			</div>

			<Tabs defaultValue='core' className='w-full'>
				<div className='border-b border-zinc-800 px-4 sm:px-5'>
					<TabsList
						className={cn(
							dashboardTabsListClass,
							'w-full min-w-0 justify-between gap-0 sm:max-w-none sm:justify-start sm:gap-8',
						)}
					>
						<TabsTrigger
							value='core'
							className={cn(
								dashboardTabTriggerClass,
								'flex flex-1 items-center justify-center gap-1 pb-3.5 text-[11px] sm:flex-none sm:justify-start sm:gap-1.5 sm:text-sm',
							)}
						>
							<LayoutGridIcon className='h-3.5 w-3.5 shrink-0' />
							<span className='truncate'>Core</span>
							<span className='hidden truncate sm:inline'> assets</span>
						</TabsTrigger>
						<TabsTrigger
							value='gainers'
							className={cn(
								dashboardTabTriggerClass,
								'flex flex-1 items-center justify-center gap-1 pb-3.5 text-[11px] sm:flex-none sm:justify-start sm:gap-1.5 sm:text-sm',
							)}
						>
							<TrendingUpIcon className='h-3.5 w-3.5 shrink-0' />
							<span className='truncate'>Gainers</span>
						</TabsTrigger>
						<TabsTrigger
							value='losers'
							className={cn(
								dashboardTabTriggerClass,
								'flex flex-1 items-center justify-center gap-1 pb-3.5 text-[11px] sm:flex-none sm:justify-start sm:gap-1.5 sm:text-sm',
							)}
						>
							<TrendingDownIcon className='h-3.5 w-3.5 shrink-0' />
							<span className='truncate'>Losers</span>
						</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value='core' className='mt-0'>
					<MarketList
						assets={coreAssets}
						emptyMessage='Live prices are loading for core assets.'
					/>
				</TabsContent>
				<TabsContent value='gainers' className='mt-0'>
					<MarketList
						assets={topGainers}
						emptyMessage='No gainer data available right now.'
						showRank
					/>
				</TabsContent>
				<TabsContent value='losers' className='mt-0'>
					<MarketList
						assets={topLosers}
						emptyMessage='No loser data available right now.'
						showRank
					/>
				</TabsContent>
			</Tabs>
		</section>
	);
}
