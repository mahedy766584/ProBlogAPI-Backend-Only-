import { Types } from "mongoose";

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
    followers: [Types.ObjectId];
    following: [Types.ObjectId];
    isEmailVerified: boolean;
    isBanned: boolean;
};