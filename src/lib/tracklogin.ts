import { UAParser } from 'ua-parser-js';
import { db } from '@/lib/db';

type HeaderLike = Headers | { get(name: string): string | null };

type GeoInfo = {
	city: string;
	country: string;
	location: string;
	latitude?: number;
	longitude?: number;
};

export type SessionTrackingMeta = {
	ipAddress: string;
	deviceType: string;
	deviceName: string;
	browser: string;
	browserVersion: string;
	operatingSystem: string;
	userAgent: string;
	location: string;
	country: string;
	city: string;
	latitude?: number;
	longitude?: number;
};

export function getIpAddressFromHeaders(headers: HeaderLike): string {
	const forwardedFor = headers.get('x-forwarded-for');
	if (forwardedFor) {
		return forwardedFor.split(',')[0].trim();
	}

	const realIp = headers.get('x-real-ip');
	if (realIp) {
		return realIp.trim();
	}

	return headers.get('cf-connecting-ip')?.trim() || '127.0.0.1';
}

export function getUserAgentFromHeaders(headers: HeaderLike): string {
	return headers.get('user-agent')?.trim() || '';
}

function pickUserAgent(clientUserAgent?: string, headerUserAgent?: string): string {
	const client = clientUserAgent?.trim();
	if (client && client.length > 10) return client;

	const header = headerUserAgent?.trim();
	if (header && header.length > 10) return header;

	return client || header || 'Unknown';
}

function countryName(code: string | undefined): string {
	if (!code || code === 'XX') return 'Unknown';
	try {
		return (
			new Intl.DisplayNames(['en'], { type: 'region' }).of(code) ?? code
		);
	} catch {
		return code;
	}
}

function decodeHeader(value: string | null): string | undefined {
	if (!value) return undefined;
	try {
		return decodeURIComponent(value);
	} catch {
		return value;
	}
}

function isPrivateIp(ip: string): boolean {
	if (!ip || ip === '0.0.0.0') return true;
	if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('fe80:')) {
		return true;
	}
	if (ip.startsWith('10.')) return true;
	if (ip.startsWith('192.168.')) return true;
	const parts = ip.split('.').map(Number);
	if (
		parts.length === 4 &&
		parts[0] === 172 &&
		parts[1] >= 16 &&
		parts[1] <= 31
	) {
		return true;
	}
	return false;
}

function geoFromHeaders(headers: HeaderLike): Partial<GeoInfo> {
	const countryCode =
		headers.get('cf-ipcountry') ||
		headers.get('x-vercel-ip-country') ||
		headers.get('cloudfront-viewer-country');

	const city =
		decodeHeader(headers.get('x-vercel-ip-city')) ||
		decodeHeader(headers.get('cf-ipcity'));

	const region =
		decodeHeader(headers.get('x-vercel-ip-country-region')) ||
		decodeHeader(headers.get('cf-region'));

	if (!countryCode && !city) {
		return {};
	}

	const country = countryName(countryCode ?? undefined);
	const resolvedCity = city || 'Unknown';
	const location =
		[city, region].filter(Boolean).join(', ') ||
		country ||
		'Unknown';

	return {
		city: resolvedCity,
		country,
		location,
	};
}

async function resolveGeo(
	ip: string,
	headers?: HeaderLike,
): Promise<GeoInfo> {
	const fromHeaders = headers ? geoFromHeaders(headers) : {};

	if (fromHeaders.country && fromHeaders.country !== 'Unknown') {
		return {
			city: fromHeaders.city ?? 'Unknown',
			country: fromHeaders.country,
			location: fromHeaders.location ?? fromHeaders.country,
		};
	}

	if (isPrivateIp(ip)) {
		return {
			city: 'Local',
			country: 'Local network',
			location: 'Local network',
		};
	}

	const providers = [
		async () => {
			const res = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}`, {
				signal: AbortSignal.timeout(4000),
				cache: 'no-store',
			});
			if (!res.ok) return null;
			const data = (await res.json()) as {
				success?: boolean;
				country?: string;
				city?: string;
				region?: string;
				latitude?: number;
				longitude?: number;
			};
			if (!data.success) return null;
			return {
				city: data.city || fromHeaders.city || 'Unknown',
				country: data.country || fromHeaders.country || 'Unknown',
				location:
					[data.city, data.region].filter(Boolean).join(', ') ||
					data.country ||
					'Unknown',
				latitude: data.latitude,
				longitude: data.longitude,
			} satisfies GeoInfo;
		},
		async () => {
			const res = await fetch(
				`https://ipapi.co/${encodeURIComponent(ip)}/json/`,
				{ signal: AbortSignal.timeout(4000), cache: 'no-store' },
			);
			if (!res.ok) return null;
			const data = (await res.json()) as {
				error?: boolean;
				country_name?: string;
				city?: string;
				region?: string;
				latitude?: number;
				longitude?: number;
			};
			if (data.error) return null;
			return {
				city: data.city || fromHeaders.city || 'Unknown',
				country: data.country_name || fromHeaders.country || 'Unknown',
				location:
					[data.city, data.region].filter(Boolean).join(', ') ||
					data.country_name ||
					'Unknown',
				latitude: data.latitude,
				longitude: data.longitude,
			} satisfies GeoInfo;
		},
	];

	for (const provider of providers) {
		try {
			const result = await provider();
			if (result) return result;
		} catch {
			// try next provider
		}
	}

	return {
		city: fromHeaders.city ?? 'Unknown',
		country: fromHeaders.country ?? 'Unknown',
		location: fromHeaders.location ?? 'Unknown',
	};
}

