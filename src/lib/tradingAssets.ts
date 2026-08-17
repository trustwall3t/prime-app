import { db } from '@/lib/db';
import {
	getCryptoLogoUrl,
	getStockLogoUrl,
	resolveAssetLogoUrl,
} from '@/lib/assetLogos';
import type { AssetCategory } from '@/types';

export interface TradingAssetSeed {
	symbol: string;
	name: string;
	category: AssetCategory;
	iconUrl: string;
	tradingViewSymbol: string;
	externalSymbol: string;
}

function stock(
	symbol: string,
	name: string,
	exchange: 'NASDAQ' | 'NYSE' = 'NASDAQ',
	tradingViewSymbol?: string,
): TradingAssetSeed {
	return {
		symbol,
		name,
		category: 'stocks',
		iconUrl: getStockLogoUrl(symbol),
		tradingViewSymbol: tradingViewSymbol ?? `${exchange}:${symbol}`,
		externalSymbol: symbol,
	};
}

function crypto(symbol: string, name: string): TradingAssetSeed {
	const pair = `${symbol}USDT`;
	return {
		symbol,
		name,
		category: 'crypto',
		iconUrl: getCryptoLogoUrl(symbol),
		tradingViewSymbol: `BINANCE:${pair}`,
		externalSymbol: pair,
	};
}

// Top 20 US stocks and top 20 crypto by market cap / liquidity.
export const TOP_STOCKS: TradingAssetSeed[] = [
	stock('AAPL', 'Apple Inc.'),
	stock('MSFT', 'Microsoft Corp.'),
	stock('GOOGL', 'Alphabet Inc.'),
	stock('AMZN', 'Amazon.com Inc.'),
	stock('NVDA', 'NVIDIA Corp.'),
	stock('META', 'Meta Platforms Inc.'),
	stock('TSLA', 'Tesla Inc.'),
	stock('BRK-B', 'Berkshire Hathaway', 'NYSE', 'NYSE:BRK.B'),
	stock('LLY', 'Eli Lilly & Co.', 'NYSE'),
	stock('AVGO', 'Broadcom Inc.', 'NASDAQ'),
	stock('JPM', 'JPMorgan Chase & Co.', 'NYSE'),
	stock('V', 'Visa Inc.', 'NYSE'),
	stock('UNH', 'UnitedHealth Group', 'NYSE'),
	stock('WMT', 'Walmart Inc.', 'NYSE'),
	stock('MA', 'Mastercard Inc.', 'NYSE'),
	stock('XOM', 'Exxon Mobil Corp.', 'NYSE'),
	stock('PG', 'Procter & Gamble Co.', 'NYSE'),
	stock('HD', 'Home Depot Inc.', 'NYSE'),
	stock('COST', 'Costco Wholesale Corp.', 'NASDAQ'),
	stock('NFLX', 'Netflix Inc.'),
];

export const TOP_CRYPTO: TradingAssetSeed[] = [
	crypto('BTC', 'Bitcoin'),
	crypto('ETH', 'Ethereum'),
	crypto('BNB', 'BNB'),
	crypto('SOL', 'Solana'),
	crypto('XRP', 'XRP'),
	crypto('ADA', 'Cardano'),
	crypto('DOGE', 'Dogecoin'),
	crypto('TRX', 'TRON'),
	crypto('LINK', 'Chainlink'),
	crypto('AVAX', 'Avalanche'),
	crypto('MATIC', 'Polygon'),
	crypto('DOT', 'Polkadot'),
	crypto('LTC', 'Litecoin'),
	crypto('BCH', 'Bitcoin Cash'),
	crypto('UNI', 'Uniswap'),
	crypto('ATOM', 'Cosmos'),
	crypto('XLM', 'Stellar'),
	crypto('ETC', 'Ethereum Classic'),
	crypto('FIL', 'Filecoin'),
	crypto('NEAR', 'NEAR Protocol'),
];

export const DEFAULT_TRADING_ASSETS: TradingAssetSeed[] = [
	...TOP_STOCKS,
	...TOP_CRYPTO,
];

const ASSET_ORDER = new Map(
	DEFAULT_TRADING_ASSETS.map((asset, index) => [asset.symbol, index]),
);

function sortBySeedOrder<T extends { symbol: string }>(assets: T[]): T[] {
	return [...assets].sort(
		(a, b) =>
			(ASSET_ORDER.get(a.symbol) ?? 999) -
			(ASSET_ORDER.get(b.symbol) ?? 999),
	);
}

// Seeds or updates all default assets in parallel.
export async function ensureTradingAssets() {
	await Promise.all(
		DEFAULT_TRADING_ASSETS.map((asset) =>
			db.asset.upsert({
				where: { symbol: asset.symbol },
				create: asset,
				update: {
					name: asset.name,
					category: asset.category,
					iconUrl: asset.iconUrl,
					tradingViewSymbol: asset.tradingViewSymbol,
					externalSymbol: asset.externalSymbol,
				},
			}),
		),
	);

	const all = await db.asset.findMany();
	const allowed = new Set(DEFAULT_TRADING_ASSETS.map((a) => a.symbol));
	return sortBySeedOrder(all.filter((a) => allowed.has(a.symbol)));
}

// Fast read used by price polling — only seeds when the table is empty.
let cachedAssets: Awaited<ReturnType<typeof db.asset.findMany>> | null = null;
let cachedAssetsAt = 0;
const ASSET_LIST_CACHE_MS = 60_000;

export async function listTradingAssets() {
	const now = Date.now();
	if (cachedAssets && now - cachedAssetsAt < ASSET_LIST_CACHE_MS) {
		return cachedAssets;
	}

	const all = await db.asset.findMany();
	const allowed = new Set(DEFAULT_TRADING_ASSETS.map((a) => a.symbol));
	const existing = sortBySeedOrder(
		all.filter((a) => allowed.has(a.symbol)),
	);

	if (existing.length === 0) {
		const seeded = await ensureTradingAssets();
		cachedAssets = seeded;
		cachedAssetsAt = now;
		return seeded;
	}

	cachedAssets = existing;
	cachedAssetsAt = now;
	return existing;
}

export function getDefaultIconUrl(
	symbol: string,
	category: AssetCategory,
): string {
	return resolveAssetLogoUrl(symbol, category);
}
