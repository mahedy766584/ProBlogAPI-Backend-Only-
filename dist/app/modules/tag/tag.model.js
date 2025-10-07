"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tag = void 0;
const mongoose_1 = require("mongoose");
const globalPreHooks_1 = require("../../utils/globalPreHooks");
const tagSchema = new mongoose_1.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
    },
}, {
    timestamps: true,
});
tagSchema.pre('save', async function (next) {
    if (!this.isModified("name"))
        return next();
    this.slug = await (0, globalPreHooks_1.generateUniqSlug)((0, mongoose_1.model)('Tag'), this.name);
    next();
});
exports.Tag = (0, mongoose_1.model)('Tag', tagSchema);
