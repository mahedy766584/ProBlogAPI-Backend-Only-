"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../error/appError"));
const user_model_1 = require("./user.model");
const user_constant_1 = require("./user.constant");
const dbCheck_1 = require("../../helpers/dbCheck");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const mongoose_1 = __importDefault(require("mongoose"));
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const createUserIntoDB = async (file, payload) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const exitsUser = await user_model_1.User.isUserByCustomUserName(payload?.userName);
        if (exitsUser) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "This user already exist");
        }
        ;
        if (file) {
            const imageName = `${payload?.userName}`;
            const path = file?.path;
            const { secure_url } = await (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
            payload.profileImage = secure_url;
        }
        ;
        const result = await user_model_1.User.create([payload], { session });
        await session.commitTransaction();
        session.endSession();
        return result[0];
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
    ;
};
const getAllUserFromDB = async (query) => {
    const userQuery = new QueryBuilder_1.default(user_model_1.User.find(), query)
        .search(user_constant_1.userSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = await userQuery.modelQuery;
    const meta = await userQuery.countTotal();
    return (0, dbCheck_1.checkEmptyOrThrow)({
        meta,
        result
    }, 'No user found!');
};
const getSingleUserFromDB = async (id) => {
    const result = await user_model_1.User.findById(id);
    return (0, dbCheck_1.checkEmptyOrThrow)(result, 'No user found!');
};
const updateSingleUserIntoDB = async (id, payload, tokePayload) => {
    const { name, ...remainingUserData } = payload;
    const userExisting = await user_model_1.User.findById(id);
    if (!userExisting) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user not found!');
    }
    ;
    const isOwner = id === tokePayload.userId;
    const isPrivileged = user_constant_1.isPrivilegedValue.includes(tokePayload.role);
    if (!isOwner && !isPrivileged) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "You are not allowed to update your data!");
    }
    ;
    if (userExisting.isDeleted) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "You are not authorized!");
    }
    ;
    const allowedFields = isPrivileged ? user_constant_1.adminAllowedFields : user_constant_1.userAllowedFields;
    const modifiedUpdateData = {};
    for (const key of allowedFields) {
        if (key in remainingUserData) {
            modifiedUpdateData[key] = remainingUserData[key];
        }
    }
    ;
    if (name && Object.keys(name).length) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdateData[`name.${key}`] = value;
        }
        ;
    }
    ;
    const result = await user_model_1.User.findByIdAndUpdate(id, modifiedUpdateData, { new: true, runValidators: true });
    return result;
};
const deleteUserFromDB = async (id, tokePayload) => {
    const userExisting = await user_model_1.User.findById(id);
    if (!userExisting) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user not found!');
    }
    ;
    const isOwner = id === tokePayload.userId;
    const isPrivileged = user_constant_1.isPrivilegedValue.includes(tokePayload.role);
    if (!isOwner && !isPrivileged) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "You are not allowed to update your data!");
    }
    ;
    if (userExisting.isDeleted) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "User is already deleted!");
    }
    await user_model_1.User.findByIdAndUpdate(id, { isDeleted: true, $inc: { tokenVersion: 1 } }, { new: true });
    return null;
};
exports.UserServices = {
    createUserIntoDB,
    getAllUserFromDB,
    getSingleUserFromDB,
    updateSingleUserIntoDB,
    deleteUserFromDB,
};
