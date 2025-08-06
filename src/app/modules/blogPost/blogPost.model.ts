/* eslint-disable no-unused-vars */
import { model, Schema } from "mongoose";
import { TBlogPost } from "./blogPost.interface";
import { PostStatus } from "./blogPost.constant";
import { generateUniqSlug } from "../../utils/globalPreHooks";
import { estimateReadingTime } from "../../utils/estimateReadingTime";

const blogPostSchema = new Schema<TBlogPost>({
    title: {
        type: String,
        required: true,
        maxlength: 120,
        minlength: 10,
        unique: true,
    },
    slug: {
        type: String,
        unique: true,
    },
    content: {
        type: String,
        required: true,
        maxlength: 1000,
        minlength: 200,
    },
    coverImage: {
        type: String,
        default: "https://ibb.co/jkx7zn2",
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    category: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Category',
    },
    tags: {
        type: [Schema.Types.ObjectId],
        required: true,
        ref: 'Tag',
    },
    status: {
        type: String,
        enum: PostStatus,
        default: 'draft',
        required: true,
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
},
    {
        timestamps: true,
    }
);

blogPostSchema.pre<TBlogPost & { isModified(field: string): boolean }>('save', async function (next) {

    if (!this.slug || this.isModified("title")) {
        this.slug = await generateUniqSlug(model("BlogPost"), this.title);
    };

    if (this.isModified("content")) {
        this.readingTime = estimateReadingTime(this.content);
    };

    next();

}
);


export const BlogPost = model<TBlogPost>(
    'BlogPost',
    blogPostSchema,
);