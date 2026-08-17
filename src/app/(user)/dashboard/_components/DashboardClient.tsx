'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { User } from '@/generated/prisma';
import { formatMoney } from '@/lib/money';
import { Award, LayoutDashboardIcon, LinkIcon, Star, TrendingDownIcon, TrendingUpIcon, Trophy, User2Icon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CoreAssets from './CoreAssets';
import PreviewWallet from './WalletConnect/PreviewWallet';

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
}

function formatCurrency(n: number): string {
	return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function winRateStars(winRate: number): number {
	return Math.min(5, Math.max(1, Math.round(winRate / 20)));
}

const DashboardClient = ({
	user,
	ranking,
	nextRankName,
	activeCopy,
	totalWithdrawals,
	tradeInterest,
}: DashboardClientProps) => {
	const [openWallet, setOpenWallet] = React.useState(false);
	return (
		<div className='flex w-full max-w-full flex-col gap-4 overflow-x-hidden'>
			<PreviewWallet open={openWallet} setOpen={setOpenWallet} />
			<div className='grid  gap-4'>
				{/* <div className='bg-zinc-950 rounded-md p-5 flex flex-col gap-6  border-gray-300'>
					{user.isVerified && (
						<div className='flex items-center gap-2 justify-end'>
							<div className='h-3 w-3 bg-green-500 rounded-full'></div>
							<p className='text-sm font-medium'>Verified</p>
						</div>
					)}
				</div> */}
				<div className='flex flex-col gap-6 rounded-md border border-zinc-800 bg-zinc-900 p-4 text-gray-300 sm:p-5'>
					<div className='space-y-2'>
						<h3 className='text-xs font-medium sm:text-sm'>Total Balance</h3>
						<div className='flex flex-wrap items-end gap-2 sm:gap-4'>
							<p className='text-2xl font-semibold tabular-nums sm:text-3xl'>
									${formatMoney(user.walletBalance)}
								</p>
							<span className='inline-block px-2 py-[2px] text-xs bg-amber-300/40 text-amber-500 rounded-sm border-[1px] border-amber-500'>
								USD
							</span>
						</div>
					</div>
					<div className='flex w-full flex-wrap items-center gap-2'>
						<Link
							href={'/dashboard/withdraw'}
							className='flex items-center gap-1 rounded-sm bg-purple-400/50 px-3 py-2 text-xs font-medium sm:text-sm'
						>
							<svg
								width='15'
								height='15'
								viewBox='0 0 15 15'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M7.81825 1.18188C7.64251 1.00615 7.35759 1.00615 7.18185 1.18188L4.18185 4.18188C4.00611 4.35762 4.00611 4.64254 4.18185 4.81828C4.35759 4.99401 4.64251 4.99401 4.81825 4.81828L7.05005 2.58648V9.49996C7.05005 9.74849 7.25152 9.94996 7.50005 9.94996C7.74858 9.94996 7.95005 9.74849 7.95005 9.49996V2.58648L10.1819 4.81828C10.3576 4.99401 10.6425 4.99401 10.8182 4.81828C10.994 4.64254 10.994 4.35762 10.8182 4.18188L7.81825 1.18188ZM2.5 9.99997C2.77614 9.99997 3 10.2238 3 10.5V12C3 12.5538 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2238 12.2239 9.99997 12.5 9.99997C12.7761 9.99997 13 10.2238 13 10.5V12C13 13.104 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2238 2.22386 9.99997 2.5 9.99997Z'
									fill='currentColor'
									fill-rule='evenodd'
									clip-rule='evenodd'
								></path>
							</svg>
							Withdraw
						</Link>
						<Link
							href={'/dashboard/deposit'}
							className='flex items-center gap-1 rounded-sm bg-amber-400/10 px-3 py-2 text-xs font-medium sm:text-sm'
						>
							<svg
								width='15'
								height='15'
								viewBox='0 0 15 15'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
							>
								<path
									d='M7.50005 1.04999C7.74858 1.04999 7.95005 1.25146 7.95005 1.49999V8.41359L10.1819 6.18179C10.3576 6.00605 10.6425 6.00605 10.8182 6.18179C10.994 6.35753 10.994 6.64245 10.8182 6.81819L7.81825 9.81819C7.64251 9.99392 7.35759 9.99392 7.18185 9.81819L4.18185 6.81819C4.00611 6.64245 4.00611 6.35753 4.18185 6.18179C4.35759 6.00605 4.64251 6.00605 4.81825 6.18179L7.05005 8.41359V1.49999C7.05005 1.25146 7.25152 1.04999 7.50005 1.04999ZM2.5 10C2.77614 10 3 10.2239 3 10.5V12C3 12.5539 3.44565 13 3.99635 13H11.0012C11.5529 13 12 12.5528 12 12V10.5C12 10.2239 12.2239 10 12.5 10C12.7761 10 13 10.2239 13 10.5V12C13 13.1041 12.1062 14 11.0012 14H3.99635C2.89019 14 2 13.103 2 12V10.5C2 10.2239 2.22386 10 2.5 10Z'
									fill='currentColor'
									fill-rule='evenodd'
									clip-rule='evenodd'
								></path>
							</svg>
							Deposit
						</Link>
						<div
							onClick={() => setOpenWallet(true)}
							className='flex cursor-pointer items-center gap-1 rounded-sm bg-green-600 px-3 py-2 text-xs font-medium sm:text-sm'
						>
							<LinkIcon className='w-4 h-4 inline-block mr-1' />
							Connect Wallet
						</div>
					</div>
					<div className='mt-5 flex flex-col gap-3 border-y border-gray-500 py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5'>
						<Link
							href='/dashboard/ranking'
							className='flex min-w-0 flex-wrap items-center gap-2 transition hover:opacity-80'
						>
							<Trophy className='shrink-0 text-amber-500' />
							<p className='text-sm font-medium text-gray-400'>
								Your current rank :
							</p>
							<span className='text-sm font-semibold sm:text-base'>{ranking.rankName}</span>
						</Link>
						<Award className='h-8 w-8 shrink-0 text-amber-400 sm:h-10 sm:w-10' />
					</div>
					<div className='space-y-5'>
						<div className='bg-zinc-950 px-4 py-2.5 rounded-sm flex items-center gap-4 hover:bg-purple-100/10 transition hover:cursor-pointer hover:scale-105 hover:shadow-md'>
							<div className='w-12 h-12 rounded-full bg-green-700 flex items-center justify-center'>
								<div className='w-4 h-4 rounded-full bg-zinc-950'></div>
							</div>
							<div>
								<p className='uppercase text-gray-400 font-medium text-sm'>
									Deposit wallet
								</p>
								<p className='text-base font-semibold text-white sm:text-lg'>
									${formatMoney(user.investmentBalance)}
								</p>
							</div>
						</div>
						<div className='bg-zinc-950 px-4 py-2.5 rounded-sm flex items-center gap-4 hover:bg-purple-100/10 transition hover:cursor-pointer hover:scale-105 hover:shadow-md'>
							<div className='w-12 h-12 rounded-full bg-purple-700 flex items-center justify-center'>
								<div className='w-4 h-4 rounded-full bg-zinc-950'></div>
							</div>
							<div>
								<p className='uppercase text-gray-400 font-medium text-sm'>
									Interest Balances
								</p>
								<p className='text-base font-semibold text-white sm:text-lg'>
									${formatMoney(user.profitBalance)}
								</p>
							</div>
						</div>
						<div className='bg-zinc-950 px-4 py-2.5 rounded-sm flex items-center gap-4 hover:bg-purple-100/10 transition hover:cursor-pointer hover:scale-105 hover:shadow-md'>
							<div className='w-12 h-12 rounded-full bg-red-500/30 flex items-center justify-center'>
								<div className='w-4 h-4 rounded-full bg-zinc-950'></div>
							</div>
							<div>
								<p className='uppercase text-gray-400 font-medium text-sm'>
									Total withdrawal
								</p>
								<p className='text-base font-semibold text-white sm:text-lg'>
									${formatMoney(totalWithdrawals)}
								</p>
							</div>
						</div>
						<div className='bg-zinc-950 px-4 py-2.5 rounded-sm flex items-center gap-4 hover:bg-purple-100/10 transition hover:cursor-pointer hover:scale-105 hover:shadow-md'>
							<div className='w-12 h-12 rounded-full bg-blue-700 flex items-center justify-center'>
								<div className='w-4 h-4 rounded-full bg-zinc-950'></div>
							</div>
							<div>
								<p className='uppercase text-gray-400 font-medium text-sm'>
									Trade interest
								</p>
								<p className='text-base font-semibold text-white sm:text-lg'>
									${formatMoney(tradeInterest)}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='space-y-5 mt-5'>
				<h1 className='text-lg font-medium sm:text-xl md:text-2xl'>Market overview</h1>
				<Tabs
					defaultValue='core'
					className='w-full max-w-full'
				>
					<TabsList className='grid h-auto w-full grid-cols-3 gap-1 bg-transparent sm:gap-2'>
						<TabsTrigger
							value='core'
							className='flex items-center justify-center gap-1 border bg-zinc-900 px-1 py-2 text-[10px] text-white active:bg-accent-foreground sm:gap-2 sm:px-4 sm:text-sm'
						>
							<LayoutDashboardIcon className='h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4' /> Core assets
						</TabsTrigger>
						<TabsTrigger
							value='market'
							className='flex items-center justify-center gap-1 border bg-zinc-900 px-1 py-2 text-[10px] text-white active:bg-accent-foreground sm:gap-2 sm:px-4 sm:text-sm'
						>
							<TrendingUpIcon className='h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4' />
							Top gainers
						</TabsTrigger>
						<TabsTrigger
							value='news'
							className='flex items-center justify-center gap-1 border bg-zinc-900 px-1 py-2 text-[10px] text-white active:bg-accent-foreground sm:gap-2 sm:px-4 sm:text-sm'
						>
							<TrendingDownIcon className='h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4' />
							Top losers
						</TabsTrigger>
					</TabsList>
					<TabsContent
						value='core'
						className='mt-2'
					>
						<div className='border border-zinc-800 rounded-md  bg-zinc-900 py-2 bg-ac'>
							<CoreAssets />
						</div>
					</TabsContent>
					<TabsContent
						value='market'
						className='mt-2'
					>
						<div className='py-2 bg-zinc-900 border border-zinc-700 rounded-md'>
							<div className='flex min-w-0 items-center justify-between gap-2 bg-zinc-900 p-3 sm:justify-around sm:gap-4 sm:p-4  border-b border-zinc-700 hover:bg-accent-foreground transition-all duration-200'>
								<div className='flex items-center gap-2'>
									<Image
										alt='logo'
										width={40}
										height={50}
										src='/dashboard/btc.svg'
									/>
									<div>
										<p className='font-semibold text-sm sm:text-base'>
											Bitcoin
										</p>
										<p className='text-gray-400 text-sm'>
											BTC
										</p>
									</div>
								</div>
								<div className='flex flex-col items-end gap-4'>
									<p className='font-semibold text-sm'>
										US$65765.89
									</p>
									<span className='bg-green-500 block w-5 h-[2px] rounded-4xl'></span>
								</div>
								<div className='hidden max-w-[72px] shrink-0 sm:block sm:max-w-[100px]'>
									<svg
										viewBox='0 0 1200 300'
										className='w-full h-auto'
									>
										<polyline
											points='50,200 150,130 250,170 350,100 450,50 550,270 650,300 750,180 850,130 950,220 1050,160 1150,190'
											fill='none'
											stroke='#4ade80'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
											vectorEffect='non-scaling-stroke'
										/>
									</svg>
								</div>
							</div>
							<div className='flex min-w-0 items-center justify-between gap-2 bg-zinc-900 p-3 sm:justify-around sm:gap-4 sm:p-4 border-b border-zinc-700 hover:bg-accent-foreground transition-all duration-200'>
								<div className='flex items-center gap-2'>
									<Image
										alt='logo'
										width={40}
										height={50}
										src='/dashboard/stocks/google.png'
									/>
									<div>
										<p className='font-semibold text-sm sm:text-base truncate'>
											Alphabet, Inc.
										</p>
										<p className='text-gray-400 text-sm'>
											GOOGL
										</p>
									</div>
								</div>
								<div className='flex flex-col items-end gap-4'>
									<p className='font-semibold text-sm'>
										US$150.89
									</p>
									<span className='bg-green-500 block w-5 h-[2px] rounded-4xl'></span>
								</div>
								<div className='hidden max-w-[72px] shrink-0 sm:block sm:max-w-[100px]'>
									<svg
										viewBox='0 0 1200 300'
										className='w-full h-auto'
									>
										<polyline
											points='50,200 150,130 250,170 350,100 450,50 550,270 650,300 750,180 850,130 950,220 1050,160 1150,190'
											fill='none'
											stroke='#4ade80'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
											vectorEffect='non-scaling-stroke'
										/>
									</svg>
								</div>
							</div>
							<div className='flex min-w-0 items-center justify-between gap-2 bg-zinc-900 p-3 sm:justify-around sm:gap-4 sm:p-4 rounded-md'>
								<div className='flex items-center gap-2'>
									<Image
										alt='logo'
										width={40}
										height={50}
										src='/dashboard/stocks/tesla.png'
									/>
									<div>
										<p className='font-semibold text-sm sm:text-base'>
											Tesla, Inc.
										</p>
										<p className='text-gray-400 text-sm'>
											TSLA
										</p>
									</div>
								</div>
								<div className='flex flex-col items-end gap-4'>
									<p className='font-semibold text-sm'>
										US$327
									</p>
									<span className='bg-green-500 block w-5 h-[2px] rounded-4xl'></span>
								</div>
								<div className='hidden max-w-[72px] shrink-0 sm:block sm:max-w-[100px]'>
									<svg
										viewBox='0 0 1200 300'
										className='w-full h-auto'
									>
										<polyline
											points='50,200 150,130 250,170 350,100 450,50 550,270 650,300 750,180 850,130 950,220 1050,160 1150,190'
											fill='none'
											stroke='#4ade80'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
											vectorEffect='non-scaling-stroke'
										/>
									</svg>
								</div>
							</div>
						</div>
					</TabsContent>
					<TabsContent
						value='news'
						className='mt-2'
					>
						<div className='py-2 bg-zinc-900 border border-zinc-700 rounded-md'>
							<div className='flex min-w-0 items-center justify-between gap-2 bg-zinc-900 p-3 sm:justify-around sm:gap-4 sm:p-4  border-b border-zinc-700 hover:bg-accent-foreground transition-all duration-200'>
								<div className='flex items-center gap-2'>
									<Image
										alt='logo'
										width={40}
										height={50}
										src='/dashboard/eth.svg'
									/>
									<div>
										<p className='font-semibold text-sm sm:text-base'>
											Etherum
										</p>
										<p className='text-gray-400 text-sm'>
											ETH
										</p>
									</div>
								</div>
								<div className='flex flex-col items-end gap-4'>
									<p className='font-semibold text-sm'>
										US$1878.89
									</p>
									<span className='bg-green-500 block w-5 h-[2px] rounded-4xl'></span>
								</div>
								<div className='hidden max-w-[72px] shrink-0 sm:block sm:max-w-[100px]'>
									<svg
										viewBox='0 0 1200 300'
										className='w-full h-auto'
									>
										<polyline
											points='50,200 150,130 250,170 350,100 450,50 550,270 650,300 750,180 850,130 950,220 1050,160 1150,190'
											fill='none'
											stroke='#4ade80'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
											vectorEffect='non-scaling-stroke'
										/>
									</svg>
								</div>
							</div>
							<div className='flex min-w-0 items-center justify-between gap-2 bg-zinc-900 p-3 sm:justify-around sm:gap-4 sm:p-4 border-b border-zinc-700 hover:bg-accent-foreground transition-all duration-200'>
								<div className='flex items-center gap-2'>
									<div className='bg-white rounded-md'>
										<Image
											alt='logo'
											width={40}
											height={50}
											src='/dashboard/stocks/zomato.png'
										/>
									</div>
									<div>
										<p className='font-semibold text-sm sm:text-base truncate'>
											Zomato
										</p>
										<p className='text-gray-400 text-sm'>
											ZOMATO
										</p>
									</div>
								</div>
								<div className='flex flex-col items-end gap-4'>
									<p className='font-semibold text-sm'>
										US$150.89
									</p>
									<span className='bg-green-500 block w-5 h-[2px] rounded-4xl'></span>
								</div>
								<div className='hidden max-w-[72px] shrink-0 sm:block sm:max-w-[100px]'>
									<svg
										viewBox='0 0 1200 300'
										className='w-full h-auto'
									>
										<polyline
											points='50,200 150,130 250,170 350,100 450,50 550,270 650,300 750,180 850,130 950,220 1050,160 1150,190'
											fill='none'
											stroke='red'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
											vectorEffect='non-scaling-stroke'
										/>
									</svg>
								</div>
							</div>
							<div className='flex min-w-0 items-center justify-between gap-2 bg-zinc-900 p-3 sm:justify-around sm:gap-4 sm:p-4 rounded-md'>
								<div className='flex items-center gap-2'>
									<Image
										alt='logo'
										width={40}
										height={50}
										src='/dashboard/stocks/netflix.png'
									/>
									<div>
										<p className='font-semibold text-sm sm:text-base truncate'>
											Netflix, Inc.
										</p>
										<p className='text-gray-400 text-sm'>
											NFLX
										</p>
									</div>
								</div>
								<div className='flex flex-col items-end gap-4'>
									<p className='font-semibold text-sm'>
										US$327
									</p>
									<span className='bg-green-500 block w-5 h-[2px] rounded-4xl'></span>
								</div>
								<div className='hidden max-w-[72px] shrink-0 sm:block sm:max-w-[100px]'>
									<svg
										viewBox='0 0 1200 300'
										className='w-full h-auto'
									>
										<polyline
											points='50,200 150,130 250,170 350,100 450,50 550,270 650,300 750,180 850,130 950,220 1050,160 1150,190'
											fill='none'
											stroke='red'
											strokeWidth='2'
											strokeLinecap='round'
											strokeLinejoin='round'
											vectorEffect='non-scaling-stroke'
										/>
									</svg>
								</div>
							</div>
						</div>
					</TabsContent>
				</Tabs>
			</div>

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
