import { Types } from "mongoose";

export type TComment = {
    blogPost: Types.ObjectId;
    author: Types.ObjectId;
    content: string;
    parent?: Types.ObjectId;
    isFlagged: boolean;
};