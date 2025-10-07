"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUniqSlug = void 0;
const slugify_1 = __importDefault(require("slugify"));
const generateUniqSlug = async (model, value, key = 'slug') => {
    const baseSlag = (0, slugify_1.default)(value, {
        lower: true,
        replacement: '_',
        remove: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/g,
        strict: true,
        trim: true,
    });
    let slug = baseSlag;
    let count = 1;
    while (await model.exists({ [key]: slug })) {
        slug = `${baseSlag}_${count}`;
        count++;
    }
    ;
    return slug;
};
exports.generateUniqSlug = generateUniqSlug;
