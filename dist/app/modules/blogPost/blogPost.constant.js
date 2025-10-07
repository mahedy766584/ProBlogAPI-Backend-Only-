"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogPostSearchableFields = exports.allowedRoles = exports.userAllowedFiled = exports.adminAllowedFiled = exports.PostStatus = void 0;
exports.PostStatus = ['draft', 'published', 'rejected'];
exports.adminAllowedFiled = [
    "title", "content", "contentType", "coverImage", "tags", "category",
    "status", "isApproved", "coverImage", "author", "excerpt", "renderedHtml"
];
exports.userAllowedFiled = ["title", "content", "contentType", "coverImage", "tags", "category", "coverImage"];
exports.allowedRoles = ["author", "admin", "superadmin"];
exports.blogPostSearchableFields = ['title', 'content'];
