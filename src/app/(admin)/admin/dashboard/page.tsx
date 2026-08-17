import {
	BarChart2,
	PiggyBankIcon,
	UsersRoundIcon,
	CreditCardIcon,
	ActivitySquareIcon,
	ClockIcon,
} from 'lucide-react';
import { getAdminDashboardStats } from '@/actions/admin/dashboardStats';
import {
	AdminPageHeader,
	AdminStatCard,
} from '@/app/(admin)/components/admin-ui';

export const dynamic = 'force-dynamic';

const AdminDashboard = async () => {
	const statsResult = await getAdminDashboardStats();

	if ('error' in statsResult) {
		return (
			<div className='flex flex-col gap-6'>
				<AdminPageHeader
					title='Dashboard'
					description='Overview of platform activity and requests.'
				/>
				<p className='text-sm text-red-400'>{statsResult.error}</p>
			</div>
		);
	}

	const {
		totalUsers,
		totalTrades,
		totalDeposits,
		totalWithdrawals,
		onlineUsers,
		pendingDeposits,
		pendingWithdrawals,
	} = statsResult;

	return (
		<div className='flex flex-col gap-6'>
			<AdminPageHeader
				title='Dashboard'
				description='Live overview of platform activity and pending requests.'
			/>
			<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
				<AdminStatCard
					label='Total Users'
					value={totalUsers.toLocaleString()}
					icon={<UsersRoundIcon className='h-5 w-5' />}
					accent='green'
				/>
				<AdminStatCard
					label='Total Trades'
					value={totalTrades.toLocaleString()}
					icon={<BarChart2 className='h-5 w-5' />}
					accent='blue'
				/>
				<AdminStatCard
					label='Completed Deposits'
					value={totalDeposits.toLocaleString()}
					icon={<PiggyBankIcon className='h-5 w-5' />}
					accent='green'
				/>
				<AdminStatCard
					label='Completed Withdrawals'
					value={totalWithdrawals.toLocaleString()}
					icon={<CreditCardIcon className='h-5 w-5' />}
					accent='red'
				/>
				<AdminStatCard
					label='Online Users'
					value={onlineUsers.toLocaleString()}
					icon={<ActivitySquareIcon className='h-5 w-5' />}
					accent='purple'
				/>
				<AdminStatCard
					label='Pending Deposits'
					value={pendingDeposits.toLocaleString()}
					icon={<ClockIcon className='h-5 w-5' />}
					accent='amber'
				/>
				<AdminStatCard
					label='Pending Withdrawals'
					value={pendingWithdrawals.toLocaleString()}
					icon={<ClockIcon className='h-5 w-5' />}
					accent='red'
				/>
			</div>
		</div>
	);
};

export default AdminDashboard;
