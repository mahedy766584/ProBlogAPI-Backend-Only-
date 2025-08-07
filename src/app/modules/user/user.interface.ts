/* eslint-disable no-unused-vars */
import { Model, Types } from "mongoose";
import { USER_ROLE } from "./user.constant";

export type TName = {
    firstName: string;
    lastName: string;
};

export type TUser = {
    userName: string;
    name: TName;
    email: string;
    password: string;
    role: 'superAdmin' | 'admin' | 'user' | 'author';
    bio?: string;
    profileImage: string;
    followers: Types.ObjectId[];
    following: Types.ObjectId[];
    isEmailVerified: boolean;
    isBanned: boolean;
    bookmarks: Types.ObjectId[];
    isDeleted: boolean;
    needsPasswordChange: boolean;
    passwordChangedAt?: Date;
};

export interface UserModel extends Model<TUser> {
    isUserByCustomUserName(userName: string): Promise<TUser>;
    isPasswordMatch(
        plainTextPassword: string,
        hashedPassword: string,
    ): Promise<boolean>;

    isJWTIssuedBeforePasswordChanged(
        passwordChangedTimestamp: Date,
        jwtIssuedTimestamp: number,
    ): boolean;
};


export type TUserRole = keyof typeof USER_ROLE;