export type CopyStatus = 'ACTIVE' | 'PAUSED' | 'STOPPED';

export interface PublicTrader {
	id: string;
	name: string;
	description: string | null;
	strategy: string | null;
	marketType: 'STOCK' | 'CRYPTO';
	country: string;
	totalTrades: number;
	winRate: number;
	performanceScore: number;
	followers: number;
	isActive: boolean;
}

export interface UserCopySubscription {
	id: string;
	traderId: string;
	traderName: string;
	allocationPercentage: number;
	status: CopyStatus;
	startedAt: string;
	winRate: number;
	marketType: 'STOCK' | 'CRYPTO';
}

export interface CopiedTradeRecord {
	id: string;
	traderId: string | null;
	traderName: string | null;
	userName?: string;
	userEmail?: string;
	assetSymbol: string;
	assetName: string;
	direction: 'up' | 'down';
	stake: number;
	entryPrice: number;
	exitPrice: number | null;
	profit: number | null;
	status: string;
	openedAt: string;
	expiresAt: string;
	closedAt: string | null;
}
