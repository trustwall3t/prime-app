import { redirect } from 'next/navigation';
import {
	getMyCopiedTradeHistory,
	getMyCopyTrades,
} from '@/actions/user/copyTrading';
import { syncTrades } from '@/actions/user/syncTrade';
import { getSession } from '@/lib/session';
import CopyTradingClient from './CopyTradingClient';

export const dynamic = 'force-dynamic';

export default async function CopyTradingPage() {
	const session = await getSession();
	if (!session?.user) redirect('/login');

	await syncTrades(session.user.id);

	const [copiesResult, tradesResult] = await Promise.all([
		getMyCopyTrades(),
		getMyCopiedTradeHistory(),
	]);

	if (!Array.isArray(copiesResult)) {
		redirect('/login');
	}

	const activeCopies = copiesResult.filter((c) => c.status === 'ACTIVE');
	const copiedTrades = Array.isArray(tradesResult) ? tradesResult : [];
	const tradesError =
		!Array.isArray(tradesResult) && 'error' in tradesResult
			? tradesResult.error
			: null;

	return (
		<CopyTradingClient
			copies={activeCopies}
			copiedTrades={copiedTrades}
			tradesError={tradesError}
		/>
	);
}
