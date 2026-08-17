'use client';
import React, { useRef, useTransition, useState } from 'react';
import { KycSchema } from '../../../../../../schema/KycShema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
} from '@/components/ui/form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { createKyc } from '@/actions/ky';
import { toast } from 'sonner';
import { Loader } from '@/components/Loader';
import { uploadFile } from '@/lib/uploadfile';

// Shared dark-theme input styling so every field matches the modal design.
const inputClassName =
	'bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 focus-visible:ring-indigo-500';
const labelClassName = 'text-white font-medium';

interface KycFormProps {
	// Called after a successful submission — e.g. close the dialog.
	onSubmitted?: () => void;
}

const KycForm = ({ onSubmitted }: KycFormProps) => {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [submitted, setSubmitted] = useState(false);
	const [isPending, startTransition] = useTransition();
	const [uploading, setUploading] = useState(false);
	const [selectedFileName, setSelectedFileName] = useState('');

	const form = useForm<z.infer<typeof KycSchema>>({
		resolver: zodResolver(KycSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			phone: '',
			address: '',
			country: '',
			idNumber: '',
			idType: '',
			idImage: '',
		},
	});

	const formatFileSize = (bytes: number): string => {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	};

	async function onSubmit(values: z.infer<typeof KycSchema>) {
		const fileInput = fileInputRef.current;
		const file = fileInput?.files?.[0];

		if (!file) {
			toast.error('Please select an ID image');
			return;
		}

		try {
			// Step 1: Upload file to Cloudinary via API route
			setUploading(true);
			const imageUrl = await uploadFile(file);
			setUploading(false);

			// Step 2: Submit form data with image URL to server action
			startTransition(async () => {
				const formData = new FormData();
				formData.append('firstName', values.firstName);
				formData.append('lastName', values.lastName);
				formData.append('phone', values.phone);
				formData.append('address', values.address);
				formData.append('country', values.country);
				formData.append('idNumber', values.idNumber);
				formData.append('idType', values.idType);
				formData.append('idImage', imageUrl); // Send URL instead of file

				const result = await createKyc(formData);

				if (result.error) {
					toast.error(
						result.error.toString() || 'Something went wrong',
					);
				} else {
					toast.success('KYC submitted successfully');
					form.reset();
					setSelectedFileName('');
					if (fileInputRef.current) {
						fileInputRef.current.value = '';
					}
					setSubmitted(true);
				}
			});
		} catch (error) {
			setUploading(false);
			console.error('Upload error:', error);
			toast.error(
				error instanceof Error
					? error.message
					: 'Failed to upload file',
			);
		}
	}

	const isLoading = uploading || isPending;

	if (submitted) {
		return (
			<div className='flex min-h-[320px] flex-col items-center justify-center gap-4 text-center'>
				<div className='w-full max-w-md space-y-2 rounded-md border border-emerald-800 bg-emerald-950/40 p-8'>
					<p className='font-medium text-emerald-300'>
						KYC submitted successfully, please wait while we review
						your application.
					</p>
				</div>
				<Button
					onClick={() => {
						setSubmitted(false);
						onSubmitted?.();
					}}
					className='min-w-[150px] bg-indigo-500 text-white hover:bg-indigo-400'
				>
					Close
				</Button>
			</div>
		);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='space-y-6'
			>
				{isLoading && <Loader />}
				<FormField
					control={form.control}
					name='firstName'
					render={({ field }) => (
						<FormItem>
							<FormLabel className={labelClassName}>
								First name
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='Enter your first name'
									disabled={isLoading}
									className={inputClassName}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='lastName'
					render={({ field }) => (
						<FormItem>
							<FormLabel className={labelClassName}>
								Last name
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='Enter your last name'
									disabled={isLoading}
									className={inputClassName}
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
							<FormLabel className={labelClassName}>
								Phone
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='Enter your phone number'
									disabled={isLoading}
									className={inputClassName}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='country'
					render={({ field }) => (
						<FormItem>
							<FormLabel className={labelClassName}>
								Country
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='Enter your country'
									disabled={isLoading}
									className={inputClassName}
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
							<FormLabel className={labelClassName}>
								Address
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='Enter your address'
									disabled={isLoading}
									className={inputClassName}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='idNumber'
					render={({ field }) => (
						<FormItem>
							<FormLabel className={labelClassName}>
								ID number
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder='Enter your ID number'
									disabled={isLoading}
									className={inputClassName}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='idType'
					render={({ field }) => (
						<FormItem>
							<FormLabel className={labelClassName}>
								ID type
							</FormLabel>
							<FormControl>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
									disabled={isLoading}
								>
									<SelectTrigger
										className={`w-full ${inputClassName}`}
									>
										<SelectValue placeholder='Select ID type' />
									</SelectTrigger>
									<SelectContent className='border-zinc-700 bg-zinc-800 text-white'>
										<SelectItem value='passport'>
											Passport
										</SelectItem>
										<SelectItem value='national_id'>
											National ID
										</SelectItem>
										<SelectItem value='driver_license'>
											Driver license
										</SelectItem>
									</SelectContent>
								</Select>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='idImage'
					render={({ field }) => (
						<FormItem>
							<FormLabel className={labelClassName}>
								ID image
							</FormLabel>
							<FormControl>
								<div className='relative'>
									<input
										ref={fileInputRef}
										type='file'
										accept='image/*,application/pdf'
										onChange={(e) => {
											const file = e.target.files?.[0];
											if (file) {
												const maxSize =
													10 * 1024 * 1024; // 10MB
												if (file.size > maxSize) {
													toast.error(
														'File size must be less than 10MB',
													);
													e.target.value = '';
													setSelectedFileName('');
													return;
												}

												const fileInfo = `${
													file.name
												} (${formatFileSize(
													file.size,
												)})`;
												setSelectedFileName(fileInfo);
												field.onChange('file-selected');
											} else {
												setSelectedFileName('');
												field.onChange('');
											}
										}}
										disabled={isLoading}
										className='absolute inset-0 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed'
									/>
									<div className='rounded-md border-2 border-dashed border-zinc-700 p-6 text-center transition-colors hover:border-zinc-600'>
										<div className='flex flex-col items-center space-y-2'>
											<svg
												className='h-12 w-12 text-gray-500'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
												/>
											</svg>
											<div className='text-sm text-gray-400'>
												<span className='font-medium text-indigo-400 hover:text-indigo-300'>
													Click to upload
												</span>{' '}
												or drag and drop
											</div>
											<p className='text-xs text-gray-500'>
												PNG, JPG, PDF up to 10MB
											</p>
											{selectedFileName && (
												<p className='text-xs text-emerald-400'>
													Selected: {selectedFileName}
												</p>
											)}
											{uploading && (
												<p className='text-xs font-medium text-indigo-400'>
													Uploading to cloud...
												</p>
											)}
										</div>
									</div>
								</div>
							</FormControl>
						</FormItem>
					)}
				/>
				<div className='flex items-center justify-end gap-6 pt-2'>
					<button
						type='button'
						onClick={() => {
							form.reset();
							setSelectedFileName('');
							if (fileInputRef.current) {
								fileInputRef.current.value = '';
							}
						}}
						disabled={isLoading}
						className='text-gray-400 hover:text-white disabled:opacity-50'
					>
						Cancel
					</button>
					<Button
						type='submit'
						className='min-w-[150px] bg-indigo-500 text-white hover:bg-indigo-400'
						disabled={isLoading}
					>
						{uploading
							? 'Uploading...'
							: isPending
								? 'Submitting...'
								: 'Submit for review'}
					</Button>
				</div>
			</form>
		</Form>
	);
};

export default KycForm;
