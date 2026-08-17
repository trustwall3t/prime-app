import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export const adminInputClass =
	'w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-blue-500 focus:outline-none';

export const adminSelectClass = adminInputClass;

export const adminTextareaClass = cn(adminInputClass, 'resize-none');

export function adminBtnClass(
	variant: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost' = 'primary',
) {
	const base =
		'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:opacity-50 disabled:pointer-events-none';
	switch (variant) {
		case 'secondary':
			return cn(base, 'bg-zinc-800 text-white hover:bg-zinc-700');
		case 'success':
			return cn(base, 'bg-emerald-600 text-white hover:bg-emerald-500');
		case 'danger':
			return cn(base, 'bg-red-500 text-white hover:bg-red-600');
		case 'warning':
			return cn(base, 'bg-amber-500 text-white hover:bg-amber-600');
		case 'ghost':
			return cn(
				base,
				'bg-transparent text-gray-400 hover:bg-zinc-800 hover:text-white px-2 py-1',
			);
		default:
			return cn(base, 'bg-blue-500 text-white hover:bg-blue-600');
	}
}

export function AdminPageHeader({
	title,
	description,
}: {
	title: string;
	description?: string;
}) {
	return (
		<div className='space-y-1'>
			<h1 className='text-2xl font-medium text-white'>{title}</h1>
			{description && (
				<p className='text-sm text-gray-400'>{description}</p>
			)}
		</div>
	);
}

export function AdminCard({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				'rounded-md border border-zinc-700 bg-zinc-900 p-5',
				className,
			)}
		>
			{children}
		</div>
	);
}

export function AdminStatCard({
	label,
	value,
	icon,
	accent = 'blue',
}: {
	label: string;
	value: ReactNode;
	icon?: ReactNode;
	accent?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
}) {
	const accents = {
		blue: 'text-blue-400',
		green: 'text-emerald-400',
		amber: 'text-amber-400',
		red: 'text-red-400',
		purple: 'text-purple-400',
	};

	return (
		<div className='rounded-md border border-zinc-700 bg-zinc-900 p-5 transition hover:border-zinc-600'>
			<div className='flex items-center justify-between gap-3'>
				<p className='text-sm text-gray-400'>{label}</p>
				{icon && (
					<span className={cn('opacity-80', accents[accent])}>
						{icon}
					</span>
				)}
			</div>
			<p className={cn('mt-3 text-3xl font-semibold', accents[accent])}>
				{value}
			</p>
		</div>
	);
}

export function AdminTableWrap({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<AdminCard className={cn('overflow-hidden p-0', className)}>
			<div className='overflow-x-auto [&_th]:text-gray-400 [&_th]:font-medium [&_td]:text-gray-300 [&_tr]:border-zinc-800 [&_tr:hover]:bg-zinc-800/40'>
				{children}
			</div>
		</AdminCard>
	);
}

export function AdminIconButton({
	children,
	className,
	variant = 'primary',
	...props
}: React.ComponentProps<'button'> & {
	variant?: 'primary' | 'success' | 'danger' | 'warning' | 'secondary';
}) {
	return (
		<button
			type='button'
			className={cn(
				'inline-flex h-9 w-9 items-center justify-center rounded-lg transition disabled:opacity-50',
				variant === 'success' && 'bg-emerald-600 text-white hover:bg-emerald-500',
				variant === 'danger' && 'bg-red-500 text-white hover:bg-red-600',
				variant === 'warning' && 'bg-amber-500 text-white hover:bg-amber-600',
				variant === 'secondary' && 'bg-zinc-800 text-white hover:bg-zinc-700',
				variant === 'primary' && 'bg-blue-500 text-white hover:bg-blue-600',
				className,
			)}
			{...props}
		>
			{children}
		</button>
	);
}
