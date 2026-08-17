import { NextResponse } from 'next/server';
import { settleDueTrades } from '@/lib/tradeSettlement';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/** Settle expired trades globally — call from a cron job every minute. */
export async function GET(request: Request) {
	const authHeader = request.headers.get('authorization');
	const cronSecret = process.env.CRON_SECRET;

	if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const { settled } = await settleDueTrades();
		return NextResponse.json({ ok: true, settled });
	} catch (err) {
		console.error('cron settle-trades failed:', err);
		return NextResponse.json(
			{ error: 'Settlement failed' },
			{ status: 500 },
		);
	}
}
