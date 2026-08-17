'use client';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UserLoginSchema } from '../../../../../schema/UserSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { login } from '@/actions/auth/login';
import { useTransition } from 'react';
import { useUser } from '@/lib/context/UserContext';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';

export const LoginForm = () => {
	const [isPending, startTransition] = useTransition();
	const { setUser } = useUser();
	const router = useRouter();

	const form = useForm<z.infer<typeof UserLoginSchema>>({
		resolver: zodResolver(UserLoginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = (data: z.infer<typeof UserLoginSchema>) => {
		if (data.email === '' || data.password === '') {
			toast.error('Please enter your email and password', {
				position: 'top-center',
			});
		}

		startTransition(async () => {
			const res = await login({
				...data,
				userAgent:
					typeof navigator !== 'undefined'
						? navigator.userAgent
						: undefined,
			});
			if (res.success) {
				setUser(res.user);
				router.push('/dashboard');
			} else {
				toast.error(res.error, {
					position: 'top-center',
				});
			}
		});
	};

	return (
		<div className='w-full'>
			<div className='space-y-3 mb-8'>
				<h1 className='text-3xl font-semibold text-white'>Sign in</h1>
				<p className='text-gray-400 text-sm'>
					Enter your email and password to continue.
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
								<FormLabel className='text-gray-300 text-sm font-medium'>
									Email
								</FormLabel>
								<FormControl>
									<Input
										type='email'
										{...field}
										placeholder='you@company.com'
										className='bg-zinc-900 border border-zinc-800 text-white placeholder:text-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<div className='flex items-center justify-between gap-3'>
									<FormLabel className='text-gray-300 text-sm font-medium'>
										Password
									</FormLabel>
									<Link
										href='/forgot-password'
										className='text-xs font-medium text-blue-400 hover:text-blue-300 transition'
									>
										Forgot password?
									</Link>
								</div>
								<FormControl>
									<Input
										type='password'
										{...field}
										placeholder='••••••••'
										className='bg-zinc-900 border border-zinc-800 text-white placeholder:text-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg'
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<div className='flex items-center gap-3 pt-2'>
						<input
							type='checkbox'
							name='remember'
							id='remember'
							className='h-4 w-4 rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-blue-500 cursor-pointer'
						/>
						<label
							htmlFor='remember'
							className='text-sm text-gray-400 cursor-pointer'
						>
							Remember me
						</label>
					</div>

					<Button
						type='submit'
						disabled={isPending}
						className='w-full py-3 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50'
					>
						Sign in {isPending && <Spinner />}
					</Button>
				</form>
			</Form>

			<p className='mt-6 text-center text-sm text-gray-400'>
				No account?{' '}
				<Link
					href='/signup'
					className='font-semibold text-blue-400 hover:text-blue-300 transition'
				>
					Create one
				</Link>
			</p>
		</div>
	);
};
