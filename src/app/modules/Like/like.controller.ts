import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { LikeService } from "./like.service";

const createToggleLikeIntoDB = catchAsync(async (req, res) => {
    const userPayload = {
        userId: req.user.userId,
    };
    const result = await LikeService.createToggleLikeIntoDB(req.body, userPayload);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Like is created successfully",
        data: result,
    });
});

const getLikeCountFromDB = catchAsync(async (req, res) => {
    const { blogPostId } = req.params;
    const countResult = await LikeService.getLikeCountFromDB(blogPostId);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Like count fetched successfully",
        data: countResult,
    });
});

export const LikeController = {
    createToggleLikeIntoDB,
    getLikeCountFromDB,
};