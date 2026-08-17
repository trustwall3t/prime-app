import { TableSkeleton } from '@/components/skeletons';

export default function LoginTrackingLoading() {
	return (
		<div className='space-y-8'>
			<div className='space-y-2'>
				<div className='h-8 w-48 bg-zinc-800 animate-pulse rounded-md' />
				<div className='h-4 w-full max-w-lg bg-zinc-800 animate-pulse rounded-md' />
			</div>
			<TableSkeleton
				rows={8}
				cols={5}
			/>
		</div>
	);
}
