import { getUserReferralData } from '@/actions/user/referrals';
import { redirect } from 'next/navigation';
import ReferralsClient from './ReferralsClient';

export const dynamic = 'force-dynamic';

export default async function ReferralsPage() {
	const data = await getUserReferralData();

	if ('error' in data) {
		redirect('/login');
	}

	return (
		<ReferralsClient
			referralLink={data.referralLink}
			refcode={data.refcode}
			stats={data.stats}
			referrals={data.referrals}
		/>
	);
}
