import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CommentService } from "./comment.service";

const createCommentInPostIntoDB = catchAsync(async (req, res) => {
    const result = await CommentService.createCommentInPostIntoDB(req.body);
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

export const CommentController = {
    createCommentInPostIntoDB,
    getAllCommentsFromDB,
    getSingleCommentFromDB,
};