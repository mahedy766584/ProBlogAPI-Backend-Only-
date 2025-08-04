import { Request, Response } from "express";
import { UserServices } from "./user.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const createUserIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.createUserIntoDB(req.body);

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User is created successfully',
        data: result,
    });
});

export const UserController = {
    createUserIntoDB,
};