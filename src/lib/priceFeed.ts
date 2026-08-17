// Live price lookups used for both trade entry and settlement.
// Crypto -> Binance (with fallbacks) then CoinGecko.
// Stocks -> Yahoo Finance chart endpoint.

type AssetCategory = 'stocks' | 'crypto';

export interface PriceQuote {
	price: number;
	changePercent: number;
	iconUrl?: string;
}

const CACHE_TTL_MS = 55_000;
const FETCH_TIMEOUT_MS = 6_000;
const FETCH_REVALIDATE_SECONDS = 55;

const priceCache = new Map<
	string,
	{ quote: PriceQuote; fetchedAt: number }
>();

async function fetchWithTimeout(
	url: string,
	init?: RequestInit,
): Promise<Response> {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
	try {
		return await fetch(url, {
			...init,
			signal: controller.signal,
			next: { revalidate: FETCH_REVALIDATE_SECONDS },
		});
	} finally {
		clearTimeout(timeout);
	}
}

let cryptoTickerCache: {
	fetchedAt: number;
	byPair: Map<string, PriceQuote>;
} | null = null;

const BINANCE_BASES = [
	'https://data-api.binance.vision/api/v3',
	'https://api.binance.com/api/v3',
];

// CoinGecko ids for our top-20 crypto list.
const COINGECKO_IDS: Record<string, string> = {
	BTC: 'bitcoin',
	ETH: 'ethereum',
	BNB: 'binancecoin',
	SOL: 'solana',
	XRP: 'ripple',
	ADA: 'cardano',
	DOGE: 'dogecoin',
	TRX: 'tron',
	LINK: 'chainlink',
	AVAX: 'avalanche-2',
	MATIC: 'matic-network',
	DOT: 'polkadot',
	LTC: 'litecoin',
	BCH: 'bitcoin-cash',
	UNI: 'uniswap',
	ATOM: 'cosmos',
	XLM: 'stellar',
	ETC: 'ethereum-classic',
	FIL: 'filecoin',
	NEAR: 'near',
};

// Some pairs were renamed on Binance — try these if the primary pair is missing.
const CRYPTO_PAIR_FALLBACKS: Record<string, string[]> = {
	MATIC: ['POLUSDT', 'MATICUSDT'],
};

async function fetchSingleCryptoQuote(
	externalSymbol: string,
): Promise<PriceQuote | null> {
	for (const base of BINANCE_BASES) {
		try {
			const res = await fetchWithTimeout(
				`${base}/ticker/24hr?symbol=${externalSymbol}`,
			);
			if (!res.ok) continue;

			const data = (await res.json()) as {
				lastPrice: string;
				priceChangePercent: string;
			};
			const price = Number(data.lastPrice);
			const changePercent = Number(data.priceChangePercent);
			if (!Number.isFinite(price)) continue;

			return {
				price,
				changePercent: Number.isFinite(changePercent)
					? changePercent
					: 0,
			};
		} catch (err) {
			console.error(
				`Binance single ticker failed (${base}, ${externalSymbol}):`,
				err,
			);
		}
	}
	return null;
}

async function fetchCryptoTickerMapFromBinance(): Promise<Map<
	string,
	PriceQuote
> | null> {
	for (const base of BINANCE_BASES) {
		try {
			const res = await fetchWithTimeout(`${base}/ticker/24hr`);
			if (!res.ok) continue;

			const data = (await res.json()) as Array<{
				symbol: string;
				lastPrice: string;
				priceChangePercent: string;
			}>;

			const byPair = new Map<string, PriceQuote>();
			for (const ticker of data) {
				const price = Number(ticker.lastPrice);
				const changePercent = Number(ticker.priceChangePercent);
				if (!Number.isFinite(price)) continue;
				byPair.set(ticker.symbol, {
					price,
					changePercent: Number.isFinite(changePercent)
						? changePercent
						: 0,
				});
			}

			if (byPair.size > 0) return byPair;
		} catch (err) {
			console.error(`Binance ticker fetch failed (${base}):`, err);
		}
	}
	return null;
}

async function fetchCryptoFromCoinGecko(
	symbols: string[],
): Promise<Map<string, PriceQuote>> {
	const ids = symbols
		.map((s) => COINGECKO_IDS[s])
		.filter(Boolean);

	if (ids.length === 0) return new Map();

	try {
		const res = await fetchWithTimeout(
			`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids.join(',')}&sparkline=false`,
		);
		if (!res.ok) return new Map();

		const data = (await res.json()) as Array<{
			id: string;
			symbol: string;
			current_price: number;
			price_change_percentage_24h: number | null;
			image: string;
		}>;

		const idToSymbol = Object.fromEntries(
			Object.entries(COINGECKO_IDS).map(([symbol, id]) => [id, symbol]),
		);

		const results = new Map<string, PriceQuote>();
		for (const coin of data) {
			const symbol = idToSymbol[coin.id]?.toUpperCase();
			if (!symbol || !Number.isFinite(coin.current_price)) continue;
			results.set(symbol, {
				price: coin.current_price,
				changePercent: coin.price_change_percentage_24h ?? 0,
				iconUrl: coin.image,
			});
		}
		return results;
	} catch (err) {
		console.error('CoinGecko markets fetch failed:', err);
		return new Map();
	}
}

