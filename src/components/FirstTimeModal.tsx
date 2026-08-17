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
import { ChevronLeft, Loader2 } from 'lucide-react';

const TOTAL_STEPS = 2;

const STEP_META = [
	{
		title: 'About you',
		description: 'Just the basics to get your account ready.',
	},
	{
		title: 'Almost done',
		description: 'Optional details — skip anything you don’t have yet.',
	},
] as const;

const STEP_ONE_FIELDS = [
	'firstName',
	'lastName',
	'address',
	'country',
] as const satisfies readonly (keyof FirstTimeProfileInput)[];

const inputClass =
	'h-11 bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 focus-visible:ring-indigo-500/40';

export default function FirstTimeModal() {
	const router = useRouter();
	const [step, setStep] = useState(1);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [slideIn, setSlideIn] = useState(true);

	const form = useForm<FirstTimeProfileInput>({
		resolver: zodResolver(FirstTimeProfileSchema),
		mode: 'onTouched',
		defaultValues: {
			firstName: '',
			lastName: '',
			address: '',
			country: '',
			AccountType: '',
			yearlyIncomeRange: '',
			btcAddress: '',
			ethAddress: '',
			usdtAddress: '',
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

	const progress = (step / TOTAL_STEPS) * 100;
	const meta = STEP_META[step - 1];

	const animateStep = (next: number) => {
		setSlideIn(false);
		window.setTimeout(() => {
			setStep(next);
			setSlideIn(true);
		}, 150);
	};

	const goBack = () => {
		if (step > 1) animateStep(step - 1);
	};

	const goNext = async () => {
		const valid = await form.trigger([...STEP_ONE_FIELDS]);
		if (!valid) return;
		animateStep(2);
	};

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

	const skipOptional = () => {
		form.handleSubmit(finish)();
	};

	return (
		<Dialog open onOpenChange={() => {}}>
			<DialogContent
				className='gap-0 overflow-hidden border-zinc-800 bg-zinc-950 p-0 sm:max-w-[440px] [&>button.absolute]:hidden'
			>
				<div className='px-6 pt-6 pb-4'>
					<div className='mb-5 h-1 w-full overflow-hidden rounded-full bg-zinc-800'>
						<div
							className='h-full rounded-full bg-indigo-500 transition-all duration-500 ease-out'
							style={{ width: `${progress}%` }}
						/>
					</div>

					<DialogTitle className='text-lg font-semibold text-white'>
						{meta.title}
					</DialogTitle>
					<DialogDescription className='mt-1 text-sm text-zinc-400'>
						{meta.description}
					</DialogDescription>
					<p className='mt-2 text-xs text-zinc-500'>
						Step {step} of {TOTAL_STEPS}
					</p>
				</div>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(finish)}
						className='px-6 pb-6'
						autoComplete='off'
						noValidate
					>
						<div
							className={`space-y-4 transition-all duration-300 ease-out ${
								slideIn
									? 'translate-x-0 opacity-100'
									: 'translate-x-3 opacity-0'
							}`}
						>
							{step === 1 ? (
								<>
									<div className='grid grid-cols-2 gap-3'>
										<FormField
											control={form.control}
											name='firstName'
											render={({ field }) => (
												<FormItem className='col-span-2 sm:col-span-1'>
													<FormLabel className='text-zinc-300 text-xs font-medium'>
														First name
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															placeholder='John'
															autoComplete='given-name'
															className={inputClass}
														/>
													</FormControl>
													<FormMessage className='text-red-400 text-xs' />
												</FormItem>
											)}
										/>
										<FormField
											control={form.control}
											name='lastName'
											render={({ field }) => (
												<FormItem className='col-span-2 sm:col-span-1'>
													<FormLabel className='text-zinc-300 text-xs font-medium'>
														Last name
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															placeholder='Doe'
															autoComplete='family-name'
															className={inputClass}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
									</div>

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
										name='country'
										render={({ field }) => (
											<FormItem>
												<FormLabel className='text-zinc-300 text-xs font-medium'>
													Country
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder='United States'
														autoComplete='country-name'
														className={inputClass}
													/>
												</FormControl>
												<FormMessage className='text-red-400 text-xs' />
											</FormItem>
										)}
									/>
								</>
							) : (
								<>
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

									<div className='grid grid-cols-2 gap-3'>
										<FormField
											control={form.control}
											name='AccountType'
											render={({ field }) => (
												<FormItem>
													<FormLabel className='text-zinc-300 text-xs font-medium'>
														Account type
													</FormLabel>
													<FormControl>
														<Input
															{...field}
															placeholder='Individual'
															className={inputClass}
														/>
													</FormControl>
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
														<Input
															{...field}
															placeholder='$50k–$100k'
															className={inputClass}
														/>
													</FormControl>
												</FormItem>
											)}
										/>
									</div>

									<FormField
										control={form.control}
										name='btcAddress'
										render={({ field }) => (
											<FormItem>
												<FormLabel className='text-zinc-300 text-xs font-medium'>
													Bitcoin address
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder='Optional'
														className={inputClass}
													/>
												</FormControl>
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name='ethAddress'
										render={({ field }) => (
											<FormItem>
												<FormLabel className='text-zinc-300 text-xs font-medium'>
													Ethereum address
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder='Optional'
														className={inputClass}
													/>
												</FormControl>
											</FormItem>
										)}
									/>
								</>
							)}
						</div>

						<div className='mt-6 flex items-center gap-3'>
							{step > 1 ? (
								<button
									type='button'
									onClick={goBack}
									disabled={isSubmitting}
									className='inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition disabled:opacity-50'
								>
									<ChevronLeft className='h-4 w-4' />
									Back
								</button>
							) : (
								<span />
							)}

							<div className='ml-auto flex items-center gap-2'>
								{step === 2 && (
									<button
										type='button'
										onClick={skipOptional}
										disabled={isSubmitting}
										className='rounded-lg px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-white transition disabled:opacity-50'
									>
										Skip
									</button>
								)}

								{step === 1 ? (
									<button
										type='button'
										onClick={goNext}
										className='min-w-[120px] rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition'
									>
										Continue
									</button>
								) : (
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
								)}
							</div>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
