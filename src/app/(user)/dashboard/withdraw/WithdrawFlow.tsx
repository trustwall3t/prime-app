'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
	ArrowLeft,
	ArrowRight,
	Check,
	ChevronRight,
	Clock,
	Shield,
	Wallet,
	X,
} from 'lucide-react';
import { requestWithdrawal } from '@/actions/withdraw';
import { userInputClass, userPrimaryButtonClass } from '@/lib/userFormStyles';
import { cn } from '@/lib/utils';

type WithdrawMethod = {
	id: string;
	name: string;
	network: string;
	image: string;
	minWithdraw: string;
	maxWithdraw: string;
	processingTime: string;
	addressKey?: 'btcAddress' | 'ethAddress' | 'usdtAddress';
};

const WITHDRAWAL_METHODS: WithdrawMethod[] = [
	{
		id: 'BTC',
		name: 'Bitcoin',
		network: 'BTC',
		image: '/dashboard/btc.svg',
		minWithdraw: '50',
		maxWithdraw: '50000',
		processingTime: '24 – 48 hours',
		addressKey: 'btcAddress',
	},
	{
		id: 'USDT',
		name: 'USDT',
		network: 'TRC20',
		image: '/dashboard/usdt.svg',
		minWithdraw: '50',
		maxWithdraw: '50000',
		processingTime: '24 – 48 hours',
		addressKey: 'usdtAddress',
	},
	{
		id: 'ETH',
		name: 'Ethereum',
		network: 'ETH',
		image: '/dashboard/eth.svg',
		minWithdraw: '50',
		maxWithdraw: '50000',
		processingTime: '24 – 48 hours',
		addressKey: 'ethAddress',
	},
	{
		id: 'TRX',
		name: 'Tron',
		network: 'TRX',
		image: '/dashboard/trx.svg',
		minWithdraw: '50',
		maxWithdraw: '50000',
		processingTime: '24 – 48 hours',
	},
	{
		id: 'LTC',
		name: 'Litecoin',
		network: 'LTC',
		image: '/dashboard/ltc.svg',
		minWithdraw: '50',
		maxWithdraw: '50000',
		processingTime: '24 – 48 hours',
	},
	{
		id: 'DOGE',
		name: 'Dogecoin',
		network: 'DOGE',
		image: '/dashboard/doge.svg',
		minWithdraw: '50',
		maxWithdraw: '50000',
		processingTime: '24 – 48 hours',
	},
];

const STEP_LABELS = ['Select method', 'Enter details', 'Confirm'];

export type WithdrawFlowUser = {
	id: string;
	walletBalance: number;
	isVerified: boolean;
	btcAddress?: string | null;
	ethAddress?: string | null;
	usdtAddress?: string | null;
};

