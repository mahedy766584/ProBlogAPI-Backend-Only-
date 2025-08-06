import { z } from "zod/v3";
import { UserRole } from "./user.constant";

const nameSchema = z.object({
    firstName: z.string({
        required_error: "First name is required",
    })
        .min(4, "First name must be at least 4 characters")
        .max(10, "First name can't be more than 10 characters")
        .trim(),

    lastName: z.string({
        required_error: "Last name is required",
    })
        .min(4, "Last name must be at least 4 characters")
        .max(10, "Last name can't be more than 10 characters")
        .trim(),
});

const createUserZodSchema = z.object({
    body: z.object({
        userName: z.string({
            required_error: "Username is required",
        })
            .min(4, "Username must be at least 4 characters")
            .max(10, "Username can't be more than 10 characters")
            .trim(),

        name: nameSchema,

        email: z
            .string({
                required_error: "Email is required",
            })
            .email("Invalid email address"),

        password: z.string({
            required_error: "Password is required",
        })
            .min(6, "Password must be at least 6 characters")
            .max(10, "Password can't be more than 10 characters"),

        role: z.enum([...UserRole as [string, ...string[]]]),

        bio: z.string().max(160, "Bio can't be longer than 160 characters"),

        profileImage: z.string().optional(),

        isEmailVerified: z.boolean().optional(),

        isBanned: z.boolean().optional(),
        isDeleted: z.boolean().optional(),
        needsPasswordChange: z.boolean().optional(),
    }),
});


export const UserValidations = {
    createUserZodSchema
};