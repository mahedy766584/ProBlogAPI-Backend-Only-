"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPost = void 0;
/* eslint-disable no-unused-vars */
const mongoose_1 = require("mongoose");
const blogPost_constant_1 = require("./blogPost.constant");
const globalPreHooks_1 = require("../../utils/globalPreHooks");
const blog_utils_1 = require("./blog.utils");
const blogPostSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Blog title is required."],
        maxlength: [120, "Blog title cannot exceed 120 characters."],
        minlength: [10, "Blog title must be at least 10 characters long."],
        unique: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    content: {
        type: String,
        required: [true, "Blog content is required."],
        maxlength: [1000, "Content cannot exceed 1000 characters."],
        minlength: [200, "Content must be at least 200 characters long."],
    },
    contentType: {
        type: String,
        enum: {
            values: ["markdown", "html"],
            message: "Content type must be either 'markdown' or 'html'.",
        },
        required: [true, "Content type is required."],
    },
    renderedHtml: {
        type: String,
        required: [true, "Rendered HTML content is required."]
    },
    excerpt: { type: String },
    readTime: { type: String },
    coverImage: {
        type: String,
        default: "https://ibb.co/jkx7zn2",
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Author ID is required."],
        ref: 'User',
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: [true, "Category ID is required."],
        ref: 'Category',
    },
    tags: {
        type: [mongoose_1.Schema.Types.ObjectId],
        required: [true, "At least one tag is required."],
        ref: 'Tag',
    },
    status: {
        type: String,
        enum: {
            values: blogPost_constant_1.PostStatus,
            message: `Status must be one of the following: ${blogPost_constant_1.PostStatus.join(", ")}.`,
        },
        default: 'draft',
        required: [true, "Post status is required."],
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    viewCount: {
        type: Number,
        default: 0,
    },
    readingTime: {
        type: Number,
        default: 0,
    },
    likeCount: {
        type: Number,
        default: 0,
    },
    publishedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
blogPostSchema.pre('save', async function (next) {
    if (!this.slug || this.isModified("title")) {
        this.slug = await (0, globalPreHooks_1.generateUniqSlug)((0, mongoose_1.model)("BlogPost"), this.title);
    }
    ;
    if (this.isModified("content") || this.isModified("contentType")) {
        this.renderedHtml = this.contentType === "markdown"
            ? await (0, blog_utils_1.markdownToSanitizedHtml)(this.content)
            : await (0, blog_utils_1.sanitizeUserHtml)(this.content);
        this.excerpt = await (0, blog_utils_1.makeExcerptFromMarkdownOrHtml)(this.content, this.contentType, 160);
        this.readTime = await (0, blog_utils_1.calculateReadTime)(this.content, this.contentType);
    }
    ;
    next();
});
exports.BlogPost = (0, mongoose_1.model)('BlogPost', blogPostSchema);
