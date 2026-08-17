'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { setUpWallet } from '@/actions/settings';
import { useUser } from '@/lib/context/UserContext';
import { WalletSchema } from '../../../../../../schema/walletSchema';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import {
	userFormCardClass,
	userInputClass,
	userLabelClass,
	userPrimaryButtonClass,
	userSecondaryButtonClass,
} from '@/lib/userFormStyles';

const WithdrawalInformationForm = () => {
	const { user } = useUser();
	const [isPending, startTransition] = useTransition();
	const [copiedField, setCopiedField] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<z.infer<typeof WalletSchema>>({
		resolver: zodResolver(WalletSchema),
		defaultValues: {
			id: user?.id,
			BtcAddress: user?.btcAddress ?? '',
			UsdtAddress: user?.usdtAddress ?? '',
			EthAddress: user?.ethAddress ?? '',
		},
	});

	const btcAddress = watch('BtcAddress');
	const usdtAddress = watch('UsdtAddress');
	const ethAddress = watch('EthAddress');

	const onSubmit = async (data: z.infer<typeof WalletSchema>) => {
		startTransition(async () => {
			const res = await setUpWallet(data);
			if (res.error) {
				toast.error(res.error, { position: 'top-center' });
			} else {
				toast.success(res.success, { position: 'top-center' });
			}
		});
	};

	const handleCopy = (text: string, fieldName: string) => {
		if (!text) return;
		navigator.clipboard.writeText(text);
		setCopiedField(fieldName);
		setTimeout(() => setCopiedField(null), 2000);
		toast.success('Copied to clipboard');
	};

	const renderError = (fieldName: keyof z.infer<typeof WalletSchema>) => {
		const error = errors[fieldName];
		if (!error) return null;
		return (
			<p className='mt-1 text-sm text-red-400'>
				{error.message as string}
			</p>
		);
	};

	const WalletAddressField = ({
		label,
		name,
		placeholder,
		value,
	}: {
		label: string;
		name: keyof z.infer<typeof WalletSchema>;
		placeholder: string;
		value: string;
	}) => (
		<div>
			<label className={`${userLabelClass} mb-2 block`}>
				{label}
				<span className='text-red-400'> *</span>
			</label>
			<div className='relative'>
				<input
					type='text'
					{...register(name)}
					placeholder={placeholder}
					className={`${userInputClass} pr-12 font-mono`}
				/>
				{value ? (
					<button
						type='button'
						onClick={() => handleCopy(value, name)}
						className='absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-400 transition hover:text-white'
						title='Copy address'
					>
						{copiedField === name ? (
							<Check className='h-4 w-4 text-emerald-400' />
						) : (
							<Copy className='h-4 w-4' />
						)}
					</button>
				) : null}
			</div>
			{renderError(name)}
		</div>
	);

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className={`${userFormCardClass} max-w-2xl space-y-6`}
		>
			<WalletAddressField
				label='Bitcoin wallet address'
				name='BtcAddress'
				placeholder='e.g., bc1qa850598ff5vywc2dhxn6rfkk5j3eeh5ym327n6'
				value={btcAddress ?? ''}
			/>

			<WalletAddressField
				label='USDT wallet address'
				name='UsdtAddress'
				placeholder='e.g., TWcZ6D7x7Cj5V2r1CuERamfAc7y2Wc2C1m'
				value={usdtAddress ?? ''}
			/>

			<WalletAddressField
				label='Ethereum wallet address'
				name='EthAddress'
				placeholder='e.g., 0x45919D224cA7cDb314Cd8870F0bFB6645c846d22'
				value={ethAddress ?? ''}
			/>

			<div className='rounded-md border border-indigo-500/30 bg-indigo-500/10 p-4'>
				<p className='text-sm text-indigo-200'>
					<strong className='font-semibold text-indigo-100'>
						Important:
					</strong>{' '}
					Make sure all wallet addresses are correct. Withdrawals sent
					to incorrect addresses cannot be recovered.
				</p>
			</div>

			<div className='flex flex-wrap gap-3 pt-2'>
				<button
					type='submit'
					disabled={isPending}
					className={`${userPrimaryButtonClass} w-auto px-8`}
				>
					{isPending
						? 'Updating...'
						: 'Update withdrawal information'}
				</button>
				<button
					type='button'
					onClick={() => window.history.back()}
					className={userSecondaryButtonClass}
				>
					Cancel
				</button>
			</div>
		</form>
	);
};

export default WithdrawalInformationForm;
