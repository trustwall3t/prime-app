import { z } from 'zod';

export const UserLoginSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z.string().min(1, { message: 'Password is required' }),
	userAgent: z.string().optional(),
});

export const UserRegisterSchema = z
	.object({
		email: z.string().email({ message: 'Invalid email address' }),
		password: z.string().min(1, { message: 'Password is required' }),
		confirmPassword: z
			.string()
			.min(1, { message: 'Confirm password is required' }),
		fullName: z.string().min(1, { message: 'Full Name is required' }),
		phoneNumber: z.string().min(1, { message: 'Phone number is required' }),
		country: z.string().min(1, { message: 'Country is required' }),
		referralCode: z.string().optional(),
		agreement: z.boolean().refine((data) => data, {
			message: 'You must agree to the terms and conditions',
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

export type UserRegisterInput = z.infer<typeof UserRegisterSchema>;

export const ForgotPasswordSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
});

export const ResetPasswordSchema = z.object({
	id: z.string(),
	password: z.string().min(1, { message: 'Password is required' }),
	confirmPassword: z
		.string()
		.min(1, { message: 'Confirm password is required' }),
});

export const verifyEmailSchem = z.object({
	token: z.string().min(1,{
		message:'token required'
	}),
	email: z.string()
})

export const FirstTimeProfileSchema = z.object({
	firstName: z.string().min(1, { message: 'First name is required' }),
	lastName: z.string().optional(),
	address: z.string().min(1, { message: 'Address is required' }),
	country: z.string().min(1, { message: 'Country is required' }),
	yearlyIncomeRange: z.string().optional(),
	AccountType: z.string().optional(),
	ethAddress: z.string().optional(),
	btcAddress: z.string().optional(),
	usdtAddress: z.string().optional(),
	referralCode: z.string().optional(),
});

export type FirstTimeProfileInput = z.infer<typeof FirstTimeProfileSchema>;