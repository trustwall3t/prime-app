'use client';
import React, { useState } from 'react';
import {
	DURATIONS,
	DurationLabel,
	QUICK_STAKES,
	TradeDirection,
}  from '../../../../types';
import { dashboardMoneyClass, dashboardStatValueLgClass } from '@/lib/userFormStyles';

interface TradePanelProps {
	balance: number;
	currentPrice: number;
	onPlaceTrade: (params: {
		direction: TradeDirection;
		stake: number;
		durationSeconds: number;
	}) => void;
}

const TradePanel = ({
	balance,
	currentPrice,
	onPlaceTrade,
}: TradePanelProps) => {
	const [durationLabel, setDurationLabel] = useState<DurationLabel>('5m');
	const [stakeInput, setStakeInput] = useState('');

	const stake = Number(stakeInput) || 0;
	const selectedDuration = DURATIONS.find((d) => d.label === durationLabel)!;
	const canTrade = stake > 0 && stake <= balance;

	const handleTrade = (direction: TradeDirection) => {
		if (!canTrade) return;
		onPlaceTrade({
			direction,
			stake,
			durationSeconds: selectedDuration.seconds,
		});
		setStakeInput('');
	};

	return (
		<div className='space-y-6'>
			<p className={`${dashboardStatValueLgClass} tabular-nums`}>
				${balance.toFixed(2)}
			</p>

			<div className='space-y-2'>
				<p className='text-xs uppercase tracking-wide text-gray-400'>
					Duration
				</p>
				<div className='grid grid-cols-3 gap-3'>
					{DURATIONS.map((d) => (
						<button
							key={d.label}
							type='button'
							onClick={() => setDurationLabel(d.label)}
							className={`rounded-md border py-3 text-base font-semibold transition ${
								durationLabel === d.label
									? 'border-indigo-500 bg-indigo-500 text-white'
									: 'border-zinc-700 bg-zinc-800 text-gray-300 hover:border-zinc-600'
							}`}
						>
							{d.label}
						</button>
					))}
				</div>
			</div>

			<div className='space-y-2'>
				<p className='text-xs uppercase tracking-wide text-gray-400'>
					Stake
				</p>
				<input
					type='number'
					min={0}
					value={stakeInput}
					onChange={(e) => setStakeInput(e.target.value)}
					placeholder='Amount'
					className='w-full rounded-md border border-zinc-700 bg-zinc-800 px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-indigo-500'
				/>
				<div className='flex flex-wrap gap-2'>
					{QUICK_STAKES.map((amount) => (
						<button
							key={amount}
							type='button'
							onClick={() => setStakeInput(String(amount))}
							className='rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-gray-300 hover:border-zinc-600'
						>
							${amount}
						</button>
					))}
					<button
						type='button'
						onClick={() => setStakeInput(String(balance))}
						className='rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-gray-300 hover:border-zinc-600'
					>
						Max
					</button>
				</div>
			</div>

			<div className='rounded-md border border-zinc-700 bg-zinc-900/40 p-4'>
				<p className='text-sm text-gray-400'>
					Your return depends on how {selectedDuration.label} plays
					out — you get your stake back plus (or minus) the same
					percentage the price actually moves, capped so you can never
					lose more than your stake.
				</p>
			</div>

			<div className='grid grid-cols-2 gap-4'>
				<button
					type='button'
					disabled={!canTrade}
					onClick={() => handleTrade('down')}
					className='rounded-md bg-red-600 py-5 text-center font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50'
				>
					<p className='text-sm tracking-wide'>SELL / DOWN</p>
					<p className={`mt-1 ${dashboardMoneyClass}`}>{currentPrice.toFixed(2)}</p>
				</button>
				<button
					type='button'
					disabled={!canTrade}
					onClick={() => handleTrade('up')}
					className='rounded-md bg-emerald-600 py-5 text-center font-bold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50'
				>
					<p className='text-sm tracking-wide'>BUY / UP</p>
					<p className={`mt-1 ${dashboardMoneyClass}`}>{currentPrice.toFixed(2)}</p>
				</button>
			</div>

			{stake > balance && (
				<p className='text-center text-sm text-red-400'>
					Stake exceeds your available balance.
				</p>
			)}
		</div>
	);
};

export default TradePanel;
