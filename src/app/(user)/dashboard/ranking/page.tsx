import { getUserRankingData } from '@/actions/user/ranking';
import { redirect } from 'next/navigation';
import RankingClient from './RankingClient';

export default async function RankingPage() {
	const data = await getUserRankingData();

	if ('error' in data) {
		redirect('/login');
	}

	return (
		<RankingClient
			currentRank={data.currentRank}
			tiers={data.tiers}
			bonusEarned={data.referralBonusTotal}
		/>
	);
}