function formatUsd(value: number) {
	return value.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

function maskAddress(address: string) {
	if (address.length <= 12) return address;
	return `${address.slice(0, 6)}…${address.slice(-6)}`;
}

export default function WithdrawFlow({ user }: { user: WithdrawFlowUser }) {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [selectedMethod, setSelectedMethod] = useState<WithdrawMethod | null>(
		null,
	);
	const [wallet, setWallet] = useState('');
	const [amount, setAmount] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const savedAddress = useMemo(() => {
		if (!selectedMethod?.addressKey) return '';
		return user[selectedMethod.addressKey]?.trim() ?? '';
	}, [selectedMethod, user]);

	const numericAmount = parseFloat(amount) || 0;
	const minAmount = selectedMethod ? parseFloat(selectedMethod.minWithdraw) : 0;

	const amountError = useMemo(() => {
		if (!amount) return null;
		if (numericAmount <= 0) return 'Enter a valid amount';
		if (numericAmount < minAmount)
			return `Minimum withdrawal is $${selectedMethod?.minWithdraw}`;
		if (numericAmount > user.walletBalance)
			return 'Amount exceeds available balance';
		if (numericAmount > parseFloat(selectedMethod?.maxWithdraw ?? '0'))
			return `Maximum withdrawal is $${selectedMethod?.maxWithdraw}`;
		return null;
	}, [amount, numericAmount, minAmount, user.walletBalance, selectedMethod]);

	const canProceedStep2 =
		wallet.trim().length >= 10 &&
		numericAmount > 0 &&
		!amountError &&
		user.isVerified;

	const progress = submitted ? 100 : ((step - 1) / (STEP_LABELS.length - 1)) * 100;

	const handleSelectMethod = (method: WithdrawMethod) => {
		setSelectedMethod(method);
		const prefill = method.addressKey
			? (user[method.addressKey]?.trim() ?? '')
			: '';
		setWallet(prefill);
		setStep(2);
	};

	const handleBack = () => {
		if (step === 1) {
			router.push('/dashboard');
			return;
		}
		if (step === 2) {
			setSelectedMethod(null);
			setWallet('');
			setAmount('');
		}
		setStep((s) => s - 1);
	};

	const handleSubmit = async () => {
		if (!selectedMethod || !canProceedStep2) return;

		setIsSubmitting(true);
		try {
			const result = await requestWithdrawal({
				id: user.id,
				wallet: wallet.trim(),
				paymentMethod: selectedMethod.id,
				amount: String(numericAmount),
			});

			if (result?.error) {
				toast.error(result.error);
				return;
			}

			setSubmitted(true);
			toast.success('Withdrawal request submitted successfully');
		} catch {
			toast.error('Something went wrong. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 pb-24 backdrop-blur-sm sm:pb-4'>
			<div className='relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl'>
				{/* Header */}
				<div className='border-b border-zinc-800 px-5 py-4'>
					<div className='mb-3 flex items-center justify-between'>
						<button
							type='button'
							onClick={handleBack}
							className='flex items-center gap-1.5 text-sm text-gray-400 transition hover:text-white'
						>
							<ArrowLeft className='h-4 w-4' />
							{step === 1 ? 'Dashboard' : 'Back'}
						</button>
						<Link
							href='/dashboard'
							className='rounded-lg p-1.5 text-gray-400 transition hover:bg-zinc-800 hover:text-white'
							aria-label='Close'
						>
							<X className='h-5 w-5' />
						</Link>
					</div>

					{!submitted && (
						<>
							<div className='mb-2 flex items-center justify-between text-xs text-gray-500'>
								<span>
									Step {step} of {STEP_LABELS.length}
								</span>
								<span className='text-indigo-400'>{STEP_LABELS[step - 1]}</span>
							</div>
							<div className='h-1.5 overflow-hidden rounded-full bg-zinc-800'>
								<div
									className='h-full rounded-full bg-indigo-500 transition-all duration-500 ease-out'
									style={{ width: `${progress}%` }}
								/>
							</div>
						</>
					)}
				</div>

				{/* Body */}
				<div className='flex-1 overflow-y-auto px-5 py-6'>
					{submitted ? (
						<SuccessView
							method={selectedMethod!}
							amount={numericAmount}
							wallet={wallet}
						/>
					) : step === 1 ? (
						<StepSelectMethod
							balance={user.walletBalance}
							isVerified={user.isVerified}
							onSelect={handleSelectMethod}
						/>
					) : step === 2 ? (
						<StepEnterDetails
							method={selectedMethod!}
							balance={user.walletBalance}
							wallet={wallet}
							amount={amount}
							savedAddress={savedAddress}
							amountError={amountError}
							isVerified={user.isVerified}
							onWalletChange={setWallet}
							onAmountChange={setAmount}
							onUseSaved={() => setWallet(savedAddress)}
						/>
					) : (
						<StepConfirm
							method={selectedMethod!}
							wallet={wallet}
							amount={numericAmount}
							balance={user.walletBalance}
						/>
					)}
				</div>

				{/* Footer actions */}
				{!submitted && step > 1 && (
					<div className='border-t border-zinc-800 px-5 py-4'>
						{step === 2 && (
							<button
								type='button'
								disabled={!canProceedStep2}
								onClick={() => setStep(3)}
								className={cn(
									userPrimaryButtonClass,
									'flex items-center justify-center gap-2',
								)}
							>
								Review withdrawal
								<ArrowRight className='h-4 w-4' />
							</button>
						)}
						{step === 3 && (
							<button
								type='button'
								disabled={isSubmitting}
								onClick={handleSubmit}
								className={cn(
									userPrimaryButtonClass,
									'flex items-center justify-center gap-2',
								)}
							>
								{isSubmitting ? 'Submitting…' : 'Confirm withdrawal'}
								{!isSubmitting && <Check className='h-4 w-4' />}
							</button>
						)}
					</div>
				)}

				{submitted && (
					<div className='border-t border-zinc-800 px-5 py-4'>
						<Link
							href='/dashboard/transaction-history'
							className={cn(
								userPrimaryButtonClass,
								'flex items-center justify-center gap-2 text-center',
							)}
						>
							View transaction history
							<ChevronRight className='h-4 w-4' />
						</Link>
					</div>
				)}
			</div>
		</div>
	);
}

function StepSelectMethod({
	balance,
	isVerified,
	onSelect,
}: {
	balance: number;
	isVerified: boolean;
	onSelect: (method: WithdrawMethod) => void;
}) {
	return (
		<div className='space-y-5'>
			<div>
				<h2 className='text-xl font-semibold text-white'>Withdraw funds</h2>
				<p className='mt-1 text-sm text-gray-400'>
					Choose how you&apos;d like to receive your withdrawal.
				</p>
			</div>

			<div className='rounded-xl border border-zinc-800 bg-zinc-900/60 p-4'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center gap-2 text-sm text-gray-400'>
						<Wallet className='h-4 w-4 text-indigo-400' />
						Available balance
					</div>
					<span className='text-lg font-semibold text-white'>
						${formatUsd(balance)}
					</span>
				</div>
			</div>

			{!isVerified && (
				<div className='flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4'>
					<Shield className='mt-0.5 h-5 w-5 shrink-0 text-amber-400' />
					<div>
						<p className='text-sm font-medium text-amber-200'>
							Identity verification required
						</p>
						<p className='mt-1 text-xs text-amber-200/70'>
							Complete KYC before withdrawing.{' '}
							<Link
								href='/dashboard/kyc'
								className='underline hover:text-amber-100'
							>
								Verify now
							</Link>
						</p>
					</div>
				</div>
			)}

			<div className='grid gap-3'>
				{WITHDRAWAL_METHODS.map((method) => (
					<button
						key={method.id}
						type='button'
						onClick={() => onSelect(method)}
						disabled={!isVerified}
						className={cn(
							'group flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-left transition',
							isVerified
								? 'hover:border-indigo-500/50 hover:bg-zinc-900 active:scale-[0.99]'
								: 'cursor-not-allowed opacity-50',
						)}
					>
						<div className='flex h-11 w-11 items-center justify-center rounded-full bg-zinc-800'>
							<Image
								src={method.image}
								alt={method.name}
								width={28}
								height={28}
							/>
						</div>
						<div className='min-w-0 flex-1'>
							<p className='font-medium text-white'>{method.name}</p>
							<p className='text-xs text-gray-500'>{method.network}</p>
						</div>
						<ChevronRight className='h-5 w-5 text-gray-600 transition group-hover:text-indigo-400' />
					</button>
				))}
			</div>
		</div>
	);
}

function StepEnterDetails({
	method,
	balance,
	wallet,
	amount,
	savedAddress,
	amountError,
	isVerified,
	onWalletChange,
	onAmountChange,
	onUseSaved,
}: {
	method: WithdrawMethod;
	balance: number;
	wallet: string;
	amount: string;
	savedAddress: string;
	amountError: string | null;
	isVerified: boolean;
	onWalletChange: (v: string) => void;
	onAmountChange: (v: string) => void;
	onUseSaved: () => void;
}) {
	const setMax = () => onAmountChange(String(balance));

	return (
		<div className='space-y-5'>
			<div className='flex items-center gap-3'>
				<div className='flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800'>
					<Image src={method.image} alt={method.name} width={24} height={24} />
				</div>
				<div>
					<h2 className='text-lg font-semibold text-white'>{method.name}</h2>
					<p className='text-xs text-gray-500'>{method.network}</p>
				</div>
			</div>

			<div className='rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm'>
				<div className='flex justify-between text-gray-400'>
					<span>Min</span>
					<span className='text-white'>${method.minWithdraw}</span>
				</div>
				<div className='mt-1 flex justify-between text-gray-400'>
					<span>Max</span>
					<span className='text-white'>${method.maxWithdraw}</span>
				</div>
				<div className='mt-1 flex items-center justify-between text-gray-400'>
					<span className='flex items-center gap-1'>
						<Clock className='h-3.5 w-3.5' />
						Processing
					</span>
					<span className='text-white'>{method.processingTime}</span>
				</div>
			</div>

			{!isVerified && (
				<p className='text-sm text-amber-400'>
					Complete KYC to continue.{' '}
					<Link href='/dashboard/kyc' className='underline'>
						Verify now
					</Link>
				</p>
			)}

			<div className='space-y-2'>
				<div className='flex items-center justify-between'>
					<label htmlFor='withdraw-wallet' className='text-sm font-medium text-gray-300'>
						Destination wallet
					</label>
					{savedAddress && wallet !== savedAddress && (
						<button
							type='button'
							onClick={onUseSaved}
							className='text-xs text-indigo-400 hover:text-indigo-300'
						>
							Use saved address
						</button>
					)}
				</div>
				<input
					id='withdraw-wallet'
					type='text'
					value={wallet}
					onChange={(e) => onWalletChange(e.target.value)}
					placeholder={`Enter your ${method.name} address`}
					className={userInputClass}
					disabled={!isVerified}
				/>
			</div>

			<div className='space-y-2'>
				<div className='flex items-center justify-between'>
					<label htmlFor='withdraw-amount' className='text-sm font-medium text-gray-300'>
						Amount (USD)
					</label>
					<button
						type='button'
						onClick={setMax}
						className='text-xs font-medium text-indigo-400 hover:text-indigo-300'
						disabled={!isVerified}
					>
						Max: ${formatUsd(balance)}
					</button>
				</div>
				<div className='relative'>
					<span className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500'>
						$
					</span>
					<input
						id='withdraw-amount'
						type='number'
						min={0}
						step='0.01'
						value={amount}
						onChange={(e) => onAmountChange(e.target.value)}
						placeholder='0.00'
						className={cn(userInputClass, 'pl-8')}
						disabled={!isVerified}
					/>
				</div>
				{amountError && (
					<p className='text-xs text-red-400'>{amountError}</p>
				)}
			</div>
		</div>
	);
}

function StepConfirm({
	method,
	wallet,
	amount,
	balance,
}: {
	method: WithdrawMethod;
	wallet: string;
	amount: number;
	balance: number;
}) {
	const remaining = balance - amount;

	return (
		<div className='space-y-5'>
			<div>
				<h2 className='text-xl font-semibold text-white'>Review withdrawal</h2>
				<p className='mt-1 text-sm text-gray-400'>
					Double-check the details before submitting.
				</p>
			</div>

			<div className='overflow-hidden rounded-xl border border-zinc-800'>
				<div className='flex items-center gap-3 border-b border-zinc-800 bg-zinc-900/60 px-4 py-3'>
					<Image src={method.image} alt={method.name} width={32} height={32} />
					<div>
						<p className='font-medium text-white'>{method.name}</p>
						<p className='text-xs text-gray-500'>{method.network}</p>
					</div>
				</div>
				<dl className='divide-y divide-zinc-800 text-sm'>
					<div className='flex justify-between px-4 py-3'>
						<dt className='text-gray-400'>Amount</dt>
						<dd className='font-semibold text-white'>${formatUsd(amount)}</dd>
					</div>
					<div className='flex justify-between px-4 py-3'>
						<dt className='text-gray-400'>Destination</dt>
						<dd className='max-w-[180px] truncate font-mono text-xs text-white'>
							{maskAddress(wallet)}
						</dd>
					</div>
					<div className='flex justify-between px-4 py-3'>
						<dt className='text-gray-400'>Processing time</dt>
						<dd className='text-white'>{method.processingTime}</dd>
					</div>
					<div className='flex justify-between px-4 py-3'>
						<dt className='text-gray-400'>Balance after</dt>
						<dd className='text-emerald-400'>${formatUsd(remaining)}</dd>
					</div>
				</dl>
			</div>

			<p className='text-xs leading-relaxed text-gray-500'>
				Withdrawals are reviewed manually. You&apos;ll receive an email once your
				request is processed. Network fees may apply depending on the asset.
			</p>
		</div>
	);
}

function SuccessView({
	method,
	amount,
	wallet,
}: {
	method: WithdrawMethod;
	amount: number;
	wallet: string;
}) {
	return (
		<div className='flex flex-col items-center py-4 text-center'>
			<div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20'>
				<Check className='h-8 w-8 text-emerald-400' />
			</div>
			<h2 className='text-xl font-semibold text-white'>Request submitted</h2>
			<p className='mt-2 max-w-xs text-sm text-gray-400'>
				Your ${formatUsd(amount)} {method.name} withdrawal to{' '}
				<span className='font-mono text-gray-300'>{maskAddress(wallet)}</span>{' '}
				is pending review.
			</p>
			<div className='mt-6 w-full rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-left text-sm'>
				<p className='text-gray-400'>Estimated processing</p>
				<p className='mt-1 font-medium text-white'>{method.processingTime}</p>
			</div>
		</div>
	);
}
