'use server';

import {
	ensureTradingAssets,
	getDefaultIconUrl,
	listTradingAssets,
} from '@/lib/tradingAssets';
import { getBatchPriceQuotes } from '@/lib/priceFeed';
import type { Asset, AssetCategory } from '@/types';

export interface AssetPriceUpdate {
	symbol: string;
	price: number;
	changePercent: number;
	iconUrl?: string;
}

function buildAssetFromDb(
	a: Awaited<ReturnType<typeof listTradingAssets>>[number],
	quote?: { price: number; changePercent: number; iconUrl?: string },
): Asset {
	const category = a.category as AssetCategory;
	return {
		symbol: a.symbol,
		name: a.name,
		iconUrl:
			quote?.iconUrl ??
			getDefaultIconUrl(a.symbol, category) ??
			a.iconUrl,
		category,
		tradingViewSymbol: a.tradingViewSymbol,
		price: quote?.price ?? 0,
		changePercent: quote?.changePercent ?? 0,
	};
}

// Called from the client every minute — reads assets only, no re-seeding.
export async function refreshAssetPrices(): Promise<AssetPriceUpdate[]> {
	const dbAssets = await listTradingAssets();

	const quotes = await getBatchPriceQuotes(
		dbAssets.map((a) => ({
			symbol: a.symbol,
			externalSymbol: a.externalSymbol,
			category: a.category as AssetCategory,
		})),
		true,
	);

	return dbAssets.map((a) => {
		const quote = quotes.get(a.symbol);
		const category = a.category as AssetCategory;
		return {
			symbol: a.symbol,
			price: quote?.price ?? 0,
			changePercent: quote?.changePercent ?? 0,
			iconUrl:
				quote?.iconUrl ?? getDefaultIconUrl(a.symbol, category),
		};
	});
}

export async function loadTradingAssetsWithPrices(): Promise<Asset[]> {
	const dbAssets = await listTradingAssets();

	const quotes = await getBatchPriceQuotes(
		dbAssets.map((a) => ({
			symbol: a.symbol,
			externalSymbol: a.externalSymbol,
			category: a.category as AssetCategory,
		})),
	);

	return dbAssets.map((a) => buildAssetFromDb(a, quotes.get(a.symbol)));
}
