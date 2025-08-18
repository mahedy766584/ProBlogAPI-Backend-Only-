import { model, Schema } from "mongoose";
import { TView } from "./view.interface";

const viewSchema = new Schema<TView>({
    blogPost: {
        type: Schema.Types.ObjectId,
        ref: "BlogPost",
        required: true
    },
    viewerIP: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
});

export const View = model<TView>('View', viewSchema);