'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { toast } from 'sonner';
import {
	Asset,
	AssetCategory,
	CHART_INTERVALS,
	ChartInterval,
	Trade,
	TradeDirection,
} from '../../../../types';
import AssetTicker from './AssetTicker';
import TradePanel from './TradePanel';
import TradesList from './TradeList';
import { placeTrade } from '@/actions/user/placeTrade';
import { syncTrades } from '@/actions/user/syncTrade';
import { refreshAssetPrices } from '@/actions/user/refreshPrices';
import { roundMoney } from '@/lib/money';
import {
	dashboardMoneyClass,
	dashboardPageTitleClass,
} from '@/lib/userFormStyles';

const TradingViewWidget = dynamic(() => import('./TradingviewWidget'), {
	ssr: false,
	loading: () => (
		<div className='h-[420px] animate-pulse rounded-md border border-zinc-700 bg-zinc-900' />
	),
});

const CHART_INTERVAL_MAP: Record<ChartInterval, string> = {
	'5M': '5',
	'15M': '15',
	'1H': '60',
	'1D': 'D',
};

const TRADE_POLL_INTERVAL_MS = 5000;
const TRADE_POLL_FAST_MS = 1500;
const TRADE_POLL_IDLE_MS = 15000;
const PRICE_POLL_INTERVAL_MS = 60_000;

interface TradingScreenProps {
	assets: Asset[];
	initialBalance: number;
	initialOpenTrades: Trade[];
	initialHistory: Trade[];
}

