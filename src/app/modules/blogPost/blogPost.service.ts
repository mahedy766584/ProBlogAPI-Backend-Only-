import { TBlogPost } from "./blogPost.interface";
import { BlogPost } from "./blogPost.model";

const createBlogPostIntoDB = async (payload: TBlogPost) => {
    const result = await BlogPost.create(payload);
    return result;
};

export const BlogPostService = {
    createBlogPostIntoDB,
};