import { getAdminTraders } from '@/actions/admin/traders';
import { getEmittedCopyTrades } from '@/actions/admin/copyTrades';
import { redirect } from 'next/navigation';
import AdminTradersClient from './AdminTradersClient';

export default async function AdminTradersPage() {
	const [result, emittedTrades] = await Promise.all([
		getAdminTraders(),
		getEmittedCopyTrades(),
	]);

	if ('error' in result) {
		redirect('/admin/login');
	}

	return (
		<AdminTradersClient
			traders={result.traders}
			emittedTrades={emittedTrades}
		/>
	);
}
