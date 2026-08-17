import { Transaction, TransactionCardList } from './TransactionCard';

interface AllTransactionsProps {
	transactions: Transaction[];
}

const AllTransactions = ({ transactions }: AllTransactionsProps) => {
	return (
		<TransactionCardList
			transactions={transactions}
			emptyMessage='No transactions found.'
		/>
	);
};

export default AllTransactions;