async function fetchCryptoTickerMap(
	symbols: string[] = [],
): Promise<Map<string, PriceQuote>> {
	if (
		cryptoTickerCache &&
		Date.now() - cryptoTickerCache.fetchedAt < CACHE_TTL_MS
	) {
		return cryptoTickerCache.byPair;
	}

	const binance = await fetchCryptoTickerMapFromBinance();
	if (binance && binance.size > 0) {
		cryptoTickerCache = { fetchedAt: Date.now(), byPair: binance };
		return binance;
	}

	// Binance blocked or unavailable — fall back to CoinGecko by display symbol.
	const coingecko = await fetchCryptoFromCoinGecko(symbols);
	const byPair = new Map<string, PriceQuote>();
	for (const [symbol, quote] of coingecko) {
		byPair.set(`${symbol}USDT`, quote);
	}
	cryptoTickerCache = { fetchedAt: Date.now(), byPair };
	return byPair;
}

function resolveCryptoQuote(
	displaySymbol: string,
	primaryPair: string,
	tickers: Map<string, PriceQuote>,
): PriceQuote | null {
	const direct = tickers.get(primaryPair);
	if (direct) return direct;

	const fallbacks = CRYPTO_PAIR_FALLBACKS[displaySymbol] ?? [];
	for (const pair of fallbacks) {
		const quote = tickers.get(pair);
		if (quote) return quote;
	}

	// CoinGecko fallback stores by USDT pair key from symbol map.
	return tickers.get(`${displaySymbol}USDT`) ?? null;
}

async function fetchCryptoQuote(
	displaySymbol: string,
	externalSymbol: string,
	skipCache = false,
): Promise<PriceQuote | null> {
	const cacheKey = `crypto:${externalSymbol}`;
	if (!skipCache) {
		const cached = priceCache.get(cacheKey);
		if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
			return cached.quote;
		}
	}

	// Single-symbol lookup first — avoids downloading the full ticker list
	// when placing or settling one trade.
	let quote = await fetchSingleCryptoQuote(externalSymbol);

	if (!quote) {
		const tickers = await fetchCryptoTickerMap([displaySymbol]);
		quote = resolveCryptoQuote(
			displaySymbol,
			externalSymbol,
			tickers,
		);
	}

	if (!quote) {
		const coingecko = await fetchCryptoFromCoinGecko([displaySymbol]);
		quote = coingecko.get(displaySymbol) ?? null;
	}

	if (quote) {
		priceCache.set(cacheKey, { quote, fetchedAt: Date.now() });
	}
	return quote;
}

async function fetchStockQuote(
	externalSymbol: string,
	skipCache = false,
): Promise<PriceQuote | null> {
	const cacheKey = `stocks:${externalSymbol}`;
	if (!skipCache) {
		const cached = priceCache.get(cacheKey);
		if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
			return cached.quote;
		}
	}

	try {
		const res = await fetchWithTimeout(
			`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(externalSymbol)}`,
			{
				headers: {
					'User-Agent':
						'Mozilla/5.0 (compatible; TradingSimBot/1.0)',
				},
			},
		);
		if (!res.ok) return null;

		const data = await res.json();
		const meta = data?.chart?.result?.[0]?.meta;
		const price = meta?.regularMarketPrice;
		if (typeof price !== 'number') return null;

		const previousClose =
			meta?.chartPreviousClose ?? meta?.previousClose ?? price;
		const changePercent =
			previousClose > 0
				? ((price - previousClose) / previousClose) * 100
				: 0;

		const quote = { price, changePercent };
		priceCache.set(cacheKey, { quote, fetchedAt: Date.now() });
		return quote;
	} catch (err) {
		console.error(
			`Yahoo price fetch failed for ${externalSymbol}:`,
			err,
		);
		return null;
	}
}

export async function getPriceQuote(
	externalSymbol: string,
	category: AssetCategory,
	skipCache = false,
	displaySymbol?: string,
): Promise<PriceQuote | null> {
	return category === 'crypto'
		? fetchCryptoQuote(
				displaySymbol ?? externalSymbol.replace(/USDT$/, ''),
				externalSymbol,
				skipCache,
			)
		: fetchStockQuote(externalSymbol, skipCache);
}

export async function getLatestPrice(
	externalSymbol: string,
	category: AssetCategory,
	skipCache = false,
	displaySymbol?: string,
): Promise<number | null> {
	const quote = await getPriceQuote(
		externalSymbol,
		category,
		skipCache,
		displaySymbol,
	);
	return quote?.price ?? null;
}

export async function getBatchPriceQuotes(
	assets: Array<{
		symbol: string;
		externalSymbol: string;
		category: AssetCategory;
	}>,
	skipCache = false,
): Promise<Map<string, PriceQuote>> {
	const results = new Map<string, PriceQuote>();

	const cryptoAssets = assets.filter((a) => a.category === 'crypto');
	const stockAssets = assets.filter((a) => a.category === 'stocks');

	if (cryptoAssets.length > 0) {
		if (skipCache) cryptoTickerCache = null;

		const tickers = await fetchCryptoTickerMap(
			cryptoAssets.map((a) => a.symbol),
		);

		const missingSymbols: string[] = [];
		for (const asset of cryptoAssets) {
			const quote = resolveCryptoQuote(
				asset.symbol,
				asset.externalSymbol,
				tickers,
			);
			if (quote) {
				results.set(asset.symbol, quote);
			} else {
				missingSymbols.push(asset.symbol);
			}
		}

		if (missingSymbols.length > 0) {
			const coingecko = await fetchCryptoFromCoinGecko(missingSymbols);
			for (const symbol of missingSymbols) {
				const quote = coingecko.get(symbol);
				if (quote) results.set(symbol, quote);
			}
		}
	}

	if (stockAssets.length > 0) {
		const stockQuotes = await Promise.all(
			stockAssets.map(async (asset) => {
				const quote = await fetchStockQuote(
					asset.externalSymbol,
					skipCache,
				);
				return { symbol: asset.symbol, quote };
			}),
		);
		for (const { symbol, quote } of stockQuotes) {
			if (quote) results.set(symbol, quote);
		}
	}

	return results;
}
