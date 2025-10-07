"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.View = void 0;
const mongoose_1 = require("mongoose");
const viewSchema = new mongoose_1.Schema({
    blogPost: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "BlogPost",
        required: true
    },
    viewerIP: {
        type: String,
        required: true
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User"
    },
});
exports.View = (0, mongoose_1.model)('View', viewSchema);
