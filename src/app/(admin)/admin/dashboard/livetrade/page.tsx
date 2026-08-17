import TradeForm from '@/app/(admin)/components/form/TradeForm';
import BalanceForm from '@/app/(admin)/components/form/BalanceForm';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { getAllUsers } from '../../../../../actions/admin/users';
import UserSelect from '@/app/(admin)/components/UserSelect';
import {
	AdminCard,
	AdminPageHeader,
} from '@/app/(admin)/components/admin-ui';

type UserData = {
	id: string;
	name: string;
	email: string;
	phone: string;
	walletBalance: number | null;
	profitBalance: number | null;
	investmentBalance: number | null;
	targetBalance: number | null;
	refcode: string | null;
	isVerified: boolean;
	createdAt: Date;
};

export default async function LiveTrade({
	searchParams,
}: {
	searchParams: Promise<{ userId?: string }>;
}) {
	const users = await getAllUsers();
	const params = await searchParams;
	const selectedUser: UserData | null = params.userId
		? users.find((user) => user.id === params.userId) || null
		: null;

	return (
		<div className='flex flex-col gap-6'>
			<AdminPageHeader
				title='Live trading'
				description='Select a user to update balances or place trades.'
			/>
			<AdminCard>
				<div className='flex w-full flex-col items-start justify-between gap-6 md:flex-row'>
					<UserSelect
						users={users}
						defaultUserId={selectedUser?.id}
					/>
					<div className='w-full md:w-2/3'>
						<Tabs defaultValue='trade'>
							<TabsList className='flex w-full justify-start gap-2 bg-transparent p-0'>
								<TabsTrigger
									value='balance'
									className='rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-white data-[state=active]:bg-zinc-700'
								>
									Balance
								</TabsTrigger>
								<TabsTrigger
									value='trade'
									className='rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-white data-[state=active]:bg-zinc-700'
								>
									Trade
								</TabsTrigger>
							</TabsList>
							<TabsContent value='balance' className='mt-6 w-full'>
								<BalanceForm user={selectedUser} />
							</TabsContent>
							<TabsContent value='trade' className='mt-6 w-full'>
								<TradeForm user={selectedUser} />
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</AdminCard>
		</div>
	);
}
