import z from "zod/v3";

const createBookMarkSchemaValidation = z.object({
    body: z.object({
        blogPost: z.string({
            required_error: "Blog post id is required",
        })
    })
});

export const BookMarkValidation = {
    createBookMarkSchemaValidation,
};