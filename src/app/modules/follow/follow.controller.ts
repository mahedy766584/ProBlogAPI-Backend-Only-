import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { FollowService } from "./follow.service";

const createFollowUser = catchAsync(async (req, res) => {
    const result = await FollowService.createFollowUser(req.body, req.user);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User followed successfully',
        data: result,
    });
});

const createUnfollowUser = catchAsync(async (req, res) => {
    const result = await FollowService.createUnfollowUser(req.body, req.user);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User unfollowed successfully',
        data: result,
    });
});

const getFollowersFromDB = catchAsync(async (req, res) => {
    const result = await FollowService.getFollowersFromDB(req.user);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Followers is retrieved successfully',
        data: result,
    });
});

const getFollowingFromDB = catchAsync(async (req, res) => {
    const result = await FollowService.getFollowingFromDB(req.user);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Following is retrieved successfully',
        data: result,
    });
});

export const FollowController = {
    createFollowUser,
    createUnfollowUser,
    getFollowersFromDB,
    getFollowingFromDB
};