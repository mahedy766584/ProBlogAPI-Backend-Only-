import status from "http-status";
import AppError from "../../error/appError";
import { BlogPost } from "../blogPost/blogPost.model";
import { TComment } from "./comment.interface";
import { User } from "../user/user.model";
import { Comment } from "./comment.model";

const createCommentInPostIntoDB = async (payload: TComment) => {

    const isExistBlogPost = await BlogPost.findById(payload.blogPost);

    if (!isExistBlogPost) {
        throw new AppError(status.NOT_FOUND, 'Blog not found!');
    };

    const isUserExist = await User.findById(payload.author);

    if (!isUserExist) {
        throw new AppError(status.NOT_FOUND, 'User is not allowed to comment.!');
    };

    if (isUserExist.isDeleted || isUserExist.isBanned) {
        throw new AppError(status.NOT_FOUND, 'User is not allowed to comment. you was banned!');
    };

    const recentComments = await Comment.find({
        author: payload?.author,
        createdAt: { $gte: new Date(Date.now() - 30000) }
    });

    if (recentComments.length >= 5) {
        throw new AppError(429, "You are commenting too frequently.");
    };

    if (payload.parent) {
        const parentComment = await Comment.findById(payload.parent);
        if (!parentComment) {
            throw new AppError(400, "Parent comment not found.");
        }
    };

    const result = await Comment.create(payload);

    return result;

};

const getAllCommentsFromDB = async () => {
    const result = await Comment.find().populate('blogPost author parent');
    if (!result) {
        throw new AppError(status.NOT_FOUND, 'Any comment not found!')
    };
    return result;
};

const getSingleCommentFromDB = async (id: string) => {
    const result = await Comment.findById(id).populate('blogPost author parent');
    if (!result) {
        throw new AppError(status.NOT_FOUND, 'Any comment not found!')
    };
    return result;
};

export const CommentService = {
    createCommentInPostIntoDB,
    getAllCommentsFromDB,
    getSingleCommentFromDB,
};