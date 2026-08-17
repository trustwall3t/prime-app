import { TableSkeleton } from '@/components/skeletons';

export default function AdminTransactionsLoading() {
	return <TableSkeleton theme='light' rows={10} cols={6} />;
}
