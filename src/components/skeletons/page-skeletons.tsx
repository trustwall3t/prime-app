import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

type Theme = 'dark' | 'light';

function bone(theme: Theme, className?: string) {
	return cn(
		theme === 'dark' ? 'bg-zinc-800' : 'bg-gray-200',
		className,
	);
}

function PageHeaderSkeleton({
	theme = 'dark',
	lines = 2,
}: {
	theme?: Theme;
	lines?: number;
}) {
	return (
		<div className='space-y-3'>
			<Skeleton className={bone(theme, 'h-8 w-48')} />
			{lines > 1 && (
				<Skeleton className={bone(theme, 'h-4 w-full max-w-md')} />
			)}
		</div>
	);
}

function DashboardSkeleton() {
	return (
		<div className='flex flex-col gap-4 w-full animate-in fade-in duration-300'>
			<Skeleton className={bone('dark', 'h-36 w-full rounded-md')} />
			<div className='grid gap-4 md:grid-cols-2'>
				<Skeleton className={bone('dark', 'h-28 rounded-md')} />
				<Skeleton className={bone('dark', 'h-28 rounded-md')} />
			</div>
			<Skeleton className={bone('dark', 'h-10 w-full max-w-xs rounded-md')} />
			<div className='space-y-3'>
				{Array.from({ length: 5 }).map((_, i) => (
					<Skeleton
						key={i}
						className={bone('dark', 'h-16 w-full rounded-md')}
					/>
				))}
			</div>
		</div>
	);
}

function TableSkeleton({
	theme = 'dark',
	rows = 6,
	cols = 5,
}: {
	theme?: Theme;
	rows?: number;
	cols?: number;
}) {
	return (
		<div className='space-y-4 animate-in fade-in duration-300'>
			<Skeleton className={bone(theme, 'h-10 w-full rounded-md')} />
			<div className='space-y-2'>
				{Array.from({ length: rows }).map((_, row) => (
					<div
						key={row}
						className='grid gap-3'
						style={{
							gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
						}}
					>
						{Array.from({ length: cols }).map((_, col) => (
							<Skeleton
								key={col}
								className={bone(theme, 'h-8 rounded-md')}
							/>
						))}
					</div>
				))}
			</div>
		</div>
	);
}

function TabsPageSkeleton({ theme = 'dark' }: { theme?: Theme }) {
	return (
		<div className='space-y-6 animate-in fade-in duration-300'>
			<PageHeaderSkeleton theme={theme} />
			<div className='flex gap-6 border-b border-zinc-700 pb-3'>
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton
						key={i}
						className={bone(theme, 'h-6 w-20')}
					/>
				))}
			</div>
			<div className='space-y-3'>
				{Array.from({ length: 6 }).map((_, i) => (
					<Skeleton
						key={i}
						className={bone(theme, 'h-20 w-full rounded-md')}
					/>
				))}
			</div>
		</div>
	);
}

function FormSkeleton({ theme = 'dark', fields = 4 }: { theme?: Theme; fields?: number }) {
	return (
		<div className='space-y-6 animate-in fade-in duration-300'>
			<PageHeaderSkeleton theme={theme} />
			<div className='space-y-4 max-w-xl'>
				{Array.from({ length: fields }).map((_, i) => (
					<div
						key={i}
						className='space-y-2'
					>
						<Skeleton className={bone(theme, 'h-4 w-24')} />
						<Skeleton className={bone(theme, 'h-11 w-full rounded-md')} />
					</div>
				))}
				<Skeleton className={bone(theme, 'h-11 w-32 rounded-md mt-4')} />
			</div>
		</div>
	);
}

function CardGridSkeleton({
	theme = 'dark',
	cards = 3,
}: {
	theme?: Theme;
	cards?: number;
}) {
	return (
		<div className='space-y-6 animate-in fade-in duration-300'>
			<PageHeaderSkeleton theme={theme} />
			<Skeleton className={bone(theme, 'h-24 w-full rounded-md')} />
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
				{Array.from({ length: cards }).map((_, i) => (
					<Skeleton
						key={i}
						className={bone(theme, 'h-48 rounded-md')}
					/>
				))}
			</div>
		</div>
	);
}

