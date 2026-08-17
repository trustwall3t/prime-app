import { TableSkeleton } from '@/components/skeletons';

export default function AdminUsersLoading() {
	return <TableSkeleton theme='light' rows={10} cols={7} />;
}
