import status from "http-status";
import AppError from "../../error/appError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import { createToke, verifyToken } from "./auth.utils";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";

const loginUser = async (payload: TLoginUser) => {
    const user = await User.isUserByCustomUserName(
        payload?.userName
    );
    if (!user) {
        throw new AppError(
            status.NOT_FOUND,
            'This user was not founded!'
        );
    }
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
    const jwtPayload = {
        userName: user?.userName,
        role: user?.role,
    };
    const accessToken = createToke(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    );
    const refreshToken = createToke(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string,
    );
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

    const decoded = verifyToken(
        token,
        config.jwt_refresh_secret as string,
    );
    const { userName, iat } = decoded;

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
    if (
        user.passwordChangedAt &&
        User?.isJWTIssuedBeforePasswordChanged(
            user.passwordChangedAt,
            iat as number
        )) {
        throw new AppError(
            status.UNAUTHORIZED,
            'You are not authorized !'
        );
    };
    const jwtPayload = {
        userName: user?.userName,
        role: user?.role,
    };
    const accessToken = createToke(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
    );
    return {
        accessToken,
    };
};

// const forgetPassword = async (userName: string) => {

//     const user = await User.isUserByCustomUserName(userName);

//     if (!user) {
//         throw new AppError(
//             status.NOT_FOUND,
//             'This user was not founded!'
//         );
//     };

//     const isDeleted = user?.isDeleted;
//     if (isDeleted) {
//         throw new AppError(
//             status.BAD_REQUEST,
//             'This user was deleted!'
//         );
//     };

//     // const jwtPayload = {
//     //     userName: user?.userName,
//     //     role: user?.role,
//     // };

//     // const resetToken = {

//     // };

// };

export const AuthService = {
    loginUser,
    changePassword,
    refreshToken,
};