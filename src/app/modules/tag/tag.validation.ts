import { z } from "zod/v3";

const createTagValidationSchema = z.object({
    body: z.object({
        name: z.string({
            required_error: 'Category name is required'
        })
            .min(2, "Name must be at least 2 characters")
            .max(15, "Name can't be more than 50 characters"),
    }),
});

export const TagValidations = {
    createTagValidationSchema,
};

