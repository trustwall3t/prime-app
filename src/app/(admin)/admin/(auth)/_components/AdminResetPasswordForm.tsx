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
import { ResetPasswordSchema } from '../../../../../../schema/AdminLoginSschema';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const inputClassName =
	'rounded-lg border border-zinc-800 bg-zinc-900 text-white placeholder:text-gray-600 focus:border-blue-500 focus:ring-blue-500';

export default function AdminResetPasswordForm() {
	const form = useForm<z.infer<typeof ResetPasswordSchema>>({
		resolver: zodResolver(ResetPasswordSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	});

	const onSubmit = (data: z.infer<typeof ResetPasswordSchema>) => {
		console.log(data);
	};

	return (
		<div className='w-full'>
			<div className='mb-8 space-y-3'>
				<h1 className='text-3xl font-semibold text-white'>
					Reset password
				</h1>
				<p className='text-sm text-gray-400'>
					Choose a new password for your manager account.
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

					<FormField
						control={form.control}
						name='confirmPassword'
						render={({ field }) => (
							<FormItem>
								<FormLabel className='text-sm text-gray-300'>
									Confirm password
								</FormLabel>
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

					<Button
						type='submit'
						className='w-full rounded-lg bg-blue-600 py-3 text-white transition hover:bg-blue-700'
					>
						Reset password
					</Button>

					<p className='text-center text-sm text-gray-400'>
						Back to{' '}
						<Link
							href='/admin/login'
							className='font-semibold text-blue-400 transition hover:text-blue-300'
						>
							manager sign in
						</Link>
					</p>
				</form>
			</Form>
		</div>
	);
}
