import { Types } from "mongoose";

export type TBookMark = {
    user: Types.ObjectId;
    blogPost: Types.ObjectId;
};