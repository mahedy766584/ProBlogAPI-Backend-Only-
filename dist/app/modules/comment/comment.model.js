"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    blogPost: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "BlogPost",
        required: true
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    parent: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Comment"
    },
    isFlagged: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
});
exports.Comment = (0, mongoose_1.model)('Comment', commentSchema);
