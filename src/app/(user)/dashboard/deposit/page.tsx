'use client';
import React from 'react';
import { useState, useTransition } from 'react';
import Image from 'next/image';
import { ChevronLeft, Copy, Check, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { deposit } from '@/actions/deposit';
import { toast } from 'sonner';
import { depositSchema } from '../../../../../schema/depositSchema';
import { useRouter } from 'next/navigation';

interface DepositMethod {
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
	description: string;
}

// Extend schema to include transaction hash
const extendedDepositSchema = depositSchema.extend({
	transactionHash: z.string().min(1, 'Transaction hash is required'),
});

type ExtendedDepositFormData = z.infer<typeof extendedDepositSchema>;

const DepositFlow = () => {
	const [step, setStep] = useState(1);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		null,
	);
	const [selectedMethod, setSelectedMethod] = useState<DepositMethod | null>(
		null,
	);
	const [copiedAddress, setCopiedAddress] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [expiryTime, setExpiryTime] = useState<Date | null>(null);
	const [timeRemaining, setTimeRemaining] = useState<string>('2:00:00');

	// Set expiry time when reaching step 4 and countdown timer
	React.useEffect(() => {
		if (step === 4 && !expiryTime) {
			const now = new Date();
			const expiry = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
			setExpiryTime(expiry);
		}
	}, [step, expiryTime]);

	// Countdown timer
	React.useEffect(() => {
		if (step !== 4 || !expiryTime) return;

		const interval = setInterval(() => {
			const now = new Date();
			const diff = expiryTime.getTime() - now.getTime();

			if (diff <= 0) {
				setTimeRemaining('Expired');
				clearInterval(interval);
				return;
			}

			const hours = Math.floor(diff / (1000 * 60 * 60));
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((diff % (1000 * 60)) / 1000);

			setTimeRemaining(
				`${hours}:${minutes.toString().padStart(2, '0')}:${seconds
					.toString()
					.padStart(2, '0')}`,
			);
		}, 1000);

		return () => clearInterval(interval);
	}, [step, expiryTime]);

	const form = useForm<ExtendedDepositFormData>({
		resolver: zodResolver(extendedDepositSchema),
		defaultValues: {
			amount: '',
			method: '',
			transactionHash: '',
		},
	});
	const router = useRouter();
 const onClose = () => {
	router.back() 
 }
	const depositMethods: DepositMethod[] = [
		{
			id: 1,
			name: 'Bitcoin',
			image: '/dashboard/btc.svg',
			barcode: '/paymentBarcode/bitcoin.jpeg',
			processingTime: '10 - 20 minutes',
			minDeposit: '100',
			maxDeposit: '1000',
			network: 'BTC',
			address: 'bc1qa850598ff5vywc2dhxn6rfkk5j3eeh5ym327n6',
			fee: '0.1%',
			description:
				'Bitcoin is a digital currency that is decentralized and allows users to send and receive payments without intermediaries.',
		},
		{
			id: 2,
			name: 'USDT',
			image: '/dashboard/usdt.svg',
			barcode: '/paymentBarcode/usdttrc20.jpeg',
			processingTime: '10 - 20 minutes',
			minDeposit: '100',
			maxDeposit: '1000',
			network: 'TRC20',
			address: 'TWcZ6D7x7Cj5V2r1CuERamfAc7y2Wc2C1m',
			fee: '0.1%',
			description:
				'USDT on TRON network offers fast and low-cost transactions.',
		},
		{
			id: 3,
			name: 'Ethereum',
			image: '/dashboard/eth.svg',
			barcode: '/paymentBarcode/eth.jpeg',
			processingTime: '10 - 20 minutes',
			minDeposit: '100',
			maxDeposit: '100000',
			network: 'ETH',
			address: '0x45919D224cA7cDb314Cd8870F0bFB6645c846d22',
			fee: '0.1%',
			description:
				'Ethereum is a blockchain-based platform that allows users to create and manage decentralized applications.',
		},
		{
			id: 4,
			name: 'USDT',
			image: '/dashboard/usdt.svg',
			barcode: '/paymentBarcode/usdterc20.jpeg',
			processingTime: '10 - 20 minutes',
			minDeposit: '100',
			maxDeposit: '1000',
			network: 'ERC20',
			address: '0x45919D224cA7cDb314Cd8870F0bFB6645c846d22',
			fee: '0.1%',
			description: 'USDT on Ethereum network.',
		},
		{
			id: 5,
			name: 'Solana',
			image: '/dashboard/solana.png',
			barcode: '/paymentBarcode/solana.jpeg',
			processingTime: '10 - 20 minutes',
			minDeposit: '100',
			maxDeposit: '1000',
			network: 'SOL',
			address: 'EjsfkSqYTUdu4a8fU11HRWpxTkSLiLtuTAc5Qyf4zgC3',
			fee: '0.1%',
			description:
				'Solana is a blockchain-based platform that allows users to create and manage decentralized applications.',
		},
		{
			id: 6,
			name: 'USDT',
			image: '/dashboard/usdt.svg',
			barcode: '/paymentBarcode/usdttrc20.jpeg',
			processingTime: '10 - 20 minutes',
			minDeposit: '100',
			maxDeposit: '1000',
			network: 'BEP-20',
			address: 'TWcZ6D7x7Cj5V2r1CuERamfAc7y2Wc2C1m',
			fee: '0.1%',
			description: 'USDT on Binance Smart Chain.',
		},
	];
	const depositCategories = [{ id: 1, name: 'Cryptocurrency', icon: '💰' }];

	const handleBack = () => {
		if (step > 1) {
			if (step === 2) {
				setSelectedCategory(null);
			} else if (step === 3) {
				setSelectedMethod(null);
				form.reset();
			} else if (step === 4) {
				setSelectedMethod(null);
				setExpiryTime(null); // Reset expiry timer
				form.reset();
			}
			setStep(step - 1);
		} else {
			onClose();
		}
	};

	const handleCategorySelect = (category: string) => {
		setSelectedCategory(category);
		setStep(2);
	};

	const handleMethodSelect = (method: DepositMethod) => {
		setSelectedMethod(method);
		form.setValue('method', method.name);
		setStep(3);
	};

	const copyToClipboard = async (text: string) => {
		await navigator.clipboard.writeText(text);
		setCopiedAddress(true);
		setTimeout(() => setCopiedAddress(false), 2000);
	};

	const onAmountSubmit = async (data: ExtendedDepositFormData) => {
		// Just move to next step, don't call server action yet
		setStep(4);
	};

	const onFinalSubmit = async (data: ExtendedDepositFormData) => {
		try {
			const formData = new FormData();
			formData.append('amount', data.amount);
			formData.append('method', data.method);
			formData.append('transactionHash', data.transactionHash);

			startTransition(async () => {
				try {
					const res = await deposit(formData);
					if (res.success) {
						toast.success(res.success, {
							position: 'top-center',
						});
						// Reset and close
						form.reset();
						setStep(1);
						setSelectedCategory(null);
						setSelectedMethod(null);
						setExpiryTime(null); // Reset expiry timer
						onClose();
					} else {
						toast.error(res.error, {
							position: 'top-center',
						});
					}
				} catch (error) {
					console.error('Error in deposit action:', error);
					toast.error(
						'An error occurred while processing your deposit',
						{
							position: 'top-center',
						},
					);
				}
			});
		} catch (error) {
			console.error('Error in form submission:', error);
			toast.error('An error occurred while submitting the form', {
				position: 'top-center',
			});
		}
	};

	const handleFormSubmit = (step: number) => async (e: React.FormEvent) => {
		e.preventDefault();

		if (step === 3) {
			// Only validate amount field
			const isValid = await form.trigger(['amount', 'method']);
			if (isValid) {
				const data = form.getValues();
				await onAmountSubmit(data);
			}
		} else if (step === 4) {
			// Validate all fields including transaction hash
			const isValid = await form.trigger();
			if (isValid) {
				const data = form.getValues();
				await onFinalSubmit(data);
			}
		}
	};

	return (
		<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
			<div className='bg-black border border-zinc-700 w-full max-w-md max-h-[90vh] rounded-lg overflow-hidden flex flex-col'>
				{/* Header */}
				<div className='flex items-center justify-between p-4 border-b border-zinc-700'>
					<button
						onClick={handleBack}
						className='text-white hover:text-gray-300 transition'
					>
						<ChevronLeft className='w-6 h-6' />
					</button>
					<span className='text-gray-400 text-sm'>
						{step === 1 && 'Step 1 / 3'}
						{step === 2 && 'Step 2 / 3'}
						{step === 3 && 'Step 3 / 3'}
						{step === 4 && 'Complete your deposit'}
					</span>
					<button
						onClick={onClose}
						className='text-gray-400 hover:text-gray-200 transition'
					>
						<X className='w-6 h-6' />
					</button>
				</div>

				{/* Content */}
				<div className='flex-1 overflow-y-auto p-6'>
					{/* Step 1: Choose Category */}
					{step === 1 && (
						<div>
							<h2 className='text-white text-2xl font-semibold mb-2'>
								Deposit
							</h2>
							<p className='text-gray-400 text-sm mb-8'>
								Choose how you want to fund your account.
							</p>
							<div className='space-y-3'>
								{depositCategories.map((category) => (
									<button
										key={category.id}
										onClick={() =>
											handleCategorySelect(category.name)
										}
										className='w-full p-4 rounded-lg border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:border-blue-500/50 transition flex items-center gap-3'
									>
										<span className='text-2xl'>
											{category.icon}
										</span>
										<span className='text-white font-medium'>
											{category.name}
										</span>
									</button>
								))}
							</div>
						</div>
					)}

					{/* Step 2: Select Method */}
					{step === 2 && (
						<div>
							<h2 className='text-white text-2xl font-semibold mb-2'>
								Select method
							</h2>
							<div className='space-y-3 mt-6'>
								{depositMethods.map((method) => (
									<button
										key={method.id}
										onClick={() =>
											handleMethodSelect(method)
										}
										className='w-full p-4 rounded-lg border border-zinc-700 bg-zinc-800/50 hover:bg-zinc-800 hover:border-blue-500/50 transition flex items-center gap-3'
									>
										<div className='relative w-12 h-12 rounded-full bg-zinc-700 flex items-center justify-center flex-shrink-0'>
											<Image
												src={method.image}
												alt={method.name}
												width={30}
												height={30}
												className='rounded-full'
											/>
										</div>
										<div className='flex-1 text-left'>
											<p className='text-white font-medium'>
												{method.name}
											</p>
											<p className='text-gray-400 text-sm'>
												{method.network}
											</p>
										</div>
									</button>
								))}
							</div>
						</div>
					)}

					{/* Step 3: Enter Amount */}
					{step === 3 && selectedMethod && (
						<form
							onSubmit={handleFormSubmit(3)}
							className='space-y-4'
						>
							<h2 className='text-white text-2xl font-semibold mb-2'>
								Amount
							</h2>
							<p className='text-gray-400 text-sm mb-6'>
								Enter the amount you want to deposit.
							</p>

							<div>
								<label className='block text-white font-semibold mb-2 text-base'>
									Amount to credit (USD)
								</label>
								<input
									type='text'
									placeholder='0.00'
									{...form.register('amount')}
									className='w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
								/>
								{form.formState.errors.amount && (
									<div className='flex items-center gap-2 mt-2 text-red-400 text-sm'>
										<AlertCircle className='w-4 h-4' />
										<span>
											{
												form.formState.errors.amount
													.message
											}
										</span>
									</div>
								)}
								<p className='text-gray-400 text-sm mt-2'>
									Min: ${selectedMethod.minDeposit} - Max: $
									{selectedMethod.maxDeposit}
								</p>
							</div>

							<div className='pt-4 space-y-2 bg-zinc-800/50 p-4 rounded-lg'>
								<div className='flex justify-between text-sm'>
									<span className='text-gray-400'>
										Processing Time:
									</span>
									<span className='text-white'>
										{selectedMethod.processingTime}
									</span>
								</div>
								<div className='flex justify-between text-sm'>
									<span className='text-gray-400'>
										Network:
									</span>
									<span className='text-white'>
										{selectedMethod.network}
									</span>
								</div>
								<div className='flex justify-between text-sm'>
									<span className='text-gray-400'>Fee:</span>
									<span className='text-white'>
										{selectedMethod.fee}
									</span>
								</div>
							</div>

							<input
								type='hidden'
								{...form.register('method')}
								value={selectedMethod.name}
							/>

							<div className='flex gap-3 pt-4'>
								<button
									type='button'
									onClick={handleBack}
									className='flex-1 p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition'
								>
									Back
								</button>
								<button
									type='submit'
									className='flex-1 p-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition'
								>
									Continue
								</button>
							</div>
						</form>
					)}

					{/* Step 4: Complete Deposit with Transaction Hash */}
					{step === 4 && selectedMethod && (
						<form
							onSubmit={handleFormSubmit(4)}
							className='space-y-6'
						>
							{/* Loading Overlay */}
							{isPending && (
								<div className='fixed inset-0 bg-black/80 flex items-center justify-center z-[100] rounded-lg'>
									<div className='flex flex-col items-center gap-4'>
										<div className='relative w-16 h-16'>
											<svg
												className='absolute inset-0 w-full h-full'
												viewBox='0 0 100 100'
												xmlns='http://www.w3.org/2000/svg'
											>
												<circle
													cx='50'
													cy='50'
													r='45'
													fill='none'
													stroke='#3b82f6'
													strokeWidth='3'
													strokeDasharray='141 282'
													opacity='0.3'
												/>
												<circle
													cx='50'
													cy='50'
													r='45'
													fill='none'
													stroke='#3b82f6'
													strokeWidth='3'
													strokeDasharray='141 282'
													style={{
														animation:
															'spin 2s linear infinite',
														transformOrigin:
															'50% 50%',
													}}
												/>
											</svg>
										</div>
										<p className='text-white font-semibold'>
											Processing your deposit...
										</p>
										<p className='text-gray-400 text-sm'>
											Please wait while we verify your
											transaction
										</p>
									</div>
									<style>{`
										@keyframes spin {
											from { transform: rotate(0deg); }
											to { transform: rotate(360deg); }
										}
									`}</style>
								</div>
							)}

							<div className='flex items-center justify-between'>
								<h2 className='text-white text-2xl font-semibold mb-1'>
									Complete your deposit
								</h2>
								<span className='bg-yellow-600/50 text-yellow-200 px-3 py-1 rounded-sm text-sm font-medium inline-block'>
									Pay-in active
								</span>
							</div>

							{/* Amount Display */}
							<div className='text-center'>
								<p className='text-gray-400 text-sm mb-2'>
									Amount to deposit
								</p>
								<p className='text-white text-3xl font-semibold'>
									$
									{parseFloat(
										form.watch('amount') || '0',
									).toFixed(2)}
								</p>
							</div>

							{/* QR Code */}
							<div className='flex justify-center'>
								<Image
									src={selectedMethod.barcode}
									alt={selectedMethod.name}
									width={200}
									height={200}
									className='rounded-lg border border-zinc-700'
								/>
							</div>

							{/* Address */}
							<div>
								<p className='text-gray-400 text-sm mb-2'>
									Send to address
								</p>
								<div className='bg-zinc-800 rounded-lg p-4 border border-zinc-700'>
									<p className='text-white text-sm break-all font-mono'>
										{selectedMethod.address}
									</p>
								</div>
								<button
									type='button'
									onClick={() =>
										copyToClipboard(selectedMethod.address)
									}
									className='text-blue-400 hover:text-blue-300 text-sm mt-2 flex items-center gap-1 transition'
								>
									{copiedAddress ? (
										<>
											<Check className='w-4 h-4' />
											Copied!
										</>
									) : (
										<>
											<Copy className='w-4 h-4' />
											Copy address
										</>
									)}
								</button>
							</div>

							{/* Transaction Hash */}
							<div>
								<label className='block text-white font-semibold mb-2'>
									Transaction hash
								</label>
								<input
									type='text'
									placeholder='Paste your transaction hash here'
									{...form.register('transactionHash')}
									className='w-full p-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
								/>
								{form.formState.errors.transactionHash && (
									<div className='flex items-center gap-2 mt-2 text-red-400 text-sm'>
										<AlertCircle className='w-4 h-4' />
										<span>
											{
												form.formState.errors
													.transactionHash.message
											}
										</span>
									</div>
								)}
							</div>

							{/* Expires */}
							<div className='space-y-2 text-center'>
								<div
									className={`text-2xl font-bold font-mono ${
										timeRemaining === 'Expired'
											? 'text-red-400'
											: 'text-blue-400'
									}`}
								>
									{timeRemaining}
								</div>
								<p className='text-gray-500 text-sm'>
									Expires: {expiryTime?.toLocaleString()}
								</p>
								{timeRemaining !== 'Expired' && (
									<p className='text-yellow-600 text-xs'>
										⏰ Complete payment before time runs out
									</p>
								)}
								{timeRemaining === 'Expired' && (
									<p className='text-red-500 text-sm font-semibold'>
										⚠️ This transaction has expired. Please
										start a new deposit.
									</p>
								)}
							</div>

							<div className='flex gap-3 pt-4'>
								<button
									type='button'
									onClick={handleBack}
									disabled={
										isPending || timeRemaining === 'Expired'
									}
									className='flex-1 p-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed'
								>
									Back
								</button>
								<button
									type='submit'
									disabled={
										isPending || timeRemaining === 'Expired'
									}
									className='flex-1 p-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition disabled:bg-zinc-700 disabled:cursor-not-allowed flex items-center justify-center gap-2'
								>
									{timeRemaining === 'Expired' ? (
										'Expired'
									) : isPending ? (
										<>
											<svg
												className='w-4 h-4 animate-spin'
												xmlns='http://www.w3.org/2000/svg'
												fill='none'
												viewBox='0 0 24 24'
											>
												<circle
													className='opacity-25'
													cx='12'
													cy='12'
													r='10'
													stroke='currentColor'
													strokeWidth='4'
												></circle>
												<path
													className='opacity-75'
													fill='currentColor'
													d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
												></path>
											</svg>
											Submitting...
										</>
									) : (
										'Submit'
									)}
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
};

const X = ({ className }: { className: string }) => (
	<svg
		className={className}
		fill='none'
		stroke='currentColor'
		viewBox='0 0 24 24'
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth={2}
			d='M6 18L18 6M6 6l12 12'
		/>
	</svg>
);

export default DepositFlow;
