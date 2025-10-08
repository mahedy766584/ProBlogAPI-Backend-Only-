import status from "http-status";
import AppError from "../../error/appError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from "./auth.utils";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { sendEmail } from "../../utils/communication/sendEmail";

const loginUser = async (payload: TLoginUser) => {
    const user = await User.isUserByCustomUserName(payload?.userName);
    if (!user) {
        throw new AppError(
            status.NOT_FOUND,
            'This user was not founded!'
        );
    };
    const userStatus = user?.isDeleted;
    if (userStatus) {
        throw new AppError(
            status.NOT_FOUND,
            'This user was deleted!'
        );
    };
    if (! await User.isPasswordMatch(payload?.password, user?.password)) {
        throw new AppError(
            status.FORBIDDEN,
            'Password do not match!'
        );
    };
    const userId = user._id.toString();
    const jwtPayload = {
        userId: userId,
        userName: user?.userName,
        role: user?.role,
    };

    const accessToken = await generateAccessToken(jwtPayload);

    const refreshToken = await generateRefreshToken({
        userId: user._id.toString(),
        tokenVersion: user.tokenVersion
    });

    return {
        accessToken,
        refreshToken,
        needsPasswordChange: user?.needsPasswordChange,
    };
};

const changePassword = async (
    userData: JwtPayload,
    payload: { oldPassword: string, newPassword: string }
) => {
    const user = await User.isUserByCustomUserName(userData.userName);
    if (!user) {
        throw new AppError(
            status.NOT_FOUND,
            'This user was not founded!'
        );
    };
    const userStatus = user?.isDeleted;
    if (userStatus) {
        throw new AppError(
            status.BAD_REQUEST,
            'This user was deleted!'
        );
    };

    if (! await User.isPasswordMatch(payload?.oldPassword, user?.password)) {
        throw new AppError(
            status.FORBIDDEN,
            'This password do not match!'
        );
    };

    const newHashedPassword = await bcrypt.hash(
        payload.newPassword,
        Number(config.bcrypt_salt_rounds),
    );

    await User.findOneAndUpdate(
        {
            userName: userData?.userName,
            role: userData?.role,
        },
        {
            password: newHashedPassword,
            needsPasswordChange: false,
            passwordChangedAt: new Date(),
        },
    );

    return null;

};

const refreshToken = async (token: string) => {

    const decoded = await verifyRefreshToken(token);
    const { userId, iat } = decoded;

    if (!userId) {
        throw new AppError(status.BAD_REQUEST, 'Invalid refresh token payload!');
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(status.NOT_FOUND, 'This user was not founded!');
    }
    if (user?.isDeleted) {
        throw new AppError(status.BAD_REQUEST, 'This user was deleted!');
    }

    if (typeof decoded.tokenVersion !== "undefined" && decoded.tokenVersion !== user?.tokenVersion) {
        throw new AppError(status.UNAUTHORIZED, 'Refresh token revoked!');
    };

    if (user.passwordChangedAt && User?.isJWTIssuedBeforePasswordChanged(user.passwordChangedAt, iat as number)) {
        throw new AppError(
            status.UNAUTHORIZED,
            'You are not authorized !'
        );
    };

    const jwtPayload = {
        userId: user?._id.toString(),
        userName: user?.userName,
        role: user?.role,
    };
    const accessToken = await generateAccessToken(jwtPayload);
    return {
        accessToken,
    };
};

const forgetPassword = async (userName: string) => {
    const user = await User.isUserByCustomUserName(userName);
    if (!user) {
        throw new AppError(
            status.NOT_FOUND,
            'This user was not founded!'
        );
    };
    const isDeleted = user?.isDeleted;
    if (isDeleted) {
        throw new AppError(
            status.BAD_REQUEST,
            'This user was deleted!'
        );
    };
    const userId = user?._id.toString();
    const jwtPayload = {
        userId: userId,
        userName: user?.userName,
        role: user?.role,
    };

    const resetToken = generateAccessToken(jwtPayload);

    const resetUiLink = `${config.reset_pass_ui_link}?userName=${user.userName}&token=${resetToken}`;
    sendEmail(user.email, resetUiLink);
};

const resetPassword = async (
    payload: { userName: string, newPassword: string },
    token: string
) => {
    const user = await User.isUserByCustomUserName(payload?.userName);
    if (!user) {
        throw new AppError(
            status.NOT_FOUND,
            'This user was not founded!'
        );
    };
    const isDeleted = user?.isDeleted;
    if (isDeleted) {
        throw new AppError(
            status.BAD_REQUEST,
            'This user was deleted!'
        );
    };

    const decoded = await verifyAccessToken(token);
    
    if (payload?.userName !== decoded.userName) {
        throw new AppError(
            status.FORBIDDEN,
            'Your are forbidden!'
        );
    };
    const newHashedPassword = await bcrypt.hash(
        payload?.newPassword,
        Number(config.bcrypt_salt_rounds),
    );
    await User.findOneAndUpdate(
        {
            userName: user?.userName,
            role: user?.role,
        },
        {
            password: newHashedPassword,
            needsPasswordChange: false,
            passwordChangedAt: new Date(),
        }
    );
};

export const AuthService = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword
};