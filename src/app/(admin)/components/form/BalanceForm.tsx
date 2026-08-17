'use client';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	Form,
	FormDescription,
} from '@/components/ui/form';
import { BalanceSchema } from '../../../../../schema/balanceSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { Checkbox } from '@/components/ui/checkbox';
import { useTransition } from 'react';
import { updateUserBalance } from '../../../../actions/admin/updateUserBalance';
import { useEffect } from 'react';
import { Loader } from '@/components/Loader';
import { toast } from 'sonner';
import { adminBtnClass } from '@/app/(admin)/components/admin-ui';

const inputClass =
	'border-zinc-700 bg-zinc-800 text-white placeholder:text-gray-500';

type UserData = {
	id: string;
	name: string;
	email: string;
	phone: string;
	walletBalance: number | null;
	profitBalance: number | null;
	investmentBalance: number | null;
	targetBalance: number | null;
	refcode: string | null;
	isVerified: boolean;
	createdAt: Date;
};

const BalanceForm = ({ user }: { user: UserData | null }) => {
	const [isPending, startTransition] = useTransition();

	const form = useForm<z.infer<typeof BalanceSchema>>({
		resolver: zodResolver(BalanceSchema),
		defaultValues: {
			balance: '',
			profit: '',
			investment: '',
			target: '',
			credit: true,
			userId: user?.id || '',
		},
	});

	// Update userId when user changes
	useEffect(() => {
		if (user?.id) {
			form.setValue('userId', user.id);
		}
	}, [user?.id, form]);

	const onSubmit = async (data: z.infer<typeof BalanceSchema>) => {
		if (!user?.id) {
			toast.error('No user selected', {
				position: 'top-right',
			});
			return;
		}

		// Validate that at least one field has a value
		if (!data.balance && !data.profit && !data.investment && !data.target) {
			toast.error('Please enter at least one value to update', {
				position: 'top-right',
			});
			return;
		}

		startTransition(async () => {
			try {
				const res = await updateUserBalance({
					...data,
					userId: user.id,
				});
				if (res.success) {
					toast.success('Balance updated successfully', {
						position: 'top-right',
					});
					form.reset({
						balance: '',
						profit: '',
						investment: '',
						target: '',
						credit: true,
						userId: user.id,
					});
				} else {
					toast.error(res.error || 'Failed to update balance', {
						position: 'top-right',
					});
				}
			} catch (err) {
				console.error('Form submission error:', err);
				toast.error('An unexpected error occurred', {
					position: 'top-right',
				});
			}
		});
	};
	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='mx-auto mt-4 w-full space-y-4'
			>
				<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
					<div className='flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 md:flex-col md:items-start md:gap-2'>
						<h2 className='text-sm text-gray-400'>Balance</h2>
						<p className='font-bold text-white'>
							${user?.walletBalance?.toFixed(2) || '0.00'}
						</p>
					</div>
					<div className='flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 md:flex-col md:items-start md:gap-2'>
						<h2 className='text-sm text-gray-400'>Profit</h2>
						<p className='font-bold text-white'>
							${user?.profitBalance?.toFixed(2) || '0.00'}
						</p>
					</div>
					<div className='flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 md:flex-col md:items-start md:gap-2'>
						<h2 className='text-sm text-gray-400'>Investment</h2>
						<p className='font-bold text-white'>
							${user?.investmentBalance?.toFixed(2) || '0.00'}
						</p>
					</div>
					<div className='flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 md:flex-col md:items-start md:gap-2'>
						<h2 className='text-sm text-gray-400'>Target</h2>
						<p className='font-bold text-white'>
							${user?.targetBalance?.toFixed(2) || '0.00'}
						</p>
					</div>
				</div>
				{isPending && <Loader />}
				<FormField
					control={form.control}
					name='credit'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-gray-300'>Credit</FormLabel>
							<FormControl>
								<Checkbox
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							</FormControl>
							<FormDescription className='text-gray-500'>
								This will add a credit to the balance if
								checked.
							</FormDescription>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='balance'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-gray-300'>
								Account Balance
							</FormLabel>
							<FormControl>
								<Input {...field} placeholder='0.00' className={inputClass} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='profit'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-gray-300'>
								Profit Balance
							</FormLabel>
							<FormControl>
								<Input {...field} placeholder='0.00' className={inputClass} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='target'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-gray-300'>
								Target Balance
							</FormLabel>
							<FormControl>
								<Input {...field} placeholder='0.00' className={inputClass} />
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='investment'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='text-gray-300'>
								Investment Balance
							</FormLabel>
							<FormControl>
								<Input {...field} placeholder='0.00' className={inputClass} />
							</FormControl>
						</FormItem>
					)}
				/>
				<button
					type='submit'
					disabled={isPending}
					className={`${adminBtnClass('primary')} w-full`}
				>
					{isPending ? 'Updating...' : 'Update balance'}
				</button>
			</form>
		</Form>
	);
};

export default BalanceForm;
