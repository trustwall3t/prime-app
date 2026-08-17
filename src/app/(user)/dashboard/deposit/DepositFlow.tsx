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
	Copy,
	X,
} from 'lucide-react';
import { deposit } from '@/actions/deposit';
import { userInputClass, userPrimaryButtonClass, dashboardModalTitleClass, dashboardCardTitleClass } from '@/lib/userFormStyles';
import { cn } from '@/lib/utils';

type DepositMethod = {
	id: number;
	name: string;
	image: string;
	barcode: string;
	processingTime: string;
	minDeposit: string;
	maxDeposit: string;
	network: string;
	address: string;
	fee: string;
};

const DEPOSIT_METHODS: DepositMethod[] = [
	{
		id: 1,
		name: 'Bitcoin',
		image: '/dashboard/btc.svg',
		barcode: '/paymentBarcode/bitcoin.jpeg',
		processingTime: '10 – 20 minutes',
		minDeposit: '100',
		maxDeposit: '1000000',
		network: 'BTC',
		address: 'bc1qccwhk5v5tn9rd6xhkzt0mxcyhgv52je70prr3f',
		fee: '0.1%',
	},
	{
		id: 2,
		name: 'USDT',
		image: '/dashboard/usdt.svg',
		barcode: '/paymentBarcode/usdttrc20.jpeg',
		processingTime: '10 – 20 minutes',
		minDeposit: '100',
		maxDeposit: '1000000',
		network: 'TRC20',
		address: 'TKECE2g35FyNoxdZMM6pP6bHQjSp9n21CV',
		fee: '0.1%',
	},
	{
		id: 3,
		name: 'Ethereum',
		image: '/dashboard/eth.svg',
		barcode: '/paymentBarcode/eth.jpeg',
		processingTime: '10 – 20 minutes',
		minDeposit: '100',
		maxDeposit: '10000000',
		network: 'ETH',
		address: '0xD79c3B3dbc8aD0159C81e343e994E580997A716A',
		fee: '0.1%',
	},
	{
		id: 4,
		name: 'USDT',
		image: '/dashboard/usdt.svg',
		barcode: '/paymentBarcode/usdterc20.jpeg',
		processingTime: '10 – 20 minutes',
		minDeposit: '100',
		maxDeposit: '1000000',
		network: 'ERC20',
		address: '0xD79c3B3dbc8aD0159C81e343e994E580997A716A',
		fee: '0.1%',
	},
	{
		id: 5,
		name: 'Solana',
		image: '/dashboard/solana.png',
		barcode: '/paymentBarcode/solana.jpeg',
		processingTime: '10 – 20 minutes',
		minDeposit: '100',
		maxDeposit: '1000000',
		network: 'SOL',
		address: 'HMEszRxXxkyx3HsFRofvGjaeMDBKB1UYKrXH4jN2X8WH',
		fee: '0.1%',
	},
	{
		id: 6,
		name: 'XRP',
		image: '/dashboard/xrp.svg',
		barcode: '/paymentBarcode/usdttrc20.jpeg',
		processingTime: '10 – 20 minutes',
		minDeposit: '100',
		maxDeposit: '1000000',
		network: 'XRP',
		address: 'rGhTVESAPLLmrC8tXRRAainKkdVFhGTksH',
		fee: '0.1%',
	},
];

const STEP_LABELS = ['Select method', 'Enter amount', 'Send payment'];

function formatUsd(value: number) {
	return value.toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
}

