import status from "http-status";
import AppError from "../../error/appError";
import { AuthorRequest } from "../AuthorRequest/authorRequest.model";
import { TBlogPost } from "./blogPost.interface";
import { Category } from "../category/category.model";
import { Tag } from "../tag/tag.model";
import { BlogPost } from "./blogPost.model";
import { User } from "../user/user.model";
import { adminAllowedFiled, allowedRoles, blogPostSearchableFields, userAllowedFiled } from "./blogPost.constant";
import { customJwtPayload } from "../../interface";
import { checkEmptyOrThrow } from "../../helpers/dbCheck";
import { markdownToSanitizedHtml, sanitizeUserHtml } from "./blog.utils";
import { TAuthorRequest } from "../AuthorRequest/authorRequest.interface";
import QueryBuilder from "../../builder/QueryBuilder";

const createBlogPostIntoDB = async (payload: Omit<TBlogPost, "author">, tokenPayload: customJwtPayload) => {

    const userExisting = await User.findById(tokenPayload.userId);

    if (!userExisting) {
        throw new AppError(
            status.NOT_FOUND,
            'You are not a valid author!',
        );
    };

    const authorExisting = await AuthorRequest.findOne({ user: tokenPayload?.userId });
    const checkRole = allowedRoles.includes(tokenPayload.role?.toLowerCase());

    if (!checkRole && !authorExisting) {
        throw new AppError(status.FORBIDDEN, "This author not a valid!");
    };

    if (authorExisting && authorExisting.status === "pending") {
        throw new AppError(
            status.FORBIDDEN,
            'Your author request is pending!',
        );
    };
    if (authorExisting && authorExisting.status === "rejected") {
        throw new AppError(
            status.FORBIDDEN,
            'Your author request is rejected!',
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

    if (payload.content && payload.contentType) {
        payload.renderedHtml =
            payload.contentType === "markdown"
                ? await markdownToSanitizedHtml(payload.content)
                : await sanitizeUserHtml(payload.content);
    };

    const result = await BlogPost.create({
        author: tokenPayload.userId,
        ...payload
    });
    return result;
};

const getAllBlogPostFromDB = async (query: Record<string, unknown>) => {

    const blogPostSearchQuery = new QueryBuilder(BlogPost.find()
    .populate('author')
    .populate('tags category')
    , query)
    .search(blogPostSearchableFields)
    .filter()
    .sort()
    .fields();

    const result = await blogPostSearchQuery.modelQuery;
    const meta = await blogPostSearchQuery.countTotal();
    return checkEmptyOrThrow({
        meta,
        result,
    }, "Blog post not found!");
};

const getSingleBlogPostFromDB = async (id: string) => {
    const result = await BlogPost.findById(id);
    return checkEmptyOrThrow(result, "Blog post not found!");
};


const updateSingleBlogPostIntoDB = async (
    id: string,
    payload: Partial<TBlogPost>,
    tokenPayload: customJwtPayload
) => {
    // Step 1: BlogPost exist check
    const existingBlogPost = await BlogPost.findById(id);
    if (!existingBlogPost) {
        throw new AppError(status.NOT_FOUND, "Blog post not found!");
    }

    // Step 2: User exist check
    const user = await User.findById(tokenPayload.userId);
    if (!user) {
        throw new AppError(status.NOT_FOUND, "User not found!");
    }

    // Step 3: Role & Author verification
    const isAdmin = ["admin", "superAdmin"].includes(tokenPayload.role);
    let authorRequest: (TAuthorRequest & Document) | null = null;

    if (!isAdmin) {
        authorRequest = await AuthorRequest.findOne({ user: tokenPayload.userId });

        if (!authorRequest) {
            throw new AppError(status.NOT_FOUND, "You are not a valid author!");
        }

        if (authorRequest.status !== "approved") {
            throw new AppError(status.FORBIDDEN, `Your author request is ${authorRequest.status}!`);
        }

        // Author can only update own post
        if (existingBlogPost.author.toString() !== tokenPayload.userId.toString()) {
            throw new AppError(status.FORBIDDEN, "You are not the owner of this blog post!");
        }
    }

    // Step 4: Allowed fields check (Role-based)
    const allowedFields =
        isAdmin ? adminAllowedFiled : userAllowedFiled;

    Object.keys(payload).forEach((field) => {
        if (!allowedFields.includes(field as keyof TBlogPost)) {
            throw new AppError(status.BAD_REQUEST, `You cannot update field: ${field}`);
        }
    });

    // Step 5: Validate Category
    if (payload.category) {
        const categoryExists = await Category.findById(payload.category);
        if (!categoryExists) {
            throw new AppError(status.BAD_REQUEST, "Invalid category ID!");
        }
    }

    // Step 6: Validate Tags
    if (payload.tags && payload.tags.length > 0) {
        if (payload.tags.length > 5) {
            throw new AppError(status.BAD_REQUEST, "You cannot add more than 5 tags!");
        }

        const existingTags = await Tag.find({ _id: { $in: payload.tags } });
        if (existingTags.length !== payload.tags.length) {
            throw new AppError(status.BAD_REQUEST, "One or more tags are invalid!");
        }
    }

    // Step 7: Content to HTML
    if (payload.content && payload.contentType) {
        payload.renderedHtml =
            payload.contentType === "markdown"
                ? await markdownToSanitizedHtml(payload.content)
                : await sanitizeUserHtml(payload.content);
    }

    // Step 8: Final Update
    const updatedBlog = await BlogPost.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });

    return updatedBlog;
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