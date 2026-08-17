import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUserTransactionHistory } from '@/actions/getAllTransactions';
import {
	dashboardTabTriggerClass,
	dashboardTabsListClass,
} from '@/lib/userFormStyles';
import AllTransactions from './AllTransactions';
import DepositHistory from './DepositHistory';
import WithdrawalHistory from './WithdrawalHistory';
import TradingHistory from './TradingHistory';

const TransactionHistory = async () => {
	const transactions = await getUserTransactionHistory();

	const deposits = transactions.filter((t) => t.type === 'deposit');
	const withdrawals = transactions.filter((t) => t.type === 'withdrawal');
	const trades = transactions.filter((t) => t.type === 'trade');

	return (
		<div className='space-y-6'>
			<div className='space-y-2'>
				<h1 className='text-3xl font-bold text-white'>Transactions</h1>
				<p className='text-gray-400 text-sm'>
					History of deposits, withdrawals, and live trades.
				</p>
			</div>

			<Tabs
				className='w-full'
				defaultValue='transaction'
			>
				<TabsList className={dashboardTabsListClass}>
					<TabsTrigger
						value='transaction'
						className={dashboardTabTriggerClass}
					>
						All
					</TabsTrigger>
					<TabsTrigger
						value='deposit'
						className={dashboardTabTriggerClass}
					>
						Deposits
					</TabsTrigger>
					<TabsTrigger
						value='withdraw'
						className={dashboardTabTriggerClass}
					>
						Withdrawals
					</TabsTrigger>
					<TabsTrigger
						value='trade'
						className={dashboardTabTriggerClass}
					>
						Trade
					</TabsTrigger>
				</TabsList>

				<TabsContent
					value='transaction'
					className='mt-5 w-full'
				>
					<AllTransactions transactions={transactions} />
				</TabsContent>
				<TabsContent
					value='deposit'
					className='mt-5 w-full'
				>
					<DepositHistory transactions={deposits} />
				</TabsContent>
				<TabsContent
					value='withdraw'
					className='mt-5 w-full'
				>
					<WithdrawalHistory transactions={withdrawals} />
				</TabsContent>
				<TabsContent
					value='trade'
					className='mt-5 w-full'
				>
					<TradingHistory transactions={trades} />
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default TransactionHistory;
