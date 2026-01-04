import status from "http-status";
import AppError from "../../error/appError";
import { BlogPost } from "../blogPost/blogPost.model";
import { TComment } from "./comment.interface";
import { User } from "../user/user.model";
import { Comment } from "./comment.model";
import { markdownToSanitizedHtml, sanitizeUserHtml } from "../blogPost/blog.utils";

const createCommentInPostIntoDB = async (
    payload: Omit<TComment, "author">,
    userPayload: {
        userId: string,
        userRole: "user" | "admin" | "author" | "superAdmin"
    }
) => {

    //1. Check blog post exiting
    const isExistBlogPost = await BlogPost.findById(payload.blogPost);
    if (!isExistBlogPost) {
        throw new AppError(status.NOT_FOUND, 'Blog not found!');
    };

    //2. Check user validity from token
    const isUserExist = await User.findById(userPayload.userId);
    if (!isUserExist) {
        throw new AppError(status.NOT_FOUND, 'User is not allowed to comment.!');
    };
    if (isUserExist.isDeleted) {
        throw new AppError(status.NOT_FOUND, 'User is not allowed to comment. you was banned!');
    };

    //3. Check spam protection
    const recentComments = await Comment.find({
        author: userPayload.userId,
        createdAt: { $gte: new Date(Date.now() - 30000) }
    });

    if (recentComments.length >= 5) {
        throw new AppError(429, "You are commenting too frequently.");
    };

    // 4. Validate parent comment if reply
    if (payload.parent) {
        const parentComment = await Comment.findById(payload.parent);
        if (!parentComment) {
            throw new AppError(status.BAD_REQUEST, "Parent comment not found.");
        }
    }

    // 5. markdown or html
    if (payload.content && payload.contentType) {
        payload.renderedHtml = payload.contentType === 'markdown' ?
            await markdownToSanitizedHtml(payload.content)
            :
            await sanitizeUserHtml(payload.content);
    }

    // 6. Create comment (author always from token)

    const result = await Comment.create({
        ...payload,
        user: userPayload.userId
    });

    return result;

};

const getAllCommentsFromDB = async () => {
    const result = await Comment.find().populate('blogPost parent');
    if (!result) {
        throw new AppError(status.NOT_FOUND, 'Any comment not found!')
    };
    return result;
};

const getSingleCommentFromDB = async (id: string) => {
    const result = await Comment.findById(id).populate('blogPost  parent');
    if (!result) {
        throw new AppError(status.NOT_FOUND, 'Any comment not found!')
    };
    return result;
};

const getCommentForBlogPost = async (blogPostId: string) => {
    const result = await Comment.find({ blogPost: blogPostId }).populate('user parent blogPost');
    if (!result) {
        throw new AppError(status.NOT_FOUND, 'Any comment not found!')
    };
    return result;
};

const updateSingleCommentIntoDB = async (
    id: string,
    payload: Partial<TComment>,
    userPayload: { userId: string; role: "user" | "author" | "admin" | "superAdmin" }
) => {

    //1. Check if comment existing
    const existingComment = await Comment.findById(id);
    if (!existingComment) {
        throw new AppError(status.NOT_FOUND, 'Comment was not found!');
    };

    //2. Role and ownership check
    const isOwner = existingComment.user.toString() === userPayload.userId;
    const isPrivileged = ["admin", "superAdmin"].includes(userPayload.role);

    if (!isOwner && !isPrivileged) {
        throw new AppError(status.FORBIDDEN, "You are not allowed to update this comment.");
    };

    //3. Check user validity from token
    const isUserExist = await User.findById(userPayload.userId);
    if (!isUserExist) {
        throw new AppError(status.NOT_FOUND, 'User is not allowed to update this comment.!');
    };
    if (isUserExist.isDeleted) {
        throw new AppError(status.NOT_FOUND, 'User is not allowed to update this comment. you was banned!');
    };

    // 4. Restrict immutable fields
    const immutableFields: (keyof TComment)[] = ["user", "blogPost"];
    immutableFields.forEach((field) => {
        if (payload[field] !== undefined) {
            throw new AppError(status.BAD_REQUEST, `Field ${field} cannot be updated.`);
        }
    });

    //5. Content validation
    if (payload.content) {
        if (payload.content.trim().length < 5) {
            throw new AppError(status.BAD_REQUEST, "Comment must be at least 3 characters long.");
        };
    };

    //6. Final update comment
    const result = await Comment.findByIdAndUpdate(
        id,
        { $set: payload },
        {
            new: true,
            runValidators: true,
        }
    );

    return result;

};

const deleteSingleCommentFromDB = async (
    id: string,
    userPayload: { userId: string, role: "user" | "author" | "admin" | "superAdmin" }
) => {

    const commentExisting = await Comment.findById(id);
    if (!commentExisting) {
        throw new AppError(status.NOT_FOUND, 'Comment was not found!');
    };

    const isOwner = commentExisting.user.toString() === userPayload.userId;
    const isPrivileged = ["admin", "superAdmin"].includes(userPayload.role);

    if (!isOwner && !isPrivileged) {
        throw new AppError(status.FORBIDDEN, "You are not allowed to delete this comment.");
    };

    const result = await Comment.deleteOne({ _id: id });
    return result;

};

export const CommentService = {
    createCommentInPostIntoDB,
    getAllCommentsFromDB,
    getSingleCommentFromDB,
    getCommentForBlogPost,
    updateSingleCommentIntoDB,
    deleteSingleCommentFromDB,
};