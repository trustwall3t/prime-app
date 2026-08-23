import { z } from 'zod';
import { COUNTRIES } from '@/lib/countries';
import { ACCOUNT_TYPES, INCOME_RANGES } from '@/lib/profileOptions';

export const countryField = z
	.string()
	.min(1, { message: 'Country is required' })
	.refine((value) => (COUNTRIES as readonly string[]).includes(value), {
		message: 'Select a valid country',
	});

export const optionalCountryField = z
	.string()
	.optional()
	.refine((value) => !value || (COUNTRIES as readonly string[]).includes(value), {
		message: 'Select a valid country',
	});

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
		country: countryField,
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
	yearlyIncomeRange: z
		.string()
		.optional()
		.refine(
			(value) =>
				!value || (INCOME_RANGES as readonly string[]).includes(value),
			{ message: 'Select a valid income range' },
		),
	AccountType: z
		.string()
		.optional()
		.refine(
			(value) =>
				!value || (ACCOUNT_TYPES as readonly string[]).includes(value),
			{ message: 'Select a valid account type' },
		),
	referralCode: z.string().optional(),
});

export type FirstTimeProfileInput = z.infer<typeof FirstTimeProfileSchema>;