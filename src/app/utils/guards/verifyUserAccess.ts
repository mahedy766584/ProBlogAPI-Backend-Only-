import status from "http-status";
import AppError from "../../error/appError";
import { customJwtPayload } from "../../interface";
import { User } from "../../modules/user/user.model";
import { isPrivilegedValue } from "../../modules/user/user.constant";
import { ErrorMessages } from "../../constant/errorMessages";

export const verifyUserAccess = async(id: string, tokenPayload: customJwtPayload) =>{
    const userExisting = await User.findById(id);
    if (!userExisting) {
        throw new AppError(status.NOT_FOUND, ErrorMessages.USER.NOT_FOUND);
    };

    const isOwner = id === tokenPayload.userId;
    const isPrivileged = isPrivilegedValue.includes(tokenPayload.role);

    if (!isOwner && !isPrivileged) {
        throw new AppError(status.FORBIDDEN, ErrorMessages.USER.NOT_ALLOWED);
    };

    return userExisting;

};