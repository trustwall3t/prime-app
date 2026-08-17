'use client';

import type { CopiedTradeRecord } from '@/types/copyTrading';
import { AdminTableWrap } from '@/app/(admin)/components/admin-ui';

function formatMoney(value: number) {
	return value.toFixed(2);
}

function statusColor(status: string) {
	if (status === 'won') return 'text-emerald-400';
	if (status === 'lost') return 'text-red-400';
	if (status === 'open') return 'text-amber-400';
	return 'text-gray-500';
}

export default function EmittedTradesTable({
	trades,
	showUser = false,
}: {
	trades: CopiedTradeRecord[];
	showUser?: boolean;
}) {
	if (trades.length === 0) {
		return (
			<p className='rounded-md border border-zinc-700 bg-zinc-900 py-10 text-center text-sm text-gray-500'>
				No emitted copy trades yet. Use &quot;Emit signal&quot; on a
				trader with active copiers.
			</p>
		);
	}

	return (
		<AdminTableWrap>
			<table className='w-full text-sm'>
				<thead className='border-b border-zinc-800 text-left text-gray-400'>
					<tr>
						<th className='px-4 py-3 font-medium'>Time</th>
						<th className='px-4 py-3 font-medium'>Trader</th>
						{showUser && (
							<th className='px-4 py-3 font-medium'>User</th>
						)}
						<th className='px-4 py-3 font-medium'>Asset</th>
						<th className='px-4 py-3 font-medium'>Side</th>
						<th className='px-4 py-3 font-medium'>Stake</th>
						<th className='px-4 py-3 font-medium'>Status</th>
						<th className='px-4 py-3 font-medium'>P/L</th>
					</tr>
				</thead>
				<tbody>
					{trades.map((trade) => (
						<tr
							key={trade.id}
							className='border-b border-zinc-800 last:border-0 hover:bg-zinc-800/40'
						>
							<td className='whitespace-nowrap px-4 py-3 text-gray-300'>
								{new Date(trade.openedAt).toLocaleString()}
							</td>
							<td className='px-4 py-3 text-gray-300'>
								{trade.traderName ?? '—'}
							</td>
							{showUser && (
								<td className='px-4 py-3 text-gray-300'>
									<div>{trade.userName ?? '—'}</div>
									{trade.userEmail && (
										<div className='text-xs text-gray-500'>
											{trade.userEmail}
										</div>
									)}
								</td>
							)}
							<td className='px-4 py-3 text-gray-300'>
								{trade.assetSymbol}
							</td>
							<td
								className={`px-4 py-3 uppercase ${
									trade.direction === 'up'
										? 'text-emerald-400'
										: 'text-red-400'
								}`}
							>
								{trade.direction}
							</td>
							<td className='px-4 py-3 text-gray-300'>
								${formatMoney(trade.stake)}
							</td>
							<td
								className={`px-4 py-3 capitalize ${statusColor(trade.status)}`}
							>
								{trade.status}
							</td>
							<td className='px-4 py-3'>
								{trade.profit == null ? (
									<span className='text-gray-500'>—</span>
								) : trade.profit >= 0 ? (
									<span className='text-emerald-400'>
										+${formatMoney(trade.profit)}
									</span>
								) : (
									<span className='text-red-400'>
										-${formatMoney(Math.abs(trade.profit))}
									</span>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</AdminTableWrap>
	);
}
