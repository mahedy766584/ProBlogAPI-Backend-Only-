import { model, Schema } from "mongoose";
import { TComment } from "./comment.interface";

const commentSchema = new Schema<TComment>({
    blogPost: {
        type: Schema.Types.ObjectId,
        ref: "BlogPost",
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    parent: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    isFlagged: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true,
    }
);

export const Comment = model<TComment>(
    'Comment',
    commentSchema
);