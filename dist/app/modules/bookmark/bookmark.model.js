"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookMark = void 0;
const mongoose_1 = require("mongoose");
const bookmarkSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    blogPost: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "BlogPost",
        required: true
    },
}, { timestamps: true });
exports.BookMark = (0, mongoose_1.model)('BookMark', bookmarkSchema);
