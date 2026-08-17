import { Transaction, TransactionCardList } from './TransactionCard';

interface TradingHistoryProps {
	transactions: Transaction[];
}

const TradingHistory = ({ transactions }: TradingHistoryProps) => {
	return (
		<TransactionCardList
			transactions={transactions}
			emptyMessage='No trades found.'
		/>
	);
};

export default TradingHistory;
