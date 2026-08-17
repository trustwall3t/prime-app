// Remote logo URLs — no API key required.
// Stocks: Financial Modeling Prep public image CDN.
// Crypto: jsDelivr mirror of spothq/cryptocurrency-icons.

const FALLBACK_ICON = '/logo.png';

export function getStockLogoUrl(symbol: string): string {
	return `https://financialmodelingprep.com/image-stock/${encodeURIComponent(symbol)}.png`;
}

export function getCryptoLogoUrl(symbol: string): string {
	return `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/128/color/${symbol.toLowerCase()}.png`;
}

export function resolveAssetLogoUrl(
	symbol: string,
	category: 'stocks' | 'crypto',
	localIcon?: string,
): string {
	if (localIcon && !localIcon.endsWith('/logo.png')) {
		return localIcon;
	}
	return category === 'crypto'
		? getCryptoLogoUrl(symbol)
		: getStockLogoUrl(symbol);
}

export { FALLBACK_ICON };
