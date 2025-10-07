"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorRequestService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../error/appError"));
const user_model_1 = require("../user/user.model");
const authorRequest_model_1 = require("./authorRequest.model");
const mongoose_1 = __importDefault(require("mongoose"));
const auth_utils_1 = require("../Auth/auth.utils");
const dbCheck_1 = require("../../helpers/dbCheck");
const createAuthorRequestIntoDB = async (payload, tokenPayload) => {
    if (!tokenPayload.userId) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "User ID missing in token!");
    }
    const user = await user_model_1.User.findById(tokenPayload.userId);
    if (!user) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "This user not found!!");
    }
    if (user?.role !== tokenPayload.role) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "Only normal users can request author role!");
    }
    ;
    const isDeleted = user?.isDeleted;
    if (isDeleted) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "this user was deleted!");
    }
    ;
    const isExistsRequest = await authorRequest_model_1.AuthorRequest.findOne({
        user: tokenPayload?.userId,
        status: 'pending',
    });
    if (isExistsRequest) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "You already have a pending author request!");
    }
    const result = await authorRequest_model_1.AuthorRequest.create({
        user: tokenPayload.userId,
        ...payload,
    });
    return result;
};
const getAllAuthorRequestFromDB = async () => {
    const result = await authorRequest_model_1.AuthorRequest.find()
        .populate('user');
    return (0, dbCheck_1.checkEmptyOrThrow)(result, "Author request not found!");
};
const getSingleAuthorRequestFromDB = async (id) => {
    const result = await authorRequest_model_1.AuthorRequest.findById(id)
        .populate('user');
    return (0, dbCheck_1.checkEmptyOrThrow)(result, "Author request not found!");
};
const updateSingleAuthorRequestIntoDB = async (id, payload, tokenPayload) => {
    // 1. Find the existing request + populate user
    const authorRequest = await authorRequest_model_1.AuthorRequest.findById(id).populate("user", "userName role");
    if (!authorRequest) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Author request not found!");
    }
    // 2. Ensure linked user exists
    if (!authorRequest.user) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "User linked to this request does not exist!");
    }
    // 3. Prevent update if status is already approved/rejected
    if (authorRequest.status !== "pending") {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, `You cannot update a request that is already ${authorRequest.status}`);
    }
    // 4. Role-based restriction (normal user can only edit own message)
    if (tokenPayload?.role === "user") {
        if (authorRequest.user.userName !== tokenPayload.userName) {
            throw new appError_1.default(http_status_1.default.FORBIDDEN, "❎ You cannot update another user's request!");
        }
        const allowedField = ["message"];
        Object.keys(payload).forEach((key) => {
            if (!allowedField.includes(key)) {
                throw new appError_1.default(http_status_1.default.FORBIDDEN, `You are not allowed to update this field: ${key}`);
            }
        });
    }
    const session = await mongoose_1.default.startSession();
    let tokens;
    try {
        session.startTransaction();
        // 5. Update the request document
        const updateRequest = await authorRequest_model_1.AuthorRequest.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
            session,
        });
        if (!updateRequest) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update author request!");
        }
        // 6. If approved → update user role & bump tokenVersion
        if (updateRequest?.status === "approved") {
            const userId = authorRequest.user?._id?.toString() || authorRequest.user?.toString();
            const updatedUser = await user_model_1.User.findByIdAndUpdate(userId, { role: "author", $inc: { tokenVersion: 1 } }, { new: true, session });
            if (!updatedUser) {
                throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Failed to update user role!");
            }
            // Generate new tokens with updated role & tokenVersion
            const accessToken = await (0, auth_utils_1.generateAccessToken)({
                userId: updatedUser._id.toString(),
                userName: updatedUser.userName,
                role: updatedUser.role,
                tokenVersion: updatedUser.tokenVersion,
            });
            const refreshToken = await (0, auth_utils_1.generateRefreshToken)({
                userId: updatedUser._id.toString(),
                tokenVersion: updatedUser.tokenVersion,
            });
            tokens = { accessToken, refreshToken };
        }
        await session.commitTransaction();
        session.endSession();
        // 7. Return updated request + tokens (if generated)
        return {
            updateRequest,
            ...(tokens && { tokens }), // Only include tokens if role was updated
        };
    }
    catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err instanceof appError_1.default
            ? err
            : new appError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to update author request!");
    }
};
const deletedAuthorRequestFromDB = async (id) => {
    const isExistAuthor = await authorRequest_model_1.AuthorRequest.findById(id);
    if (!isExistAuthor) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Your author request not found!');
    }
    ;
    const result = await authorRequest_model_1.AuthorRequest.deleteOne({ _id: id });
    return result;
};
exports.AuthorRequestService = {
    createAuthorRequestIntoDB,
    getAllAuthorRequestFromDB,
    getSingleAuthorRequestFromDB,
    updateSingleAuthorRequestIntoDB,
    deletedAuthorRequestFromDB,
};
