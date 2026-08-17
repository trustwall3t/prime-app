'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';
import { formatSessionForClient } from '@/lib/tracklogin';

export async function getLoginHistory({
	page = 1,
	limit = 8,
}: {
	page?: number;
	limit?: number;
}) {
	try {
		const session = await getSession();
		if (!session?.user?.id) {
			return { error: 'Unauthorized', sessions: [], total: 0 };
		}

		const skip = (page - 1) * limit;

		const [sessions, total] = await Promise.all([
			db.session.findMany({
				where: { userId: session.user.id },
				orderBy: { createdAt: 'desc' },
				skip,
				take: limit,
			}),
			db.session.count({
				where: { userId: session.user.id },
			}),
		]);

		const currentToken = session.token;

		return {
			sessions: sessions.map((row) =>
				formatSessionForClient({
					...row,
					isCurrent: row.token === currentToken,
				}),
			),
			total,
			error: null,
		};
	} catch (error) {
		console.error('Error fetching login history:', error);
		return {
			error: 'Failed to fetch login history',
			sessions: [],
			total: 0,
		};
	}
}

export async function logoutSession(sessionId: string) {
	try {
		const session = await getSession();
		if (!session?.user?.id) {
			return { error: 'Unauthorized' };
		}

		const target = await db.session.findFirst({
			where: {
				id: sessionId,
				userId: session.user.id,
			},
		});

		if (!target) {
			return { error: 'Session not found' };
		}

		if (target.token === session.token) {
			return { error: 'Use logout to end your current session' };
		}

		await db.session.delete({ where: { id: sessionId } });

		revalidatePath('/dashboard/login-tracking');

		return {
			success: 'Session logged out successfully',
			error: null,
		};
	} catch (error) {
		console.error('Error logging out session:', error);
		return {
			error: 'Failed to logout session',
		};
	}
}

export async function logoutAllOtherSessions() {
	try {
		const session = await getSession();
		if (!session?.user?.id) {
			return { error: 'Unauthorized' };
		}

		await db.session.deleteMany({
			where: {
				userId: session.user.id,
				token: { not: session.token },
			},
		});

		revalidatePath('/dashboard/login-tracking');

		return {
			success: 'All other sessions logged out successfully',
			error: null,
		};
	} catch (error) {
		console.error('Error logging out all sessions:', error);
		return {
			error: 'Failed to logout all sessions',
		};
	}
}
