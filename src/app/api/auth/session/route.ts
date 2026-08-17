import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
	try {
		const { getSessionUncached } = await import('@/lib/session');
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
