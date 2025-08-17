import { model, Schema } from "mongoose";
import { TLike } from "./like.interface";

const likeSchema = new Schema<TLike>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        blogPost: {
            type: Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },
    },
    { timestamps: true }
);

export const Like = model<TLike>("Like", likeSchema);