'use client';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { dashboardSettingSchema } from '../../../../../../schema/dashboardSettingSchema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	AdminCard,
	AdminPageHeader,
} from '@/app/(admin)/components/admin-ui';

const Settings = () => {
	const form = useForm<z.infer<typeof dashboardSettingSchema>>({
		resolver: zodResolver(dashboardSettingSchema),
		defaultValues: {
			siteName: '',
		},
	});

	const onSubmit = (values: z.infer<typeof dashboardSettingSchema>) => {
		console.log(values);
	};

	return (
		<div className='flex flex-col gap-6'>
			<AdminPageHeader
				title='Settings'
				description='Configure site-wide dashboard settings.'
			/>
			<AdminCard>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='max-w-xl space-y-6'
					>
						<div className='grid grid-cols-1 gap-4'>
							<FormField
								control={form.control}
								name='siteName'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-gray-300'>
											Site Name
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												type='text'
												placeholder='My Site'
												className='border-zinc-700 bg-zinc-800 text-white placeholder:text-gray-500'
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='siteDescription'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-gray-300'>
											Site Description
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='This is a description of the site'
												className='border-zinc-700 bg-zinc-800 text-white placeholder:text-gray-500'
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='siteEmail'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-gray-300'>
											Site Email
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='example@gmail.com'
												className='border-zinc-700 bg-zinc-800 text-white placeholder:text-gray-500'
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='sitePhone'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-gray-300'>
											Site Phone
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='+1234567890'
												className='border-zinc-700 bg-zinc-800 text-white placeholder:text-gray-500'
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='siteAddress'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-gray-300'>
											Site Address
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='123 Main St, Anytown, USA'
												className='border-zinc-700 bg-zinc-800 text-white placeholder:text-gray-500'
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='copyrightYear'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-gray-300'>
											Copyright Year
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='2025'
												className='border-zinc-700 bg-zinc-800 text-white placeholder:text-gray-500'
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='siteLogo'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-gray-300'>
											Site Logo
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												type='file'
												className='h-20 border-zinc-700 bg-zinc-800 text-white file:mr-2 file:my-auto file:h-16 file:rounded-md file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:cursor-pointer hover:file:bg-blue-600'
											/>
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='siteFavicon'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-gray-300'>
											Site Favicon
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												type='file'
												className='h-20 border-zinc-700 bg-zinc-800 text-white file:mr-2 file:my-auto file:h-16 file:rounded-md file:border-0 file:bg-blue-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:cursor-pointer hover:file:bg-blue-600'
											/>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>
						<Button
							type='submit'
							className='bg-blue-500 font-semibold text-white hover:bg-blue-600'
						>
							Save settings
						</Button>
					</form>
				</Form>
			</AdminCard>
		</div>
	);
};

export default Settings;
