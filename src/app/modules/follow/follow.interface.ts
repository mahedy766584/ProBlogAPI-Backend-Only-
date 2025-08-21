import { Types } from "mongoose";

export type TFollowBase = {
    follower?: Types.ObjectId;
    following: Types.ObjectId;
};