function LiveTradingSkeleton() {
	return (
		<div className='space-y-6 animate-in fade-in duration-300'>
			<div className='flex items-center justify-between'>
				<Skeleton className={bone('dark', 'h-4 w-40')} />
				<Skeleton className={bone('dark', 'h-4 w-48')} />
			</div>
			<Skeleton className={bone('dark', 'h-11 w-full rounded-md')} />
			<div className='flex gap-3 overflow-hidden'>
				{Array.from({ length: 6 }).map((_, i) => (
					<Skeleton
						key={i}
						className={bone('dark', 'h-28 w-28 shrink-0 rounded-md')}
					/>
				))}
			</div>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					<Skeleton className={bone('dark', 'h-14 w-14 rounded-md')} />
					<div className='space-y-2'>
						<Skeleton className={bone('dark', 'h-6 w-20')} />
						<Skeleton className={bone('dark', 'h-4 w-32')} />
					</div>
				</div>
				<div className='space-y-2 text-right'>
					<Skeleton className={bone('dark', 'h-8 w-24 ml-auto')} />
					<Skeleton className={bone('dark', 'h-4 w-16 ml-auto')} />
				</div>
			</div>
			<div className='flex gap-3'>
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton
						key={i}
						className={bone('dark', 'h-10 w-16 rounded-md')}
					/>
				))}
			</div>
			<Skeleton className={bone('dark', 'h-[420px] w-full rounded-md')} />
			<div className='flex gap-8 border-b border-zinc-700 pb-3'>
				<Skeleton className={bone('dark', 'h-6 w-28')} />
				<Skeleton className={bone('dark', 'h-6 w-20')} />
			</div>
			<Skeleton className={bone('dark', 'h-24 w-full rounded-md')} />
			<Skeleton className={bone('dark', 'h-12 w-40 rounded-md')} />
			<div className='grid grid-cols-2 gap-4'>
				<Skeleton className={bone('dark', 'h-14 rounded-md')} />
				<Skeleton className={bone('dark', 'h-14 rounded-md')} />
			</div>
		</div>
	);
}

function AuthFormSkeleton() {
	return (
		<div className='w-full max-w-md mx-auto space-y-6 animate-in fade-in duration-300 py-8'>
			<div className='space-y-2 text-center'>
				<Skeleton className={bone('dark', 'h-8 w-48 mx-auto')} />
				<Skeleton className={bone('dark', 'h-4 w-64 mx-auto')} />
			</div>
			<div className='space-y-4'>
				{Array.from({ length: 3 }).map((_, i) => (
					<div
						key={i}
						className='space-y-2'
					>
						<Skeleton className={bone('dark', 'h-4 w-20')} />
						<Skeleton className={bone('dark', 'h-11 w-full rounded-md')} />
					</div>
				))}
				<Skeleton className={bone('dark', 'h-11 w-full rounded-md mt-2')} />
			</div>
		</div>
	);
}

function GenericPageSkeleton({ theme = 'dark' }: { theme?: Theme }) {
	return (
		<div className='space-y-6 animate-in fade-in duration-300'>
			<PageHeaderSkeleton theme={theme} />
			<Skeleton className={bone(theme, 'h-40 w-full rounded-md')} />
			<div className='space-y-3'>
				{Array.from({ length: 4 }).map((_, i) => (
					<Skeleton
						key={i}
						className={bone(theme, 'h-4 w-full')}
					/>
				))}
			</div>
		</div>
	);
}

function HomePageSkeleton() {
	return (
		<div className='min-h-screen space-y-8 p-6 animate-in fade-in duration-300'>
			<Skeleton className={bone('light', 'h-16 w-full rounded-md')} />
			<Skeleton className={bone('light', 'h-72 w-full rounded-md')} />
			<div className='grid gap-4 md:grid-cols-3'>
				{Array.from({ length: 3 }).map((_, i) => (
					<Skeleton
						key={i}
						className={bone('light', 'h-40 rounded-md')}
					/>
				))}
			</div>
			<Skeleton className={bone('light', 'h-52 w-full rounded-md')} />
		</div>
	);
}

function AdminPageSkeleton() {
	return (
		<div className='animate-in fade-in space-y-6 duration-300'>
			<PageHeaderSkeleton theme='dark' />
			<TableSkeleton theme='dark' rows={8} cols={6} />
		</div>
	);
}

export {
	DashboardSkeleton,
	TableSkeleton,
	TabsPageSkeleton,
	FormSkeleton,
	CardGridSkeleton,
	LiveTradingSkeleton,
	AuthFormSkeleton,
	GenericPageSkeleton,
	HomePageSkeleton,
	AdminPageSkeleton,
	PageHeaderSkeleton,
};
