"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const follow_service_1 = require("./follow.service");
const createFollowUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await follow_service_1.FollowService.createFollowUser(req.body, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User followed successfully',
        data: result,
    });
});
const createUnfollowUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await follow_service_1.FollowService.createUnfollowUser(req.body, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User unfollowed successfully',
        data: result,
    });
});
const getFollowersFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await follow_service_1.FollowService.getFollowersFromDB(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Followers is retrieved successfully',
        data: result,
    });
});
const getFollowingFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await follow_service_1.FollowService.getFollowingFromDB(req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Following is retrieved successfully',
        data: result,
    });
});
exports.FollowController = {
    createFollowUser,
    createUnfollowUser,
    getFollowersFromDB,
    getFollowingFromDB
};
