'use client';
import React, { useState } from 'react';
import { CheckCircleIcon, ClockIcon } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import KycForm from './KycForm';
import { dashboardModalTitleClass, dashboardPageTitleClass } from '@/lib/userFormStyles';

interface KycSectionProps {
	isVerified?: boolean;
	firstName?: string;
	// Reflects a persisted "pending review" status from your session/DB
	// (e.g. session?.user.kycStatus === 'pending'). Defaults to false when
	// you don't yet track this — the section will still switch to the
	// pending view the moment the person submits, via local state below.
	hasPendingSubmission?: boolean;
}

const KycSection = ({
	isVerified,
	firstName,
	hasPendingSubmission,
}: KycSectionProps) => {
	const [open, setOpen] = useState(false);
	// Seeded from the server prop so a reload keeps showing "pending" once
	// you wire up real persisted status; flips to true immediately on a
	// successful submit so the person can't reopen the form in this session.
	const [pending, setPending] = useState(hasPendingSubmission);

	if (isVerified) {
		return (
			<div className='rounded-md border border-zinc-700 bg-zinc-800 p-8 flex flex-col items-center gap-3 text-center'>
				<div className='flex h-14 w-14 items-center justify-center rounded-full bg-emerald-900/60'>
					<CheckCircleIcon className='h-8 w-8 text-emerald-400' />
				</div>
				<p className='font-medium text-emerald-300'>
					Your KYC has been approved
				</p>
			</div>
		);
	}

	if (pending) {
		return (
			<div className='rounded-md border border-zinc-700 bg-zinc-800 p-6 space-y-4'>
				<h2 className={dashboardModalTitleClass}>
					Hey, {firstName ?? 'there'} <span aria-hidden>👋</span>
				</h2>

				<p className='text-gray-400'>
					We&apos;ve received your verification documents and
					they&apos;re currently under review. This usually takes a
					few minutes to a few hours — we&apos;ll notify you once a
					decision has been made.
				</p>

				<span className='inline-flex items-center gap-2 rounded-md bg-amber-900/40 px-4 py-2 text-sm font-medium text-amber-300'>
					<ClockIcon size={16} />
					Verification in progress
				</span>
			</div>
		);
	}

	return (
		<div className='rounded-md border border-zinc-700 bg-zinc-800 p-6 space-y-4'>
			<h2 className={dashboardModalTitleClass}>
				Hey, {firstName ?? 'there'} <span aria-hidden>👋</span>
			</h2>

			<p className='text-gray-400'>
				To ensure a secure and trustworthy environment for all our
				users, we kindly request you to submit your verification
				documents. Completing this process is quick and easy, and it
				helps us maintain the integrity of our platform. It only takes a
				few minutes to complete the verification process.
			</p>

			<span className='inline-block rounded-md bg-red-900/40 px-4 py-2 text-sm font-medium text-red-300'>
				Not Verified
			</span>

			<div>
				<Dialog
					open={open}
					onOpenChange={setOpen}
				>
					<Button
						type='button'
						onClick={() => setOpen(true)}
						className='bg-indigo-500 text-white hover:bg-indigo-400'
					>
						Click here to Submit
					</Button>

					<DialogContent className='max-h-[85vh] max-w-lg overflow-y-auto border-zinc-700 bg-zinc-900 text-white'>
						<DialogHeader>
							<DialogTitle className={dashboardPageTitleClass}>
								Submit verification
							</DialogTitle>
						</DialogHeader>

						<KycForm
							onSubmitted={() => {
								setOpen(false);
								setPending(true);
							}}
						/>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
};

export default KycSection;
