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
import { AdminForgotPasswordSchema } from '../../../../../../schema/AdminLoginSschema';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const inputClassName =
	'rounded-lg border border-zinc-800 bg-zinc-900 text-white placeholder:text-gray-600 focus:border-blue-500 focus:ring-blue-500';

export default function AdminForgotPasswordForm() {
	const form = useForm<z.infer<typeof AdminForgotPasswordSchema>>({
		resolver: zodResolver(AdminForgotPasswordSchema),
		defaultValues: {
			email: '',
		},
	});

	const onSubmit = (data: z.infer<typeof AdminForgotPasswordSchema>) => {
		console.log(data);
	};

	return (
		<div className='w-full'>
			<div className='mb-8 space-y-3'>
				<h1 className='text-3xl font-semibold text-white'>
					Forgot password
				</h1>
				<p className='text-sm text-gray-400'>
					Enter your email to request a password reset link.
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
								<FormLabel className='text-sm text-gray-300'>
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

					<Button
						type='submit'
						className='w-full rounded-lg bg-blue-600 py-3 text-white transition hover:bg-blue-700 disabled:opacity-50'
					>
						Request reset link
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
