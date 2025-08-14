import { model, Schema, Types } from "mongoose";
import { TName, TUser, UserModel } from "./user.interface";
import bcrypt from "bcrypt";
import config from "../../config";

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
                values: ['superAdmin', 'admin', 'user', 'author'],
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
        isDeleted: {
            type: Boolean,
            default: false,
        },
        tokenVersion: {
            type: Number,
            default: 0,
        },
        needsPasswordChange: {
            type: Boolean,
            default: true,
        },
        passwordChangedAt: {
            type: Date
        },
    },
    {
        timestamps: true,
    }
);

userSchema.statics.isUserByCustomUserName = async function (userName: string) {
    return await User.findOne({ userName: userName }).select('+password');
};

userSchema.statics.isUserByCustomId = async function (id: string) {
    return await User.findOne({ id }).select('+password');
};

userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(
        this.password,
        Number(config.bcrypt_salt_rounds)
    );
    return next;
});

userSchema.post('save', async function (doc, next) {
    doc.password = '';
    next();
});

userSchema.statics.isPasswordMatch = async function (
    plainTextPassword: string,
    hashedPassword: string,
) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
) {
    const passwordChangedTime = Math.floor(
        new Date(passwordChangedTimestamp).getTime() / 1000
    );
    return passwordChangedTime > jwtIssuedTimestamp;
};


export const User = model<TUser, UserModel>("User", userSchema);