'use client';
import React from 'react';
import Link from 'next/link';
import type { User } from '@/generated/prisma';
import { formatMoney } from '@/lib/money';
import { Award, LinkIcon, Star, Trophy, User2Icon } from 'lucide-react';
import MarketOverview from './MarketOverview';
import PreviewWallet from './WalletConnect/PreviewWallet';
import type { Asset } from '@/types';

interface RankProgress {
	rankName: string;
	myInvest: { current: number; target: number };
	directReferral: { current: number; target: number };
	teamInvest: { current: number; target: number };
	bonus: number;
}

interface ActiveCopy {
	traderName: string;
	traderId: string;
	winRate: number;
	allocationPercentage: number;
	status: string;
	totalCopies: number;
}

interface DashboardClientProps {
	user: User;
	ranking: RankProgress;
	nextRankName: string;
	activeCopy: ActiveCopy | null;
	totalWithdrawals: number;
	tradeInterest: number;
	marketAssets: Asset[];
}

function formatCurrency(n: number): string {
	return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function winRateStars(winRate: number): number {
	return Math.min(5, Math.max(1, Math.round(winRate / 20)));
}

const balanceRows = [
	{
		label: 'Deposit wallet',
		key: 'investment' as const,
		circleClass: 'bg-green-700',
	},
	{
		label: 'Interest Balances',
		key: 'profit' as const,
		circleClass: 'bg-purple-700',
	},
	{
		label: 'Total withdrawal',
		key: 'withdrawals' as const,
		circleClass: 'bg-red-500/30',
	},
	{
		label: 'Trade interest',
		key: 'tradeInterest' as const,
		circleClass: 'bg-blue-700',
	},
] as const;

const DashboardClient = ({
	user,
	ranking,
	nextRankName,
	activeCopy,
	totalWithdrawals,
	tradeInterest,
	marketAssets,
}: DashboardClientProps) => {
	const [openWallet, setOpenWallet] = React.useState(false);

	const balanceValues = {
		investment: user.investmentBalance,
		profit: user.profitBalance,
		withdrawals: totalWithdrawals,
		tradeInterest,
	};

	return (
		<div className='flex w-full max-w-full flex-col gap-4 overflow-x-hidden'>
			<PreviewWallet open={openWallet} setOpen={setOpenWallet} />
			<div className='flex flex-col gap-6 rounded-xl border border-zinc-800 bg-zinc-900 p-4 sm:p-5'>
				<div className='space-y-2'>
					<h3 className='text-xs font-medium uppercase tracking-wide text-zinc-500 sm:text-sm'>
						Total Balance
					</h3>
					<div className='flex flex-wrap items-end gap-2 sm:gap-3'>
						<p className='text-2xl font-semibold tabular-nums text-white sm:text-3xl'>
							${formatMoney(user.walletBalance)}
						</p>
						<span className='inline-block rounded border border-amber-500/40 bg-amber-400/10 px-2 py-0.5 text-xs font-medium text-amber-400'>
							USD
						</span>
					</div>
				</div>

				<div className='flex w-full flex-wrap items-center gap-2'>
					<Link
						href='/dashboard/withdraw'
						className='flex items-center gap-1.5 rounded-md bg-purple-500/20 px-3 py-2 text-xs font-medium text-purple-200 transition hover:bg-purple-500/30 sm:text-sm'
					>
						<svg
							width='15'
							height='15'
							viewBox='0 0 15 15'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
							aria-hidden
						>
							<path
								d='M7.81825 1.18188C7.64251 1.00615 7.35759 1.00615 7.18185 1.18188L4.18185 4.18188C4.00611 4.35762 4.00611 4.64254 4.18185 4.81828C4.35759 4.99401 4.64251 4.99401 4.81825 4.81828L7.05005 2.58648V9.49996C7.05005 9.74849 7.25152 9.94996 7.50005 9.94996C7.74858 9.94996 7.95005 9.74849 7.95005 9.49996V2.58648L10.1819 4.81828C10.3576 4.99401 10.6425 4.99401 10.8182 4.81828C10.994 4.64254 10.994 4.35762 10.8182 4.18188L7.81825 1.18188ZM2.5 9.99997C2.77614 9.99997 3 10.2238 3 10.5V12C3 12.5538 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2238 12.2239 9.99997 12.5 9.99997C12.7761 9.99997 13 10.2238 13 10.5V12C13 13.104 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2238 2.22386 9.99997 2.5 9.99997Z'
								fill='currentColor'
								fillRule='evenodd'
								clipRule='evenodd'
							/>
						</svg>
						Withdraw
					</Link>
					<Link
						href='/dashboard/deposit'
						className='flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-400/10 px-3 py-2 text-xs font-medium text-amber-300 transition hover:bg-amber-400/15 sm:text-sm'
					>
						<svg
							width='15'
							height='15'
							viewBox='0 0 15 15'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
							aria-hidden
						>
							<path
								d='M7.50005 1.04999C7.74858 1.04999 7.95005 1.25146 7.95005 1.49999V8.41359L10.1819 6.18179C10.3576 6.00605 10.6425 6.00605 10.8182 6.18179C10.994 6.35753 10.994 6.64245 10.8182 6.81819L7.81825 9.81819C7.64251 9.99392 7.35759 9.99392 7.18185 9.81819L4.18185 6.81819C4.00611 6.64245 4.00611 6.35753 4.18185 6.18179C4.35759 6.00605 4.64251 6.00605 4.81825 6.18179L7.05005 8.41359V1.49999C7.05005 1.25146 7.25152 1.04999 7.50005 1.04999ZM2.5 10C2.77614 10 3 10.2239 3 10.5V12C3 12.5539 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2239 12.2239 10 12.5 10C12.7761 10 13 10.2239 13 10.5V12C13 13.1041 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2239 2.22386 10 2.5 10Z'
								fill='currentColor'
								fillRule='evenodd'
								clipRule='evenodd'
							/>
						</svg>
						Deposit
					</Link>
					<button
						type='button'
						onClick={() => setOpenWallet(true)}
						className='flex items-center gap-1.5 rounded-md bg-green-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-green-500 sm:text-sm'
					>
						<LinkIcon className='h-4 w-4' />
						Connect Wallet
					</button>
				</div>

				<div className='flex items-center justify-between gap-3 border-y border-zinc-800 py-4 sm:py-5'>
					<Link
						href='/dashboard/ranking'
						className='flex min-w-0 flex-wrap items-center gap-2 transition hover:opacity-80'
					>
						<Trophy className='h-5 w-5 shrink-0 text-amber-500' />
						<p className='text-sm font-medium text-zinc-500'>
							Your current rank:
						</p>
						<span className='text-sm font-semibold text-white sm:text-base'>
							{ranking.rankName}
						</span>
					</Link>
					<Award className='h-8 w-8 shrink-0 text-amber-400 sm:h-9 sm:w-9' />
				</div>

				<div className='space-y-3'>
					{balanceRows.map((row) => (
						<div
							key={row.key}
							className='flex items-center gap-4 rounded-lg border border-zinc-800 bg-zinc-950/60 px-4 py-3 transition hover:bg-zinc-950'
						>
							<div
								className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${row.circleClass}`}
							>
								<div className='h-3.5 w-3.5 rounded-full bg-zinc-950' />
							</div>
							<div className='min-w-0'>
								<p className='text-xs font-medium uppercase tracking-wide text-zinc-500 sm:text-sm'>
									{row.label}
								</p>
								<p className='text-base font-semibold tabular-nums text-white sm:text-lg'>
									${formatMoney(balanceValues[row.key])}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>

			<MarketOverview initialAssets={marketAssets} />

			<div className='space-y-7 mt-5'>
				<div className='flex flex-col gap-5 items-center bg-zinc-900 p-5 border border-zinc-700 rounded-md'>
					<p className='text-gray-400 uppercase text-sm'>
						Your current server
					</p>
					{activeCopy ? (
						<>
							<div className='w-16 h-16 bg-gradient-to-b from-blue-500 to-zinc-500 rounded-full flex items-center justify-center'>
								<div className='bg-white h-8 w-8 rounded-full flex items-center justify-center'>
									<User2Icon className='w-6 h-6 text-blue-500' />
								</div>
							</div>
							<Link
								href={`/dashboard/traders/${activeCopy.traderId}`}
								className='font-semibold text-sm sm:text-base text-center hover:text-indigo-400 transition'
							>
								{activeCopy.traderName}
							</Link>
							<p className='text-sm text-gray-400'>
								{activeCopy.allocationPercentage}% allocation ·{' '}
								{activeCopy.status.toLowerCase()}
								{activeCopy.totalCopies > 1
									? ` · +${activeCopy.totalCopies - 1} more`
									: ''}
							</p>
							<div className='flex items-center gap-1'>
								{Array.from({ length: 5 }).map((_, index) => (
									<Star
										key={index}
										fill={
											index < winRateStars(activeCopy.winRate)
												? 'orange'
												: 'transparent'
										}
										className={
											index < winRateStars(activeCopy.winRate)
												? 'text-orange-300'
												: 'text-zinc-600'
										}
									/>
								))}
							</div>
						</>
					) : (
						<>
							<div className='w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700'>
								<User2Icon className='w-8 h-8 text-gray-500' />
							</div>
							<h3 className='font-semibold text-sm sm:text-base text-gray-400'>
								No active copy trader
							</h3>
							<p className='text-sm text-gray-500 text-center'>
								Browse traders and start copying to connect to a
								server.
							</p>
							<Link
								href='/dashboard/traders'
								className='text-sm font-medium text-indigo-400 hover:text-indigo-300'
							>
								Browse copy traders
							</Link>
						</>
					)}
				</div>
				<Link
					href='/dashboard/ranking'
					className='flex flex-col gap-5 items-center bg-zinc-900 p-5 border border-zinc-700 rounded-md hover:border-indigo-500/40 transition'
				>
					<p className='text-gray-400 uppercase text-sm'>
						Unlock next rank
					</p>
					<Award className='h-12 w-12 text-amber-400' />
					<h3 className='font-semibold text-sm sm:text-base'>
						{formatCurrency(ranking.myInvest.current)} /{' '}
						{formatCurrency(ranking.myInvest.target)}
					</h3>
					<p className='text-gray-400 text-sm text-center'>
						Reach {nextRankName} — invest{' '}
						{formatCurrency(
							Math.max(
								ranking.myInvest.target - ranking.myInvest.current,
								0,
							),
						)}{' '}
						more, invite{' '}
						{Math.max(
							ranking.directReferral.target -
								ranking.directReferral.current,
							0,
						)}{' '}
						referrals, and grow team invest to{' '}
						{formatCurrency(ranking.teamInvest.target)}.
					</p>
					<p className='text-indigo-400 text-sm font-medium'>
						View full ranking progress →
					</p>
				</Link>
			</div>
		</div>
	);
};

export default DashboardClient;
