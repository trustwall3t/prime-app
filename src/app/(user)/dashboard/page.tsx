
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { buildRankingView, getRankMetrics } from '@/lib/ranking';
import { getUserDashboardFinancials } from '@/actions/user/dashboardStats';
import { loadTradingAssetsWithPrices } from '@/actions/user/refreshPrices';
import DashboardClient from './_components/DashboardClient';
import { dashboardPageWrapClass } from '@/lib/userFormStyles';

const DashboardPage = async () => {
	const session = await getSession();
	if (!session?.user) {
		redirect('/login');
	}

	const user = session.user;

	const [metrics, copies, financials, marketAssets] = await Promise.all([
		getRankMetrics(user.id),
		db.copyTrading.findMany({
			where: {
				userId: user.id,
				status: { in: ['ACTIVE', 'PAUSED'] },
			},
			include: {
				trader: {
					select: {
						name: true,
						winRate: true,
						marketType: true,
					},
				},
			},
			orderBy: { startedAt: 'desc' },
			take: 5,
		}),
		getUserDashboardFinancials(user.id),
		loadTradingAssetsWithPrices(),
	]);

	const ranking = buildRankingView(metrics);
	const activeCopy = copies[0]
		? {
				traderName: copies[0].trader.name,
				traderId: copies[0].traderId,
				winRate: copies[0].trader.winRate ?? 0,
				allocationPercentage: copies[0].allocationPercentage,
				status: copies[0].status,
				totalCopies: copies.length,
			}
		: null;

	return (
		<div className={dashboardPageWrapClass}>
			<DashboardClient
				user={user}
				ranking={ranking.currentRank}
				nextRankName={ranking.nextTier?.name ?? ranking.achieved?.name ?? 'Platinum'}
				activeCopy={activeCopy}
				totalWithdrawals={financials.totalWithdrawals}
				tradeInterest={financials.tradeInterest}
				marketAssets={marketAssets}
			/>
		</div>
	);
};

export default DashboardPage;
