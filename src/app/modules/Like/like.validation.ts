import z from "zod/v3";

const createLikeValidationSchema = z.object({
    body: z.object({
        blogPost: z.string({
            required_error: "Blog post must be required",
        }),
    }),
});

export const LikeValidation = {
    createLikeValidationSchema,
};