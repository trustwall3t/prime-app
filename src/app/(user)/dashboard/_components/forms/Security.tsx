'use client';
import { useTransition } from 'react';
import { Input } from '@/components/ui/input';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { PasswordSchema } from '../../../../../../schema/passwordSchema';
import { updatePassword } from '@/actions/settings';
import { toast } from 'sonner';
import { Loader } from '@/components/Loader';
import { useUser } from '@/lib/context/UserContext';
import {
	userFormCardClass,
	userInputClass,
	userLabelClass,
	userPrimaryButtonClass,
} from '@/lib/userFormStyles';

const Security = () => {
	const { user } = useUser();
	const [isPending, startTransition] = useTransition();
	const form = useForm<z.infer<typeof PasswordSchema>>({
		resolver: zodResolver(PasswordSchema),
		defaultValues: {
			id: user?.id,
			password: '',
			confirmPassword: '',
		},
	});
	const onSubmit = (data: z.infer<typeof PasswordSchema>) => {
		startTransition(async () => {
			const res = await updatePassword(data);
			if (res.success) {
				toast.success(res.success);
				form.reset({ id: user?.id, password: '', confirmPassword: '' });
			} else {
				toast.error(res.error);
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
					{isPending && <Loader />}
					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel className={userLabelClass}>
									New password
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										type='password'
										className={userInputClass}
										placeholder='Enter new password'
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
								<FormLabel className={userLabelClass}>
									Confirm password
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										type='password'
										className={userInputClass}
										placeholder='Confirm new password'
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<button
						disabled={isPending}
						type='submit'
						className={userPrimaryButtonClass}
					>
						{isPending ? 'Updating...' : 'Update password'}
					</button>
				</form>
			</Form>
		</div>
	);
};

export default Security;
