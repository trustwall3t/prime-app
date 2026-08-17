import {Transaction, TransactionCardList } from "./TransactionCard";

interface WithdrawalHistoryProps {
	transactions: Transaction[];
}

const WithdrawalHistory = ({ transactions }: WithdrawalHistoryProps) => {
	return (
		<TransactionCardList
			transactions={transactions}
			emptyMessage='No withdrawals found.'
		/>
	);
};

export default WithdrawalHistory;
