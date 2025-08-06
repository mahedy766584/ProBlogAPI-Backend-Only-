import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BlogPostService } from "./blogPost.service";

const createBlogPostIntoDB = catchAsync(async (req, res) => {
    const result = await BlogPostService.createBlogPostIntoDB(req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Blog post is create successfully',
        data: result,
    });
});

export const BlogPostController = {
    createBlogPostIntoDB,
};