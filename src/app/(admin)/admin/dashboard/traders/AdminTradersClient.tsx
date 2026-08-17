'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
	createTrader,
	deleteTrader,
	emitTraderCopySignal,
	toggleTraderActive,
} from '@/actions/admin/traders';
import type { CopiedTradeRecord } from '@/types/copyTrading';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import {
	AdminCard,
	AdminPageHeader,
	AdminTableWrap,
	adminBtnClass,
	adminInputClass,
	adminTextareaClass,
} from '@/app/(admin)/components/admin-ui';
import type { MarketType } from '@/generated/prisma';
import EmittedTradesTable from './EmittedTradesTable';

type AdminTrader = {
	id: string;
	name: string;
	description: string | null;
	strategy: string | null;
	marketType: MarketType;
	country: string | null;
	followers: number;
	totalTrades: number;
	winRate: number | null;
	performanceScore: number | null;
	isActive: boolean;
	activeCopiers: number;
	createdAt: Date;
};

export default function AdminTradersClient({
	traders: initialTraders,
	emittedTrades: initialEmittedTrades,
}: {
	traders: AdminTrader[];
	emittedTrades: CopiedTradeRecord[];
}) {
	const [traders, setTraders] = useState(initialTraders);
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const [form, setForm] = useState({
		name: '',
		description: '',
		strategy: '',
		marketType: 'STOCK' as MarketType,
		country: '',
		winRate: '85',
		totalTrades: '1000',
		followers: '5000',
	});

	const handleCreate = (e: React.FormEvent) => {
		e.preventDefault();
		startTransition(async () => {
			const result = await createTrader({
				name: form.name,
				description: form.description,
				strategy: form.strategy,
				marketType: form.marketType,
				country: form.country,
				winRate: Number(form.winRate),
				totalTrades: Number(form.totalTrades),
				followers: Number(form.followers),
			});

			if ('error' in result && result.error) {
				toast.error(result.error);
				return;
			}

			if ('trader' in result && result.trader) {
				toast.success('Trader created.');
				setTraders((prev) => [
					{
						...result.trader,
						followers: result.trader.followers ?? 0,
						activeCopiers: 0,
					},
					...prev,
				]);
				setForm({
					name: '',
					description: '',
					strategy: '',
					marketType: 'STOCK',
					country: '',
					winRate: '85',
					totalTrades: '1000',
					followers: '5000',
				});
			}
		});
	};

	const handleToggle = (trader: AdminTrader) => {
		startTransition(async () => {
			const result = await toggleTraderActive(trader.id, !trader.isActive);
			if ('error' in result && result.error) {
				toast.error(result.error);
				return;
			}
			setTraders((prev) =>
				prev.map((t) =>
					t.id === trader.id ? { ...t, isActive: !t.isActive } : t,
				),
			);
			toast.success(
				trader.isActive ? 'Trader deactivated.' : 'Trader activated.',
			);
		});
	};

	const handleEmitSignal = (traderId: string, traderName: string) => {
		startTransition(async () => {
			const result = await emitTraderCopySignal(traderId);
			if (result.error) {
				toast.error(result.error);
				return;
			}
			toast.success(result.success ?? `Signal sent for ${traderName}.`);
			router.refresh();
		});
	};

	const handleDelete = (traderId: string) => {
		if (!confirm('Delete this trader? Active copy subscriptions will be removed.')) {
			return;
		}
		startTransition(async () => {
			const result = await deleteTrader(traderId);
			if ('error' in result && result.error) {
				toast.error(result.error);
				return;
			}
			setTraders((prev) => prev.filter((t) => t.id !== traderId));
			toast.success('Trader deleted.');
		});
	};

	return (
		<div className='flex flex-col gap-6'>
			<AdminPageHeader
				title='Copy traders'
				description='Create traders and emit copy signals to subscribed users.'
			/>

			<AdminCard>
				<form
					onSubmit={handleCreate}
					className='grid gap-4 md:grid-cols-2'
				>
					<h3 className='text-lg font-semibold text-white md:col-span-2'>
						Add trader
					</h3>
					<input
						required
						value={form.name}
						onChange={(e) =>
							setForm((f) => ({ ...f, name: e.target.value }))
						}
						placeholder='Display name'
						className={adminInputClass}
					/>
					<select
						value={form.marketType}
						onChange={(e) =>
							setForm((f) => ({
								...f,
								marketType: e.target.value as MarketType,
							}))
						}
						className={adminInputClass}
					>
						<option value='STOCK'>Stocks</option>
						<option value='CRYPTO'>Crypto</option>
					</select>
					<input
						value={form.country}
						onChange={(e) =>
							setForm((f) => ({ ...f, country: e.target.value }))
						}
						placeholder='Country'
						className={adminInputClass}
					/>
					<input
						value={form.winRate}
						onChange={(e) =>
							setForm((f) => ({ ...f, winRate: e.target.value }))
						}
						placeholder='Win rate %'
						type='number'
						min={0}
						max={100}
						className={adminInputClass}
					/>
					<input
						value={form.totalTrades}
						onChange={(e) =>
							setForm((f) => ({
								...f,
								totalTrades: e.target.value,
							}))
						}
						placeholder='Total trades'
						type='number'
						min={0}
						className={adminInputClass}
					/>
					<input
						value={form.followers}
						onChange={(e) =>
							setForm((f) => ({
								...f,
								followers: e.target.value,
							}))
						}
						placeholder='Followers'
						type='number'
						min={0}
						className={adminInputClass}
					/>
					<input
						value={form.strategy}
						onChange={(e) =>
							setForm((f) => ({ ...f, strategy: e.target.value }))
						}
						placeholder='Strategy'
						className={`${adminInputClass} md:col-span-2`}
					/>
					<textarea
						value={form.description}
						onChange={(e) =>
							setForm((f) => ({
								...f,
								description: e.target.value,
							}))
						}
						placeholder='Bio / description'
						rows={3}
						className={`${adminTextareaClass} md:col-span-2`}
					/>
					<button
						type='submit'
						disabled={isPending}
						className={`${adminBtnClass('primary')} md:col-span-2`}
					>
						{isPending ? 'Saving...' : 'Create trader'}
					</button>
				</form>
			</AdminCard>

			<AdminTableWrap>
				<Table>
					<TableHeader>
						<TableRow className='border-zinc-800 hover:bg-transparent'>
							<TableHead>Name</TableHead>
							<TableHead>Market</TableHead>
							<TableHead>Win rate</TableHead>
							<TableHead>Followers</TableHead>
							<TableHead>Copiers</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{traders.length === 0 ? (
							<TableRow className='border-zinc-800'>
								<TableCell
									colSpan={7}
									className='py-10 text-center text-gray-500'
								>
									No traders yet.
								</TableCell>
							</TableRow>
						) : (
							traders.map((trader) => (
								<TableRow
									key={trader.id}
									className='border-zinc-800'
								>
									<TableCell className='font-medium text-white'>
										{trader.name}
									</TableCell>
									<TableCell>{trader.marketType}</TableCell>
									<TableCell>
										{(trader.winRate ?? 0).toFixed(0)}%
									</TableCell>
									<TableCell>
										{(trader.followers ?? 0).toLocaleString()}
									</TableCell>
									<TableCell>{trader.activeCopiers}</TableCell>
									<TableCell>
										{trader.isActive ? (
											<span className='text-emerald-400'>
												Active
											</span>
										) : (
											<span className='text-gray-500'>
												Hidden
											</span>
										)}
									</TableCell>
									<TableCell>
										<div className='flex flex-wrap gap-2'>
											<button
												type='button'
												disabled={isPending}
												onClick={() =>
													handleEmitSignal(
														trader.id,
														trader.name,
													)
												}
												className={adminBtnClass('success')}
											>
												Emit signal
											</button>
											<button
												type='button'
												disabled={isPending}
												onClick={() =>
													handleToggle(trader)
												}
												className={adminBtnClass('secondary')}
											>
												{trader.isActive
													? 'Hide'
													: 'Show'}
											</button>
											<button
												type='button'
												disabled={isPending}
												onClick={() =>
													handleDelete(trader.id)
												}
												className={adminBtnClass('danger')}
											>
												Delete
											</button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</AdminTableWrap>

			<div className='space-y-3'>
				<h3 className='text-lg font-semibold text-white'>
					Recent emitted trades
				</h3>
				<p className='text-sm text-gray-400'>
					Trades placed for users copying a trader after you click
					Emit signal.
				</p>
				<EmittedTradesTable
					trades={initialEmittedTrades}
					showUser
				/>
			</div>
		</div>
	);
}
