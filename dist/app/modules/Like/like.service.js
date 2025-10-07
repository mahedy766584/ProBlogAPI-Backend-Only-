"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikeService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../error/appError"));
const blogPost_model_1 = require("../blogPost/blogPost.model");
const user_model_1 = require("../user/user.model");
const like_model_1 = require("./like.model");
const mongoose_1 = __importDefault(require("mongoose"));
// const createToggleLikeIntoDB = async (payload: Omit<TLike, "user">, userPayload: { userId: string }) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//         const blogPostExisting = await BlogPost.findById(payload.blogPost).session(session);
//         if (!blogPostExisting) {
//             throw new AppError(status.NOT_FOUND, 'This blog post not found!');
//         };
//         const userExisting = await User.findById(userPayload.userId).session(session);
//         if (!userExisting) {
//             throw new AppError(status.NOT_FOUND, 'Your are not a valid user!');
//         };
//         if (userExisting.isDeleted || userExisting.isDeleted) {
//             throw new AppError(status.NOT_FOUND, 'Your are not a valid user!');
//         };
//         const alreadyLiked = await Like.findOne({
//             blogPost: payload.blogPost,
//             user: userPayload.userId,
//         }).session(session);
//         if (alreadyLiked) {
//             await Like.deleteOne({
//                 blogPost: payload.blogPost,
//                 user: userPayload.userId,
//             }).session(session);
//             await BlogPost.findByIdAndUpdate(payload.blogPost, {
//                 $inc: { likeCount: -1 },
//             },
//                 { new: true, session }
//             );
//             return { liked: false, messaged: "Unliked successfully" }
//         } else {
//             const newLike = await Like.create(
//                 [
//                     {
//                         blogPost: payload.blogPost,
//                         user: userPayload.userId,
//                     },
//                 ],
//                 { session }
//             );
//             await BlogPost.findByIdAndUpdate(
//                 payload.blogPost,
//                 { $inc: { likeCount: 1 } },
//                 { new: true, session }
//             );
//             await session.commitTransaction();
//             session.endSession();
//             return { liked: true, message: "Liked successfully", like: newLike[0] };
//         };
//     } catch (error) {
//         await session.abortTransaction();
//         session.endSession();
//         throw error;
//     };
// };
const createToggleLikeIntoDB = async (payload, userPayload) => {
    const session = await mongoose_1.default.startSession();
    try {
        let result;
        await session.withTransaction(async () => {
            const blogPostExisting = await blogPost_model_1.BlogPost.findById(payload.blogPost).session(session);
            if (!blogPostExisting) {
                throw new appError_1.default(http_status_1.default.NOT_FOUND, "This blog post not found!");
            }
            const userExisting = await user_model_1.User.findById(userPayload.userId).session(session);
            if (!userExisting || userExisting.isDeleted) {
                throw new appError_1.default(http_status_1.default.NOT_FOUND, "You are not a valid user!");
            }
            const alreadyLiked = await like_model_1.Like.findOne({
                blogPost: payload.blogPost,
                user: userPayload.userId,
            }).session(session);
            if (alreadyLiked) {
                // unlike
                await like_model_1.Like.deleteOne({
                    blogPost: payload.blogPost,
                    user: userPayload.userId,
                }).session(session);
                await blogPost_model_1.BlogPost.findByIdAndUpdate(payload.blogPost, { $inc: { likeCount: -1 } }, { new: true, session });
                result = { liked: false, message: "Unliked successfully" };
            }
            else {
                // like
                const newLike = await like_model_1.Like.create([
                    {
                        blogPost: payload.blogPost,
                        user: userPayload.userId,
                    },
                ], { session });
                await blogPost_model_1.BlogPost.findByIdAndUpdate(payload.blogPost, { $inc: { likeCount: 1 } }, { new: true, session });
                result = { liked: true, message: "Liked successfully", like: newLike[0] };
            }
        });
        return result;
    }
    finally {
        session.endSession();
    }
};
const getLikeCountFromDB = async (blogPostId) => {
    const result = await like_model_1.Like.find({ blogPost: blogPostId }).populate("user", "name email profileImage");
    const likeCount = result.length;
    const users = result.map(like => like.user);
    return {
        likeCount,
        users,
    };
};
exports.LikeService = {
    createToggleLikeIntoDB,
    getLikeCountFromDB,
};
