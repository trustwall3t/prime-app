import { Transaction, TransactionCardList } from './TransactionCard';

interface DepositHistoryProps {
	transactions: Transaction[];
}

const DepositHistory = ({ transactions }: DepositHistoryProps) => {
	return (
		<TransactionCardList
			transactions={transactions}
			emptyMessage='No deposits found.'
		/>
	);
};

export default DepositHistory;
