"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentValidations = void 0;
const v3_1 = require("zod/v3");
// Create Comment Validation Schema
const createCommentValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        blogPost: v3_1.z
            .string({
            required_error: "Post ID is required.",
            invalid_type_error: "Post ID must be a valid string.",
        })
            .regex(/^[0-9a-fA-F]{24}$/, "Post ID must be a valid MongoDB ObjectId."),
        content: v3_1.z
            .string({
            required_error: "Comment content is required.",
            invalid_type_error: "Comment content must be a string.",
        })
            .min(2, "Comment must be at least 2 characters long.")
            .max(500, "Comment cannot exceed 500 characters."),
        parent: v3_1.z
            .string({
            invalid_type_error: "Parent comment ID must be a valid string.",
        })
            .regex(/^[0-9a-fA-F]{24}$/, "Parent ID must be a valid MongoDB ObjectId.")
            .optional(),
        isFlagged: v3_1.z
            .boolean({
            invalid_type_error: "isFlagged must be a boolean value.",
        })
            .optional()
            .default(false),
    }),
});
// Update Comment Validation Schema
const updateCommentValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        content: v3_1.z
            .string({
            invalid_type_error: "Comment content must be a string.",
        })
            .min(2, "Comment must be at least 2 characters long.")
            .max(500, "Comment cannot exceed 500 characters.")
            .optional(),
        isFlagged: v3_1.z
            .boolean({
            invalid_type_error: "isFlagged must be a boolean value.",
        })
            .optional(),
    }),
});
exports.CommentValidations = {
    createCommentValidationSchema,
    updateCommentValidationSchema,
};
