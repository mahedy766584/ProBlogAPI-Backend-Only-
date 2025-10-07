"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const comment_service_1 = require("./comment.service");
const createCommentInPostIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const userPayload = {
        userId: req.user.userId,
        userRole: req.user.role
    };
    const result = await comment_service_1.CommentService.createCommentInPostIntoDB(req.body, userPayload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Comment is created successfully',
        data: result,
    });
});
const getAllCommentsFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await comment_service_1.CommentService.getAllCommentsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Comment is retrieved successfully',
        data: result,
    });
});
const getSingleCommentFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await comment_service_1.CommentService.getSingleCommentFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Comment is retrieved successfully',
        data: result,
    });
});
const updateSingleCommentIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const userPayload = {
        userId: req.user.userId,
        role: req.user.role,
    };
    const { id } = req.params;
    const result = await comment_service_1.CommentService.updateSingleCommentIntoDB(id, req.body, userPayload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Comment is updated successfully',
        data: result,
    });
});
const deleteSingleCommentFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const userPayload = {
        userId: req.user.userId,
        role: req.user.role,
    };
    const { id } = req.params;
    const result = await comment_service_1.CommentService.deleteSingleCommentFromDB(id, userPayload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Comment is deleted successfully',
        data: result,
    });
});
exports.CommentController = {
    createCommentInPostIntoDB,
    getAllCommentsFromDB,
    getSingleCommentFromDB,
    updateSingleCommentIntoDB,
    deleteSingleCommentFromDB
};
