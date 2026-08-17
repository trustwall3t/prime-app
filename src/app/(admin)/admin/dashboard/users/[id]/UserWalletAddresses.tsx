'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { adminBtnClass } from '@/app/(admin)/components/admin-ui';

function WalletAddressRow({
	label,
	address,
}: {
	label: string;
	address: string | null;
}) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		if (!address) return;
		try {
			await navigator.clipboard.writeText(address);
			setCopied(true);
			toast.success(`${label} address copied`);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error('Could not copy address');
		}
	};

	return (
		<div className='rounded-md border border-zinc-800 bg-zinc-950 px-4 py-3'>
			<div className='mb-2 flex items-center justify-between gap-3'>
				<p className='text-xs font-medium uppercase tracking-wide text-gray-500'>
					{label}
				</p>
				{address && (
					<button
						type='button'
						onClick={handleCopy}
						className={adminBtnClass('secondary')}
					>
						{copied ? (
							<Check className='h-4 w-4 text-emerald-400' />
						) : (
							<Copy className='h-4 w-4' />
						)}
						Copy
					</button>
				)}
			</div>
			<p className='break-all font-mono text-sm text-white'>
				{address || 'Not provided'}
			</p>
		</div>
	);
}

export default function UserWalletAddresses({
	btcAddress,
	ethAddress,
	usdtAddress,
}: {
	btcAddress: string | null;
	ethAddress: string | null;
	usdtAddress: string | null;
}) {
	return (
		<div className='space-y-3'>
			<div>
				<h2 className='text-lg font-semibold text-white'>
					Wallet addresses
				</h2>
				<p className='text-sm text-gray-400'>
					Crypto withdrawal addresses saved on the user profile.
				</p>
			</div>
			<WalletAddressRow label='Bitcoin (BTC)' address={btcAddress} />
			<WalletAddressRow label='Ethereum (ETH)' address={ethAddress} />
			<WalletAddressRow label='Tether (USDT)' address={usdtAddress} />
		</div>
	);
}
