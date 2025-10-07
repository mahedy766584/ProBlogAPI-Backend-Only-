"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookMarkValidation = void 0;
const v3_1 = __importDefault(require("zod/v3"));
const createBookMarkSchemaValidation = v3_1.default.object({
    body: v3_1.default.object({
        blogPost: v3_1.default.string({
            required_error: "Blog post id is required",
        })
    })
});
exports.BookMarkValidation = {
    createBookMarkSchemaValidation,
};
