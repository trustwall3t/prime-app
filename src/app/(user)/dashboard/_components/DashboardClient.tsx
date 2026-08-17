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
}

function formatCurrency(n: number): string {
	return `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function winRateStars(winRate: number): number {
	return Math.min(5, Math.max(1, Math.round(winRate / 20)));
}

const DashboardClient = ({ user, ranking, nextRankName, activeCopy }: DashboardClientProps) => {
	const [openWallet, setOpenWallet] = React.useState(false);
	return (
		<div className='flex flex-col gap-4  w-full'>
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
				<div className='bg-zinc-900 text-gray-300 p-5 border border-zinc-800 rounded-md flex flex-col gap-6'>
					<div className='space-y-2'>
						<h3 className='text-sm font-medium'>Total Balance</h3>
						<div className='flex items-end gap-4'>
							<p className='text-3xl font-semibold'>
									${formatMoney(user.walletBalance)}
								</p>
							<span className='inline-block px-2 py-[2px] text-xs bg-amber-300/40 text-amber-500 rounded-sm border-[1px] border-amber-500'>
								USD
							</span>
						</div>
					</div>
					<div className='flex items-center gap-2 min-w-[400px] overflow-scroll '>
						<Link
							href={'/dashboard/withdraw'}
							className='bg-purple-400/50 px-3 py-2 rounded-sm text-sm font-medium  flex items-center gap-1'
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
							className='bg-amber-400/10 px-3 py-2 rounded-sm text-sm font-medium flex items-center gap-1'
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
							className='bg-green-600 px-3 py-2 rounded-sm text-sm font-medium flex items-center gap-1'
						>
							<LinkIcon className='w-4 h-4 inline-block mr-1' />
							Connect Wallet
						</div>
					</div>
					<div className='flex items-center justify-between border-t-1 border-b-1 py-5 border-gray-500 mt-5'>
						<Link
							href='/dashboard/ranking'
							className='flex items-center gap-2 hover:opacity-80 transition'
						>
							<Trophy className='text-amber-500' />
							<p className='text-gray-400 font-medium'>
								Your current rank :
							</p>
							<span className='font-semibold'>{ranking.rankName}</span>
						</Link>
						<Award className='h-10 w-10 text-amber-400' />
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
								<p className='text-white font-semibold text-lg'>
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
								<p className='text-white font-semibold text-xl'>
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
								<p className='text-white font-semibold text-lg'>
									${formatMoney(user.investmentBalance)}
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
								<p className='text-white font-semibold text-lg'>
									${formatMoney(user.investmentBalance)}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className='space-y-5 mt-5'>
				<h1 className='font-medium text-2xl'>Market overview</h1>
				<Tabs
					defaultValue='core'
					className='w-full '
				>
					<TabsList className='grid w-full grid-cols-3 gap-2 bg-transparent'>
						<TabsTrigger
							value='core'
							className='bg-zinc-900 border  text-white px-4 active:bg-accent-foreground '
						>
							<LayoutDashboardIcon /> Core assets
						</TabsTrigger>
						<TabsTrigger
							value='market'
							className='bg-zinc-900 border  text-white px-4 active:bg-accent-foreground '
						>
							<TrendingUpIcon />
							Top gainers
						</TabsTrigger>
						<TabsTrigger
							value='news'
							className='bg-zinc-900 border  text-white px-4 active:bg-accent-foreground '
						>
							<TrendingDownIcon />
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
							<div className='flex items-center justify-around gap-4 bg-zinc-900 p-4  border-b border-zinc-700 hover:bg-accent-foreground transition-all duration-200'>
								<div className='flex items-center gap-2'>
									<Image
										alt='logo'
										width={40}
										height={50}
										src='/dashboard/btc.svg'
									/>
									<div>
										<p className='font-semibold text-lg'>
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
								<div className='max-w-[100px]'>
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
							<div className='flex items-center justify-around gap-4 bg-zinc-900 p-4 border-b border-zinc-700 hover:bg-accent-foreground transition-all duration-200'>
								<div className='flex items-center gap-2'>
									<Image
										alt='logo'
										width={40}
										height={50}
										src='/dashboard/stocks/google.png'
									/>
									<div>
										<p className='font-semibold text-lg truncate'>
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
								<div className='max-w-[100px]'>
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
							<div className='flex items-center justify-around gap-4 bg-zinc-900 p-4 rounded-md'>
								<div className='flex items-center gap-2'>
									<Image
										alt='logo'
										width={40}
										height={50}
										src='/dashboard/stocks/tesla.png'
									/>
									<div>
										<p className='font-semibold text-lg'>
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
								<div className='max-w-[100px]'>
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
							<div className='flex items-center justify-around gap-4 bg-zinc-900 p-4  border-b border-zinc-700 hover:bg-accent-foreground transition-all duration-200'>
								<div className='flex items-center gap-2'>
									<Image
										alt='logo'
										width={40}
										height={50}
										src='/dashboard/eth.svg'
									/>
									<div>
										<p className='font-semibold text-lg'>
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
								<div className='max-w-[100px]'>
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
							<div className='flex items-center justify-around gap-4 bg-zinc-900 p-4 border-b border-zinc-700 hover:bg-accent-foreground transition-all duration-200'>
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
										<p className='font-semibold text-lg truncate'>
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
								<div className='max-w-[100px]'>
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
							<div className='flex items-center justify-around gap-4 bg-zinc-900 p-4 rounded-md'>
								<div className='flex items-center gap-2'>
									<Image
										alt='logo'
										width={40}
										height={50}
										src='/dashboard/stocks/netflix.png'
									/>
									<div>
										<p className='font-semibold text-lg truncate'>
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
								<div className='max-w-[100px]'>
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
								className='font-semibold text-lg text-center hover:text-indigo-400 transition'
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
							<h3 className='font-semibold text-lg text-gray-400'>
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
					<h3 className='font-semibold text-lg'>
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
