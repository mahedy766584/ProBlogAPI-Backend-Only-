import { TBlogPost } from "./blogPost.interface";

export const PostStatus = ['draft', 'published', 'rejected'];

export const adminAllowedFiled: (keyof TBlogPost)[] = [
    "title", "content", "contentType", "coverImage", "tags", "category",
    "status", "isApproved", "coverImage", "author", "excerpt", "renderedHtml"
];
export const userAllowedFiled: (keyof TBlogPost)[] = ["title", "content", "contentType", "coverImage", "tags", "category", "coverImage"];

export const allowedRoles = ["author", "admin", "superadmin"];