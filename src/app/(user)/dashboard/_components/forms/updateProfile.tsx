'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Form } from '@/components/ui/form';
import { PersonalInfoSchema } from '../../../../../../schema/personalInfoSchema';
import { useTransition } from 'react';
import { toast } from 'sonner';
import { personalInfoSettings } from '@/actions/settings';
import { useUser } from '@/lib/context/UserContext';
import {
	userFormCardClass,
	userInputClass,
	userLabelClass,
	userPrimaryButtonClass,
} from '@/lib/userFormStyles';
import CountrySelect from '@/components/CountrySelect';
import OptionSelect from '@/components/OptionSelect';
import { ACCOUNT_TYPES } from '@/lib/profileOptions';

const UpdateProfile = () => {
	const { user } = useUser();
	const savedAccountTypeRaw = user?.accountType ?? user?.AccountType ?? undefined;
	const savedAccountType =
		savedAccountTypeRaw &&
		(ACCOUNT_TYPES as readonly string[]).includes(savedAccountTypeRaw)
			? savedAccountTypeRaw
			: undefined;
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof PersonalInfoSchema>>({
		resolver: zodResolver(PersonalInfoSchema),
		defaultValues: {
			name: user?.name ?? undefined,
			email: user?.email ?? undefined,
			phone: user?.phone ?? undefined,
			address: user?.address ?? undefined,
			accountType: savedAccountType,
			country: user?.country ?? undefined,
		},
	});
	const onSubmit = (data: z.infer<typeof PersonalInfoSchema>) => {
		startTransition(async () => {
			const res = await personalInfoSettings(data);
			if (res.error) {
				toast.error(res.error);
			} else {
				toast.success(res.success);
			}
		});
	};
	return (
		<div className={`${userFormCardClass} max-w-2xl`}>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='space-y-5'
				>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel className={userLabelClass}>
									Name
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										className={userInputClass}
										placeholder='Enter your name'
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
								<FormLabel className={userLabelClass}>
									Email
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										className={userInputClass}
										placeholder='Enter your email'
										readOnly
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='phone'
						render={({ field }) => (
							<FormItem>
								<FormLabel className={userLabelClass}>
									Phone
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										className={userInputClass}
										placeholder='Enter your phone number'
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='address'
						render={({ field }) => (
							<FormItem>
								<FormLabel className={userLabelClass}>
									Address
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										className={userInputClass}
										placeholder='Enter your address'
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name='accountType'
						render={({ field }) => (
							<FormItem>
								<FormLabel className={userLabelClass}>
									Account type
								</FormLabel>
								<FormControl>
									<OptionSelect
										value={field.value}
										onChange={field.onChange}
										options={ACCOUNT_TYPES}
										placeholder='Select account type'
										triggerClassName={userInputClass}
										contentClassName='border-zinc-800 bg-zinc-900 text-white'
										aria-label='Account type'
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
								<FormLabel className={userLabelClass}>
									Country
								</FormLabel>
								<FormControl>
									<CountrySelect
										value={field.value}
										onChange={field.onChange}
										triggerClassName={userInputClass}
										contentClassName='border-zinc-800 bg-zinc-900 text-white'
									/>
								</FormControl>
								<FormMessage className='text-red-400 text-xs' />
							</FormItem>
						)}
					/>
					<button
						type='submit'
						className={userPrimaryButtonClass}
						disabled={isPending}
					>
						{isPending ? 'Updating...' : 'Update profile'}
					</button>
				</form>
			</Form>
		</div>
	);
};

export default UpdateProfile;
