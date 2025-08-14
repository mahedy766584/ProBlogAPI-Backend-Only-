import z from "zod/v3";

const createAuthorRequestValidationSchema = z.object({
    body: z.object({
        message: z
            .string()
            .trim()
            .min(120, "Message must be at least 120 characters long to provide enough details.")
            .max(200, "Message cannot exceed 200 characters."),
        status: z
            .enum(["pending", "approved", "rejected"])
            .optional()
            .default("pending"),
    })
});

const updateAuthorRequestValidationSchema = z.object({
    body: z.object({
        message: z
            .string()
            .trim()
            .min(120, "Message must be at least 120 characters long to provide enough details.")
            .max(200, "Message cannot exceed 200 characters."),
        status: z
            .enum(["pending", "approved", "rejected"])
            .optional()
            .default("pending"),
    })
});

export const AuthorRequestValidation = {
    createAuthorRequestValidationSchema,
    updateAuthorRequestValidationSchema,
};