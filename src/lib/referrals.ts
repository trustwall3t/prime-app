import { db } from '@/lib/db';

const REF_CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/** Branded referral code — e.g. PM-A3K9X2M7 */
export function generateReferralCode(): string {
	let suffix = '';
	for (let i = 0; i < 8; i++) {
		suffix += REF_CODE_CHARS.charAt(
			Math.floor(Math.random() * REF_CODE_CHARS.length),
		);
	}
	return `PM-${suffix}`;
}

export function normalizeReferralCode(code: string | null | undefined): string {
	return code?.trim().toUpperCase() ?? '';
}

export function getReferralLink(refcode: string | null | undefined) {
	const base =
		process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ??
		'https://primemirrormarket.com';
	const code = normalizeReferralCode(refcode);
	return `${base}/signup?ref=${encodeURIComponent(code)}`;
}

/** Ensure every user has a unique referral code (backfills older accounts). */
export async function ensureUserRefcode(userId: string): Promise<string> {
	const existing = await db.user.findUnique({
		where: { id: userId },
		select: { refcode: true },
	});

	if (existing?.refcode) {
		return existing.refcode;
	}

	for (let attempt = 0; attempt < 8; attempt++) {
		const refcode = generateReferralCode();
		try {
			const updated = await db.user.update({
				where: { id: userId },
				data: { refcode },
				select: { refcode: true },
			});
			return updated.refcode!;
		} catch (err: unknown) {
			const isUniqueViolation =
				err &&
				typeof err === 'object' &&
				'code' in err &&
				err.code === 'P2002';
			if (!isUniqueViolation) throw err;
		}
	}

	throw new Error('Could not generate a unique referral code.');
}

export async function findUserByReferralCode(code: string | null | undefined) {
	const normalized = normalizeReferralCode(code);
	if (!normalized) return null;

	return db.user.findFirst({
		where: {
			refcode: { equals: normalized, mode: 'insensitive' },
		},
		select: { id: true, name: true, refcode: true },
	});
}
