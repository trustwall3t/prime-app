'use server';

import { KycDocumentSchema, KycSchema } from '../../schema/KycShema';
import { db } from '@/lib/db';
import { getSession } from '@/lib/session';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';
import { unstable_noStore as noStore } from 'next/cache';

function splitFullName(fullName: string) {
	const trimmed = fullName.trim();
	const [firstName, ...rest] = trimmed.split(/\s+/).filter(Boolean);
	const lastName = rest.join(' ');

	return {
		firstName: firstName || trimmed,
		lastName: lastName || firstName || trimmed,
	};
}

function firstValidationError(
	error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } },
) {
	const fieldErrors = error.flatten().fieldErrors;
	const first = Object.values(fieldErrors).find(
		(messages) => messages && messages.length > 0,
	);
	return first?.[0] ?? 'Invalid KYC details';
}

export async function createKyc(formData: FormData) {
	const session = await getSession();
	if (!session) {
		throw new Error('Unauthorized');
	}

	const user = await db.user.findUnique({
		where: {
			id: session.userId,
		},
	});

	if (!user) {
		throw new Error('User not found');
	}

	if (!user.name?.trim() || !user.phone?.trim() || !user.country?.trim()) {
		return {
			error: 'Please complete your profile in Settings before submitting KYC',
		};
	}

	if (!user.address?.trim()) {
		return {
			error: 'Please add your address in Settings before submitting KYC',
		};
	}

	// Handle file upload - idImage can be either a URL string (from form) or a File
	const idImageValue = formData.get('idImage');
	let imageUrl = '';

	if (idImageValue) {
		// Check if it's already a URL string (from form upload)
		if (
			typeof idImageValue === 'string' &&
			idImageValue.startsWith('http')
		) {
			imageUrl = idImageValue;
		} else if (idImageValue instanceof File && idImageValue.size > 0) {
			// It's a file, upload it to Cloudinary
			try {
				imageUrl = await uploadToCloudinary(idImageValue);
			} catch (error) {
				return {
					error: 'Failed to upload image: ' + error?.toString(),
				};
			}
		}
	}

	const documentFields = KycDocumentSchema.safeParse({
		idNumber: formData.get('idNumber'),
		idType: formData.get('idType'),
		idImage: imageUrl,
	});

	if (!documentFields.success) {
		return { error: firstValidationError(documentFields.error) };
	}

	const { firstName, lastName } = splitFullName(user.name);
	const validatedFields = KycSchema.safeParse({
		firstName,
		lastName,
		phone: user.phone,
		address: user.address,
		country: user.country,
		...documentFields.data,
	});

	if (!validatedFields.success) {
		return { error: firstValidationError(validatedFields.error) };
	}

	const {
		firstName: kycFirstName,
		lastName: kycLastName,
		phone,
		address,
		country,
		idNumber,
		idType,
		idImage,
	} = validatedFields.data;
	const userKyc = await db.kyc.findFirst({
		where: {
			userId: user.id,
		},
	});
	if (userKyc) {
		return { error: 'KYC already exists, please wait for approval' };
	}
	const kyc = await db.kyc.create({
		data: {
			firstName: kycFirstName,
			lastName: kycLastName,
			phone,
			address,
			country,
			idNumber,
			idType,
			idImage,
			status: 'pending',
			user: {
				connect: {
					id: user.id,
				},
			},
		},
	});

	if (!kyc) {
		return { error: 'Failed to create KYC' };
	}
	revalidatePath('/dashboard');
	revalidatePath('/dashboard/kyc');

	return { success: 'KYC created successfully' };
}

export async function approveKyc(id: string) {
	const kyc = await db.kyc.findUnique({
		where: {
			id,
		},
	});
	if (!kyc) {
		return { error: 'KYC not found' };
	}
	await db.kyc.update({
		where: { id },
		data: { status: 'approved' },
	});
	await db.user.update({
		where: { id: kyc.userId },
		data: { isVerified: true },
	});
	revalidatePath('/admin/dashboard/kyc');
	return { success: 'KYC approved successfully' };
}

export async function rejectKyc(id: string) {
	const kyc = await db.kyc.findUnique({
		where: { id },
	});
	if (!kyc) {
		return { error: 'KYC not found' };
	}
	await db.kyc.update({
		where: { id },
		data: { status: 'rejected' },
	});
	await db.user.update({
		where: { id: kyc.userId },
		data: { isVerified: false },
	});
	revalidatePath('/admin/dashboard/kyc');
	return { success: 'KYC rejected successfully' };
}

export async function getKyc() {
	noStore();
	const kyc = await db.kyc.findMany({
		include: {
			user: true,
		},
	});
	return kyc;
}