const TradingScreen = ({
	assets,
	initialBalance,
	initialOpenTrades,
	initialHistory,
}: TradingScreenProps) => {
	const [category, setCategory] = useState<AssetCategory>('stocks');
	const [selectedSymbol, setSelectedSymbol] = useState<string>(() => {
		const stocks = assets.filter((a) => a.category === 'stocks');
		return stocks[0]?.symbol ?? assets[0]?.symbol ?? '';
	});
	const [chartInterval, setChartInterval] = useState<ChartInterval>('5M');
	const placingRef = useRef(false);
	const syncInFlightRef = useRef(false);
	const notifiedTradeIdsRef = useRef(new Set<string>());

	const [balance, setBalance] = useState(initialBalance);
	const [openTrades, setOpenTrades] = useState<Trade[]>(initialOpenTrades);
	const [history, setHistory] = useState<Trade[]>(initialHistory);
	const [liveAssets, setLiveAssets] = useState<Asset[]>(assets);
	const [lastPriceUpdate, setLastPriceUpdate] = useState<Date>(() => new Date());

	const visibleAssets = useMemo(
		() => liveAssets.filter((a) => a.category === category),
		[liveAssets, category],
	);

	const selectedAsset = useMemo(() => {
		const match = liveAssets.find((a) => a.symbol === selectedSymbol);
		if (match) return match;
		return visibleAssets[0] ?? liveAssets[0];
	}, [liveAssets, selectedSymbol, visibleAssets]);

	// When switching category, pick the first asset in that tab if current
	// selection isn't visible.
	useEffect(() => {
		const visible = liveAssets.filter((a) => a.category === category);
		const stillVisible = visible.some((a) => a.symbol === selectedSymbol);
		if (!stillVisible && visible[0]) {
			setSelectedSymbol(visible[0].symbol);
		}
	}, [category, liveAssets, selectedSymbol]);

	// Don't re-toast trades that were already settled before this session.
	useEffect(() => {
		for (const trade of initialHistory) {
			notifiedTradeIdsRef.current.add(trade.id);
		}
	}, [initialHistory]);

	const openTradesRef = useRef(openTrades);
	openTradesRef.current = openTrades;

	const hasExpiredOpenTrades = useMemo(
		() =>
			openTrades.some(
				(t) =>
					t.status === 'open' &&
					new Date(t.expiresAt).getTime() <= Date.now(),
			),
		[openTrades],
	);

	const notifySettlements = (
		previous: Trade[],
		result: { openTrades: Trade[]; history: Trade[] },
	) => {
		for (const trade of previous) {
			if (trade.id.startsWith('pending-')) continue;
			if (result.openTrades.some((o) => o.id === trade.id)) continue;

			const settled = result.history.find((h) => h.id === trade.id);
			if (!settled || notifiedTradeIdsRef.current.has(settled.id)) {
				continue;
			}

			notifiedTradeIdsRef.current.add(settled.id);

			if (settled.status === 'won') {
				toast.success(
					`${settled.assetSymbol} won +$${settled.profit?.toFixed(2)}`,
				);
			} else if (settled.status === 'lost') {
				toast.error(
					`${settled.assetSymbol} lost $${Math.abs(settled.profit ?? 0).toFixed(2)}`,
				);
			}
		}
	};

	const refreshTrades = async () => {
		if (syncInFlightRef.current) return;
		syncInFlightRef.current = true;

		try {
			const previous = openTradesRef.current;
			const result = await syncTrades();
			if ('error' in result) return;

			notifySettlements(previous, result);
			setBalance(result.balance);
			setOpenTrades(result.openTrades);
			setHistory(result.history);
		} finally {
			syncInFlightRef.current = false;
		}
	};

	const refreshPrices = async () => {
		try {
			const updates = await refreshAssetPrices();
			if (!updates.length) return;

			const bySymbol = new Map(updates.map((u) => [u.symbol, u]));
			setLiveAssets((prev) =>
				prev.map((asset) => {
					const update = bySymbol.get(asset.symbol);
					if (!update) return asset;
					return {
						...asset,
						price: update.price,
						changePercent: update.changePercent,
						iconUrl: update.iconUrl ?? asset.iconUrl,
					};
				}),
			);
			setLastPriceUpdate(new Date());
		} catch (err) {
			console.error('Price refresh failed:', err);
		}
	};

	useEffect(() => {
		const interval = setInterval(refreshPrices, PRICE_POLL_INTERVAL_MS);
		return () => clearInterval(interval);
	}, []);

	// Settle trades on load and keep polling while this screen is open.
	useEffect(() => {
		void refreshTrades();

		const pollMs = hasExpiredOpenTrades
			? TRADE_POLL_FAST_MS
			: openTrades.length > 0
				? TRADE_POLL_INTERVAL_MS
				: TRADE_POLL_IDLE_MS;

		const interval = setInterval(refreshTrades, pollMs);
		return () => clearInterval(interval);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [hasExpiredOpenTrades, openTrades.length]);

	const handlePlaceTrade = ({
		direction,
		stake,
		durationSeconds,
	}: {
		direction: TradeDirection;
		stake: number;
		durationSeconds: number;
	}) => {
		if (!selectedAsset || placingRef.current) return;
		if (selectedAsset.price <= 0) {
			toast.error('Price not loaded yet — wait a moment and try again.');
			return;
		}

		const stakeAmount = roundMoney(stake);
		if (stakeAmount <= 0 || stakeAmount > balance) return;

		placingRef.current = true;

		const openedAt = new Date();
		const expiresAt = new Date(
			openedAt.getTime() + durationSeconds * 1000,
		);
		const tempId = `pending-${openedAt.getTime()}`;

		const optimisticTrade: Trade = {
			id: tempId,
			assetSymbol: selectedAsset.symbol,
			assetName: selectedAsset.name,
			direction,
			stake: stakeAmount,
			durationSeconds,
			entryPrice: selectedAsset.price,
			exitPrice: null,
			profit: null,
			status: 'open',
			openedAt: openedAt.toISOString(),
			expiresAt: expiresAt.toISOString(),
			closedAt: null,
		};

		// Instant feedback — no waiting on the server.
		setBalance((prev) => prev - stakeAmount);
		setOpenTrades((prev) => [optimisticTrade, ...prev]);
		toast.success(
			`Trade placed: ${direction.toUpperCase()} ${selectedAsset.symbol}`,
		);

		const formData = new FormData();
		formData.append('assetSymbol', selectedAsset.symbol);
		formData.append('direction', direction);
		formData.append('stake', String(stakeAmount));
		formData.append('durationSeconds', String(durationSeconds));
		formData.append('entryPrice', String(selectedAsset.price));

		void placeTrade(formData)
			.then((result) => {
				if (result?.error) {
					setBalance((prev) => prev + stakeAmount);
					setOpenTrades((prev) =>
						prev.filter((t) => t.id !== tempId),
					);
					toast.error(result.error);
					return;
				}

				if (result.balance != null) {
					setBalance(result.balance);
				}

				if (result.trade) {
					setOpenTrades((prev) =>
						prev.map((t) =>
							t.id === tempId ? result.trade! : t,
						),
					);
				}
			})
			.catch((err) => {
				console.error('Place trade failed:', err);
				setBalance((prev) => prev + stakeAmount);
				setOpenTrades((prev) => prev.filter((t) => t.id !== tempId));
				toast.error('Failed to place trade. Please try again.');
			})
			.finally(() => {
				placingRef.current = false;
			});
	};

	if (!selectedAsset) {
		return (
			<div className='rounded-md border border-zinc-700 bg-zinc-900 p-8 text-center text-gray-400'>
				No tradeable assets are available right now.
			</div>
		);
	}

	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between text-xs text-gray-500'>
				<p>
					{visibleAssets.length} {category} assets · Top 20 each
				</p>
				<p>
					Prices update every 1 min · Last updated{' '}
					{lastPriceUpdate.toLocaleTimeString()}
				</p>
			</div>

			<AssetTicker
				assets={visibleAssets}
				selectedSymbol={selectedAsset.symbol}
				onSelect={(asset) => setSelectedSymbol(asset.symbol)}
			/>

			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={selectedAsset.iconUrl}
						alt={selectedAsset.symbol}
						className='h-14 w-14 rounded-md object-contain'
					/>
					<div>
						<h2 className={dashboardPageTitleClass}>
							{selectedAsset.symbol}
						</h2>
						<p className='text-sm text-gray-400'>
							{selectedAsset.name}
						</p>
					</div>
				</div>

				<div className='text-right'>
					<p className={`${dashboardStatValueClass} tabular-nums`}>
						{selectedAsset.price.toFixed(2)}
					</p>
					<p
						className={`text-sm font-medium ${
							selectedAsset.changePercent >= 0
								? 'text-emerald-400'
								: 'text-red-400'
						}`}
					>
						{selectedAsset.changePercent >= 0 ? '+' : ''}
						{selectedAsset.changePercent.toFixed(2)}%
					</p>
				</div>
			</div>

			<div className='flex gap-3'>
				{CHART_INTERVALS.map((interval) => (
					<button
						key={interval}
						type='button'
						onClick={() => setChartInterval(interval)}
						className={`rounded-md border px-4 py-2 text-sm font-semibold transition ${
							chartInterval === interval
								? 'border-indigo-500 bg-indigo-500 text-white'
								: 'border-zinc-700 bg-zinc-800 text-gray-300 hover:border-zinc-600'
						}`}
					>
						{interval}
					</button>
				))}
			</div>

			<TradingViewWidget
				symbol={selectedAsset.tradingViewSymbol}
				interval={CHART_INTERVAL_MAP[chartInterval]}
			/>

			<TradesList
				openTrades={openTrades}
				history={history}
			/>

			<TradePanel
				balance={balance}
				currentPrice={selectedAsset.price}
				onPlaceTrade={handlePlaceTrade}
			/>

			<div className='grid grid-cols-2 gap-4'>
				<button
					type='button'
					onClick={() => setCategory('stocks')}
					className={`rounded-md border py-3 text-center font-medium transition ${
						category === 'stocks'
							? 'border-indigo-500 text-indigo-400'
							: 'border-zinc-700 text-gray-400 hover:border-zinc-600'
					}`}
				>
					Stocks
				</button>
				<button
					type='button'
					onClick={() => setCategory('crypto')}
					className={`rounded-md border py-3 text-center font-medium transition ${
						category === 'crypto'
							? 'border-indigo-500 text-indigo-400'
							: 'border-zinc-700 text-gray-400 hover:border-zinc-600'
					}`}
				>
					Crypto
				</button>
			</div>
		</div>
	);
};

export default TradingScreen;
