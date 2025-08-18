import { Types } from "mongoose";

export type TView = {
    blogPost: Types.ObjectId;
    viewerIP: string;
    user?: Types.ObjectId;
};