'use client';

import type { CopiedTradeRecord } from '@/types/copyTrading';

function statusColor(status: string) {
	if (status === 'won') return 'text-emerald-400';
	if (status === 'lost') return 'text-red-400';
	if (status === 'open') return 'text-amber-300';
	return 'text-gray-400';
}

export default function CopiedTradesList({
	trades,
	isCopying = false,
}: {
	trades: CopiedTradeRecord[];
	isCopying?: boolean;
}) {
	if (trades.length === 0) {
		return (
			<p className='py-4 text-sm text-gray-500'>
				{isCopying
					? 'No copied trades yet. When your trader emits a signal from the admin panel, mirrored trades appear here and in Live Trading.'
					: 'No copied trades yet. Start copying a trader, then wait for a signal to be emitted.'}
			</p>
		);
	}

	return (
		<div className='space-y-3'>
			{trades.map((trade) => (
				<div
					key={trade.id}
					className='rounded-md border border-zinc-700 bg-zinc-800 p-4'
				>
					<div className='flex items-start justify-between gap-4'>
						<div className='space-y-1'>
							<p className='font-medium text-white'>
								{trade.traderName ?? 'Copied trader'} ·{' '}
								{trade.assetSymbol}{' '}
								<span
									className={
										trade.direction === 'up'
											? 'text-emerald-400'
											: 'text-red-400'
									}
								>
									{trade.direction.toUpperCase()}
								</span>
							</p>
							<p className='text-sm text-gray-400'>
								Stake ${trade.stake.toFixed(2)} ·{' '}
								{new Date(trade.openedAt).toLocaleString()}
							</p>
						</div>
						<div className='text-right'>
							<p
								className={`text-sm capitalize ${statusColor(trade.status)}`}
							>
								{trade.status}
							</p>
							{trade.profit != null && (
								<p
									className={`font-semibold ${trade.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
								>
									{trade.profit >= 0 ? '+' : '-'}$
									{Math.abs(trade.profit).toFixed(2)}
								</p>
							)}
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
