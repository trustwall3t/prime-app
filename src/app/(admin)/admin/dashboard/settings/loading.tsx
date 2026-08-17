import { FormSkeleton } from '@/components/skeletons';

export default function AdminSettingsLoading() {
	return <FormSkeleton theme='light' fields={4} />;
}
