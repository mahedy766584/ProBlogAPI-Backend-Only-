import { z } from "zod/v3";
import { objectIdSchema } from "../../utils/objectIdSchema";

export const followValidationSchema = z.object({
    body: z.object({
        following: objectIdSchema
    })
});

export const unFollowValidationSchema = z.object({
    body: z.object({
        following: objectIdSchema
    })
});

export const FollowValidation = {
    followValidationSchema,
    unFollowValidationSchema,
};


