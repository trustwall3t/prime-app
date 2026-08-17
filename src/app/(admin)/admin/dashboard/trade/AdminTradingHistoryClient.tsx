'use client';

import { useMemo, useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PendingBadge from '@/app/(admin)/components/PendingBadge';
import SuccessBadge from '@/app/(admin)/components/SuccessBadge';
import CancelledBadge from '@/app/(admin)/components/CancelledBadge';
import {
	AdminPageHeader,
	AdminStatCard,
	AdminTableWrap,
} from '@/app/(admin)/components/admin-ui';
import type {
	AdminTradeRecord,
	AdminTradeSource,
	AdminTradingHistoryStats,
} from '@/types/adminTradingHistory';

type Filter = 'all' | AdminTradeSource;

function formatMoney(value: number) {
	return value.toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

function formatDate(iso: string) {
	return new Date(iso).toLocaleString();
}

function TradeStatusBadge({ status }: { status: string }) {
	const normalized = status.toLowerCase();

	if (normalized === 'open' || normalized === 'pending') {
		return <PendingBadge />;
	}
	if (
		normalized === 'won' ||
		normalized === 'success' ||
		normalized === 'even' ||
		normalized === 'approved'
	) {
		return <SuccessBadge />;
	}
	if (
		normalized === 'lost' ||
		normalized === 'cancelled' ||
		normalized === 'canceled' ||
		normalized === 'rejected'
	) {
		return <CancelledBadge />;
	}

	return (
		<span className='text-xs capitalize text-gray-400'>{status}</span>
	);
}

function SourceBadge({ source }: { source: AdminTradeSource }) {
	const styles: Record<AdminTradeSource, string> = {
		copy: 'bg-indigo-500/15 text-indigo-400',
		user: 'bg-blue-500/15 text-blue-400',
		admin: 'bg-purple-500/15 text-purple-400',
	};
	const labels: Record<AdminTradeSource, string> = {
		copy: 'Copy trade',
		user: 'User trade',
		admin: 'Admin trade',
	};

	return (
		<span
			className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles[source]}`}
		>
			{labels[source]}
		</span>
	);
}

function directionClass(direction: string) {
	const value = direction.toLowerCase();
	if (value === 'up' || value === 'buy') return 'text-emerald-400';
	if (value === 'down' || value === 'sell') return 'text-red-400';
	return 'text-gray-300';
}

function directionLabel(direction: string) {
	const value = direction.toLowerCase();
	if (value === 'up') return 'UP';
	if (value === 'down') return 'DOWN';
	return direction.toUpperCase();
}

function TradesTable({
	trades,
	emptyMessage,
}: {
	trades: AdminTradeRecord[];
	emptyMessage: string;
}) {
	if (trades.length === 0) {
		return (
			<div className='rounded-md border border-zinc-700 bg-zinc-900 px-4 py-12 text-center text-sm text-gray-500'>
				{emptyMessage}
			</div>
		);
	}

	return (
		<AdminTableWrap>
			<Table>
				<TableHeader>
					<TableRow className='border-zinc-800 hover:bg-transparent'>
						<TableHead>Date</TableHead>
						<TableHead>Source</TableHead>
						<TableHead>User</TableHead>
						<TableHead>Asset / Pair</TableHead>
						<TableHead>Side</TableHead>
						<TableHead>Amount</TableHead>
						<TableHead>Trader</TableHead>
						<TableHead>P/L</TableHead>
						<TableHead>Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{trades.map((trade) => (
						<TableRow key={`${trade.source}-${trade.id}`} className='border-zinc-800'>
							<TableCell className='whitespace-nowrap'>
								{formatDate(trade.openedAt)}
							</TableCell>
							<TableCell>
								<SourceBadge source={trade.source} />
							</TableCell>
							<TableCell>
								<div className='font-medium text-white'>
									{trade.userName}
								</div>
								<div className='text-xs text-gray-500'>
									{trade.userEmail}
								</div>
							</TableCell>
							<TableCell>{trade.assetOrPair}</TableCell>
							<TableCell className={directionClass(trade.direction)}>
								{directionLabel(trade.direction)}
							</TableCell>
							<TableCell>${formatMoney(trade.amount)}</TableCell>
							<TableCell>
								{trade.traderName ?? '—'}
							</TableCell>
							<TableCell>
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
							</TableCell>
							<TableCell>
								<TradeStatusBadge status={trade.status} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</AdminTableWrap>
	);
}

export default function AdminTradingHistoryClient({
	trades,
	stats,
}: {
	trades: AdminTradeRecord[];
	stats: AdminTradingHistoryStats;
}) {
	const [filter, setFilter] = useState<Filter>('all');

	const filteredTrades = useMemo(() => {
		if (filter === 'all') return trades;
		return trades.filter((trade) => trade.source === filter);
	}, [filter, trades]);

	const emptyMessages: Record<Filter, string> = {
		all: 'No trades recorded yet.',
		copy: 'No copy trades yet. Emit a signal from Copy Traders.',
		user: 'No user live trades yet.',
		admin: 'No admin-placed trades yet. Place one from Live Trading.',
	};

	return (
		<div className='flex flex-col gap-6'>
			<AdminPageHeader
				title='Trading history'
				description='Copy trades, user live trades, and admin-placed trades in one place.'
			/>

			<div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				<AdminStatCard label='Total trades' value={stats.total} accent='blue' />
				<AdminStatCard
					label='Copy trades'
					value={stats.copy}
					accent='purple'
				/>
				<AdminStatCard
					label='User trades'
					value={stats.user}
					accent='green'
				/>
				<AdminStatCard
					label='Admin trades'
					value={stats.admin}
					accent='amber'
				/>
			</div>

			<Tabs
				value={filter}
				onValueChange={(value) => setFilter(value as Filter)}
			>
				<TabsList className='flex h-auto w-full flex-wrap justify-start gap-2 bg-transparent p-0'>
					{(
						[
							['all', 'All'],
							['copy', 'Copy trades'],
							['user', 'User trades'],
							['admin', 'Admin trades'],
						] as const
					).map(([value, label]) => (
						<TabsTrigger
							key={value}
							value={value}
							className='rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-white data-[state=active]:bg-zinc-700'
						>
							{label}
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>

			<TradesTable
				trades={filteredTrades}
				emptyMessage={emptyMessages[filter]}
			/>
		</div>
	);
}
