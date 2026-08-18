import Link from 'next/link';
import { Clock, ShieldAlert } from 'lucide-react';

type KycRecord = {
	status: string;
};

type KycLayoutBannerProps = {
	kyc: KycRecord[];
};

const warningCardClass =
	'mb-4 w-full rounded-md border border-yellow-500/20 bg-yellow-500/5 p-4 sm:p-5';

export default function KycLayoutBanner({ kyc }: KycLayoutBannerProps) {
	if (kyc.length === 0) {
		return (
			<div className={`${warningCardClass} flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4`}>
				<div className='flex flex-1 items-start gap-3'>
					<div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-500/10'>
						<ShieldAlert className='h-5 w-5 text-yellow-500' aria-hidden />
					</div>
					<div className='min-w-0 space-y-1'>
						<p className='text-sm font-semibold text-white sm:text-base'>
							Complete identity verification
						</p>
						<p className='text-xs text-gray-400 sm:text-sm'>
							Submit your KYC documents to unlock trading, deposits,
							and withdrawals.{' '}
							<Link
								href='/dashboard/kyc'
								className='font-medium text-indigo-400 underline hover:text-indigo-300'
							>
								Complete KYC
							</Link>
						</p>
					</div>
				</div>
			</div>
		);
	}

	if (kyc[0].status === 'pending') {
		return (
			<div className={warningCardClass}>
				<div className='flex items-start gap-3'>
					<div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-500/10'>
						<Clock className='h-5 w-5 text-yellow-500' aria-hidden />
					</div>
					<div className='min-w-0 space-y-2'>
						<div className='space-y-1'>
							<p className='text-sm font-semibold text-white sm:text-base'>
								Verification in progress
							</p>
							<p className='text-xs text-gray-400 sm:text-sm'>
								We&apos;ve received your documents. Review usually
								takes a few minutes to a few hours — we&apos;ll
								notify you once approved.
							</p>
						</div>
						<span className='inline-flex items-center gap-1.5 rounded-md bg-yellow-500/10 px-3 py-1.5 text-xs font-medium text-yellow-500'>
							<Clock className='h-3.5 w-3.5' aria-hidden />
							Pending approval
						</span>
					</div>
				</div>
			</div>
		);
	}

	return null;
}
