const { PrismaClient } = require('../src/generated/prisma');
const bcrypt = require('bcrypt');

const ADMIN = {
	email: 'support@primemirrormarket.com',
	password: 'Frank2025%',
	name: 'support',
};

async function main() {
	const db = new PrismaClient();

	try {
		const existing = await db.admin.findUnique({
			where: { email: ADMIN.email },
		});

		if (existing) {
			console.log(`Admin already exists: ${ADMIN.email}`);
			return;
		}

		const hashedPassword = await bcrypt.hash(ADMIN.password, 10);
		const admin = await db.admin.create({
			data: {
				email: ADMIN.email,
				password: hashedPassword,
				name: ADMIN.name,
			},
		});

		console.log(`Admin seeded: ${admin.email} (${admin.id})`);
	} finally {
		await db.$disconnect();
	}
}

main().catch((err) => {
	console.error('Seed failed:', err);
	process.exit(1);
});
