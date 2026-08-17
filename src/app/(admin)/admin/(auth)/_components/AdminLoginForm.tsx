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
import { AdminLoginSchema } from '../../../../../../schema/AdminLoginSschema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { loginAdmin } from '@/actions/auth/admin';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

const inputClassName =
	'rounded-lg border border-zinc-800 bg-zinc-900 text-white placeholder:text-gray-600 focus:border-blue-500 focus:ring-blue-500';

export default function AdminLoginForm() {
	const [isPending, startTransition] = useTransition();
	const router = useRouter();

	const form = useForm<z.infer<typeof AdminLoginSchema>>({
		resolver: zodResolver(AdminLoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = (data: z.infer<typeof AdminLoginSchema>) => {
		if (!data.email || !data.password) {
			toast.error('Please enter your email and password', {
				position: 'top-center',
			});
			return;
		}

		startTransition(async () => {
			const response = await loginAdmin(data);
			if (response?.error) {
				toast.error(response.error, { position: 'top-center' });
				return;
			}
			if (response?.redirect) {
				router.push(response.redirect);
			}
		});
	};

	return (
		<div className='w-full'>
			<div className='mb-8 space-y-3'>
				<h1 className='text-3xl font-semibold text-white'>
					Manager sign in
				</h1>
				<p className='text-sm text-gray-400'>
					Enter your email and password to access the manager dashboard.
				</p>
			</div>

			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-5'
				>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-sm font-medium text-gray-300'>
									Email
								</FormLabel>
								<FormControl>
									<Input
										type='email'
										{...field}
										placeholder='manager@company.com'
										className={inputClassName}
									/>
								</FormControl>
								<FormMessage className='text-sm text-red-500' />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<div className='flex items-center justify-between gap-3'>
									<FormLabel className='text-sm font-medium text-gray-300'>
										Password
									</FormLabel>
									<Link
										href='/admin/forgot-password'
										className='text-xs font-medium text-blue-400 transition hover:text-blue-300'
									>
										Forgot password?
									</Link>
								</div>
								<FormControl>
									<Input
										type='password'
										{...field}
										placeholder='••••••••'
										className={inputClassName}
									/>
								</FormControl>
								<FormMessage className='text-sm text-red-500' />
							</FormItem>
						)}
					/>

					<div className='flex items-center gap-3 pt-2'>
						<input
							type='checkbox'
							name='remember'
							id='admin-remember'
							className='h-4 w-4 cursor-pointer rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-blue-500'
						/>
						<label
							htmlFor='admin-remember'
							className='cursor-pointer text-sm text-gray-400'
						>
							Remember me
						</label>
					</div>

					<Button
						type='submit'
						disabled={isPending}
						className='mt-6 w-full rounded-lg bg-blue-600 py-3 font-medium text-white transition hover:bg-blue-700 disabled:opacity-50'
					>
						Sign in {isPending && <Spinner />}
					</Button>
				</form>
			</Form>

			<p className='mt-6 text-center text-sm text-gray-400'>
				Back to{' '}
				<Link
					href='/'
					className='font-semibold text-blue-400 transition hover:text-blue-300'
				>
					main site
				</Link>
			</p>
		</div>
	);
}
