import { z } from 'zod/v3';
import { objectIdSchema } from '../../utils/objectIdSchema';
import { PostStatus } from './blogPost.constant';

const createBlogPostZodSchema = z.object({
    body: z.object({
        title: z
            .string({
                required_error: 'Title is required',
            })
            .min(10, 'Title must be at least 10 characters')
            .max(120, 'Title must be at most 100 characters'),

        slug: z.string().optional(),

        content: z
            .string({
                required_error: 'Content is required',
            })
            .min(200, 'Content must be at least 200 characters')
            .max(1000, 'Content must be at most 350 characters'),

        contentType: z.enum(['markdown', 'html']),

        coverImage: z
            .string()
            .url('Cover image must be a valid URL')
            .optional(),

        author: objectIdSchema,
        category: objectIdSchema,
        tags: z.array(objectIdSchema).min(1, 'At least one tag is required'),

        status: z.enum([...PostStatus] as [string, ...string[]]),

        isApproved: z.boolean().optional(),
        viewCount: z.number().optional(),
        readingTime: z.number().optional(),
        likeCount: z.number().optional(),

        publishedAt: z.date().optional(),
    })
});

const updateBlogPostZodSchema = z.object({
    body: z.object({
        title: z
            .string({
                required_error: 'Title is required',
            })
            .min(10, 'Title must be at least 10 characters')
            .max(120, 'Title must be at most 100 characters')
            .optional(),

        slug: z.string().optional(),

        content: z
            .string({
                required_error: 'Content is required',
            })
            .min(200, 'Content must be at least 200 characters')
            .max(1000, 'Content must be at most 350 characters')
            .optional(),

        contentType: z.enum(['markdown', 'html']).optional(),

        coverImage: z
            .string()
            .url('Cover image must be a valid URL')
            .optional(),

        author: objectIdSchema,
        category: objectIdSchema,
        tags: z.array(objectIdSchema).min(1, 'At least one tag is required').optional(),

        status: z.enum([...PostStatus] as [string, ...string[]]).optional(),

        isApproved: z.boolean().optional(),
        viewCount: z.number().optional(),
        readingTime: z.number().optional(),
        likeCount: z.number().optional(),

        publishedAt: z.date().optional(),
    })
});

export const BlogPostValidation = {
    createBlogPostZodSchema,
    updateBlogPostZodSchema
};