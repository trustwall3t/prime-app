import Image from 'next/image';
import Link from 'next/link';
import { UserProvider } from '@/lib/context/UserContext';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='w-full h-screen flex  bg-zinc-950 overflow-y-scroll no-scrollbar'>
			{/* Left Section - Headline and Branding */}
			<div className='hidden lg:flex lg:w-1/2 flex-col justify-between items-start p-8 lg:p-16'>
				{/* Center headline */}
				<div className='flex-1 flex flex-col justify-center'>
					<h1 className='text-2xl lg:text-3xl font-bold text-white leading-tight'>
						We Deal With The Stress,
						<br />
						While You Relax & Earn
					</h1>
					<div className='mt-6 h-1 w-24 rounded-full bg-gradient-to-r from-cyan-400 via-sky-500 to-indigo-600' />
					<p className='text-gray-400 text-sm tracking-widest mt-8'>
						PRIME MIRROR MARKET
					</p>
				</div>

				{/* Empty bottom for balance */}
				<div />
			</div>

			{/* Right Section - Form */}
			<div className='w-full lg:w-1/2 flex flex-col items-center justify-center  p-8'>
				{/* Logo for mobile/tablet */}
				<div className='mt-20  flex items-center justify-end gap-2'>
					<Link
						href='/'
						className='flex items-center gap-2'
					>
						<Image
							src='/logo.png'
							alt='Promirror Market'
							width={160}
							height={48}
							className='h-auto w-auto object-contain'
						/>
					</Link>
				</div>

				{/* Form Content */}
				<UserProvider>
					<div className='w-full max-w-3xl'>{children}</div>
				</UserProvider>
			</div>
		</div>
	);
};

export default AuthLayout;
