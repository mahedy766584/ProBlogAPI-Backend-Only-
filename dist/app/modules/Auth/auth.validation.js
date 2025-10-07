"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const v3_1 = __importDefault(require("zod/v3"));
const loginValidationSchema = v3_1.default.object({
    body: v3_1.default.object({
        userName: v3_1.default.string({ required_error: 'User name is required' }),
        password: v3_1.default.string({ required_error: 'Password is required' }),
    }),
});
const changePasswordValidationSchema = v3_1.default.object({
    body: v3_1.default.object({
        oldPassword: v3_1.default.string({ required_error: 'Old password is required' }),
        newPassword: v3_1.default.string({ required_error: 'Password is required' }),
    })
});
const refreshTokenValidationSchema = v3_1.default.object({
    cookies: v3_1.default.object({
        refreshToken: v3_1.default.string({
            required_error: 'Refresh token is required',
        })
    })
});
const forgetPasswordValidationSchema = v3_1.default.object({
    body: v3_1.default.object({
        userName: v3_1.default.string({
            required_error: 'User name is required!!'
        })
    })
});
const resetPasswordValidationSchema = v3_1.default.object({
    body: v3_1.default.object({
        userName: v3_1.default.string({
            required_error: "User name must be required",
        }),
        newPassword: v3_1.default.string({
            required_error: "New password is required",
        })
    })
});
exports.AuthValidation = {
    loginValidationSchema,
    changePasswordValidationSchema,
    refreshTokenValidationSchema,
    forgetPasswordValidationSchema,
    resetPasswordValidationSchema,
};
