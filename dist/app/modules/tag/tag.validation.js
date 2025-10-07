"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagValidations = void 0;
const v3_1 = require("zod/v3");
const createTagValidationSchema = v3_1.z.object({
    body: v3_1.z.object({
        name: v3_1.z.string({
            required_error: 'Category name is required'
        })
            .min(2, "Name must be at least 2 characters")
            .max(15, "Name can't be more than 50 characters"),
    }),
});
exports.TagValidations = {
    createTagValidationSchema,
};
