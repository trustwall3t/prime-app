'use client';

import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { adminBtnClass } from '@/app/(admin)/components/admin-ui';

export default function CopyPassphraseButton({
	passphrase,
}: {
	passphrase: string;
}) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(passphrase);
			setCopied(true);
			toast.success('Passphrase copied to clipboard');
			setTimeout(() => setCopied(false), 2000);
		} catch {
			toast.error('Could not copy passphrase');
		}
	};

	return (
		<div className='flex max-w-xs items-start gap-2'>
			<span className='flex-1 break-all font-mono text-xs text-gray-400'>
				{passphrase}
			</span>
			<button
				type='button'
				onClick={handleCopy}
				title='Copy passphrase'
				className={adminBtnClass('secondary')}
			>
				{copied ? (
					<Check className='h-4 w-4 text-emerald-400' />
				) : (
					<Copy className='h-4 w-4' />
				)}
				Copy
			</button>
		</div>
	);
}
