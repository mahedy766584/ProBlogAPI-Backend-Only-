import status from "http-status";
import AppError from "../../error/appError";
import { User } from "../user/user.model";
import { TLoginUser } from "./auth.interface";
import { createToke } from "./auth.utils";
import config from "../../config";

const loginUser = async (payload: TLoginUser) => {
    console.log('payload', payload)
    const user = await User.isUserByCustomUserName(
        payload?.userName
    );
    if (!user) {
        throw new AppError(
            status.NOT_FOUND,
            'This user was not founded!'
        );
    }
    console.log('user---->', user)
    const userStatus = user?.isDeleted;
    if (userStatus) {
        throw new AppError(
            status.NOT_FOUND,
            'This user was deleted!'
        );
    };
    console.log('p--->', payload?.password, 'us-->', user?.password)
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

    return {
        accessToken,
        needsPasswordChange: user?.needsPasswordChange,
    };

};

export const AuthService = {
    loginUser,
};