export type AssetCategory = 'stocks' | 'crypto';

export interface Asset {
	symbol: string; // e.g. 'AAPL', 'BTCUSDT'
	name: string; // e.g. 'Apple Inc.'
	iconUrl: string;
	category: AssetCategory;
	// TradingView expects "EXCHANGE:SYMBOL", e.g. 'NASDAQ:AAPL', 'BINANCE:BTCUSDT'
	tradingViewSymbol: string;
	price: number;
	changePercent: number;
}

export type TradeDirection = 'up' | 'down';
export type TradeStatus = 'open' | 'won' | 'lost' | 'even' | 'expired';

// Duration in seconds — matches the picker in the screenshot.
export const DURATIONS = [
	{ label: '1m', seconds: 60 },
	{ label: '5m', seconds: 300 },
	{ label: '15m', seconds: 900 },
	{ label: '1h', seconds: 3600 },
	{ label: '4h', seconds: 14400 },
	{ label: '1d', seconds: 86400 },
] as const;

export type DurationLabel = (typeof DURATIONS)[number]['label'];

/** Copy-traded signals never run shorter than 15 minutes. */
export const COPY_TRADE_MIN_DURATION_SECONDS = 900;

export const COPY_TRADE_DURATIONS = DURATIONS.filter(
	(d) => d.seconds >= COPY_TRADE_MIN_DURATION_SECONDS,
);

export const CHART_INTERVALS = ['5M', '15M', '1H', '1D'] as const;
export type ChartInterval = (typeof CHART_INTERVALS)[number];

export const QUICK_STAKES = [10, 25, 50, 100, 250] as const;

export interface Trade {
	id: string;
	assetSymbol: string;
	assetName: string;
	direction: TradeDirection;
	stake: number;
	durationSeconds: number;
	entryPrice: number;
	exitPrice: number | null;
	profit: number | null; // positive on win, -stake on loss, null while open
	status: TradeStatus;
	openedAt: string; // ISO date
	expiresAt: string; // ISO date
	closedAt: string | null;
}
