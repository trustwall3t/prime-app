import { NextResponse } from 'next/server';
import { getSessionUncached } from '@/lib/session';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
	try {
		const session = await getSessionUncached(false);
		if (!session) {
			return NextResponse.json({ user: null }, { status: 401 });
		}
		return NextResponse.json(
			{ user: session.user },
			{
				headers: {
					'Cache-Control': 'private, no-store',
				},
			},
		);
	} catch (error) {
		console.error('Error in session route:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		);
	}
}
