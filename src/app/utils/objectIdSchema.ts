import z from "zod/v3";

// Regular expression to roughly validate MongoDB ObjectId (24-hex characters)
export const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, {
    message: 'Invalid ObjectId',
});