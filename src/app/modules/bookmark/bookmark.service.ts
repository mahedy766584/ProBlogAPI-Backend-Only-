import status from "http-status";
import AppError from "../../error/appError";
import { BlogPost } from "../blogPost/blogPost.model";
import { TBookMark } from "./bookmark.interface";
import { User } from "../user/user.model";
import { BookMark } from "./bookmark.model";

const createBookMarkIntoDB = async (payload: Omit<TBookMark, "user">, userId: string) => {

    const existingBookmark = await BookMark.findOne({
        blogPost: payload.blogPost,
        user: userId,
    });

    if (existingBookmark) {
        throw new AppError(status.BAD_REQUEST, "Already bookmarked this post!");
    };

    const blogPostExisting = await BlogPost.findById(payload.blogPost);

    if (!blogPostExisting) {
        throw new AppError(status.NOT_FOUND, 'This blog post not found!');
    };

    const userExisting = await User.findById(userId);

    if (!userExisting) {
        throw new AppError(status.NOT_FOUND, 'You are not a valid user!');
    };

    if (userExisting.isBanned || userExisting.isDeleted) {
        throw new AppError(status.NOT_FOUND, 'This user was banned!');
    };

    const result = await BookMark.create({
        ...payload,
        user: userId
    });

    return result;

};

const getAllBookmarkFromDB = async () => {
    const result = await BookMark.find().populate("user");
    return result;
};

const getForUserBookmark = async (
    id: string,
    userPayload: { userId: string, role: "admin" | "superAdmin" | "author" | "user" }
) => {

    const existingUser = await User.findById(id);
    if (!existingUser) {
        throw new AppError(status.NOT_FOUND, 'This user not a valid!');
    };

    const isOwner = existingUser._id.toString() === userPayload.userId;
    const isPrivileged = ["admin", "superAdmin"].includes(userPayload.role);
    if (!isOwner && !isPrivileged) {
        throw new AppError(status.FORBIDDEN, "You are not allowed to get this blog.");
    };

    if (existingUser.isBanned || existingUser.isDeleted) {
        throw new AppError(status.NOT_FOUND, 'This user was banned!');
    };

    const bookmarkCount = await BookMark.countDocuments({ user: id });

    const bookmarks = await BookMark.find({ user: id }).populate("blogPost");

    const result = {
        totalBookmarks: bookmarkCount,
        bookmarks,
    };

    return result;

};

const deleteBookmarkFromDB = async (
    id: string,
    userPayload: { userId: string, role: "user" | "author" | "admin" | "superAdmin" }
) => {

    const bookmarkExisting = await BookMark.findById(id);
    if (!bookmarkExisting) {
        throw new AppError(status.NOT_FOUND, 'Bookmark was not found!');
    };

    const isOwner = bookmarkExisting.user.toString() === userPayload.userId;
    const isPrivileged = ["admin", "superAdmin"].includes(userPayload.role);

    if (!isOwner && !isPrivileged) {
        throw new AppError(status.FORBIDDEN, "You are not allowed to delete this Bookmark.");
    };

    const result = await BookMark.deleteOne({ _id: id });
    return result;

};

export const BookMarkService = {
    createBookMarkIntoDB,
    getAllBookmarkFromDB,
    getForUserBookmark,
    deleteBookmarkFromDB,
};