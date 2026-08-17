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
import { z } from 'zod';
import { ResetPasswordSchema } from '../../../../../schema/UserSchema';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { resetPassword } from '@/actions/auth/resetPassword';
import { toast } from 'sonner';
import { authPageTitleClass } from '@/lib/userFormStyles';
import { Spinner } from '@/components/ui/spinner';

export const ResetPasswordForm = ({ id }: { id: string }) => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const form = useForm<z.infer<typeof ResetPasswordSchema>>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
			id: id,
		},
	});

	const onSubmit = (data: z.infer<typeof ResetPasswordSchema>) => {
		startTransition(async () => {
			try {
				const res = await resetPassword(data);
				if (res.success) {
					toast.success(res.success, { position: 'top-center' });
					router.push('/login');
				} else {
					toast.error(res.error, { position: 'top-center' });
				}
			} catch (error) {
				console.log(error);
				toast.error('An error occurred during reset password', {
					position: 'top-center',
				});
			}
		});
	};

	return (
		<div className='w-full min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-10'>
			<div className='w-full max-w-md '>
				<div className='space-y-3 mb-8'>
					<h1 className={authPageTitleClass}>
						Reset Password
					</h1>
					<p className='text-sm text-gray-400'>
						Choose a new password for your account.
					</p>
				</div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-5'
					>
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
									<FormMessage className='text-sm text-red-500' />
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
									<FormMessage className='text-sm text-red-500' />
								</FormItem>
							)}
						/>
						<Button
							type='submit'
							className='w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50'
							disabled={isPending}
						>
							Reset Password {isPending && <Spinner />}
						</Button>
						<p className='text-center text-sm text-gray-400'>
							Back to{' '}
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

export default ResetPasswordForm;
