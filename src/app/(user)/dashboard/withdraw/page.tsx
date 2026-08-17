import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import WithdrawFlow from './WithdrawFlow';

export default async function WithdrawPage() {
	const session = await getSession();
	if (!session?.user) redirect('/login');

	const user = session.user;

	return (
		<WithdrawFlow
			user={{
				id: user.id,
				walletBalance: user.walletBalance ?? 0,
				isVerified: user.isVerified ?? false,
				btcAddress: user.btcAddress,
				ethAddress: user.ethAddress,
				usdtAddress: user.usdtAddress,
			}}
		/>
	);
}
