/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import AppError from "../../error/appError";
import { User } from "../user/user.model";
import { TAuthorRequest } from "./authorRequest.interface";
import { AuthorRequest } from "./authorRequest.model";
import { TUser } from "../user/user.interface";
import mongoose from "mongoose";
import { generateAccessToken, generateRefreshToken } from "../Auth/auth.utils";

const createAuthorRequestIntoDB = async (userId: string, payload: TAuthorRequest) => {

    const user = await User.findById(userId);
    if (!user) {
        throw new AppError(
            status.BAD_REQUEST,
            'This user not found!!'
        );
    };
    if (user?.role !== 'user') {
        throw new AppError(
            status.FORBIDDEN,
            "Only normal users can request author role!"
        );
    };

    const isDeleted = user?.isDeleted;
    if (isDeleted) {
        throw new AppError(
            status.FORBIDDEN,
            "this user was deleted!"
        );
    };

    const isExistsRequest = await AuthorRequest.findOne({
        user: userId,
        status: 'pending',
    });
    if (isExistsRequest) {
        throw new AppError(
            status.BAD_REQUEST,
            "You already have a pending author request!"
        );
    }
    const result = await AuthorRequest.create(payload);
    return result;
};

const getAllAuthorRequestFromDB = async () => {
    const result = await AuthorRequest.find()
        .populate('user');
    return result;
};

const getSingleAuthorRequestFromDB = async (id: string) => {
    const result = await AuthorRequest.findById(id)
        .populate('user');
    return result;
};

const updateSingleAuthorRequestIntoDB = async (
    id: string,
    payload: Partial<TAuthorRequest>,
    currentUser: { userName: string; role: string; userId: string }
) => {
    // 1. Find the existing request + populate user
    const authorRequest = await AuthorRequest.findById(id).populate<{ user: TUser }>(
        "user",
        "userName role"
    );
    if (!authorRequest) {
        throw new AppError(status.NOT_FOUND, "Author request not found!");
    }

    // 2. Ensure linked user exists
    if (!authorRequest.user) {
        throw new AppError(status.BAD_REQUEST, "User linked to this request does not exist!");
    }

    // 3. Prevent update if status is already approved/rejected
    if (authorRequest.status !== "pending") {
        throw new AppError(
            status.FORBIDDEN,
            `You cannot update a request that is already ${authorRequest.status}`
        );
    }

    // 4. Role-based restriction (normal user can only edit own message)
    if (currentUser?.role === "user") {
        if (authorRequest.user.userName !== currentUser.userName) {
            throw new AppError(status.FORBIDDEN, "❎ You cannot update another user's request!");
        }
        const allowedField = ["message"];
        Object.keys(payload).forEach((key) => {
            if (!allowedField.includes(key)) {
                throw new AppError(
                    status.FORBIDDEN,
                    `You are not allowed to update this field: ${key}`
                );
            }
        });
    }

    const session = await mongoose.startSession();
    let tokens: { accessToken: string; refreshToken: string } | undefined;

    try {
        session.startTransaction();

        // 5. Update the request document
        const updateRequest = await AuthorRequest.findByIdAndUpdate(id, payload, {
            new: true,
            runValidators: true,
            session,
        });

        if (!updateRequest) {
            throw new AppError(status.BAD_REQUEST, "Failed to update author request!");
        }

        // 6. If approved → update user role & bump tokenVersion
        if (updateRequest?.status === "approved") {
            const userId =
                authorRequest.user?._id?.toString() || authorRequest.user?.toString();

            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { role: "author", $inc: { tokenVersion: 1 } },
                { new: true, session }
            );

            if (!updatedUser) {
                throw new AppError(status.BAD_REQUEST, "Failed to update user role!");
            }

            // Generate new tokens with updated role & tokenVersion
            const accessToken = await generateAccessToken({
                userId: updatedUser._id.toString(),
                userName: updatedUser.userName,
                role: updatedUser.role,
                tokenVersion: updatedUser.tokenVersion,
            });

            const refreshToken = await generateRefreshToken({
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
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err instanceof AppError
            ? err
            : new AppError(status.INTERNAL_SERVER_ERROR, "Failed to update author request!");
    }
};

const deletedAuthorRequestFromDB = async (id: string) => {

    const isExistAuthor = await AuthorRequest.findById(id);

    if (!isExistAuthor) {
        throw new AppError(
            status.NOT_FOUND,
            'Your author request not found!'
        );
    };

    const result = await AuthorRequest.deleteOne({ _id: id });
    return result;
};

export const AuthorRequestService = {
    createAuthorRequestIntoDB,
    getAllAuthorRequestFromDB,
    getSingleAuthorRequestFromDB,
    updateSingleAuthorRequestIntoDB,
    deletedAuthorRequestFromDB,
};