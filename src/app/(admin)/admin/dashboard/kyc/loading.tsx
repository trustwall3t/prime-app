import { TableSkeleton } from '@/components/skeletons';

export default function AdminKycLoading() {
	return <TableSkeleton theme='light' rows={8} cols={5} />;
}
