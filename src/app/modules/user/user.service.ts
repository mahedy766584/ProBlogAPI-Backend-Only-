/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import AppError from "../../error/appError";
import { TUser } from "./user.interface";
import { User } from "./user.model";
import { customJwtPayload } from "../../interface";
import { adminAllowedFields, isPrivilegedValue, userAllowedFields } from "./user.constant";
import { checkEmptyOrThrow } from "../../helpers/dbCheck";

const createUserIntoDB = async (payload: TUser) => {
    const exitsUser = await User.isUserByCustomUserName(payload?.userName);
    if (exitsUser) {
        throw new AppError(
            status.BAD_REQUEST,
            'This user already exist'
        );
    };
    const result = await User.create(payload);
    return result;
};

const getAllUserFromDB = async () => {
    const result = await User.find();
    return checkEmptyOrThrow(result, 'No user found!');
};

const getSingleUserFromDB = async (id: string) => {
    const result = await User.findById(id);
    return checkEmptyOrThrow(result, 'No user found!');
};

const updateSingleUserIntoDB = async (id: string, payload: Partial<TUser>, tokePayload: customJwtPayload) => {

    const { name, ...remainingUserData } = payload;

    const userExisting = await User.findById(id);
    if (!userExisting) {
        throw new AppError(status.NOT_FOUND, 'This user not found!');
    };

    const isOwner = id === tokePayload.userId;
    const isPrivileged = isPrivilegedValue.includes(tokePayload.role);

    if (!isOwner && !isPrivileged) {
        throw new AppError(status.FORBIDDEN, "You are not allowed to update your data!");
    };

    if (userExisting.isDeleted) {
        throw new AppError(status.FORBIDDEN, "You are not authorized!");
    };

    const allowedFields = isPrivileged ? adminAllowedFields : userAllowedFields;

    const modifiedUpdateData: Record<string, unknown> = {};
    for (const key of allowedFields) {
        if (key in remainingUserData) {
            modifiedUpdateData[key] = (remainingUserData as any)[key];
        }
    };

    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdateData[`name.${key}`] = value;
        };
    };

    const result = await User.findByIdAndUpdate(id, modifiedUpdateData, { new: true, runValidators: true });
    return result;

};

const deleteUserFromDB = async (id: string, tokePayload: customJwtPayload) => {

    const userExisting = await User.findById(id);
    if (!userExisting) {
        throw new AppError(status.NOT_FOUND, 'This user not found!');
    };

    const isOwner = id === tokePayload.userId;
    const isPrivileged = isPrivilegedValue.includes(tokePayload.role);

    if (!isOwner && !isPrivileged) {
        throw new AppError(status.FORBIDDEN, "You are not allowed to update your data!");
    };

    if (userExisting.isDeleted) {
        throw new AppError(status.FORBIDDEN, "User is already deleted!");
    }

    await User.findByIdAndUpdate(
        id,
        { isDeleted: true, $inc: { tokenVersion: 1 } },
        { new: true } 
    );

    return null;

};

export const UserServices = {
    createUserIntoDB,
    getAllUserFromDB,
    getSingleUserFromDB,
    updateSingleUserIntoDB,
    deleteUserFromDB,
};