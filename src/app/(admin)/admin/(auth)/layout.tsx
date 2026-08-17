import Image from 'next/image';
import Link from 'next/link';

const AdminAuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='no-scrollbar flex h-screen w-full overflow-y-scroll bg-zinc-950'>
			<div className='hidden flex-col items-start justify-between p-8 lg:flex lg:w-1/2 lg:p-16'>
				<div className='flex flex-1 flex-col justify-center'>
					<h1 className='text-2xl font-bold leading-tight text-white lg:text-3xl'>
						We Deal With The Stress,
						<br />
						While You Relax & Earn
					</h1>
					<div className='mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600' />
					<p className='mt-8 text-sm tracking-widest text-gray-400'>
						PRIME MIRROR MARKET
					</p>
				</div>
				<div />
			</div>

			<div className='flex w-full flex-col items-center justify-center p-8 lg:w-1/2'>
				<div className='mt-20 flex items-center justify-end gap-2'>
					<Link href='/' className='flex items-center gap-2'>
						<Image
							src='/logo.png'
							alt='Prime Mirror Market'
							width={160}
							height={48}
							className='h-auto w-auto object-contain'
						/>
					</Link>
				</div>

				<div className='w-full max-w-3xl'>{children}</div>
			</div>
		</div>
	);
};

export default AdminAuthLayout;
