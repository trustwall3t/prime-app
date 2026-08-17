import { redirect } from 'next/navigation';
import { getAdminTradingHistory } from '@/actions/admin/tradingHistory';
import AdminTradingHistoryClient from './AdminTradingHistoryClient';

export const dynamic = 'force-dynamic';

export default async function TradePage() {
	const result = await getAdminTradingHistory();

	if ('error' in result) {
		redirect('/admin/login');
	}

	return (
		<AdminTradingHistoryClient
			trades={result.trades}
			stats={result.stats}
		/>
	);
}
