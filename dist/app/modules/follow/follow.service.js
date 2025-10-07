"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../error/appError"));
const user_model_1 = require("../user/user.model");
const follow_model_1 = require("./follow.model");
const mongoose_1 = __importDefault(require("mongoose"));
const createFollowUser = async (payload, follower) => {
    if (payload.following.toString() === follower.userId.toString()) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "You cannot follow yourself!");
    }
    ;
    const userExisting = await user_model_1.User.findById(follower.userId);
    if (userExisting && userExisting.isDeleted) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "You are not a valid user!");
    }
    ;
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const newFollowing = await follow_model_1.Follow.create([{ follower: follower.userId, ...payload }], { session });
        await user_model_1.User.findByIdAndUpdate(payload.following, { $inc: { followers: 1 } }, { session });
        await user_model_1.User.findByIdAndUpdate(follower.userId, { $inc: { following: 1 } }, { session });
        await session.commitTransaction();
        session.endSession();
        return newFollowing[0];
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
    ;
};
const createUnfollowUser = async (payload, follower) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    const existingFollowing = await follow_model_1.Follow.findOne({ follower: follower.userId });
    if (!existingFollowing) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Your are not owner of this following!');
    }
    ;
    try {
        const result = await follow_model_1.Follow.findOneAndDelete([{ follower: follower.userId, following: payload.following }]).session(session);
        if (!result) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "Follow relationship not found!");
        }
        await user_model_1.User.findOneAndUpdate({ _id: follower.userId, following: { $gt: 0 } }, { $inc: { following: -1 } }, { session, new: true });
        await user_model_1.User.findOneAndUpdate({ _id: payload.following, followers: { $gt: 0 } }, { $inc: { followers: -1 } }, { session, new: true });
        await session.commitTransaction();
        session.endSession();
        return result;
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
    ;
};
const getFollowersFromDB = async (user) => {
    const result = await follow_model_1.Follow.find({ following: user?.userId }).populate('follower', 'name email profileImage');
    return {
        count: result.length,
        result,
    };
};
const getFollowingFromDB = async (user) => {
    const result = await follow_model_1.Follow.find({ follower: user?.userId }).populate('following', 'name, email, profileImage');
    return {
        count: result.length,
        result,
    };
};
exports.FollowService = {
    createFollowUser,
    createUnfollowUser,
    getFollowersFromDB,
    getFollowingFromDB
};
