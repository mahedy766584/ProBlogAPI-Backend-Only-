"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogPostService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../error/appError"));
const authorRequest_model_1 = require("../AuthorRequest/authorRequest.model");
const category_model_1 = require("../category/category.model");
const tag_model_1 = require("../tag/tag.model");
const blogPost_model_1 = require("./blogPost.model");
const user_model_1 = require("../user/user.model");
const blogPost_constant_1 = require("./blogPost.constant");
const dbCheck_1 = require("../../helpers/dbCheck");
const blog_utils_1 = require("./blog.utils");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const mongoose_1 = __importDefault(require("mongoose"));
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const createBlogPostIntoDB = async (file, payload, tokenPayload) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const userExisting = await user_model_1.User.findById(tokenPayload.userId);
        if (!userExisting) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, 'You are not a valid author!');
        }
        ;
        const authorExisting = await authorRequest_model_1.AuthorRequest.findOne({ user: tokenPayload?.userId });
        const checkRole = blogPost_constant_1.allowedRoles.includes(tokenPayload.role?.toLowerCase());
        if (!checkRole && !authorExisting) {
            throw new appError_1.default(http_status_1.default.FORBIDDEN, "This author not a valid!");
        }
        ;
        if (authorExisting && authorExisting.status === "pending") {
            throw new appError_1.default(http_status_1.default.FORBIDDEN, 'Your author request is pending!');
        }
        ;
        if (authorExisting && authorExisting.status === "rejected") {
            throw new appError_1.default(http_status_1.default.FORBIDDEN, 'Your author request is rejected!');
        }
        ;
        const isCategory = await category_model_1.Category.findById(payload.category);
        if (!isCategory) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Blog pos category not a valid!');
        }
        ;
        const isTags = await tag_model_1.Tag.find({ _id: { $in: payload.tags } });
        if (isTags.length !== payload.tags.length) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, 'One or more blog post tags are invalid!');
        }
        ;
        if (payload.content && payload.contentType) {
            payload.renderedHtml =
                payload.contentType === "markdown"
                    ? await (0, blog_utils_1.markdownToSanitizedHtml)(payload.content)
                    : await (0, blog_utils_1.sanitizeUserHtml)(payload.content);
        }
        ;
        const result = await blogPost_model_1.BlogPost.create([{
                author: tokenPayload.userId,
                ...payload
            }], { session });
        let secure_url;
        if (file) {
            const imageName = `${tokenPayload.userName}${payload.title}`;
            const path = file?.path;
            secure_url = (await (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path)).secure_url;
            payload.coverImage = secure_url;
        }
        await session.commitTransaction();
        session.endSession();
        return result[0];
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
    ;
};
const getAllBlogPostFromDB = async (query) => {
    const blogPostSearchQuery = new QueryBuilder_1.default(blogPost_model_1.BlogPost.find()
        .populate('author')
        .populate('tags category'), query)
        .search(blogPost_constant_1.blogPostSearchableFields)
        .filter()
        .sort()
        .fields();
    const result = await blogPostSearchQuery.modelQuery;
    const meta = await blogPostSearchQuery.countTotal();
    return (0, dbCheck_1.checkEmptyOrThrow)({
        meta,
        result,
    }, "Blog post not found!");
};
const getSingleBlogPostFromDB = async (id) => {
    const result = await blogPost_model_1.BlogPost.findById(id);
    return (0, dbCheck_1.checkEmptyOrThrow)(result, "Blog post not found!");
};
const updateSingleBlogPostIntoDB = async (id, payload, tokenPayload) => {
    // Step 1: BlogPost exist check
    const existingBlogPost = await blogPost_model_1.BlogPost.findById(id);
    if (!existingBlogPost) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "Blog post not found!");
    }
    // Step 2: User exist check
    const user = await user_model_1.User.findById(tokenPayload.userId);
    if (!user) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    // Step 3: Role & Author verification
    const isAdmin = ["admin", "superAdmin"].includes(tokenPayload.role);
    let authorRequest = null;
    if (!isAdmin) {
        authorRequest = await authorRequest_model_1.AuthorRequest.findOne({ user: tokenPayload.userId });
        if (!authorRequest) {
            throw new appError_1.default(http_status_1.default.NOT_FOUND, "You are not a valid author!");
        }
        if (authorRequest.status !== "approved") {
            throw new appError_1.default(http_status_1.default.FORBIDDEN, `Your author request is ${authorRequest.status}!`);
        }
        // Author can only update own post
        if (existingBlogPost.author.toString() !== tokenPayload.userId.toString()) {
            throw new appError_1.default(http_status_1.default.FORBIDDEN, "You are not the owner of this blog post!");
        }
    }
    // Step 4: Allowed fields check (Role-based)
    const allowedFields = isAdmin ? blogPost_constant_1.adminAllowedFiled : blogPost_constant_1.userAllowedFiled;
    Object.keys(payload).forEach((field) => {
        if (!allowedFields.includes(field)) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, `You cannot update field: ${field}`);
        }
    });
    // Step 5: Validate Category
    if (payload.category) {
        const categoryExists = await category_model_1.Category.findById(payload.category);
        if (!categoryExists) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "Invalid category ID!");
        }
    }
    // Step 6: Validate Tags
    if (payload.tags && payload.tags.length > 0) {
        if (payload.tags.length > 5) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "You cannot add more than 5 tags!");
        }
        const existingTags = await tag_model_1.Tag.find({ _id: { $in: payload.tags } });
        if (existingTags.length !== payload.tags.length) {
            throw new appError_1.default(http_status_1.default.BAD_REQUEST, "One or more tags are invalid!");
        }
    }
    // Step 7: Content to HTML
    if (payload.content && payload.contentType) {
        payload.renderedHtml =
            payload.contentType === "markdown"
                ? await (0, blog_utils_1.markdownToSanitizedHtml)(payload.content)
                : await (0, blog_utils_1.sanitizeUserHtml)(payload.content);
    }
    // Step 8: Final Update
    const updatedBlog = await blogPost_model_1.BlogPost.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return updatedBlog;
};
const deleteSingleBlogPostFromDB = async (id, userPayload) => {
    const isExistBlogPost = await blogPost_model_1.BlogPost.findById(id);
    if (!isExistBlogPost) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Blog post not found!');
    }
    ;
    const isOwner = isExistBlogPost.author.toString() === userPayload.userId;
    const isPrivileged = ["admin", "superAdmin"].includes(userPayload.role);
    if (!isOwner && !isPrivileged) {
        throw new appError_1.default(http_status_1.default.FORBIDDEN, "You are not allowed to delete this blog post");
    }
    ;
    const result = await blogPost_model_1.BlogPost.deleteOne({ _id: id });
    return result;
};
exports.BlogPostService = {
    createBlogPostIntoDB,
    getAllBlogPostFromDB,
    getSingleBlogPostFromDB,
    updateSingleBlogPostIntoDB,
    deleteSingleBlogPostFromDB
};
