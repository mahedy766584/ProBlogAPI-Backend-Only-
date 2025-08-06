import { Types } from "mongoose";

export type TBlogPost = {
    title: string;
    slug: string;
    content: string;
    coverImage: string;
    author: Types.ObjectId;
    category: Types.ObjectId;
    tags: Types.ObjectId[];
    status: 'draft' | 'published' | 'rejected';
    isApproved: boolean;
    viewCount: number;
    readingTime: number;
    likeCount: number;
    publishedAt: Date;
};

