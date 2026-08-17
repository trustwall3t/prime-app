import SideBar from '@/app/(admin)/components/Sidebar';
import AdminMenu from '@/app/(admin)/components/AdminMenu';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import Image from 'next/image';
import Link from 'next/link';

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<SidebarProvider className='bg-zinc-950'>
			<SideBar />
			<main className='w-full bg-zinc-950 text-white'>
				<div className='fixed left-0 right-0 top-0 z-50 flex w-full items-center justify-between bg-zinc-950 px-4 py-4 shadow-sm sm:px-6 md:px-10'>
					<div className='flex items-center gap-2'>
						<SidebarTrigger className='text-white' />
						<div className='logo-container hidden items-center gap-2 border-l-2 border-zinc-700 pl-2 sm:flex'>
							<Link
								href='/admin/dashboard'
								className='flex h-full w-full items-center justify-center'
							>
								<Image
									src='/logo.png'
									alt='logo'
									width={100}
									height={100}
									className='object-contain'
								/>
							</Link>
						</div>
					</div>
					<AdminMenu />
				</div>
				<div className='mt-16 min-h-[calc(100vh-100px)] p-4 md:p-10'>
					{children}
				</div>
				<div className='flex items-center justify-between px-10 py-10 text-white'>
					<p className='text-xs capitalize'>
						Copyright {new Date().getFullYear()} &copy; All rights
						reserved
					</p>
					<Link href='/privacy-policy' className='text-xs'>
						Terms
					</Link>
				</div>
			</main>
		</SidebarProvider>
	);
};

export default AdminDashboardLayout;
