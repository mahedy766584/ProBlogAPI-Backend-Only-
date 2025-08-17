import status from "http-status";
import AppError from "../../error/appError";
import { BlogPost } from "../blogPost/blogPost.model";
import { TLike } from "./like.interface";
import { User } from "../user/user.model";
import { Like } from "./like.model";

const createToggleLikeIntoDB = async (payload: Omit<TLike, "user">, userPayload: { userId: string }) => {

    const blogPostExisting = await BlogPost.findById(payload.blogPost);

    if (!blogPostExisting) {
        throw new AppError(status.NOT_FOUND, 'This blog post not found!');
    };

    const userExisting = await User.findById(userPayload.userId);

    if (!userExisting) {
        throw new AppError(status.NOT_FOUND, 'Your are not a valid user!');
    };

    if (userExisting.isDeleted || userExisting.isDeleted) {
        throw new AppError(status.NOT_FOUND, 'Your are not a valid user!');
    };

    const alreadyLiked = await Like.findOne({
        blogPost: payload.blogPost,
        user: userPayload.userId,
    });

    if (alreadyLiked) {
        await Like.deleteOne({
            blogPost: payload.blogPost,
            user: userPayload.userId,
        });
        return { liked: false, messaged: "Unliked successfully" }
    } else {
        const newLike = await Like.create({
            blogPost: payload.blogPost,
            user: userPayload.userId,
        });
        return { liked: true, message: "Liked successfully", like: newLike };
    };
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