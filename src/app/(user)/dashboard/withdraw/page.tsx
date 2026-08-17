import { WithdrawButton } from './withdraw-button';

import { getSession } from '@/lib/session';
import { formatMoney } from '@/lib/money';

const Withdraw = async () => {
	const session = await getSession();

	return (
		<div>
			<div className='p-10 bg-black text-white rounded-lg flex flex-col gap-4 items-center justify-center'>
				<h1 className='text-2xl font-bold'>Account Balance</h1>
				<p className='text-4xl font-bold bg-green-500 rounded-lg p-2 px-5'>
					${formatMoney(session?.user?.walletBalance)}
				</p>
				<WithdrawButton
					id={session?.user?.id || ''}
					ethAddress={session?.user?.ethAddress || ''}
					usdtAddress={session?.user?.usdtAddress || ''}
					btcAddress={session?.user?.btcAddress || ''}
				/>
			</div>
		</div>
	);
};

export default Withdraw;
