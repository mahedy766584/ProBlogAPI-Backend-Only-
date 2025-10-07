"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookMarkService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../error/appError"));
const blogPost_model_1 = require("../blogPost/blogPost.model");
const user_model_1 = require("../user/user.model");
const bookmark_model_1 = require("./bookmark.model");
const createBookMarkIntoDB = async (payload, userId) => {
    const existingBookmark = await bookmark_model_1.BookMark.findOne({
        blogPost: payload.blogPost,
        user: userId,
    });
    if (existingBookmark) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Already bookmarked this post!");
    }
    ;
    const blogPostExisting = await blogPost_model_1.BlogPost.findById(payload.blogPost);
    if (!blogPostExisting) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This blog post not found!');
    }
    ;
    const userExisting = await user_model_1.User.findById(userId);
    if (!userExisting) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'You are not a valid user!');
    }
    ;
    if (userExisting.isDeleted) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user was banned!');
    }
    ;
    const result = await bookmark_model_1.BookMark.create({
        ...payload,
        user: userId
    });
    return result;
};
const getAllBookmarkFromDB = async () => {
    const result = await bookmark_model_1.BookMark.find().populate("user");
    return result;
};
const getForUserBookmark = async (id, userPayload) => {
    const existingUser = await user_model_1.User.findById(id);
    if (!existingUser) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user not a valid!');
    }
    ;
    const isOwner = existingUser._id.toString() === userPayload.userId;
    const isPrivileged = ["admin", "superAdmin"].includes(userPayload.role);
    if (!isOwner && !isPrivileged) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "You are not allowed to get this blog.");
    }
    ;
    if (existingUser.isDeleted) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'This user was banned!');
    }
    ;
    const bookmarkCount = await bookmark_model_1.BookMark.countDocuments({ user: id });
    const bookmarks = await bookmark_model_1.BookMark.find({ user: id }).populate("blogPost");
    const result = {
        totalBookmarks: bookmarkCount,
        bookmarks,
    };
    return result;
};
const deleteBookmarkFromDB = async (id, userPayload) => {
    const bookmarkExisting = await bookmark_model_1.BookMark.findById(id);
    if (!bookmarkExisting) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Bookmark was not found!');
    }
    ;
    const isOwner = bookmarkExisting.user.toString() === userPayload.userId;
    const isPrivileged = ["admin", "superAdmin"].includes(userPayload.role);
    if (!isOwner && !isPrivileged) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "You are not allowed to delete this Bookmark.");
    }
    ;
    const result = await bookmark_model_1.BookMark.deleteOne({ _id: id });
    return result;
};
exports.BookMarkService = {
    createBookMarkIntoDB,
    getAllBookmarkFromDB,
    getForUserBookmark,
    deleteBookmarkFromDB,
};
