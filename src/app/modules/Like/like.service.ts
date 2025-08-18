import status from "http-status";
import AppError from "../../error/appError";
import { BlogPost } from "../blogPost/blogPost.model";
import { TLike } from "./like.interface";
import { User } from "../user/user.model";
import { Like } from "./like.model";
import mongoose from "mongoose";

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

const createToggleLikeIntoDB = async (
    payload: Omit<TLike, "user">,
    userPayload: { userId: string }
) => {
    const session = await mongoose.startSession();

    try {
        let result;

        await session.withTransaction(async () => {
            const blogPostExisting = await BlogPost.findById(payload.blogPost).session(session);
            if (!blogPostExisting) {
                throw new AppError(status.NOT_FOUND, "This blog post not found!");
            }

            const userExisting = await User.findById(userPayload.userId).session(session);
            if (!userExisting || userExisting.isDeleted) {
                throw new AppError(status.NOT_FOUND, "You are not a valid user!");
            }

            const alreadyLiked = await Like.findOne({
                blogPost: payload.blogPost,
                user: userPayload.userId,
            }).session(session);

            if (alreadyLiked) {
                // unlike
                await Like.deleteOne({
                    blogPost: payload.blogPost,
                    user: userPayload.userId,
                }).session(session);

                await BlogPost.findByIdAndUpdate(
                    payload.blogPost,
                    { $inc: { likeCount: -1 } },
                    { new: true, session }
                );

                result = { liked: false, message: "Unliked successfully" };
            } else {
                // like
                const newLike = await Like.create(
                    [
                        {
                            blogPost: payload.blogPost,
                            user: userPayload.userId,
                        },
                    ],
                    { session }
                );

                await BlogPost.findByIdAndUpdate(
                    payload.blogPost,
                    { $inc: { likeCount: 1 } },
                    { new: true, session }
                );

                result = { liked: true, message: "Liked successfully", like: newLike[0] };
            }
        });

        return result;
    } finally {
        session.endSession();
    }
};

const getLikeCountFromDB = async (blogPostId: string) => {
    const result = await Like.find({ blogPost: blogPostId }).populate("user", "name email profileImage");
    const likeCount = result.length;
    const users = result.map(like => like.user);
    return {
        likeCount,
        users,
    };
};

export const LikeService = {
    createToggleLikeIntoDB,
    getLikeCountFromDB,
};