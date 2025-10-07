"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const nameSchema = new mongoose_1.Schema({
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
}, {
    _id: false,
});
const userSchema = new mongoose_1.Schema({
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
        type: Number,
        default: 0,
    },
    following: {
        type: Number,
        default: 0,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
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
}, {
    timestamps: true,
});
userSchema.statics.isUserByCustomUserName = async function (userName) {
    return await exports.User.findOne({ userName: userName }).select('+password');
};
userSchema.statics.isUserByCustomId = async function (id) {
    return await exports.User.findOne({ id }).select('+password');
};
userSchema.pre('save', async function (next) {
    this.password = await bcrypt_1.default.hash(this.password, Number(config_1.default.bcrypt_salt_rounds));
    return next;
});
userSchema.post('save', async function (doc, next) {
    doc.password = '';
    next();
});
userSchema.statics.isPasswordMatch = async function (plainTextPassword, hashedPassword) {
    return await bcrypt_1.default.compare(plainTextPassword, hashedPassword);
};
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (passwordChangedTimestamp, jwtIssuedTimestamp) {
    const passwordChangedTime = Math.floor(new Date(passwordChangedTimestamp).getTime() / 1000);
    return passwordChangedTime > jwtIssuedTimestamp;
};
userSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
exports.User = (0, mongoose_1.model)("User", userSchema);
