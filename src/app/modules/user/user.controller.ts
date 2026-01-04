import { Request, Response } from "express";
import { UserServices } from "./user.service";
import status from "http-status";
import catchAsync from "../../utils/async/catchAsync";
import sendResponse from "../../utils/common/sendResponse";

const createUserIntoDB = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServices.createUserIntoDB(req.file, req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User is created successfully',
        data: result,
    });
});

const getAllUserFromDB = catchAsync(async (req, res) => {
    const result = await UserServices.getAllUserFromDB(req.query);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'All user is retrieved successfully',
        data: result,
    });
});

const getUserRoleAuthor = catchAsync(async(req, res) =>{
    const result = await UserServices.getUserRoleAuthor();
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'All author is retrieved successfully',
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

const restoreDeletedUserFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const result = await UserServices.restoreDeletedUserFromDB(id, user!);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User is restored successfully',
        data: result,
    });
});

const updateUserRole = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;
    const result = await UserServices.updateUserRole(id, role, req.user!);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Update user role successfully',
        data: result,
    });
});

const updateUserProfileImage = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await UserServices.updateUserProfileImage(id, req.file, req.user);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Update user profile image successfully',
        data: result,
    });
});

const deactivateUserAccount = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = UserServices.deactivateUserAccount(id, req.user!);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User is deactivated successfully',
        data: result,
    });
});

const activateUserAccount = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = UserServices.activateUserAccount(id, req.user!);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User is activated successfully',
        data: result,
    });
});

export const UserController = {
    createUserIntoDB,
    getAllUserFromDB,
    getSingleUserFromDB,
    updateSingleUserIntoDB,
    deleteUserFromDB,
    restoreDeletedUserFromDB,
    updateUserRole,
    updateUserProfileImage,
    deactivateUserAccount,
    activateUserAccount,
    getUserRoleAuthor,
};