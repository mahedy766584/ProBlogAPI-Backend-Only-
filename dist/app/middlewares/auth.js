"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../error/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const auth_utils_1 = require("../modules/Auth/auth.utils");
const user_model_1 = require("../modules/user/user.model");
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)(async (req, res, next) => {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;
        // ✅ 1. Token not found
        if (!token) {
            throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
        }
        try {
            // ✅ 2. Verify Access Token
            const decoded = await (0, auth_utils_1.verifyAccessToken)(token);
            // console.log("[AUTH] Decoded Access Token:", decoded);
            const dbUser = await user_model_1.User.findById(decoded.userId).select("userName role isDeleted tokenVersion passwordChangedAt");
            // console.log("[AUTH] Found User in DB:", dbUser);
            // ✅ 3. User checks
            if (!dbUser)
                throw new appError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
            if (dbUser.isDeleted)
                throw new appError_1.default(http_status_1.default.FORBIDDEN, "User account deleted!");
            if (typeof decoded.tokenVersion !== "undefined" &&
                decoded.tokenVersion !== dbUser.tokenVersion) {
                throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "Token revoked. Please login again.");
            }
            if (dbUser.passwordChangedAt &&
                decoded.iat &&
                user_model_1.User.isJWTIssuedBeforePasswordChanged &&
                user_model_1.User.isJWTIssuedBeforePasswordChanged(dbUser.passwordChangedAt, decoded.iat)) {
                throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "Password changed after token issued!");
            }
            // ✅ 4. Attach to req.user
            req.user = {
                userId: dbUser._id.toString(),
                userName: dbUser.userName,
                role: dbUser.role,
                tokenVersion: dbUser.tokenVersion,
            };
            // console.log("[AUTH] Attached req.user:", req.user);
            // ✅ 5. Role-based restriction
            if (requiredRoles.length > 0 && !requiredRoles.includes(req.user.role)) {
                throw new appError_1.default(http_status_1.default.FORBIDDEN, "Access denied!");
            }
            return next();
        }
        catch (err) {
            // ✅ Handle expired access token → try refresh token
            if (err.name === "TokenExpiredError") {
                const refreshToken = req.cookies?.refreshToken;
                if (!refreshToken) {
                    throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "No refresh token found!");
                }
                try {
                    const decodedRefresh = await (0, auth_utils_1.verifyRefreshToken)(refreshToken);
                    // console.log("[AUTH] Decoded Refresh Token:", decodedRefresh);
                    const user = await user_model_1.User.findById(decodedRefresh.userId).select("userName role isDeleted tokenVersion");
                    // console.log("[AUTH] User from refresh:", user);
                    if (!user)
                        throw new appError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
                    if (user.isDeleted)
                        throw new appError_1.default(http_status_1.default.FORBIDDEN, "User account deleted!");
                    if (typeof decodedRefresh.tokenVersion !== "undefined" &&
                        decodedRefresh.tokenVersion !== user.tokenVersion) {
                        throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "Refresh token revoked!");
                    }
                    // ✅ Issue new access token
                    const newAccessToken = await (0, auth_utils_1.generateAccessToken)({
                        userId: user._id.toString(),
                        userName: user.userName,
                        role: user.role,
                        tokenVersion: user.tokenVersion,
                    });
                    res.setHeader("x-new-token", newAccessToken);
                    req.user = {
                        userId: user._id.toString(),
                        userName: user.userName,
                        role: user.role,
                        tokenVersion: user.tokenVersion,
                    };
                    if (requiredRoles.length > 0 && !requiredRoles.includes(req.user.role)) {
                        throw new appError_1.default(http_status_1.default.FORBIDDEN, "Access denied!");
                    }
                    return next();
                }
                catch {
                    throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "Refresh token invalid or expired");
                }
            }
            // ✅ Generic error
            throw new appError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid authorization!");
        }
    });
};
exports.default = auth;
