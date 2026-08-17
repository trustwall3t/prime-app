'use client';
import React, { useEffect, useState } from 'react';
import { Trade } from '../../../../types';

function formatCountdown(expiresAt: string): string {
	const diffMs = new Date(expiresAt).getTime() - Date.now();
	if (diffMs <= 0) return 'Settling...';
	const totalSeconds = Math.floor(diffMs / 1000);
	const m = Math.floor(totalSeconds / 60);
	const s = totalSeconds % 60;
	return `${m}:${s.toString().padStart(2, '0')}`;
}

const TradeRow = ({ trade }: { trade: Trade }) => {
	const [, tick] = useState(0);

	// Re-render every second so the countdown stays live.
	useEffect(() => {
		if (trade.status !== 'open') return;
		const interval = setInterval(() => tick((n) => n + 1), 1000);
		return () => clearInterval(interval);
	}, [trade.status, trade.expiresAt]);

	const isOpen = trade.status === 'open';
	const isWin = trade.status === 'won';
	const isLoss = trade.status === 'lost';
	const isEven = trade.status === 'even';

	return (
		<div className='flex items-center justify-between rounded-md border border-zinc-700 bg-zinc-800 p-4'>
			<div>
				<p className='font-semibold text-white'>
					{trade.assetSymbol}{' '}
					<span
						className={
							trade.direction === 'up'
								? 'text-emerald-400'
								: 'text-red-400'
						}
					>
						{trade.direction === 'up' ? 'UP' : 'DOWN'}
					</span>
				</p>
				<p className='text-sm text-gray-400'>
					Stake ${trade.stake.toFixed(2)} · Entry{' '}
					{trade.entryPrice.toFixed(2)}
					{trade.exitPrice != null && (
						<> · Exit {trade.exitPrice.toFixed(2)}</>
					)}
				</p>
			</div>

			<div className='text-right'>
				{isOpen && (
					<p className='text-sm font-medium text-amber-300'>
						{formatCountdown(trade.expiresAt)}
					</p>
				)}
				{isWin && (
					<p className='font-bold text-emerald-400'>
						+${trade.profit?.toFixed(2)}
					</p>
				)}
				{isLoss && (
					<p className='font-bold text-red-400'>
						-${Math.abs(trade.profit ?? 0).toFixed(2)}
					</p>
				)}
				{isEven && <p className='font-medium text-gray-400'>$0.00</p>}
				{trade.status === 'expired' && (
					<p className='font-medium text-gray-400'>Expired</p>
				)}
			</div>
		</div>
	);
};

interface TradesListProps {
	openTrades: Trade[];
	history: Trade[];
}

const TradesList = ({ openTrades, history }: TradesListProps) => {
	const [tab, setTab] = useState<'open' | 'history'>('open');
	const trades = tab === 'open' ? openTrades : history;

	return (
		<div className='space-y-4'>
			<div className='flex gap-8 border-b border-zinc-700'>
				<button
					type='button'
					onClick={() => setTab('open')}
					className={`pb-3 text-sm transition sm:text-base md:text-lg ${
						tab === 'open'
							? 'border-b-2 border-indigo-500 text-indigo-400'
							: 'text-gray-400 hover:text-white'
					}`}
				>
					Open trades ({openTrades.length})
				</button>
				<button
					type='button'
					onClick={() => setTab('history')}
					className={`pb-3 text-sm transition sm:text-base md:text-lg ${
						tab === 'history'
							? 'border-b-2 border-indigo-500 text-indigo-400'
							: 'text-gray-400 hover:text-white'
					}`}
				>
					History ({history.length})
				</button>
			</div>

			{trades.length === 0 ? (
				<p className='py-8 text-center text-gray-500'>
					{tab === 'open' ? 'No open trades.' : 'No history yet.'}
				</p>
			) : (
				<div className='space-y-3'>
					{trades.map((trade) => (
						<TradeRow
							key={trade.id}
							trade={trade}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default TradesList;
