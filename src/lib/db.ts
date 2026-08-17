import { PrismaClient } from '@/generated/prisma';

/** Bump when Prisma schema changes so dev HMR recreates the client. */
const PRISMA_SCHEMA_VERSION = 9;

const prismaClientSingleton = () => {
	return new PrismaClient({
		log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : [],
	});
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClientSingleton | undefined;
	prismaSchemaVersion: number | undefined;
};

function getPrismaClient() {
	const cached = globalForPrisma.prisma;
	const version = globalForPrisma.prismaSchemaVersion;
	const hasDelegates =
		cached &&
		'asset' in cached &&
		'trade' in cached &&
		'trader' in cached &&
		'copyTrading' in cached &&
		'walletConnection' in cached;

	if (cached && hasDelegates && version === PRISMA_SCHEMA_VERSION) {
		return cached;
	}

	const client = prismaClientSingleton();
	globalForPrisma.prisma = client;
	globalForPrisma.prismaSchemaVersion = PRISMA_SCHEMA_VERSION;
	return client;
}

export const db = getPrismaClient();
