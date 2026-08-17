'use client';

import React, { useState } from 'react';
import { Info, Link as LinkIcon, Copy, Users } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Referral {
	id: string;
	name: string;
	joinedAt: string;
	invested: number;
}

interface ReferralStats {
	totalReferrals: number;
	thisMonthReferrals: number;
	teamInvest: number;
	bonusEarned: number;
}

function formatCurrency(n: number): string {
	return `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

const StatBox = ({
	label,
	value,
}: {
	label: string;
	value: React.ReactNode;
}) => (
	<div className='rounded-md border border-zinc-700 bg-zinc-800 p-6 space-y-2'>
		<p className='text-xs uppercase tracking-wide text-gray-400'>{label}</p>
		<div className='text-4xl font-bold text-white'>{value}</div>
	</div>
);

const InfoCallout = ({
	icon,
	title,
	children,
}: {
	icon: React.ReactNode;
	title: string;
	children: React.ReactNode;
}) => (
	<div className='rounded-md border border-blue-500/40 bg-blue-950/40 p-6 space-y-3'>
		<div className='flex items-center gap-3'>
			{icon}
			<h3 className='text-lg font-semibold text-white'>{title}</h3>
		</div>
		<div className='text-blue-300 leading-relaxed'>{children}</div>
	</div>
);

export default function ReferralsClient({
	referralLink,
	refcode,
	stats,
	referrals,
}: {
	referralLink: string;
	refcode: string;
	stats: ReferralStats;
	referrals: Referral[];
}) {
	const [copiedLink, setCopiedLink] = useState(false);
	const [copiedCode, setCopiedCode] = useState(false);

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(referralLink);
			setCopiedLink(true);
			toast.success('Referral link copied');
			setTimeout(() => setCopiedLink(false), 2000);
		} catch {
			toast.error('Could not copy link');
		}
	};

	const handleCopyCode = async () => {
		try {
			await navigator.clipboard.writeText(refcode);
			setCopiedCode(true);
			toast.success('Referral code copied');
			setTimeout(() => setCopiedCode(false), 2000);
		} catch {
			toast.error('Could not copy code');
		}
	};

	return (
		<div className='space-y-8'>
			<div className='space-y-3'>
				<h1 className='text-3xl font-bold text-white'>
					Refer &amp; climb the ranks
				</h1>
				<p className='text-gray-400'>
					Share your link with friends. When they sign up and invest,
					they count toward your direct referrals and team invest
					volume — both help you unlock higher ranks and bonuses.
				</p>
			</div>

			<InfoCallout
				icon={<span className='text-xl'>🏆</span>}
				title='Referrals boost your rank'
			>
				<p>
					Each direct referral and their deposits count toward your
					rank progress. Higher ranks unlock bigger bonuses — view
					your progress on the ranking page.
				</p>
				<Link
					href='/dashboard/ranking'
					className='mt-3 inline-block font-medium text-indigo-400 underline hover:text-indigo-300'
				>
					View ranking progress
				</Link>
			</InfoCallout>

			<div className='grid gap-4 sm:grid-cols-2'>
				<StatBox label='Total referrals' value={stats.totalReferrals} />
				<StatBox
					label='This month'
					value={stats.thisMonthReferrals}
				/>
				<StatBox
					label='Team invest volume'
					value={formatCurrency(stats.teamInvest)}
				/>
				<StatBox
					label='Rank bonuses earned'
					value={formatCurrency(stats.bonusEarned)}
				/>
			</div>

			<div className='rounded-md border border-zinc-700 bg-zinc-800 p-6 space-y-4'>
				<div className='space-y-1'>
					<h2 className='text-xl font-bold text-white'>
						Your referral code
					</h2>
					<p className='text-gray-400 text-sm'>
						Share your code or link — friends use it when they complete
						their profile after signing up.
					</p>
				</div>

				<div className='flex items-center justify-between gap-3 rounded-md border border-zinc-700 bg-zinc-900/40 px-4 py-3'>
					<p className='font-mono text-lg font-semibold tracking-wide text-white'>
						{refcode}
					</p>
					<button
						type='button'
						onClick={handleCopyCode}
						className='inline-flex items-center gap-2 rounded-md border border-zinc-600 px-3 py-1.5 text-sm text-gray-200 hover:bg-zinc-800'
					>
						<Copy size={16} />
						{copiedCode ? 'Copied!' : 'Copy code'}
					</button>
				</div>
			</div>

			<div className='rounded-md border border-zinc-700 bg-zinc-800 p-6 space-y-4'>
				<div className='space-y-1'>
					<h2 className='text-xl font-bold text-white'>
						Your referral link
					</h2>
					<p className='text-gray-400 text-sm'>
						Anyone who registers through this link is counted as
						your referral.
					</p>
				</div>

				<div className='flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900/40 px-4 py-3'>
					<LinkIcon size={16} className='shrink-0 text-gray-400' />
					<p className='truncate text-gray-300'>{referralLink}</p>
				</div>

				<button
					type='button'
					onClick={handleCopyLink}
					className='flex w-full items-center justify-center gap-2 rounded-md bg-indigo-500 py-3 text-base font-semibold text-white transition hover:bg-indigo-400 active:scale-[0.99]'
				>
					<Copy size={18} />
					{copiedLink ? 'Copied!' : 'Copy referral link'}
				</button>
			</div>

			<InfoCallout
				icon={
					<span className='flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white'>
						<Info size={14} />
					</span>
				}
				title='How it works'
			>
				<ol className='list-decimal list-inside space-y-2'>
					<li>Share your unique referral link with friends.</li>
					<li>They sign up and enter your code during profile setup.</li>
					<li>Their deposits add to your team invest volume.</li>
					<li>Meet all rank requirements to unlock bonuses.</li>
				</ol>
			</InfoCallout>

			<div className='space-y-2'>
				<h2 className='text-2xl font-bold text-white'>
					Your referrals
				</h2>
				<p className='text-gray-400 text-sm'>
					People who joined using your link.
				</p>

				{referrals.length === 0 ? (
					<div className='flex items-center gap-3 rounded-md border border-zinc-700 bg-zinc-800 p-6'>
						<Users size={20} className='shrink-0 text-gray-400' />
						<p className='text-gray-300'>
							No referrals yet. Share your link to get started and
							earn rank progress.
						</p>
					</div>
				) : (
					<div className='space-y-3'>
						{referrals.map((referral) => (
							<div
								key={referral.id}
								className='flex items-center justify-between rounded-md border border-zinc-700 bg-zinc-800 p-4'
							>
								<div>
									<p className='font-medium text-white'>
										{referral.name}
									</p>
									<p className='text-sm text-gray-400'>
										Joined {referral.joinedAt}
									</p>
								</div>
								<p className='text-sm font-medium text-indigo-400'>
									{formatCurrency(referral.invested)} invested
								</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
