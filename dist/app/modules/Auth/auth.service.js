"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../error/appError"));
const user_model_1 = require("../user/user.model");
const auth_utils_1 = require("./auth.utils");
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const sendEmail_1 = require("../../utils/sendEmail");
const loginUser = async (payload) => {
    const user = await user_model_1.User.isUserByCustomUserName(payload?.userName);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user was not founded!');
    }
    ;
    const userStatus = user?.isDeleted;
    if (userStatus) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user was deleted!');
    }
    ;
    if (!await user_model_1.User.isPasswordMatch(payload?.password, user?.password)) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'Password do not match!');
    }
    ;
    const userId = user._id.toString();
    const jwtPayload = {
        userId: userId,
        userName: user?.userName,
        role: user?.role,
    };
    const accessToken = await (0, auth_utils_1.generateAccessToken)(jwtPayload);
    const refreshToken = await (0, auth_utils_1.generateRefreshToken)({
        userId: user._id.toString(),
        tokenVersion: user.tokenVersion
    });
    return {
        accessToken,
        refreshToken,
        needsPasswordChange: user?.needsPasswordChange,
    };
};
const changePassword = async (userData, payload) => {
    const user = await user_model_1.User.isUserByCustomUserName(userData.userName);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user was not founded!');
    }
    ;
    const userStatus = user?.isDeleted;
    if (userStatus) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'This user was deleted!');
    }
    ;
    if (!await user_model_1.User.isPasswordMatch(payload?.oldPassword, user?.password)) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'This password do not match!');
    }
    ;
    const newHashedPassword = await bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    await user_model_1.User.findOneAndUpdate({
        userName: userData?.userName,
        role: userData?.role,
    }, {
        password: newHashedPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    });
    return null;
};
const refreshToken = async (token) => {
    const decoded = await (0, auth_utils_1.verifyRefreshToken)(token);
    const { userId, iat } = decoded;
    if (!userId) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid refresh token payload!');
    }
    const user = await user_model_1.User.findById(userId);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user was not founded!');
    }
    if (user?.isDeleted) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'This user was deleted!');
    }
    if (typeof decoded.tokenVersion !== "undefined" && decoded.tokenVersion !== user?.tokenVersion) {
        throw new appError_1.default(http_status_1.default.UNAUTHORIZED, 'Refresh token revoked!');
    }
    ;
    if (user.passwordChangedAt && user_model_1.User?.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat)) {
        throw new appError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized !');
    }
    ;
    const jwtPayload = {
        userId: user?._id.toString(),
        userName: user?.userName,
        role: user?.role,
    };
    const accessToken = await (0, auth_utils_1.generateAccessToken)(jwtPayload);
    return {
        accessToken,
    };
};
const forgetPassword = async (userName) => {
    const user = await user_model_1.User.isUserByCustomUserName(userName);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user was not founded!');
    }
    ;
    const isDeleted = user?.isDeleted;
    if (isDeleted) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'This user was deleted!');
    }
    ;
    const userId = user?._id.toString();
    const jwtPayload = {
        userId: userId,
        userName: user?.userName,
        role: user?.role,
    };
    const resetToken = (0, auth_utils_1.generateAccessToken)(jwtPayload);
    const resetUiLink = `${config_1.default.reset_pass_ui_link}?userName=${user.userName}&token=${resetToken}`;
    (0, sendEmail_1.sendEmail)(user.email, resetUiLink);
};
const resetPassword = async (payload, token) => {
    const user = await user_model_1.User.isUserByCustomUserName(payload?.userName);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user was not founded!');
    }
    ;
    const isDeleted = user?.isDeleted;
    if (isDeleted) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'This user was deleted!');
    }
    ;
    const decoded = await (0, auth_utils_1.verifyAccessToken)(token);
    if (payload?.userName !== decoded.userName) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, 'Your are forbidden!');
    }
    ;
    const newHashedPassword = await bcrypt_1.default.hash(payload?.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    await user_model_1.User.findOneAndUpdate({
        userName: user?.userName,
        role: user?.role,
    }, {
        password: newHashedPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    });
};
exports.AuthService = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword
};
