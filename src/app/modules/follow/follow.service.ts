import status from "http-status";
import AppError from "../../error/appError";
import { customJwtPayload } from "../../interface";
import { TFollowBase } from "./follow.interface";
import { User } from "../user/user.model";
import { Follow } from "./follow.model";
import mongoose from "mongoose";

const createFollowUser = async (payload: Omit<TFollowBase, 'follower'>, follower: customJwtPayload) => {

    if (payload.following.toString() === follower.userId.toString()) {
        throw new AppError(status.BAD_REQUEST, "You cannot follow yourself!");
    };

    const userExisting = await User.findById(follower.userId);
    if (userExisting && userExisting.isDeleted) {
        throw new AppError(status.BAD_REQUEST, "You are not a valid user!");
    };

    const session = await mongoose.startSession();
    session.startTransaction();

    try {

        const newFollowing = await Follow.create([{ follower: follower.userId, ...payload }], { session });

        await User.findByIdAndUpdate(payload.following, { $inc: { followers: 1 } }, { session });
        await User.findByIdAndUpdate(follower.userId, { $inc: { following: 1 } }, { session });

        await session.commitTransaction();
        session.endSession();
        return newFollowing[0];

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    };


};

const createUnfollowUser = async (payload: Omit<TFollowBase, 'follower'>, follower: customJwtPayload) => {

    const session = await mongoose.startSession();
    session.startTransaction();

    const existingFollowing = await Follow.findOne({ follower: follower.userId });

    if (!existingFollowing) {
        throw new AppError(status.BAD_REQUEST, 'Your are not owner of this following!');
    };

    try {

        const result = await Follow.findOneAndDelete([{ follower: follower.userId, following: payload.following }]).session(session);

        if (!result) {
            throw new AppError(status.NOT_FOUND, "Follow relationship not found!");
        }

        await User.findOneAndUpdate(
            { _id: follower.userId, following: { $gt: 0 } },
            { $inc: { following: -1 } },
            { session, new: true }
        );

        await User.findOneAndUpdate(
            { _id: payload.following, followers: { $gt: 0 } },
            { $inc: { followers: -1 } },
            { session, new: true }
        );


        await session.commitTransaction();
        session.endSession();

        return result;

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    };

};

const getFollowersFromDB = async (user: customJwtPayload) => {
    const result = await Follow.find({ following: user?.userId }).populate('follower', 'name email profileImage');
    return {
        count: result.length,
        result,
    };
};

const getFollowingFromDB = async (user: customJwtPayload) => {
    const result = await Follow.find({ follower: user?.userId }).populate('following', 'name, email, profileImage');
    return {
        count: result.length,
        result,
    };
};

export const FollowService = {
    createFollowUser,
    createUnfollowUser,
    getFollowersFromDB,
    getFollowingFromDB
};