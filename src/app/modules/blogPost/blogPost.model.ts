/* eslint-disable no-unused-vars */
import { model, Schema } from "mongoose";
import { TBlogPost } from "./blogPost.interface";
import { PostStatus } from "./blogPost.constant";
import { generateUniqSlug } from "../../utils/common/globalPreHooks";
import { calculateReadTime, makeExcerptFromMarkdownOrHtml, markdownToSanitizedHtml, sanitizeUserHtml } from "./blog.utils";

const blogPostSchema = new Schema<TBlogPost>({
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
        type: Schema.Types.ObjectId,
        required: [true, "Author ID is required."],
        ref: 'User',
    },
    category: {
        type: Schema.Types.ObjectId,
        required: [true, "Category ID is required."],
        ref: 'Category',
    },
    tags: {
        type: [Schema.Types.ObjectId],
        required: [true, "At least one tag is required."],
        ref: 'Tag',
    },
    status: {
        type: String,
        enum: {
            values: PostStatus,
            message: `Status must be one of the following: ${PostStatus.join(", ")}.`,
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
    isFeatured: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});


blogPostSchema.pre<TBlogPost & { isModified(field: string): boolean }>('save', async function (next) {

    if (!this.slug || this.isModified("title")) {
        this.slug = await generateUniqSlug(model("BlogPost"), this.title);
    };

    if (this.isModified("content") || this.isModified("contentType")) {
        this.renderedHtml = this.contentType === "markdown"
            ? await markdownToSanitizedHtml(this.content)
            : await sanitizeUserHtml(this.content);

        this.excerpt = await makeExcerptFromMarkdownOrHtml(this.content, this.contentType, 160);

        this.readTime = await calculateReadTime(this.content, this.contentType);
    };

    next();

}
);

export const BlogPost = model<TBlogPost>(
    'BlogPost',
    blogPostSchema,
);