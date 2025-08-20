export const USER_ROLE = {
    superAdmin: 'superAdmin',
    admin: 'admin',
    user: 'user',
    author: 'author',
} as const;

export const userAllowedFields = ["name", "bio", "profileImage", "email"];
export const adminAllowedFields = [
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

export const isPrivilegedValue = ["admin", "superAdmin"];

export const userSearchableFields = ['name.firstName', 'userName', 'email'];