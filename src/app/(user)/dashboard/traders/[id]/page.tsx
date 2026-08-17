import { notFound, redirect } from 'next/navigation';
import { getPublicTraderById } from '@/actions/user/traders';
import { getMyCopyTrades } from '@/actions/user/copyTrading';
import { getSession } from '@/lib/session';
import { toMoneyNumber } from '@/lib/money';
import TraderProfileClient from './TraderProfileClient';

export default async function TraderProfilePage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const session = await getSession();
	if (!session?.user) redirect('/login');

	const [trader, copiesResult] = await Promise.all([
		getPublicTraderById(id),
		getMyCopyTrades(),
	]);

	if (!trader) notFound();

	const copies = Array.isArray(copiesResult) ? copiesResult : [];
	const existingCopy =
		copies.find((c) => c.traderId === id && c.status === 'ACTIVE') ??
		null;

	return (
		<TraderProfileClient
			trader={trader}
			existingCopy={existingCopy}
			walletBalance={toMoneyNumber(session.user.walletBalance)}
		/>
	);
}
