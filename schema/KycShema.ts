import { z } from "zod";
import { countryField } from "./UserSchema";

export const KycSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().min(1),
    address: z.string().min(1),
    country: countryField,
    idNumber: z.string().min(1),
    idType: z.string().min(1),
    idImage: z.string().min(1),
})