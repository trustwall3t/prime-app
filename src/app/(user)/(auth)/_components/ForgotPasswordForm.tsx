'use client';

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useTransition } from 'react';
import { z } from 'zod';
import { ForgotPasswordSchema } from '../../../../../schema/UserSchema';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { requestResetPassword } from '@/actions/auth/resetPassword';
import { toast } from 'sonner';
import { authPageTitleClass } from '@/lib/userFormStyles';
import { Spinner } from '@/components/ui/spinner';

export const ForgotPasswordForm = () => {
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
		resolver: zodResolver(ForgotPasswordSchema),
		defaultValues: {
			email: '',
		},
	});

	const handleSubmit = async (data: z.infer<typeof ForgotPasswordSchema>) => {
		startTransition(async () => {
			try {
				const response = await requestResetPassword(data.email);
				if (response.error) {
					toast.error(response.error, { position: 'top-center' });
				} else {
					toast.success(response.success, { position: 'top-center' });
					form.reset();
				}
			} catch (error: unknown) {
				if (error instanceof Error) {
					toast.error(error.message || 'An error occurred');
				} else {
					toast.error('An error occurred');
				}
			}
		});
	};

	return (
		<div className='w-full  flex items-center justify-center bg-zinc-950 px-4 py-10'>
			<div className='w-full max-w-md rounded-[32px] '>
				<div className='space-y-3 mb-8'>
					<h1 className={authPageTitleClass}>
						Forgot Password
					</h1>
					<p className='text-sm text-gray-400'>
						Enter your email to request a password reset link.
					</p>
				</div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className='space-y-5'
					>
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
									<FormMessage className='text-sm text-red-500' />
								</FormItem>
							)}
						/>
						<Button
							type='submit'
							className='w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50'
							disabled={isPending}
						>
							{isPending ? 'Sending...' : 'Request Reset Link'}{' '}
							{isPending && <Spinner />}
						</Button>
						<p className='text-center text-sm text-gray-400'>
							Back to{' '}
							<Link
								href='/login'
								className='text-blue-400 hover:text-blue-300 font-semibold'
							>
								login
							</Link>
						</p>
					</form>
				</Form>
			</div>
		</div>
	);
};
