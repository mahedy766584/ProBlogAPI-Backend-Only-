import { model, Schema, Types } from "mongoose";
import { TName, TUser } from "./user.interface";
import { UserRole } from "./user.constant";

const nameSchema = new Schema<TName>({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        maxlength: [10, "First name can't be more than 10 characters"],
        minlength: [4, "First name must be at least 4 characters"],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        maxlength: [10, "Last name can't be more than 10 characters"],
        minlength: [4, "Last name must be at least 4 characters"],
        trim: true,
    },
},
    {
        _id: false,
    }
);

const userSchema = new Schema<TUser>(
    {
        userName: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            maxlength: [10, "Username can't be more than 10 characters"],
            minlength: [4, "Username must be at least 4 characters"],
            trim: true,
            index: true,
        },
        name: {
            type: nameSchema,
            required: [true, "Name is required"],
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            match: [/.+@.+\..+/, "Please provide a valid email address"],
            index: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            select: false,
            maxlength: [10, "Password must be at least 10 characters long"],
            minlength: [6, "Password must be at least 6 characters short"],
        },
        role: {
            type: String,
            enum: {
                values: UserRole,
                message: "Role must be one of: superAdmin, admin, user, author",
            },
            default: "user",
        },
        bio: {
            type: String,
            maxlength: [160, "Bio can't be longer than 160 characters"],
        },
        profileImage: {
            type: String,
            required: [true, "Profile image is required"],
            default: "https://ibb.co/jkx7zn2",
        },
        followers: {
            type: [Types.ObjectId],
            ref: "User",
            default: [],
        },
        following: {
            type: [Types.ObjectId],
            ref: "User",
            default: [],
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        isBanned: {
            type: Boolean,
            default: false,
        },
        bookmarks: {
            type: [Types.ObjectId],
            ref: 'BlogPost',
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export const User = model<TUser>("User", userSchema);