"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const config_1 = __importDefault(require("../../config"));
const appError_1 = __importDefault(require("../../error/appError"));
const loginUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.loginUser(req.body);
    const { refreshToken, accessToken, needsPasswordChange } = result;
    res.cookie('refreshToken', refreshToken, {
        secure: config_1.default.NODE_DEV === 'production',
        httpOnly: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User logged in successfully',
        data: {
            accessToken,
            needsPasswordChange,
        }
    });
});
const changePassword = (0, catchAsync_1.default)(async (req, res) => {
    const { ...passwordData } = req.body;
    const result = await auth_service_1.AuthService.changePassword(req.user, passwordData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password is updated successfully',
        data: result,
    });
});
const refreshToken = (0, catchAsync_1.default)(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await auth_service_1.AuthService.refreshToken(refreshToken);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Access token is retrieved successfully',
        data: result,
    });
});
const forgetPassword = (0, catchAsync_1.default)(async (req, res) => {
    const userName = req.body.userName;
    const result = await auth_service_1.AuthService.forgetPassword(userName);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Reset link is generated successfully',
        data: result,
    });
});
const resetPassword = (0, catchAsync_1.default)(async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Something went wrong!');
    }
    ;
    const result = await auth_service_1.AuthService.resetPassword(req.body, token);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password reset successfully',
        data: result,
    });
});
exports.AuthController = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword
};
