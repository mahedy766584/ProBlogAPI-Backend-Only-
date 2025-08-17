import { z } from "zod/v3";

// Create Comment Validation Schema
const createCommentValidationSchema = z.object({
    body: z.object({
        blogPost: z
            .string({
                required_error: "Post ID is required.",
                invalid_type_error: "Post ID must be a valid string.",
            })
            .regex(/^[0-9a-fA-F]{24}$/, "Post ID must be a valid MongoDB ObjectId."),

        content: z
            .string({
                required_error: "Comment content is required.",
                invalid_type_error: "Comment content must be a string.",
            })
            .min(2, "Comment must be at least 2 characters long.")
            .max(500, "Comment cannot exceed 500 characters."),

        parent: z
            .string({
                invalid_type_error: "Parent comment ID must be a valid string.",
            })
            .regex(/^[0-9a-fA-F]{24}$/, "Parent ID must be a valid MongoDB ObjectId.")
            .optional(),

        isFlagged: z
            .boolean({
                invalid_type_error: "isFlagged must be a boolean value.",
            })
            .optional()
            .default(false),
    }),
});

// Update Comment Validation Schema
const updateCommentValidationSchema = z.object({
    body: z.object({
        content: z
            .string({
                invalid_type_error: "Comment content must be a string.",
            })
            .min(2, "Comment must be at least 2 characters long.")
            .max(500, "Comment cannot exceed 500 characters.")
            .optional(),

        isFlagged: z
            .boolean({
                invalid_type_error: "isFlagged must be a boolean value.",
            })
            .optional(),
    }),
});

export const CommentValidations = {
    createCommentValidationSchema,
    updateCommentValidationSchema,
};
