import { model, Schema } from "mongoose";
import { TFollowBase } from "./follow.interface";

const followSchema = new Schema<TFollowBase>({
    follower: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    following: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
},
    {
        timestamps: true
    }
);

// followSchema.index({ follower: 1, following: 1 }, { unique: true });

export const Follow = model<TFollowBase>('Follow', followSchema);