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

const getAllUserFromDB = catchAsync(async (req, res) => {
    const result = await UserServices.getAllUserFromDB();
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'All user is retrieved successfully',
        data: result,
    });
});

const getSingleUserFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await UserServices.getSingleUserFromDB(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Single user is retrieved successfully',
        data: result,
    });
});

const updateSingleUserIntoDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await UserServices.updateSingleUserIntoDB(id, req.body, req.user!);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Single user is updated successfully',
        data: result,
    });
});

const deleteUserFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await UserServices.deleteUserFromDB(id, req.user!);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User is Deleted successfully',
        data: result,
    });
});

export const UserController = {
    createUserIntoDB,
    getAllUserFromDB,
    getSingleUserFromDB,
    updateSingleUserIntoDB,
    deleteUserFromDB,
};