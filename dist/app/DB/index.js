"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config"));
const user_constant_1 = require("../modules/user/user.constant");
const user_model_1 = require("../modules/user/user.model");
const superUser = {
    userName: 'superadmin',
    name: { firstName: 'Super', lastName: 'Admin' },
    email: config_1.default.super_admin_email,
    password: config_1.default.super_admin_password,
    role: 'superAdmin',
    isEmailVerified: true,
    isBanned: false,
    isDeleted: false,
    needsPasswordChange: false
};
const seedSuperAdmin = async () => {
    const isSuperAdminExist = await user_model_1.User.findOne({ role: user_constant_1.USER_ROLE.superAdmin });
    if (!isSuperAdminExist) {
        await user_model_1.User.create(superUser);
    }
};
exports.default = seedSuperAdmin;
