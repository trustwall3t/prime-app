export type AdminTradeSource = 'copy' | 'user' | 'admin';

export interface AdminTradeRecord {
	id: string;
	source: AdminTradeSource;
	openedAt: string;
	userName: string;
	userEmail: string;
	assetOrPair: string;
	direction: string;
	amount: number;
	status: string;
	profit: number | null;
	traderName: string | null;
}

export interface AdminTradingHistoryStats {
	total: number;
	copy: number;
	user: number;
	admin: number;
}

export interface AdminTradingHistoryResult {
	trades: AdminTradeRecord[];
	stats: AdminTradingHistoryStats;
}
