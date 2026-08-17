import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyEmailSchem } from '../../../../../schema/UserSchema';
import { z } from 'zod';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';
import { authPageTitleClass } from '@/lib/userFormStyles';
import { verifyEmail } from '@/actions/auth/signup';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';

const VerifyForm = ({ email }: { email: string }) => {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();
	const form = useForm<z.infer<typeof verifyEmailSchem>>({
		resolver: zodResolver(verifyEmailSchem),
		defaultValues: {
			token: '',
			email: email || '',
		},
	});

	const onSubmit = (data: z.infer<typeof verifyEmailSchem>) => {
		if (!data.token) {
			toast.error('Token is required');
			return;
		}
		if (!data.email) {
			toast.error('Email is required');
			return;
		}
		startTransition(async () => {
			try {
				const res = await verifyEmail(data);
				if (res.success) {
					toast.success(res.success, { position: 'top-center' });
					router.push('/login');
				}
				if (res.error) {
					toast.error(res.error, { position: 'top-center' });
				}
			} catch (error) {
				console.log(error);
				toast.error('An error occurred during verification', {
					position: 'top-center',
				});
			}
		});
	};

	return (
		<div className='w-full min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-10'>
			<div className='w-full max-w-md rounded-[32px] border border-zinc-800 bg-zinc-950/95 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.6)]'>
				<div className='space-y-3 mb-8'>
					<h1 className={authPageTitleClass}>
						Verify Email
					</h1>
					<p className='text-sm text-gray-400'>
						Enter the token sent to your email.
					</p>
				</div>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-5'
					>
						<FormField
							control={form.control}
							name='token'
							render={({ field }) => (
								<FormItem>
									<FormLabel className='text-sm text-gray-300'>
										Verification Token
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											type='text'
											placeholder='Enter the token'
											className='bg-zinc-900 border border-zinc-800 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
											disabled={isPending}
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
							{isPending ? 'Verifying...' : 'Verify'}{' '}
							{isPending && <Spinner />}
						</Button>
						<p className='text-center text-sm text-gray-400'>
							Didn't receive a token?{' '}
							<Link
								href='/login'
								className='text-blue-400 hover:text-blue-300 font-semibold'
							>
								Return to login
							</Link>
						</p>
					</form>
				</Form>
			</div>
		</div>
	);
};

export default VerifyForm;
