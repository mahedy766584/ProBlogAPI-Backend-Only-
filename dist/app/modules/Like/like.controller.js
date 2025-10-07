"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const like_service_1 = require("./like.service");
const createToggleLikeIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const userPayload = {
        userId: req.user.userId,
    };
    const result = await like_service_1.LikeService.createToggleLikeIntoDB(req.body, userPayload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Like is created successfully",
        data: result,
    });
});
const getLikeCountFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { blogPostId } = req.params;
    const countResult = await like_service_1.LikeService.getLikeCountFromDB(blogPostId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Like count fetched successfully",
        data: countResult,
    });
});
exports.LikeController = {
    createToggleLikeIntoDB,
    getLikeCountFromDB,
};
