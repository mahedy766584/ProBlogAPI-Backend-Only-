"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeValidation = void 0;
const v3_1 = __importDefault(require("zod/v3"));
const createLikeValidationSchema = v3_1.default.object({
    body: v3_1.default.object({
        blogPost: v3_1.default.string({
            required_error: "Blog post must be required",
        }),
    }),
});
exports.LikeValidation = {
    createLikeValidationSchema,
};
