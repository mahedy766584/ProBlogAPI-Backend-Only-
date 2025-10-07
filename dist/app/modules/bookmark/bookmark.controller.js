"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookMarkController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const bookmark_service_1 = require("./bookmark.service");
const createBookMarkIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const { userId } = req.user;
    const result = await bookmark_service_1.BookMarkService.createBookMarkIntoDB(req.body, userId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "This blog is bookmarked successfully",
        data: result,
    });
});
const getAllBookmarkFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await bookmark_service_1.BookMarkService.getAllBookmarkFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Bookmark is retrieved successfully",
        data: result,
    });
});
const getForUserBookmark = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const userPayload = {
        userId: req.user.userId,
        role: req.user.role,
    };
    const result = await bookmark_service_1.BookMarkService.getForUserBookmark(id, userPayload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Bookmark is retrieved successfully",
        data: result,
    });
});
const deleteBookmarkFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const userPayload = {
        userId: req.user.userId,
        role: req.user.role,
    };
    const { id } = req.params;
    const result = await bookmark_service_1.BookMarkService.deleteBookmarkFromDB(id, userPayload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Comment is deleted successfully',
        data: result,
    });
});
exports.BookMarkController = {
    createBookMarkIntoDB,
    getAllBookmarkFromDB,
    getForUserBookmark,
    deleteBookmarkFromDB
};