export default function DepositFlow() {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [selectedMethod, setSelectedMethod] = useState<DepositMethod | null>(
		null,
	);
	const [amount, setAmount] = useState('');
	const [transactionHash, setTransactionHash] = useState('');
	const [copiedAddress, setCopiedAddress] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const numericAmount = parseFloat(amount) || 0;
	const minAmount = selectedMethod
		? parseFloat(selectedMethod.minDeposit)
		: 0;
	const maxAmount = selectedMethod
		? parseFloat(selectedMethod.maxDeposit)
		: 0;

	const amountError = useMemo(() => {
		if (!amount) return null;
		if (numericAmount <= 0) return 'Enter a valid amount';
		if (numericAmount < minAmount)
			return `Minimum deposit is $${selectedMethod?.minDeposit}`;
		if (numericAmount > maxAmount)
			return `Maximum deposit is $${selectedMethod?.maxDeposit}`;
		return null;
	}, [amount, numericAmount, minAmount, maxAmount, selectedMethod]);

	const canProceedStep2 = numericAmount > 0 && !amountError;
	const canSubmit =
		transactionHash.trim().length >= 8 && selectedMethod && canProceedStep2;

	const progress = submitted
		? 100
		: ((step - 1) / (STEP_LABELS.length - 1)) * 100;

	const handleSelectMethod = (method: DepositMethod) => {
		setSelectedMethod(method);
		setStep(2);
	};

	const handleBack = () => {
		if (step === 1) {
			router.push('/dashboard');
			return;
		}
		if (step === 2) {
			setSelectedMethod(null);
			setAmount('');
		}
		if (step === 3) {
			setTransactionHash('');
		}
		setStep((s) => s - 1);
	};

	const copyAddress = async (address: string) => {
		await navigator.clipboard.writeText(address);
		setCopiedAddress(true);
		toast.success('Address copied');
		setTimeout(() => setCopiedAddress(false), 2000);
	};

	const handleSubmit = async () => {
		if (!selectedMethod || !canSubmit) return;

		setIsSubmitting(true);
		try {
			const formData = new FormData();
			formData.append('amount', amount);
			formData.append('method', selectedMethod.name);

			const result = await deposit(formData);

			if (result.error) {
				toast.error(result.error);
				return;
			}

			setSubmitted(true);
			toast.success('Deposit request submitted successfully');
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
								<span className='text-indigo-400'>
									{STEP_LABELS[step - 1]}
								</span>
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
						/>
					) : step === 1 ? (
						<StepSelectMethod onSelect={handleSelectMethod} />
					) : step === 2 ? (
						<StepEnterAmount
							method={selectedMethod!}
							amount={amount}
							amountError={amountError}
							onAmountChange={setAmount}
						/>
					) : (
						<StepSendPayment
							method={selectedMethod!}
							amount={numericAmount}
							transactionHash={transactionHash}
							copiedAddress={copiedAddress}
							onTransactionHashChange={setTransactionHash}
							onCopyAddress={copyAddress}
						/>
					)}
				</div>

				{/* Footer */}
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
								Continue to payment
								<ArrowRight className='h-4 w-4' />
							</button>
						)}
						{step === 3 && (
							<button
								type='button'
								disabled={!canSubmit || isSubmitting}
								onClick={handleSubmit}
								className={cn(
									userPrimaryButtonClass,
									'flex items-center justify-center gap-2',
								)}
							>
								{isSubmitting ? 'Submitting…' : 'Submit deposit'}
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
	onSelect,
}: {
	onSelect: (method: DepositMethod) => void;
}) {
	return (
		<div className='space-y-5'>
			<div>
				<h2 className={dashboardModalTitleClass}>Deposit funds</h2>
				<p className='mt-1 text-sm text-gray-400'>
					Choose a cryptocurrency to fund your account.
				</p>
			</div>

			<div className='grid gap-3'>
				{DEPOSIT_METHODS.map((method) => (
					<button
						key={method.id}
						type='button'
						onClick={() => onSelect(method)}
						className='group flex items-center gap-4 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-left transition hover:border-indigo-500/50 hover:bg-zinc-900 active:scale-[0.99]'
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

function StepEnterAmount({
	method,
	amount,
	amountError,
	onAmountChange,
}: {
	method: DepositMethod;
	amount: string;
	amountError: string | null;
	onAmountChange: (v: string) => void;
}) {
	return (
		<div className='space-y-5'>
			<div className='flex items-center gap-3'>
				<div className='flex h-10 w-10 items-center justify-center rounded-full bg-zinc-800'>
					<Image src={method.image} alt={method.name} width={24} height={24} />
				</div>
				<div>
					<h2 className={dashboardCardTitleClass}>{method.name}</h2>
					<p className='text-xs text-gray-500'>{method.network}</p>
				</div>
			</div>

			<div className='rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm'>
				<div className='flex justify-between text-gray-400'>
					<span>Min</span>
					<span className='text-white'>${method.minDeposit}</span>
				</div>
				<div className='mt-1 flex justify-between text-gray-400'>
					<span>Max</span>
					<span className='text-white'>${method.maxDeposit}</span>
				</div>
				<div className='mt-1 flex items-center justify-between text-gray-400'>
					<span className='flex items-center gap-1'>
						<Clock className='h-3.5 w-3.5' />
						Processing
					</span>
					<span className='text-white'>{method.processingTime}</span>
				</div>
				<div className='mt-1 flex justify-between text-gray-400'>
					<span>Fee</span>
					<span className='text-white'>{method.fee}</span>
				</div>
			</div>

			<div className='space-y-2'>
				<label
					htmlFor='deposit-amount'
					className='text-sm font-medium text-gray-300'
				>
					Amount (USD)
				</label>
				<div className='relative'>
					<span className='pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500'>
						$
					</span>
					<input
						id='deposit-amount'
						type='number'
						min={0}
						step='0.01'
						value={amount}
						onChange={(e) => onAmountChange(e.target.value)}
						placeholder='0.00'
						className={cn(userInputClass, 'pl-8')}
					/>
				</div>
				{amountError && (
					<p className='text-xs text-red-400'>{amountError}</p>
				)}
			</div>
		</div>
	);
}

function StepSendPayment({
	method,
	amount,
	transactionHash,
	copiedAddress,
	onTransactionHashChange,
	onCopyAddress,
}: {
	method: DepositMethod;
	amount: number;
	transactionHash: string;
	copiedAddress: boolean;
	onTransactionHashChange: (v: string) => void;
	onCopyAddress: (address: string) => void;
}) {
	return (
		<div className='space-y-5'>
			<div>
				<h2 className={dashboardModalTitleClass}>Send payment</h2>
				<p className='mt-1 text-sm text-gray-400'>
					Transfer exactly{' '}
					<span className='font-medium text-white'>
						${formatUsd(amount)}
					</span>{' '}
					via {method.name} ({method.network}), then paste your transaction
					hash.
				</p>
			</div>

			<div className='flex justify-center'>
				<div className='overflow-hidden rounded-xl border border-zinc-800 bg-white p-2'>
					<Image
						src={method.barcode}
						alt={`${method.name} QR code`}
						width={180}
						height={180}
						className='rounded-lg'
					/>
				</div>
			</div>

			<div className='space-y-2'>
				<p className='text-sm font-medium text-gray-300'>Deposit address</p>
				<div className='rounded-xl border border-zinc-800 bg-zinc-900/60 p-3'>
					<p className='break-all font-mono text-xs text-white'>
						{method.address}
					</p>
				</div>
				<button
					type='button'
					onClick={() => onCopyAddress(method.address)}
					className='flex items-center gap-1.5 text-xs text-indigo-400 transition hover:text-indigo-300'
				>
					{copiedAddress ? (
						<>
							<Check className='h-3.5 w-3.5' />
							Copied!
						</>
					) : (
						<>
							<Copy className='h-3.5 w-3.5' />
							Copy address
						</>
					)}
				</button>
			</div>

			<div className='space-y-2'>
				<label
					htmlFor='deposit-tx-hash'
					className='text-sm font-medium text-gray-300'
				>
					Transaction hash
				</label>
				<input
					id='deposit-tx-hash'
					type='text'
					value={transactionHash}
					onChange={(e) => onTransactionHashChange(e.target.value)}
					placeholder='Paste your transaction hash'
					className={userInputClass}
				/>
				<p className='text-xs text-gray-500'>
					We&apos;ll verify your payment and credit your account once
					confirmed.
				</p>
			</div>
		</div>
	);
}

function SuccessView({
	method,
	amount,
}: {
	method: DepositMethod;
	amount: number;
}) {
	return (
		<div className='flex flex-col items-center py-4 text-center'>
			<div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20'>
				<Check className='h-8 w-8 text-emerald-400' />
			</div>
			<h2 className={dashboardModalTitleClass}>Deposit submitted</h2>
			<p className='mt-2 max-w-xs text-sm text-gray-400'>
				Your ${formatUsd(amount)} {method.name} deposit is pending
				confirmation. You&apos;ll receive an email once it&apos;s approved.
			</p>
			<div className='mt-6 w-full rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-left text-sm'>
				<p className='text-gray-400'>Estimated processing</p>
				<p className='mt-1 font-medium text-white'>{method.processingTime}</p>
			</div>
		</div>
	);
}
