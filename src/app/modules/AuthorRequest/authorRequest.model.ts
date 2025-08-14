import mongoose, { model, Schema } from "mongoose";
import { TAuthorRequest } from "./authorRequest.interface";
import AppError from "../../error/appError";
import status from "http-status";

const authorRequestSchema = new Schema<TAuthorRequest>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User reference is required for the author request."],
    },
    message: {
        type: String,
        required: [true, "A detailed message is required for the author request."],
        maxlength: [200, "Message cannot exceed 200 characters."],
        minlength: [100, "Message must be at least 120 characters long to provide enough details."],
        trim: true,
    },
    status: {
        type: String,
        enum: {
            values: ["pending", "approved", "rejected"],
            message: "Status must be either 'pending', 'approved', or 'rejected'.",
        },
        default: "pending",
    },
}, {
    timestamps: true,
});

authorRequestSchema.pre('validate', async function (next) {
    const userId = this.user;
    const user = await mongoose.model("User").findById(userId);

    if (!user) {
        throw new AppError(
            status.NOT_FOUND,
            'This user not found!'
        );
    };

    if (user.role !== 'user') {
        return next(new Error('Only normal users can request author role.'));
    };
    next();

});

export const AuthorRequest = model<TAuthorRequest>(
    'AuthorRequest',
    authorRequestSchema,
);