/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import { TUser } from "./user.interface";
import { withTransaction } from "../../utils/db/withTransaction";
import { User } from "./user.model";
import AppError from "../../error/appError";
import { sendImageToCloudinary } from "../../utils/file/sendImageToCloudinary";
import QueryBuilder from "../../builder/QueryBuilder";
import { adminAllowedFields, isPrivilegedValue, userAllowedFields, userSearchableFields } from "./user.constant";
import { checkEmptyOrThrow } from "../../helpers/dbCheck";
import { customJwtPayload } from "../../interface";
import { verifyUserAccess } from "../../utils/guards/verifyUserAccess";

const createUserIntoDB = async (file: any, payload: TUser) => {

    return withTransaction(async(session)=>{

        const exitsUser = await User.isUserByCustomUserName(payload?.userName);
        if (exitsUser) {
            throw new AppError(status.BAD_REQUEST, "This user already exist");
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
    }, 'No user found!');
};

const getSingleUserFromDB = async (id: string) => {
    const result = await User.findById(id);
    return checkEmptyOrThrow(result, 'No user found!');
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

    await verifyUserAccess(id, tokePayload);

    const isOwner = id === tokePayload.userId;
    const isPrivileged = isPrivilegedValue.includes(tokePayload.role);

    if (!isOwner && !isPrivileged) {
        throw new AppError(status.FORBIDDEN, "You are not allowed to update your data!");
    };

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