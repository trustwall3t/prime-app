import React from 'react';
import { getSession } from '@/lib/session';
import TradingScreen from './TradingScreen';
import { syncTrades } from '@/actions/user/syncTrade';
import { loadTradingAssetsWithPrices } from '@/actions/user/refreshPrices';

const TradingPage = async () => {
	try {
		const session = await getSession(false);

		const [assets, initial] = await Promise.all([
			loadTradingAssetsWithPrices(),
			session?.user
				? syncTrades(session.user.id)
				: Promise.resolve(null),
		]);

		const tradingData =
			initial && !('error' in initial)
				? initial
				: { balance: 0, openTrades: [], history: [] };

		if (assets.length === 0) {
			return (
				<div className='rounded-md border border-zinc-700 bg-zinc-900 p-8 text-center text-gray-400'>
					No tradeable assets are available right now. Please try
					again later.
				</div>
			);
		}

		return (
			<div className='space-y-6'>
				<TradingScreen
					assets={assets}
					initialBalance={tradingData.balance}
					initialOpenTrades={tradingData.openTrades}
					initialHistory={tradingData.history}
				/>
			</div>
		);
	} catch (error) {
		console.error('Live trading page failed to load:', error);
		return (
			<div className='rounded-md border border-red-800 bg-zinc-900 p-8 text-center'>
				<p className='font-medium text-red-400'>
					Unable to load live trading right now.
				</p>
				<p className='mt-2 text-sm text-gray-400'>
					Please refresh the page. If the problem continues, check
					your database connection.
				</p>
			</div>
		);
	}
};

export default TradingPage;
