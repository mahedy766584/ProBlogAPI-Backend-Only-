import { Types } from "mongoose";

export type TAuthorRequest = {
    user?: Types.ObjectId;
    message: string;
    status: "pending" | "approved" | "rejected";
};