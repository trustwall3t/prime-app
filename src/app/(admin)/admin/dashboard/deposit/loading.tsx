import { TableSkeleton } from '@/components/skeletons';

export default function AdminDepositLoading() {
	return <TableSkeleton theme='light' rows={8} cols={6} />;
}
