'use client';

import React, { useCallback, useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';
import type { UserCopySubscription, CopiedTradeRecord } from '@/types/copyTrading';
import {
	getMyCopiedTradeHistory,
	stopCopyTrading,
} from '@/actions/user/copyTrading';
import {
	dashboardCardTitleClass,
	dashboardPageTitleClass,
	dashboardPageWrapClass,
	dashboardSubheadingClass,
} from '@/lib/userFormStyles';
import CopiedTradesList from './CopiedTradesList';

function initialsFromName(name: string): string {
	return name?.trim()?.charAt(0)?.toUpperCase() || '?';
}

const CopiedTraderCard = ({
	copy,
	onViewProfile,
	onStopCopying,
	isPending,
}: {
	copy: UserCopySubscription;
	onViewProfile: () => void;
	onStopCopying: () => void;
	isPending: boolean;
}) => (
	<div className='rounded-md border border-zinc-700 bg-zinc-800 p-6 space-y-6'>
		<div className='flex items-start gap-4'>
			<div className='flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-zinc-700 text-base font-semibold text-white sm:h-14 sm:w-14 sm:text-lg'>
				{initialsFromName(copy.traderName)}
			</div>
			<div className='space-y-2'>
				<h3 className={dashboardCardTitleClass}>
					{copy.traderName}
				</h3>
				<p className='text-sm text-gray-400'>
					Since{' '}
					{new Date(copy.startedAt).toLocaleDateString(undefined, {
						month: 'short',
						day: 'numeric',
						year: 'numeric',
					})}
				</p>
				<div className='flex flex-wrap items-center gap-3'>
					<span className='rounded-sm bg-emerald-800/90 px-3 py-1 text-sm font-medium text-emerald-300'>
						{copy.status}
					</span>
					<span className='text-sm text-gray-400'>
						{copy.allocationPercentage}% allocation
					</span>
					<span className='text-sm text-gray-400'>
						Win rate {copy.winRate.toFixed(0)}%
					</span>
				</div>
			</div>
		</div>

		<button
			type='button'
			onClick={onViewProfile}
			className='w-full text-center text-sm font-medium text-white hover:text-gray-300'
		>
			View profile
		</button>

		<button
			type='button'
			disabled={isPending}
			onClick={onStopCopying}
			className='w-full rounded-md bg-red-600 py-3 text-base font-semibold text-white transition hover:bg-red-500 disabled:opacity-50'
		>
			Stop copying
		</button>
	</div>
);

export default function CopyTradingClient({
	copies: initialCopies,
	copiedTrades: initialCopiedTrades,
	tradesError: initialTradesError,
}: {
	copies: UserCopySubscription[];
	copiedTrades: CopiedTradeRecord[];
	tradesError?: string | null;
}) {
	const router = useRouter();
	const [copies, setCopies] = useState(initialCopies);
	const [copiedTrades, setCopiedTrades] = useState(initialCopiedTrades);
	const [tradesError, setTradesError] = useState(initialTradesError ?? null);
	const [isRefreshingTrades, setIsRefreshingTrades] = useState(false);
	const [isPending, startTransition] = useTransition();

	const loadCopiedTrades = useCallback(async () => {
		setIsRefreshingTrades(true);
		setTradesError(null);
		try {
			const result = await getMyCopiedTradeHistory();
			if (Array.isArray(result)) {
				setCopiedTrades(result);
			} else {
				setTradesError(result.error ?? 'Could not load copied trades.');
			}
		} catch {
			setTradesError('Could not load copied trades.');
		} finally {
			setIsRefreshingTrades(false);
		}
	}, []);

	useEffect(() => {
		loadCopiedTrades();
	}, [loadCopiedTrades]);

	const handleStop = (copyId: string) => {
		startTransition(async () => {
			const result = await stopCopyTrading(copyId);
			if (result.error) {
				toast.error(result.error);
				return;
			}
			toast.success(result.success);
			setCopies((prev) => prev.filter((c) => c.id !== copyId));
		});
	};

	return (
		<div className={dashboardPageWrapClass}>
			<div className='space-y-2'>
				<h1 className={dashboardPageTitleClass}>Copy trading</h1>
				<p className='text-gray-400 text-sm'>
					Traders you are currently copying. Stopping here ends the
					subscription only — open live trades are not closed.
				</p>
			</div>

			{copies.length === 0 ? (
				<div className='rounded-md border border-zinc-700 bg-zinc-800 p-8 text-center space-y-4'>
					<p className={dashboardCardTitleClass}>
						You are not copying anyone yet
					</p>
					<p className='text-sm text-gray-400 max-w-sm mx-auto'>
						Browse expert traders and tap Copy trade on a profile
						to add them here.
					</p>
					<button
						type='button'
						onClick={() => router.push('/dashboard/traders')}
						className='mx-auto block rounded-md bg-indigo-500 px-6 py-3 text-base font-semibold text-white transition hover:bg-indigo-400'
					>
						Browse copy traders
					</button>
				</div>
			) : (
				<div className='space-y-4'>
					{copies.map((copy) => (
						<CopiedTraderCard
							key={copy.id}
							copy={copy}
							isPending={isPending}
							onViewProfile={() =>
								router.push(
									`/dashboard/traders/${copy.traderId}`,
								)
							}
							onStopCopying={() => handleStop(copy.id)}
						/>
					))}
				</div>
			)}

			<div className='space-y-3 border-t border-zinc-700 pt-6'>
				<div className='flex items-center justify-between gap-4'>
					<h2 className={dashboardSubheadingClass}>
						Copied trade history
					</h2>
					<button
						type='button'
						onClick={loadCopiedTrades}
						disabled={isRefreshingTrades}
						className='inline-flex items-center gap-2 rounded-md border border-zinc-600 px-3 py-1.5 text-sm text-gray-300 hover:bg-zinc-800 disabled:opacity-50'
					>
						<RefreshCw
							className={`h-4 w-4 ${isRefreshingTrades ? 'animate-spin' : ''}`}
						/>
						Refresh
					</button>
				</div>
				<p className='text-sm text-gray-400'>
					Trades placed when a trader you copy emits a signal. Open
					trades also appear in{' '}
					<button
						type='button'
						onClick={() => router.push('/dashboard/live-trading')}
						className='text-indigo-400 hover:underline'
					>
						Live Trading
					</button>
					.
				</p>
				{tradesError && (
					<p className='text-sm text-red-400'>{tradesError}</p>
				)}
				{isRefreshingTrades && copiedTrades.length === 0 ? (
					<p className='py-4 text-sm text-gray-500'>Loading trades…</p>
				) : (
					<CopiedTradesList
						trades={copiedTrades}
						isCopying={copies.length > 0}
					/>
				)}
			</div>
		</div>
	);
}