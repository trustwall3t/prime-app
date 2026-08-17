import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ReactNode } from 'react';
import SideBar from './_components/SideBar';
import Link from 'next/link';
import Image from 'next/image';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { settleDueTrades } from '@/lib/tradeSettlement';
import { UserProvider } from '@/lib/context/UserContext';
import { UserMenu } from './_components/UserMenu';
import { MailWarning } from 'lucide-react';
import FirstTimeModal from '@/components/FirstTimeModal';
import BottomNavBar from './_components/BottomNavBar';

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
	const session = await getSession();
	if (!session) {
		redirect('/login');
	}

	await settleDueTrades({ userId: session.user.id });

	const isFirstLogin = session.user?.isFirstLogin ?? false;
	return (
		<UserProvider initialUser={session.user} skipInitialFetch>
			{isFirstLogin && <FirstTimeModal />}
			<SidebarProvider className='bg-zinc-950'>
				<SideBar />
				<main className='w-full max-w-full overflow-x-hidden bg-zinc-950 text-white'>
					<div className='fixed top-0 left-0 right-0 z-50 flex w-full items-center justify-between bg-zinc-950 px-4 py-4 shadow-sm sm:px-6 md:px-10'>
						<div className='flex items-center gap-2'>
							<SidebarTrigger className='text-white' />
							<div className='hidden sm:flex items-center gap-2 logo-container border-l-2 border-gray-300 pl-2'>
								<Link
									href='/dashboard'
									className='w-full h-full flex items-center justify-center'
								>
									<Image
										src='/logo.png'
										alt='logo'
										width={100}
										height={100}
									/>
								</Link>
							</div>
						</div>

						<UserMenu />
					</div>
					<div className='mt-16 min-h-[calc(100vh-100px)] max-w-full overflow-x-hidden p-4 pb-28 md:p-10 md:pb-10'>
						{/* {session.user.kyc?.length === 0 ? (
							<div className='bg-red-500/20 text-red-500 rounded-md p-5 md:p-6 w-full mb-4 space-y-4'>
								<p className='text-sm font-medium'>
									Please complete your KYC to continue trading
								</p>
								<Link
									href='/dashboard/kyc'
									className='text-sm font-medium bg-red-500 text-white rounded-md p-2 px-4'
								>
									Complete KYC
								</Link>
							</div>
						) : (
							session.user.kyc?.length > 0 &&
							session.user.kyc[0].status === 'pending' && (
								<div className='bg-yellow-500/20 text-yellow-500 rounded-md p-5 md:p-6 w-full mb-4 flex items-center gap-x-10'>
									<MailWarning className='w-4 h-4' />
									<p className='text-sm font-medium'>
										Please wait for your KYC to be approved
									</p>
								</div>
							)
						)} */}

						{children}
					</div>
					<BottomNavBar />
					<div className='flex flex-col items-center justify-between gap-2 px-4 py-6 pb-24 text-white sm:flex-row sm:px-10 sm:py-10 sm:pb-10'>
						<p className='text-xs  capitalize'>
							Copyright {new Date().getFullYear()} &copy; All
							rights reserved
						</p>
						<p className=''>
							<Link
								href='/privacy-policy'
								className='text-xs '
							>
								Terms
							</Link>
						</p>
					</div>
				</main>
			</SidebarProvider>
		</UserProvider>
	);
};

export default DashboardLayout;
