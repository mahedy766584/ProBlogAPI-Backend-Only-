import { z } from "zod/v3";

const nameSchema = z.object({
    firstName: z.string({
        required_error: "First name is required",
    })
        .min(4, "First name must be at least 4 characters")
        .max(10, "First name can't be more than 10 characters")
        .trim()
        .refine((value) => /^[A-Z]/.test(value), {
            message: 'First Name must start with a capital letter',
        }),

    lastName: z.string({
        required_error: "Last name is required",
    })
        .min(4, "Last name must be at least 4 characters")
        .max(10, "Last name can't be more than 10 characters")
        .trim(),
});

const createUserValidationSchema = z.object({
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

        role: z.enum(['superAdmin', 'admin', 'user', 'author']),

        bio: z.string().max(160, "Bio can't be longer than 160 characters"),

        profileImage: z.string().optional(),

        isEmailVerified: z.boolean().optional(),
        
        isDeleted: z.boolean().optional(),
        needsPasswordChange: z.boolean().optional(),
    }),
});


const updateUserValidationSchema = z.object({
    body: z.object({
        userName: z.string()
            .min(4, "Username must be at least 4 characters")
            .max(10, "Username can't be more than 10 characters")
            .trim()
            .optional(),

        name: nameSchema.partial(), 

        email: z.string().email("Invalid email address").optional(),

        password: z.string()
            .min(6, "Password must be at least 6 characters")
            .max(10, "Password can't be more than 10 characters")
            .optional(),

        role: z.enum(["superAdmin", "admin", "user", "author"]).optional(),

        bio: z.string().max(160, "Bio can't be longer than 160 characters").optional(),

        profileImage: z.string().optional(),

        isEmailVerified: z.boolean().optional(),
        isDeleted: z.boolean().optional(),
        needsPasswordChange: z.boolean().optional(),
    }),
});


export const UserValidations = {
    createUserValidationSchema,
    updateUserValidationSchema
};