"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../error/appError"));
const blogPost_model_1 = require("../blogPost/blogPost.model");
const user_model_1 = require("../user/user.model");
const comment_model_1 = require("./comment.model");
const createCommentInPostIntoDB = async (payload, userPayload) => {
    //1. Check blog post exiting
    const isExistBlogPost = await blogPost_model_1.BlogPost.findById(payload.blogPost);
    if (!isExistBlogPost) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Blog not found!');
    }
    ;
    //2. Check user validity from token
    const isUserExist = await user_model_1.User.findById(userPayload.userId);
    if (!isUserExist) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'User is not allowed to comment.!');
    }
    ;
    if (isUserExist.isDeleted) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'User is not allowed to comment. you was banned!');
    }
    ;
    //3. Check spam protection
    const recentComments = await comment_model_1.Comment.find({
        author: userPayload.userId,
        createdAt: { $gte: new Date(Date.now() - 30000) }
    });
    if (recentComments.length >= 5) {
        throw new appError_1.default(429, "You are commenting too frequently.");
    }
    ;
    // 4. Validate parent comment if reply
    if (payload.parent) {
        const parentComment = await comment_model_1.Comment.findById(payload.parent);
        if (!parentComment) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Parent comment not found.");
        }
    }
    // 5. Create comment (author always from token)
    const result = await comment_model_1.Comment.create({
        ...payload,
        author: userPayload.userId
    });
    return result;
};
const getAllCommentsFromDB = async () => {
    const result = await comment_model_1.Comment.find().populate('blogPost author parent');
    if (!result) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Any comment not found!');
    }
    ;
    return result;
};
const getSingleCommentFromDB = async (id) => {
    const result = await comment_model_1.Comment.findById(id).populate('blogPost author parent');
    if (!result) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Any comment not found!');
    }
    ;
    return result;
};
const updateSingleCommentIntoDB = async (id, payload, userPayload) => {
    //1. Check if comment existing
    const existingComment = await comment_model_1.Comment.findById(id);
    if (!existingComment) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Comment was not found!');
    }
    ;
    //2. Role and ownership check
    const isOwner = existingComment.author.toString() === userPayload.userId;
    const isPrivileged = ["admin", "superAdmin"].includes(userPayload.role);
    if (!isOwner && !isPrivileged) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "You are not allowed to update this comment.");
    }
    ;
    //3. Check user validity from token
    const isUserExist = await user_model_1.User.findById(userPayload.userId);
    if (!isUserExist) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'User is not allowed to update this comment.!');
    }
    ;
    if (isUserExist.isDeleted) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'User is not allowed to update this comment. you was banned!');
    }
    ;
    // 4. Restrict immutable fields
    const immutableFields = ["author", "blogPost"];
    immutableFields.forEach((field) => {
        if (payload[field] !== undefined) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, `Field ${field} cannot be updated.`);
        }
    });
    //5. Content validation
    if (payload.content) {
        if (payload.content.trim().length < 5) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Comment must be at least 3 characters long.");
        }
        ;
    }
    ;
    //6. Final update comment
    const result = await comment_model_1.Comment.findByIdAndUpdate(id, { $set: payload }, {
        new: true,
        runValidators: true,
    });
    return result;
};
const deleteSingleCommentFromDB = async (id, userPayload) => {
    const commentExisting = await comment_model_1.Comment.findById(id);
    if (!commentExisting) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Comment was not found!');
    }
    ;
    const isOwner = commentExisting.author.toString() === userPayload.userId;
    const isPrivileged = ["admin", "superAdmin"].includes(userPayload.role);
    if (!isOwner && !isPrivileged) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "You are not allowed to delete this comment.");
    }
    ;
    const result = await comment_model_1.Comment.deleteOne({ _id: id });
    return result;
};
exports.CommentService = {
    createCommentInPostIntoDB,
    getAllCommentsFromDB,
    getSingleCommentFromDB,
    updateSingleCommentIntoDB,
    deleteSingleCommentFromDB,
};
