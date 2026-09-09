import { z } from "zod";
import { countryField } from "./UserSchema";

/** Fields the user still needs to provide during KYC. */
export const KycDocumentSchema = z.object({
	idNumber: z.string().min(1, { message: "ID number is required" }),
	idType: z.string().min(1, { message: "ID type is required" }),
	idImage: z.string().min(1, { message: "ID image is required" }),
});

/** Full KYC record: document fields plus personal details from the user profile. */
export const KycSchema = KycDocumentSchema.extend({
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	phone: z.string().min(1),
	address: z.string().min(1),
	country: countryField,
});
