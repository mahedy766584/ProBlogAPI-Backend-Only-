"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSearchableFields = exports.isPrivilegedValue = exports.adminAllowedFields = exports.userAllowedFields = exports.USER_ROLE = void 0;
exports.USER_ROLE = {
    superAdmin: 'superAdmin',
    admin: 'admin',
    user: 'user',
    author: 'author',
};
exports.userAllowedFields = ["name", "bio", "profileImage", "email"];
exports.adminAllowedFields = [
    "name",
    "bio",
    "profileImage",
    "role",
    "email",
    "isBanned",
    "isDeleted",
    "isEmailVerified",
    "needsPasswordChange",
    "tokenVersion",
];
exports.isPrivilegedValue = ["admin", "superAdmin"];
exports.userSearchableFields = ['name.firstName', 'userName', 'email'];
