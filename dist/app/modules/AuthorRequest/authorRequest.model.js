"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorRequest = void 0;
const mongoose_1 = require("mongoose");
const authorRequestSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.AuthorRequest = (0, mongoose_1.model)('AuthorRequest', authorRequestSchema);
