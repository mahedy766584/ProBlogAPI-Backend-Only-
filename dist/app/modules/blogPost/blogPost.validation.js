"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPostValidation = void 0;
const v3_1 = require("zod/v3");
const objectIdSchema_1 = require("../../utils/objectIdSchema");
const blogPost_constant_1 = require("./blogPost.constant");
const createBlogPostZodSchema = v3_1.z.object({
    body: v3_1.z.object({
        title: v3_1.z
            .string({
            required_error: 'Title is required',
        })
            .min(10, 'Title must be at least 10 characters')
            .max(120, 'Title must be at most 100 characters'),
        slug: v3_1.z.string().optional(),
        content: v3_1.z
            .string({
            required_error: 'Content is required',
        })
            .min(200, 'Content must be at least 200 characters')
            .max(1000, 'Content must be at most 350 characters'),
        contentType: v3_1.z.enum(['markdown', 'html']),
        coverImage: v3_1.z
            .string()
            .url('Cover image must be a valid URL')
            .optional(),
        category: objectIdSchema_1.objectIdSchema,
        tags: v3_1.z.array(objectIdSchema_1.objectIdSchema).min(1, 'At least one tag is required'),
        status: v3_1.z.enum([...blogPost_constant_1.PostStatus]),
        isApproved: v3_1.z.boolean().optional(),
        viewCount: v3_1.z.number().optional(),
        readingTime: v3_1.z.number().optional(),
        likeCount: v3_1.z.number().optional(),
        publishedAt: v3_1.z.date().optional(),
    })
});
const updateBlogPostZodSchema = v3_1.z.object({
    body: v3_1.z.object({
        title: v3_1.z
            .string({
            required_error: 'Title is required',
        })
            .min(10, 'Title must be at least 10 characters')
            .max(120, 'Title must be at most 100 characters')
            .optional(),
        slug: v3_1.z.string().optional(),
        content: v3_1.z
            .string({
            required_error: 'Content is required',
        })
            .min(200, 'Content must be at least 200 characters')
            .max(1000, 'Content must be at most 350 characters')
            .optional(),
        contentType: v3_1.z.enum(['markdown', 'html']).optional(),
        coverImage: v3_1.z
            .string()
            .url('Cover image must be a valid URL')
            .optional(),
        category: objectIdSchema_1.objectIdSchema,
        tags: v3_1.z.array(objectIdSchema_1.objectIdSchema).min(1, 'At least one tag is required').optional(),
        status: v3_1.z.enum([...blogPost_constant_1.PostStatus]).optional(),
        isApproved: v3_1.z.boolean().optional(),
        viewCount: v3_1.z.number().optional(),
        readingTime: v3_1.z.number().optional(),
        likeCount: v3_1.z.number().optional(),
        publishedAt: v3_1.z.date().optional(),
    })
});
exports.BlogPostValidation = {
    createBlogPostZodSchema,
    updateBlogPostZodSchema
};
