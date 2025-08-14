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

const getAllBlogPostFromDB = catchAsync(async (req, res) => {
    const result = await BlogPostService.getAllBlogPostFromDB();
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'All Blog post is retrieved successfully',
        data: result,
    });
});

const getSingleBlogPostFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await BlogPostService.getSingleBlogPostFromDB(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Blog post is retrieved successfully',
        data: result,
    });
});

const updateSingleBlogPostIntoDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const userPayload = {
        userId: req.user.userId,
        userName: req.user.userName,
        role: req.user.role,
    };
    const result = await BlogPostService.updateSingleBlogPostIntoDB(id, req.body, userPayload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Blog post is updated successfully',
        data: result,
    });
});

const deleteSingleBlogPostFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await BlogPostService.deleteSingleBlogPostFromDB(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Single blog post is deleted successfully",
        data: result,
    });
});

export const BlogPostController = {
    createBlogPostIntoDB,
    getAllBlogPostFromDB,
    getSingleBlogPostFromDB,
    updateSingleBlogPostIntoDB,
    deleteSingleBlogPostFromDB,
};