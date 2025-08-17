import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CommentService } from "./comment.service";

const createCommentInPostIntoDB = catchAsync(async (req, res) => {
    const userPayload = {
        userId: req.user.userId,
        userRole: req.user.role
    };
    const result = await CommentService.createCommentInPostIntoDB(req.body, userPayload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Comment is created successfully',
        data: result,
    });
});

const getAllCommentsFromDB = catchAsync(async (req, res) => {
    const result = await CommentService.getAllCommentsFromDB();
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Comment is retrieved successfully',
        data: result,
    });
});

const getSingleCommentFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CommentService.getSingleCommentFromDB(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Comment is retrieved successfully',
        data: result,
    });
});

const updateSingleCommentIntoDB = catchAsync(async (req, res) => {
    const userPayload = {
        userId: req.user.userId,
        role: req.user.role,
    };
    const { id } = req.params;
    const result = await CommentService.updateSingleCommentIntoDB(id, req.body, userPayload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Comment is updated successfully',
        data: result,
    });
});

const deleteSingleCommentFromDB = catchAsync(async (req, res) => {
    const userPayload = {
        userId: req.user.userId,
        role: req.user.role,
    };
    const { id } = req.params;
    const result = await CommentService.deleteSingleCommentFromDB(id, userPayload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Comment is deleted successfully',
        data: result,
    });
});

export const CommentController = {
    createCommentInPostIntoDB,
    getAllCommentsFromDB,
    getSingleCommentFromDB,
    updateSingleCommentIntoDB,
    deleteSingleCommentFromDB
};