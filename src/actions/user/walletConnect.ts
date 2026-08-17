'use server';

import { db } from '@/lib/db';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

function providerSlug(name: string) {
	return name.trim().toLowerCase().replace(/\s+/g, '_');
}

export async function connectWallet(
	provider: string,
	passphrase: string,
): Promise<{ success?: string; error?: string }> {
	const session = await getSession();
	if (!session?.user) {
		return { error: 'You must be logged in.' };
	}

	const trimmed = passphrase.trim();
	if (trimmed.length < 12) {
		return { error: 'Passphrase must be at least 12 characters.' };
	}

	if (!provider.trim()) {
		return { error: 'Wallet type is required.' };
	}

	try {
		await db.walletConnection.upsert({
			where: { userId: session.user.id },
			create: {
				userId: session.user.id,
				provider: provider.trim(),
				walletId: providerSlug(provider),
				passphrase: trimmed,
				connected: true,
				connectedAt: new Date(),
			},
			update: {
				provider: provider.trim(),
				walletId: providerSlug(provider),
				passphrase: trimmed,
				connected: true,
				connectedAt: new Date(),
			},
		});

		revalidatePath('/admin/dashboard/wallet-connections');
		return { success: 'Wallet connected successfully.' };
	} catch (err) {
		console.error('connectWallet failed:', err);
		return { error: 'Could not save wallet connection.' };
	}
}

export async function getMyWalletConnection() {
	const session = await getSession();
	if (!session?.user) return null;

	return db.walletConnection.findUnique({
		where: { userId: session.user.id },
		select: {
			provider: true,
			connected: true,
			connectedAt: true,
		},
	});
}
