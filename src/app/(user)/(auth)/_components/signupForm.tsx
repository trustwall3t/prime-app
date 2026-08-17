'use client';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormDescription,
} from '@/components/ui/form';
import { UserRegisterSchema } from '../../../../../schema/UserSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useTransition, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { signup } from '@/actions/auth/signup';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

export const SignupForm = () => {
	const [isPending, startTransition] = useTransition();
	const searchParams = useSearchParams();

	useEffect(() => {
		const ref = searchParams.get('ref');
		if (ref) {
			const normalized = ref.trim().toUpperCase();
			localStorage.setItem('pm_refcode', normalized);
		}
	}, [searchParams]);

	const getReferralCodeForSignup = () => {
		const fromUrl = searchParams.get('ref');
		if (fromUrl) return fromUrl.trim().toUpperCase();
		if (typeof window !== 'undefined') {
			return localStorage.getItem('pm_refcode')?.trim().toUpperCase();
		}
		return undefined;
	};

	const form = useForm<z.infer<typeof UserRegisterSchema>>({
		resolver: zodResolver(UserRegisterSchema),
		defaultValues: {
			email: '',
			password: '',
			confirmPassword: '',
			fullName: '',
			phoneNumber: '',
			country: '',
			agreement: false,
		},
	});

	const onSubmit = async (data: z.infer<typeof UserRegisterSchema>) => {
		startTransition(async () => {
			const res = await signup({
				...data,
				referralCode: getReferralCodeForSignup(),
			});
			if (res.error) {
				toast.error(res.error, { position: 'top-center' });
			} else {
				toast.success(
					'Account created successfully, please verify your email',
					{
						position: 'top-center',
					},
				);
			}
		});
	};

	return (
		<div className=' w-full min-h-screen flex items-center justify-center  px-4 py-10'>
			<div className='w-full   '>
				<div className='space-y-3 mb-8'>
					<h1 className='text-3xl font-semibold text-white'>
						Create Account
					</h1>
					<p className='text-sm text-gray-400'>
						Sign up and start using Prime Mirror Market.
					</p>
				</div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-5'
					>
						
						<FormField
							control={form.control}
							name='fullName'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-sm text-gray-300'>
										Full Name
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder='Enter your full name'
											className='bg-zinc-900 border border-zinc-800 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-sm text-gray-300'>
										Email
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											type='email'
											placeholder='you@company.com'
											className='bg-zinc-900 border border-zinc-800 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<div className='grid grid-cols-2 gap-x-4'>
							<FormField
								control={form.control}
								name='country'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-sm text-gray-300'>
											Country
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												type='text'
												placeholder='Enter your country'
												className='bg-zinc-900 border border-zinc-800 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='phoneNumber'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-sm text-gray-300'>
											Phone Number
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												type='text'
												placeholder='Enter your phone number'
												className='bg-zinc-900 border border-zinc-800 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-sm text-gray-300'>
										Password
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											type='password'
											placeholder='Enter your password'
											className='bg-zinc-900 border border-zinc-800 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='confirmPassword'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-sm text-gray-300'>
										Confirm Password
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											type='password'
											placeholder='Confirm your password'
											className='bg-zinc-900 border border-zinc-800 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
										/>
									</FormControl>
									<FormDescription className='text-red-500'>
										{
											form.formState.errors
												.confirmPassword?.message
										}
									</FormDescription>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='agreement'
							render={({ field }) => (
								<FormItem className='flex items-start gap-3'>
									<FormControl>
										<Checkbox
											checked={field.value}
											onCheckedChange={field.onChange}
											className='border-zinc-700 text-blue-600 focus:ring-blue-500'
										/>
									</FormControl>
									<FormLabel className='text-sm text-gray-300'>
										I agree to the terms and conditions
									</FormLabel>
								</FormItem>
							)}
						/>

						<Button
							type='submit'
							className='w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50'
							disabled={isPending}
						>
							Create Account {isPending && <Spinner />}
						</Button>
						<p className='text-center text-sm text-gray-400'>
							Already have an account?{' '}
							<Link
								href='/login'
								className='text-blue-400 hover:text-blue-300 font-semibold'
							>
								Login
							</Link>
						</p>
					</form>
				</Form>
			</div>
		</div>
	);
};
