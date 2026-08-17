import { cookies } from 'next/headers';
import { cache } from 'react';
import { SignJWT, jwtVerify } from 'jose';
import { db } from './db';
import { serializeUserBalances } from './serializeUser';
import {
	buildSessionTrackingMeta,
	pickUserAgent,
	trackLogin,
} from './tracklogin';

const JWT_SECRET = new TextEncoder().encode(
	process.env.JWT_SECRET || 'your-secret-key',
);

const SESSION_TOUCH_INTERVAL_MS = 5 * 60 * 1000;

function shouldTouchSession(lastActive: Date) {
	return Date.now() - lastActive.getTime() > SESSION_TOUCH_INTERVAL_MS;
}

export async function createSession(
	userId: string,
	meta?: {
		userAgent?: string;
		clientUserAgent?: string;
		ipAddress?: string;
		headers?: Headers;
	},
) {
	const token = await new SignJWT({ userId })
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('24h')
		.sign(JWT_SECRET);

	const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
	const userAgent = pickUserAgent(meta?.clientUserAgent, meta?.userAgent);
	const ipAddress = meta?.ipAddress || '127.0.0.1';

	const tracked = await trackLogin(
		userId,
		token,
		userAgent,
		ipAddress,
		expiresAt,
		meta?.headers,
	);

	if (!tracked) {
		try {
			const tracking = await buildSessionTrackingMeta(
				userAgent,
				ipAddress,
				meta?.headers,
			);
			await db.session.create({
				data: {
					userId,
					token,
					expiresAt,
					isCurrent: true,
					lastActive: new Date(),
					...tracking,
				},
			});
			await db.session.updateMany({
				where: { userId, token: { not: token } },
				data: { isCurrent: false },
			});
		} catch (error) {
			console.error('Fallback session create failed:', error);
			await db.session.create({
				data: {
					userId,
					token,
					expiresAt,
					isCurrent: true,
					lastActive: new Date(),
				},
			});
		}
	}

	const cookieStore = await cookies();
	cookieStore.set('session', token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		maxAge: 24 * 60 * 60,
	});

	return token;
}

async function resolveSession(touch = true) {
	if (!process.env.DATABASE_URL) {
		return null;
	}

	const cookieStore = await cookies();
	const token = cookieStore.get('session')?.value;
	if (!token) return null;

	try {
		await jwtVerify(token, JWT_SECRET);
		const session = await db.session.findFirst({
			where: {
				token,
				expiresAt: {
					gt: new Date(),
				},
			},
			include: {
				user: {
					include: {
						kyc: {
							select: {
								status: true,
							},
							take: 1,
						},
					},
				},
			},
		});

		if (!session) return null;

		if (touch && shouldTouchSession(session.lastActive)) {
			void db.session
				.update({
					where: { id: session.id },
					data: { lastActive: new Date() },
				})
				.catch((error) => {
					console.error('Session touch failed:', error);
				});
		}

		return {
			...session,
			user: serializeUserBalances(session.user),
		};
	} catch (error) {
		console.log(error);
		return null;
	}
}

/** Cached per request — dedupes layout + page session reads. */
export const getSession = cache(async (touch = true) => resolveSession(touch));

/** Use in Route Handlers — React cache must not be used there. */
export async function getSessionUncached(touch = true) {
	return resolveSession(touch);
}

export async function deleteSession() {
	const cookieStore = await cookies();
	const token = cookieStore.get('session')?.value;
	if (token) {
		await db.session.deleteMany({
			where: { token },
		});
	}
	cookieStore.delete('session');
}
