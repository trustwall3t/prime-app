const WALLET_ICON_CDN =
	'https://cdn.jsdelivr.net/gh/GMWalletApp/crypto-icons@latest/assets/wallets/branded';

/** Branded wallet logos (SVG) from GMWalletApp/crypto-icons on jsDelivr. */
export const WALLET_LOGOS = {
	metamask: `${WALLET_ICON_CDN}/metamask.svg`,
	walletconnect: `${WALLET_ICON_CDN}/wallet-connect.svg`,
	coinbase: `${WALLET_ICON_CDN}/coinbase.svg`,
	trust: `${WALLET_ICON_CDN}/trust.svg`,
	phantom: `${WALLET_ICON_CDN}/phantom.svg`,
} as const;

export type WalletLogoKey = keyof typeof WALLET_LOGOS;

export function getWalletLogoUrl(key: WalletLogoKey): string {
	return WALLET_LOGOS[key];
}
