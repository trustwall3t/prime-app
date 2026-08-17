import { getUserById, type UserByIdResult } from '@/actions/admin/users';
import Link from 'next/link';
import {
	AdminCard,
	AdminPageHeader,
	AdminStatCard,
	adminBtnClass,
} from '@/app/(admin)/components/admin-ui';
import { ArrowLeft } from 'lucide-react';
import UserWalletAddresses from './UserWalletAddresses';

const ViewUser = async ({ params }: { params: Promise<{ id: string }> }) => {
	const resolvedParams = await params;
	const user: UserByIdResult | null = await getUserById(resolvedParams.id);

	if (!user) {
		return (
			<div className='flex flex-col gap-6'>
				<AdminPageHeader title='User not found' />
				<Link
					href='/admin/dashboard/users'
					className={adminBtnClass('secondary')}
				>
					<ArrowLeft className='h-4 w-4' />
					Back to users
				</Link>
			</div>
		);
	}

	const details = [
		{ label: 'Email', value: user.email },
		{ label: 'Phone', value: user.phone },
		{ label: 'Address', value: user.address },
		{ label: 'Country', value: user.country },
		{
			label: 'Yearly income range',
			value: user.yearlyIncomeRange || 'Not provided',
		},
		{ label: 'Account type', value: user.AccountType },
		{
			label: 'Registration date',
			value: user.createdAt.toLocaleDateString(),
		},
		{
			label: 'KYC status',
			value: user.isVerified ? 'Verified' : 'Not verified',
		},
		{ label: 'Referral code', value: user.refcode },
	];

	return (
		<div className='flex flex-col gap-6'>
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<AdminPageHeader
					title={user.name}
					description='User profile and account balances.'
				/>
				<Link
					href='/admin/dashboard/users'
					className={adminBtnClass('secondary')}
				>
					<ArrowLeft className='h-4 w-4' />
					Back to users
				</Link>
			</div>

			<div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
				<AdminStatCard
					label='Balance'
					value={`$${user.walletBalance?.toFixed(2)}`}
					accent='green'
				/>
				<AdminStatCard
					label='Invested amount'
					value={`$${user.investmentBalance?.toFixed(2)}`}
					accent='blue'
				/>
				<AdminStatCard
					label='Profit earned'
					value={`$${user.profitBalance?.toFixed(2)}`}
					accent='amber'
				/>
			</div>

			<AdminCard>
				<UserWalletAddresses
					btcAddress={user.btcAddress}
					ethAddress={user.ethAddress}
					usdtAddress={user.usdtAddress}
				/>
			</AdminCard>

			<AdminCard className='space-y-3'>
				{details.map((item) => (
					<div
						key={item.label}
						className='rounded-md border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm'
					>
						<span className='font-medium text-gray-400'>
							{item.label}:{' '}
						</span>
						<span className='text-white'>{item.value}</span>
					</div>
				))}
			</AdminCard>
		</div>
	);
};

export default ViewUser;
