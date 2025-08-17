import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BookMarkService } from "./bookmark.service";

const createBookMarkIntoDB = catchAsync(async (req, res) => {
    const { userId } = req.user;
    const result = await BookMarkService.createBookMarkIntoDB(req.body, userId);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "This blog is bookmarked successfully",
        data: result,
    });
});

const getAllBookmarkFromDB = catchAsync(async (req, res) => {
    const result = await BookMarkService.getAllBookmarkFromDB();
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Bookmark is retrieved successfully",
        data: result,
    });
});

const getForUserBookmark = catchAsync(async (req, res) => {
    const { id } = req.params;
    const userPayload = {
        userId: req.user.userId,
        role: req.user.role,
    };
    const result = await BookMarkService.getForUserBookmark(id, userPayload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Bookmark is retrieved successfully",
        data: result,
    });
});

const deleteBookmarkFromDB = catchAsync(async (req, res) => {
    const userPayload = {
        userId: req.user.userId,
        role: req.user.role,
    };
    const { id } = req.params;
    const result = await BookMarkService.deleteBookmarkFromDB(id, userPayload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Comment is deleted successfully',
        data: result,
    });
});

export const BookMarkController = {
    createBookMarkIntoDB,
    getAllBookmarkFromDB,
    getForUserBookmark,
    deleteBookmarkFromDB
};