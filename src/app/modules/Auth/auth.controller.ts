import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";

const loginUser = catchAsync(async (req, res) => {
    const result = await AuthService.loginUser(req.body);
    const { accessToken } = result;
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'User logged in successfully',
        data: {
            accessToken,
        }
    });
});

export const AuthController = {
    loginUser,
};