'use server';

import {
	UserRegisterSchema,
	type UserRegisterInput,
	verifyEmailSchem,
} from '../../../schema/UserSchema';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import type { Prisma } from '@/generated/prisma';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { generateReferralCode, normalizeReferralCode } from '@/lib/referrals';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export const signup = async (formData: UserRegisterInput) => {
	const validatedFields = UserRegisterSchema.safeParse(formData);
	if (!validatedFields.success) {
		return { error: 'Invalid fields' };
	}
	const {
		email,
		password,
		fullName,
		phoneNumber,
		country,
	} = validatedFields.data;

	try {
		const existingUser = await db.user.findUnique({
			where: { email },
		});

		if (existingUser && existingUser.confirm === 'true') {
			return { error: 'Email already registered' };
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const verificationToken = Math.floor(
			100000 + Math.random() * 900000,
		).toString();

		let user;
		if (existingUser && existingUser.confirm !== 'true') {
			user = await db.user.update({
				where: { email },
				data: {
					password: hashedPassword,
					name: fullName,
					phone: phoneNumber,
					country,
					token: verificationToken,
					...(existingUser.refcode
						? {}
						: { refcode: generateReferralCode() }),
				} as Prisma.UserUpdateInput,
			});
		} else {
			user = await db.user.create({
				data: {
					email,
					password: hashedPassword,
					name: fullName,
					phone: phoneNumber,
					refcode: generateReferralCode(),
					walletBalance: 0,
					country,
					token: verificationToken,
				} as Prisma.UserCreateInput,
			});
		}

		if (!user) {
			return { error: 'User creation failed' };
		}

		const referralCode = normalizeReferralCode(formData.referralCode);
		if (referralCode) {
			const cookieStore = await cookies();
			cookieStore.set('pm_refcode', referralCode, {
				path: '/',
				maxAge: 60 * 60 * 24 * 30,
				sameSite: 'lax',
			});
		}

		await sendEmail(email, 'welcome', {
			name: fullName,
			token: user.token as string,
			email: email,
		});
	} catch (error: unknown) {
		if (
			error &&
			typeof error === 'object' &&
			'code' in error &&
			error.code === 'P2002'
		) {
			return { error: 'Email already registered' };
		}
		console.error('Signup error:', error);
		return { error: 'An error occurred during signup. Please try again.' };
	}

	redirect(`/verify?email=${encodeURIComponent(email)}`);
};

export const verifyEmail = async (
	formData: z.infer<typeof verifyEmailSchem>,
) => {
	const validatedFields = verifyEmailSchem.safeParse({
		token: formData.token,
		email: formData.email,
	});
	if (!validatedFields.success) {
		return { error: 'Invalid fields' };
	}
	const { token, email } = validatedFields.data;

	const user = await db.user.findUnique({
		where: { email },
	});
	if (!user) {
		return { error: 'User not found' };
	}

	const isTokenValid = token === user.token;
	if (!isTokenValid) {
		return { error: 'Invalid verification token' };
	}

	// Update user verification status
	await db.user.update({
		where: { email },
		data: {
			confirm: 'true',
			token: null, // Clear the token after successful verification
		},
	});

	return { success: 'Email verified successfully' };
};
