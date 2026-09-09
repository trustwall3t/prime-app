import { z } from "zod";
import { optionalCountryField } from "./UserSchema";
import { ACCOUNT_TYPES } from "@/lib/profileOptions";

export const PersonalInfoSchema = z.object({
    name: z.string().optional(),
    email: z.string().email({ message: 'Invalid email address' }),
    phone: z.string().optional(),
    address: z.string().optional(),
    accountType: z
        .string()
        .optional()
        .refine(
            (value) =>
                !value || (ACCOUNT_TYPES as readonly string[]).includes(value),
            { message: 'Select a valid account type' },
        ),
    country: optionalCountryField,
});