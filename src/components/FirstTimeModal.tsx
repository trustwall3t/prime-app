'use client';

import React, { useEffect, useState } from 'react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	FirstTimeProfileSchema,
	FirstTimeProfileInput,
} from '../../schema/UserSchema';
import { submitFirstTimeProfile } from '@/actions/auth/firstTime';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import OptionSelect from '@/components/OptionSelect';
import { ACCOUNT_TYPES, INCOME_RANGES } from '@/lib/profileOptions';
import { useUser } from '@/lib/context/UserContext';

const inputClass =
	'h-11 bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-500/40';

const selectTriggerClass = `${inputClass} w-full`;
const selectContentClass = 'border-zinc-700 bg-zinc-900 text-white';

export default function FirstTimeModal() {
	const router = useRouter();
	const { user } = useUser();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<FirstTimeProfileInput>({
		resolver: zodResolver(FirstTimeProfileSchema),
		mode: 'onTouched',
		defaultValues: {
			address: '',
			AccountType: '',
			yearlyIncomeRange: '',
			referralCode: '',
		},
	});

	useEffect(() => {
		const savedRef =
			localStorage.getItem('pm_refcode') ||
			document.cookie
				.split('; ')
				.find((row) => row.startsWith('pm_refcode='))
				?.split('=')[1];

		if (savedRef) {
			form.setValue(
				'referralCode',
				decodeURIComponent(savedRef).trim().toUpperCase(),
			);
		}
	}, [form]);

	const finish = async (data: FirstTimeProfileInput) => {
		setIsSubmitting(true);
		try {
			const result = await submitFirstTimeProfile(data);
			if (result.error) {
				toast.error(result.error, { position: 'top-center' });
			} else {
				localStorage.removeItem('pm_refcode');
				document.cookie = 'pm_refcode=; path=/; max-age=0';
				toast.success('Profile complete — welcome!', {
					position: 'top-center',
				});
				router.refresh();
			}
		} catch {
			toast.error('Something went wrong. Please try again.', {
				position: 'top-center',
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<Dialog open onOpenChange={() => {}}>
			<DialogContent
				className='gap-0 overflow-hidden border-zinc-800 bg-zinc-950 p-0 sm:max-w-[440px] [&>button.absolute]:hidden'
			>
				<div className='px-6 pt-6 pb-4'>
					<DialogTitle className='text-lg font-semibold text-white'>
						{user?.name
							? `Welcome, ${user.name}`
							: 'Complete your profile'}
					</DialogTitle>
					<DialogDescription className='mt-1 text-sm text-zinc-400'>
						We already have your name from registration. Add your
						address and any optional account details to get started.
					</DialogDescription>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(finish)}
						className='px-6 pb-6'
						autoComplete='off'
						noValidate
					>
						<div className='space-y-4'>
							<FormField
								control={form.control}
								name='address'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-zinc-300 text-xs font-medium'>
											Address
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='Street, city'
												autoComplete='street-address'
												className={inputClass}
											/>
										</FormControl>
										<FormMessage className='text-red-400 text-xs' />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='AccountType'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-zinc-300 text-xs font-medium'>
											Account type
										</FormLabel>
										<FormControl>
											<OptionSelect
												value={field.value}
												onChange={field.onChange}
												options={ACCOUNT_TYPES}
												placeholder='Select account type'
												triggerClassName={selectTriggerClass}
												contentClassName={selectContentClass}
												aria-label='Account type'
											/>
										</FormControl>
										<FormMessage className='text-red-400 text-xs' />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='yearlyIncomeRange'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-zinc-300 text-xs font-medium'>
											Income range
										</FormLabel>
										<FormControl>
											<OptionSelect
												value={field.value}
												onChange={field.onChange}
												options={INCOME_RANGES}
												placeholder='Select income range'
												triggerClassName={selectTriggerClass}
												contentClassName={selectContentClass}
												aria-label='Income range'
											/>
										</FormControl>
										<FormMessage className='text-red-400 text-xs' />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='referralCode'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-zinc-300 text-xs font-medium'>
											Referral code
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='PM-XXXXXXXX'
												className={`${inputClass} font-mono uppercase tracking-wide`}
												onChange={(e) =>
													field.onChange(
														e.target.value.toUpperCase(),
													)
												}
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<div className='mt-6 flex justify-end'>
							<button
								type='submit'
								disabled={isSubmitting}
								className='min-w-[120px] inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition disabled:opacity-50'
							>
								{isSubmitting ? (
									<>
										<Loader2 className='h-4 w-4 animate-spin' />
										Saving…
									</>
								) : (
									'Finish'
								)}
							</button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
