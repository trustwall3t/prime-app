'use server';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { getAppUrl } from '@/lib/email/layout';
import { z } from 'zod';
import { ResetPasswordSchema } from '../../../schema/UserSchema';
import bcrypt from 'bcrypt';

export const requestResetPassword = async (email: string) => {
	const user = await db.user.findUnique({ where: { email } });
	if (!user) {
		return { error: 'User not found' };
	}
	const link = `${getAppUrl()}/reset-password?id=${user.id}`;
	await sendEmail(email, 'resetPassword', { link });

	return { success: 'Password reset link sent successfully' };
};

export const resetPassword = async (
	formData: z.infer<typeof ResetPasswordSchema>
) => {
	const validatedFields = ResetPasswordSchema.safeParse({
		id: formData.id,
		password: formData.password,
		confirmPassword: formData.confirmPassword,
	});
	if (!validatedFields.success) {
		return { error: 'Invalid fields' };
	}
	const { id, password } = validatedFields.data;
	const user = await db.user.findUnique({ where: { id } });
	if (!user) {
		console.log('User not found');
		return { error: 'User not found' };
	}
	const hashedPassword = await bcrypt.hash(password, 10);
	await db.user.update({
		where: { id },
		data: { password: hashedPassword },
	});
	return { success: 'Password reset successfully' };
};
