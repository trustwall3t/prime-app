'use server';

import { db } from '@/lib/db';
import { toMoneyNumber } from '@/lib/money';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { headers } from 'next/headers';
import { UserLoginSchema } from '../../../schema/UserSchema';
import { createSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { deleteSession } from '@/lib/session';
import {
	getIpAddressFromHeaders,
	getUserAgentFromHeaders,
} from '@/lib/tracklogin';




export const login = async (formData: z.infer<typeof UserLoginSchema>) => {
	const validatedFields = UserLoginSchema.safeParse(formData);
	if (!validatedFields.success) {
		return { error: 'Invalid fields' };
	}
	const { email, password, userAgent } = validatedFields.data;

	const user = await db.user.findUnique({ where: { email } });
	if (!user) {
		return { error: 'User not found' };
	}
	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		return { error: 'Invalid credentials' };
	}
	if (!user.confirm) {
		return { error: 'Email not verified' };
	}
	const kyc = await db.kyc.findFirst({
		where: {
			userId: user.id,
		},
	});
	
	const headerList = await headers();
	await createSession(user.id, {
		clientUserAgent: userAgent,
		userAgent: getUserAgentFromHeaders(headerList),
		ipAddress: getIpAddressFromHeaders(headerList),
		headers: headerList,
	});

	const userData = {
		id: user.id,
		name: user.name,
		email: user.email,
		phone: user.phone,
		address: user.address ?? undefined,
		country: user.country,
		AccountType: user.AccountType,
		isVerified: kyc?.status == 'approved' ? true : false,
		isFirstLogin: user.isFirstLogin ?? true,
		walletBalance: toMoneyNumber(user.walletBalance),
		investmentBalance: toMoneyNumber(user.investmentBalance),
		profitBalance: toMoneyNumber(user.profitBalance),
		createdAt: user.createdAt,
		token: null,
		confirm: null,
		password: '', // Empty string as we don't want to expose the password
		isVerifying: kyc?.status === 'pending' ? true : false,
		kycStatus: kyc?.status,
		
	};

	return { success: true, user: userData };
};

export const logout = async () => {
	await deleteSession();
	redirect('/login');
};

