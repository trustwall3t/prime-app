'use server';

import { db } from '@/lib/db';
import { getAdminSession } from '@/lib/admin-auth';
import { unstable_noStore as noStore } from 'next/cache';

export async function getAdminWalletConnections() {
	noStore();
	const session = await getAdminSession();
	if (!session) return { error: 'Unauthorized' as const };

	const connections = await db.walletConnection.findMany({
		where: { connected: true },
		orderBy: { connectedAt: 'desc' },
		include: {
			user: {
				select: {
					id: true,
					name: true,
					email: true,
					phone: true,
				},
			},
		},
	});

	return { connections };
}
