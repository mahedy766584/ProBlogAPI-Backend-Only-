"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorRequestValidation = void 0;
const v3_1 = __importDefault(require("zod/v3"));
const createAuthorRequestValidationSchema = v3_1.default.object({
    body: v3_1.default.object({
        message: v3_1.default
            .string()
            .trim()
            .min(120, "Message must be at least 120 characters long to provide enough details.")
            .max(200, "Message cannot exceed 200 characters."),
        status: v3_1.default
            .enum(["pending", "approved", "rejected"])
            .optional()
            .default("pending"),
    })
});
const updateAuthorRequestValidationSchema = v3_1.default.object({
    body: v3_1.default.object({
        message: v3_1.default
            .string()
            .trim()
            .min(120, "Message must be at least 120 characters long to provide enough details.")
            .max(200, "Message cannot exceed 200 characters."),
        status: v3_1.default
            .enum(["pending", "approved", "rejected"])
            .optional()
            .default("pending"),
    })
});
exports.AuthorRequestValidation = {
    createAuthorRequestValidationSchema,
    updateAuthorRequestValidationSchema,
};