function buildDeviceName(result: UAParser.IResult): string {
	if (result.device.vendor || result.device.model) {
		return [result.device.vendor, result.device.model]
			.filter(Boolean)
			.join(' ');
	}
	const os = [result.os.name, result.os.version].filter(Boolean).join(' ');
	const type = result.device.type
		? result.device.type.charAt(0).toUpperCase() +
			result.device.type.slice(1)
		: 'Desktop';
	return os ? `${type} (${os})` : type;
}

export async function buildSessionTrackingMeta(
	userAgent: string,
	ipAddress: string,
	requestHeaders?: HeaderLike,
): Promise<SessionTrackingMeta> {
	const parser = new UAParser(userAgent);
	const result = parser.getResult();
	const cleanIp = ipAddress.split(',')[0].trim();
	const geo = await resolveGeo(cleanIp, requestHeaders);

	return {
		ipAddress: cleanIp,
		deviceType: result.device.type || 'desktop',
		deviceName: buildDeviceName(result),
		browser: result.browser.name || 'Unknown',
		browserVersion: result.browser.version || '—',
		operatingSystem:
			[result.os.name, result.os.version].filter(Boolean).join(' ') ||
			'Unknown',
		userAgent,
		location: geo.location,
		country: geo.country,
		city: geo.city,
		latitude: geo.latitude,
		longitude: geo.longitude,
	};
}

/**
 * Create session row with device / location metadata after successful login.
 */
export async function trackLogin(
	userId: string,
	token: string,
	userAgent: string,
	ipAddress: string,
	expiresAt: Date,
	requestHeaders?: HeaderLike,
) {
	try {
		const tracking = await buildSessionTrackingMeta(
			userAgent,
			ipAddress,
			requestHeaders,
		);

		const session = await db.session.create({
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
			where: {
				userId,
				id: { not: session.id },
			},
			data: { isCurrent: false },
		});

		return session;
	} catch (error) {
		console.error('Error tracking login:', error);
		return null;
	}
}

export async function trackLogout(token: string) {
	try {
		await db.session.deleteMany({ where: { token } });
		return true;
	} catch (error) {
		console.error('Error tracking logout:', error);
		return false;
	}
}

export async function updateSessionActivity(sessionId: string) {
	try {
		await db.session.update({
			where: { id: sessionId },
			data: { lastActive: new Date() },
		});
	} catch (error) {
		console.error('Error updating session activity:', error);
	}
}

export function isSessionExpired(expiresAt: Date): boolean {
	return expiresAt < new Date();
}

export async function getUserActiveSessions(userId: string) {
	return db.session.findMany({
		where: {
			userId,
			expiresAt: { gt: new Date() },
		},
		orderBy: { lastActive: 'desc' },
		select: {
			id: true,
			ipAddress: true,
			deviceType: true,
			deviceName: true,
			browser: true,
			browserVersion: true,
			operatingSystem: true,
			location: true,
			country: true,
			city: true,
			lastActive: true,
			isCurrent: true,
			createdAt: true,
			expiresAt: true,
		},
	});
}

function formatSessionForClient(session: {
	id: string;
	ipAddress: string | null;
	deviceType: string | null;
	deviceName: string | null;
	browser: string | null;
	browserVersion: string | null;
	operatingSystem: string | null;
	location: string | null;
	country: string | null;
	city: string | null;
	lastActive: Date;
	isCurrent: boolean;
	createdAt: Date;
	expiresAt: Date;
}) {
	return {
		id: session.id,
		ipAddress: session.ipAddress ?? '—',
		deviceType: session.deviceType ?? '—',
		deviceName: session.deviceName ?? 'Unknown device',
		browser: session.browser ?? 'Unknown',
		browserVersion: session.browserVersion ?? '—',
		operatingSystem: session.operatingSystem ?? '—',
		location: session.location ?? 'Unknown',
		country: session.country ?? 'Unknown',
		city: session.city ?? 'Unknown',
		lastActive: session.lastActive.toLocaleString('en-US', {
			dateStyle: 'medium',
			timeStyle: 'short',
		}),
		isCurrent: session.isCurrent,
		createdAt: session.createdAt.toISOString(),
		expiresAt: session.expiresAt.toISOString(),
		isExpired: session.expiresAt < new Date(),
	};
}

export { pickUserAgent, formatSessionForClient };
