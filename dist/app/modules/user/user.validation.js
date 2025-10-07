"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserValidations = void 0;
const v3_1 = require("zod/v3");
const nameSchema = v3_1.z.object({
    firstName: v3_1.z.string({
        required_error: "First name is required",
    })
        .min(4, "First name must be at least 4 characters")
        .max(10, "First name can't be more than 10 characters")
        .trim()
        .refine((value) => /^[A-Z]/.test(value), {
        message: 'First Name must start with a capital letter',
    }),
    lastName: v3_1.z.string({
        required_error: "Last name is required",
    })
        .min(4, "Last name must be at least 4 characters")
        .max(10, "Last name can't be more than 10 characters")
        .trim(),
});
const createUserValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        userName: v3_1.z.string({
            required_error: "Username is required",
        })
            .min(4, "Username must be at least 4 characters")
            .max(10, "Username can't be more than 10 characters")
            .trim(),
        name: nameSchema,
        email: v3_1.z
            .string({
            required_error: "Email is required",
        })
            .email("Invalid email address"),
        password: v3_1.z.string({
            required_error: "Password is required",
        })
            .min(6, "Password must be at least 6 characters")
            .max(10, "Password can't be more than 10 characters"),
        role: v3_1.z.enum(['superAdmin', 'admin', 'user', 'author']).optional(),
        bio: v3_1.z.string().max(160, "Bio can't be longer than 160 characters"),
        profileImage: v3_1.z.string().optional(),
        isEmailVerified: v3_1.z.boolean().optional(),
        isDeleted: v3_1.z.boolean().optional(),
        needsPasswordChange: v3_1.z.boolean().optional(),
    }),
});
const updateUserValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        userName: v3_1.z.string()
            .min(4, "Username must be at least 4 characters")
            .max(10, "Username can't be more than 10 characters")
            .trim()
            .optional(),
        name: nameSchema.partial(),
        email: v3_1.z.string().email("Invalid email address").optional(),
        password: v3_1.z.string()
            .min(6, "Password must be at least 6 characters")
            .max(10, "Password can't be more than 10 characters")
            .optional(),
        role: v3_1.z.enum(["superAdmin", "admin", "user", "author"]).optional(),
        bio: v3_1.z.string().max(160, "Bio can't be longer than 160 characters").optional(),
        profileImage: v3_1.z.string().optional(),
        isEmailVerified: v3_1.z.boolean().optional(),
        isDeleted: v3_1.z.boolean().optional(),
        needsPasswordChange: v3_1.z.boolean().optional(),
    }),
});
exports.UserValidations = {
    createUserValidationSchema,
    updateUserValidationSchema
};
