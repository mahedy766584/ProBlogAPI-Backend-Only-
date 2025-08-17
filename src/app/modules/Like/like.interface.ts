import { Types } from "mongoose";

export interface TLike {
    user: Types.ObjectId;
    blogPost: Types.ObjectId;
}