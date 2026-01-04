import { model, Schema } from "mongoose";
import { TComment } from "./comment.interface";

const commentSchema = new Schema<TComment>({
    blogPost: {
        type: Schema.Types.ObjectId,
        ref: "BlogPost",
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    contentType: {
        type: String,
        enum: {
            values: ["markdown", "html"],
            message: "Content type must be either 'markdown' or 'html'.",
        },
        required: [true, "Content type is required."],
    },
    renderedHtml: {
        type: String,
        required: [true, "Rendered HTML content is required."]
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