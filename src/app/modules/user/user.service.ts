import status from "http-status";
import AppError from "../../error/appError";
import { TUser } from "./user.interface";
import { User } from "./user.model";

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
    return result;
};

const getSingleUserFromDB = async (id: string) => {
    const result = await User.findById(id);
    return result;
};

export const UserServices = {
    createUserIntoDB,
    getAllUserFromDB,
    getSingleUserFromDB,
};