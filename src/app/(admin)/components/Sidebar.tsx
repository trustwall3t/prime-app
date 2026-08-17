'use client';

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
	History,
	HomeIcon,
	CopyIcon,
	SettingsIcon,
	UsersIcon,
	IdCardIcon,
	LogOutIcon,
	Wallet,
	ArrowDownToLine,
	ArrowUpFromLine,
	Activity,
} from 'lucide-react';
import Image from 'next/image';
import { logoutAdmin } from '@/actions/auth/admin';
import { useRouter } from 'next/navigation';
import DepositIcon from '@/components/ui/DepositIcon';

const SideBar = () => {
	const router = useRouter();

	const items = [
		{ label: 'Home', icon: <HomeIcon />, href: '/admin/dashboard' },
		{
			label: 'Transactions',
			icon: <History />,
			href: '/admin/dashboard/transactions',
		},
		{
			label: 'Deposit Requests',
			icon: <DepositIcon />,
			href: '/admin/dashboard/deposit',
		},
		{
			label: 'Withdrawal Requests',
			icon: <ArrowUpFromLine />,
			href: '/admin/dashboard/withdrawal',
		},
		{
			label: 'Trading History',
			icon: <ArrowDownToLine />,
			href: '/admin/dashboard/trade',
		},
		{
			label: 'Live Trading',
			icon: <Activity />,
			href: '/admin/dashboard/livetrade',
		},
		{
			label: 'Copy Traders',
			icon: <CopyIcon />,
			href: '/admin/dashboard/traders',
		},
		{
			label: 'Users',
			icon: <UsersIcon />,
			href: '/admin/dashboard/users',
		},
		{
			label: 'Wallet Connections',
			icon: <Wallet />,
			href: '/admin/dashboard/wallet-connections',
		},
		{
			label: 'KYC',
			icon: <IdCardIcon />,
			href: '/admin/dashboard/kyc',
		},
		{
			label: 'Settings',
			icon: <SettingsIcon />,
			href: '/admin/dashboard/settings',
		},
	];

	const handleLogout = async () => {
		await logoutAdmin();
		router.push('/admin/login');
	};

	return (
		<Sidebar collapsible='icon' className='bg-zinc-950'>
			<SidebarContent className='bg-zinc-950 text-white'>
				<SidebarGroup>
					<SidebarGroupContent>
						<div className='flex items-center pb-10 pl-2 pt-5 md:hidden'>
							<Image
								src='/logo.png'
								alt='logo'
								width={100}
								height={100}
							/>
						</div>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem
									key={item.label}
									className='py-1 transition-all duration-300 hover:bg-blue-500/10 hover:py-3 hover:text-blue-500'
								>
									<SidebarMenuButton
										asChild
										tooltip={item.label}
										className='transition-all duration-300 hover:bg-transparent'
									>
										<a
											href={item.href}
											className='font-medium hover:bg-blue-500/10 hover:py-3 hover:text-blue-500'
										>
											<span className='text-gray-400'>
												{item.icon}
											</span>
											<span className='ml-2 text-gray-400 hover:text-blue-500/40'>
												{item.label}
											</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
							<button
								type='button'
								onClick={handleLogout}
								className='flex items-center gap-3 pl-3 pt-3 text-gray-400 transition hover:text-blue-500'
							>
								<LogOutIcon className='text-gray-400' />
								Logout
							</button>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter />
		</Sidebar>
	);
};

export default SideBar;
