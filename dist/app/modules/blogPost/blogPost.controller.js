"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPostController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const blogPost_service_1 = require("./blogPost.service");
const createBlogPostIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await blogPost_service_1.BlogPostService.createBlogPostIntoDB(req.file, req.body, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Blog post is create successfully',
        data: result,
    });
});
const getAllBlogPostFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await blogPost_service_1.BlogPostService.getAllBlogPostFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All Blog post is retrieved successfully',
        data: result,
    });
});
const getSingleBlogPostFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await blogPost_service_1.BlogPostService.getSingleBlogPostFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Blog post is retrieved successfully',
        data: result,
    });
});
const updateSingleBlogPostIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await blogPost_service_1.BlogPostService.updateSingleBlogPostIntoDB(id, req.body, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Blog post is updated successfully',
        data: result,
    });
});
const deleteSingleBlogPostFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await blogPost_service_1.BlogPostService.deleteSingleBlogPostFromDB(id, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Single blog post is deleted successfully",
        data: result,
    });
});
exports.BlogPostController = {
    createBlogPostIntoDB,
    getAllBlogPostFromDB,
    getSingleBlogPostFromDB,
    updateSingleBlogPostIntoDB,
    deleteSingleBlogPostFromDB,
};
