import status from "http-status";
import AppError from "../../error/appError";
import { AuthorRequest } from "../AuthorRequest/authorRequest.model";
import { TBlogPost } from "./blogPost.interface";
import { Category } from "../category/category.model";
import { Tag } from "../tag/tag.model";
import { BlogPost } from "./blogPost.model";
import { User } from "../user/user.model";
import { adminAllowedFiled, userAllowedFiled } from "./blogPost.constant";

const createBlogPostIntoDB = async (payload: TBlogPost) => {

    const isAuthor = await AuthorRequest.findById(payload?.author);

    if (!isAuthor) {
        throw new AppError(
            status.NOT_FOUND,
            'You are not a valid author!',
        );
    };

    if (isAuthor.status !== "approved") {
        throw new AppError(
            status.FORBIDDEN,
            'This author not a valid!',
        );
    };

    const isCategory = await Category.findById(payload.category);

    if (!isCategory) {
        throw new AppError(
            status.NOT_FOUND,
            'Blog pos category not a valid!',
        );
    };

    const isTags = await Tag.find({ _id: { $in: payload.tags } });

    if (isTags.length !== payload.tags.length) {
        throw new AppError(
            status.NOT_FOUND,
            'One or more blog post tags are invalid!',
        );
    };

    const result = await BlogPost.create(payload);
    return result;
};

const getAllBlogPostFromDB = async () => {
    const result = await BlogPost.find().populate({
        path: 'author',
        select: '-message',
        populate: {
            path: 'user',
            model: 'User'
        },
    })
        .populate('tags category');
    return result;
};

const getSingleBlogPostFromDB = async (id: string) => {
    const result = await BlogPost.findById(id);
    return result;
};

const updateSingleBlogPostIntoDB = async (
    id: string,
    payload: Partial<TBlogPost>,
    userPayload: { userId: string; userName: string; role: "user" | "admin" | "author" | "superAdmin" }
) => {

    const isExistBlogPost = await BlogPost.findById(id);
    if (!isExistBlogPost) {
        throw new AppError(status.NOT_FOUND, 'Blog post not found!');
    };

    const isAuthor = await AuthorRequest.findById(payload?.author);

    if (!isAuthor) {
        throw new AppError(
            status.NOT_FOUND,
            'You are not a valid author!',
        );
    };

    if (isAuthor.status !== "approved") {
        throw new AppError(
            status.FORBIDDEN,
            'This author not a valid!',
        );
    };

    const isUser = await User.findById(isAuthor.user);

    if (!isUser) {
        throw new AppError(status.NOT_FOUND, 'Author not found!',);
    };

    if (userPayload.role !== "admin" && userPayload.role !== "superAdmin" && isAuthor.user._id.toString() !== userPayload.userId.toString()) {
        throw new AppError(status.FORBIDDEN, "You are not the owner of this blog post!");
    };

    let allowedFields: (keyof TBlogPost)[];
    if (userPayload.role === 'admin' || userPayload.role === 'superAdmin') {
        allowedFields = adminAllowedFiled;
    } else if (userPayload.role === 'author') {
        allowedFields = userAllowedFiled;
    };

    Object.keys(payload).forEach((field) => {
        if (!allowedFields.includes(field as keyof TBlogPost)) {
            throw new AppError(status.BAD_REQUEST, `You cannot update field:${field}`);
        };
    });

    if (payload.category) {
        const categoryExists = await Category.findById(payload.category);
        if (!categoryExists) {
            throw new AppError(status.BAD_REQUEST, "Invalid category ID");
        };
    };

    if (payload.tags && payload.tags.length > 0) {
        const existsTags = await Tag.find({ _id: { $in: payload.tags } });
        if (existsTags.length !== payload.tags.length) {
            throw new AppError(status.BAD_REQUEST, "One or more tags are invalid!");
        };
        if (payload.tags.length > 5) {
            throw new AppError(status.BAD_REQUEST, "You cannot add more than 5 tags!");
        };
    };

    const result = await BlogPost.findByIdAndUpdate(
        id,
        payload,
        {
            new: true,
            runValidators: true
        }
    );

    return result;

};

const deleteSingleBlogPostFromDB = async (
    id: string,
    userPayload: { userId: string, role: "superAdmin" | "admin" | "author" | "user" }
) => {
    const isExistBlogPost = await BlogPost.findById(id);
    if (!isExistBlogPost) {
        throw new AppError(status.NOT_FOUND, 'Blog post not found!');
    };

    const isOwner = isExistBlogPost.author.toString() === userPayload.userId;
    const isPrivileged = ["admin", "superAdmin"].includes(userPayload.role);

    if (!isOwner && !isPrivileged) {
        throw new AppError(status.FORBIDDEN, "You are not allowed to delete this blog post");
    };

    const result = await BlogPost.deleteOne({ _id: id });
    return result;
};

export const BlogPostService = {
    createBlogPostIntoDB,
    getAllBlogPostFromDB,
    getSingleBlogPostFromDB,
    updateSingleBlogPostIntoDB,
    deleteSingleBlogPostFromDB
};