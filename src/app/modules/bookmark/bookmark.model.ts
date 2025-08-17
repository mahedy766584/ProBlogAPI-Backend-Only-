import { model, Schema } from "mongoose";
import { TBookMark } from "./bookmark.interface";

const bookmarkSchema = new Schema<TBookMark>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    blogPost: {
        type: Schema.Types.ObjectId,
        ref: "BlogPost",
        required: true
    },
},
    { timestamps: true }
);

export const BookMark = model<TBookMark>('BookMark', bookmarkSchema);