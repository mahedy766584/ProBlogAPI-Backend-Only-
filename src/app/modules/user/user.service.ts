/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import { TUser } from "./user.interface";
import { withTransaction } from "../../utils/db/withTransaction";
import { User } from "./user.model";
import AppError from "../../error/appError";
import { sendImageToCloudinary } from "../../utils/file/sendImageToCloudinary";
import QueryBuilder from "../../builder/QueryBuilder";
import { adminAllowedFields, isPrivilegedValue, USER_ROLE, userAllowedFields, userSearchableFields } from "./user.constant";
import { checkEmptyOrThrow } from "../../helpers/dbCheck";
import { customJwtPayload } from "../../interface";
import { verifyUserAccess } from "../../utils/guards/verifyUserAccess";
import { sendEmail } from "../../utils/communication/sendEmail";
import { ErrorMessages } from "../../constant/errorMessages";

const createUserIntoDB = async (file: any, payload: TUser) => {

    return withTransaction(async (session) => {

        const exitsUser = await User.isUserByCustomUserName(payload?.userName);
        if (exitsUser) {
            throw new AppError(status.BAD_REQUEST, ErrorMessages.USER.ALREADY_EXISTS);
        };

        if (file) {
            const imageName = `${payload?.userName}`;
            const path = file?.path;
            const { secure_url } = await sendImageToCloudinary(imageName, path);
            payload.profileImage = secure_url;
        };

        const result = await User.create([payload], { session });

        return result[0];
    });
};

const getAllUserFromDB = async (query: Record<string, unknown>) => {

    const userQuery = new QueryBuilder(User.find(), query)
        .search(userSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();

    const result = await userQuery.modelQuery;
    const meta = await userQuery.countTotal();
    return checkEmptyOrThrow({
        meta,
        result
    }, ErrorMessages.COMMON.NOT_FOUND);
};

const getSingleUserFromDB = async (id: string) => {
    const result = await User.findById(id);
    return checkEmptyOrThrow(result, ErrorMessages.COMMON.NOT_FOUND);
};

const getUserRoleAuthor = async() =>{

    const result = await User.find({role: USER_ROLE.author});

    return checkEmptyOrThrow(result, ErrorMessages.COMMON.NOT_FOUND);

};

const updateSingleUserIntoDB = async (id: string, payload: Partial<TUser>, tokePayload: customJwtPayload) => {

    const { name, ...remainingUserData } = payload;

    await verifyUserAccess(id, tokePayload);

    const isPrivileged = isPrivilegedValue.includes(tokePayload.role);

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
    const user = await verifyUserAccess(id, tokePayload);
    if (user.isDeleted) {
        throw new AppError(status.BAD_REQUEST, ErrorMessages.USER.ALREADY_DEL);
    }
    await User.findByIdAndUpdate(
        id,
        { isDeleted: true, $inc: { tokenVersion: 1 } },
        { new: true }
    );
    return null;
};

const restoreDeletedUserFromDB = async (id: string, tokenPayload: customJwtPayload) => {
    const user = await verifyUserAccess(id, tokenPayload);
    if (!user.isDeleted) {
        throw new AppError(status.BAD_REQUEST, "User is already active!");
    };
    if (tokenPayload.role !== 'admin' && tokenPayload.role !== 'superAdmin') {
        throw new AppError(status.BAD_REQUEST, "Only admins can restore users!")
    }
    const restored = await User.findByIdAndUpdate(
        id,
        { isDeleted: false },
        { new: true, runValidators: true },
    );
    if (restored) {
        await sendEmail(user.email, "Your account has been restored, Welcome back!");
    };
    return restored;
};

const updateUserRole = async (id: string, role: string, tokenPayload: customJwtPayload) => {
    const user = await verifyUserAccess(id, tokenPayload);
    if (user.isDeleted) {
        throw new AppError(status.FORBIDDEN, ErrorMessages.USER.ALREADY_DEL);
    }
    const isPrivileged = isPrivilegedValue.includes(tokenPayload.role);
    if (!isPrivileged) {
        throw new AppError(status.FORBIDDEN, ErrorMessages.USER.ROLE_UPDATE_FORBIDDEN);
    }
    const updateRole = await User.findByIdAndUpdate(
        id,
        { role: role },
        { new: true, runValidators: true },
    );
    return updateRole;
};

const updateUserProfileImage = async (id: string, file: any, tokenPayload: customJwtPayload) => {
    const user = await verifyUserAccess(id, tokenPayload);
    if (!file) {
        throw new AppError(status.NOT_FOUND, "No image provided!")
    }
    const imageName = `${user.userName}`;
    const path = file?.path;
    const { secure_url } = await sendImageToCloudinary(imageName, path);
    const updated = await User.findByIdAndUpdate(id,
        { profileImage: secure_url },
        { new: true, runValidators: true },
    );
    return updated;
};

const deactivateUserAccount = async (id: string, tokenPayload: customJwtPayload) => {
    const isPrivileged = isPrivilegedValue.includes(tokenPayload.role);
    if (isPrivileged) {
        throw new AppError(status.FORBIDDEN, "Only admin can active accounts!");
    }
    const user = await verifyUserAccess(id, tokenPayload);
    if(!user.isActive){
        throw new AppError(status.BAD_REQUEST, "User already deactivate!");
    }
    const updated = await User.findByIdAndUpdate(id,
        { isActive: false },
        { new: true }
    );
    return updated;
};

const activateUserAccount = async (id: string, tokenPayload: customJwtPayload) => {
    const isPrivileged = isPrivilegedValue.includes(tokenPayload.role);
    if (!isPrivileged) {
        throw new AppError(status.FORBIDDEN, "Only admin can deactivate accounts!");
    }
    const user = await verifyUserAccess(id, tokenPayload);
    if(user.isActive){
        throw new AppError(status.BAD_REQUEST, "User already active!");
    }
    const updated = await User.findByIdAndUpdate(id,
        { isActive: true },
        { new: true }
    );
    return updated;
};

export const UserServices = {
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