/* eslint-disable @typescript-eslint/no-explicit-any */
import status from "http-status";
import AppError from "../error/appError";
import { TUserRole } from "../modules/user/user.interface";
import catchAsync from "../utils/async/catchAsync";
import {
    generateAccessToken,
    verifyAccessToken,
    verifyRefreshToken
} from "../modules/Auth/auth.utils";
import { User } from "../modules/user/user.model";
import { customJwtPayload } from "../interface";

const auth = (...requiredRoles: TUserRole[]) => {
    return catchAsync(async (req, res, next) => {
        const authHeader = req.headers.authorization || "";
        const token = authHeader.startsWith("Bearer ")
            ? authHeader.split(" ")[1]
            : authHeader;

        // ✅ 1. Token not found
        if (!token) {
            throw new AppError(status.UNAUTHORIZED, "You are not authorized!");
        }

        try {
            // ✅ 2. Verify Access Token
            const decoded = await verifyAccessToken(token);
            // console.log("[AUTH] Decoded Access Token:", decoded);

            const dbUser = await User.findById(decoded.userId).select(
                "userName role isDeleted tokenVersion passwordChangedAt"
            );
            // console.log("[AUTH] Found User in DB:", dbUser);

            // ✅ 3. User checks
            if (!dbUser) throw new AppError(status.NOT_FOUND, "User not found!");
            if (dbUser.isDeleted)
                throw new AppError(status.FORBIDDEN, "User account deleted!");
            if (
                typeof decoded.tokenVersion !== "undefined" &&
                decoded.tokenVersion !== dbUser.tokenVersion
            ) {
                throw new AppError(status.UNAUTHORIZED, "Token revoked. Please login again.");
            }
            if (
                dbUser.passwordChangedAt &&
                decoded.iat &&
                User.isJWTIssuedBeforePasswordChanged &&
                User.isJWTIssuedBeforePasswordChanged(dbUser.passwordChangedAt, decoded.iat)
            ) {
                throw new AppError(status.UNAUTHORIZED, "Password changed after token issued!");
            }

            // ✅ 4. Attach to req.user
            req.user = {
                userId: dbUser._id.toString(),
                userName: dbUser.userName,
                role: dbUser.role,
                tokenVersion: dbUser.tokenVersion,
            } as customJwtPayload;
            // console.log("[AUTH] Attached req.user:", req.user);

            // ✅ 5. Role-based restriction
            if (requiredRoles.length > 0 && !requiredRoles.includes(req.user.role)) {
                throw new AppError(status.FORBIDDEN, "Access denied!");
            }

            return next();
        } catch (err: any) {
            // ✅ Handle expired access token → try refresh token
            if (err.name === "TokenExpiredError") {
                const refreshToken = req.cookies?.refreshToken;
                if (!refreshToken) {
                    throw new AppError(status.UNAUTHORIZED, "No refresh token found!");
                }

                try {
                    const decodedRefresh = await verifyRefreshToken(refreshToken);
                    // console.log("[AUTH] Decoded Refresh Token:", decodedRefresh);

                    const user = await User.findById(decodedRefresh.userId).select(
                        "userName role isDeleted tokenVersion"
                    );
                    // console.log("[AUTH] User from refresh:", user);

                    if (!user) throw new AppError(status.NOT_FOUND, "User not found!");
                    if (user.isDeleted)
                        throw new AppError(status.FORBIDDEN, "User account deleted!");
                    if (
                        typeof decodedRefresh.tokenVersion !== "undefined" &&
                        decodedRefresh.tokenVersion !== user.tokenVersion
                    ) {
                        throw new AppError(status.UNAUTHORIZED, "Refresh token revoked!");
                    }

                    // ✅ Issue new access token
                    const newAccessToken = await generateAccessToken({
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
                    } as customJwtPayload;

                    if (requiredRoles.length > 0 && !requiredRoles.includes(req.user.role)) {
                        throw new AppError(status.FORBIDDEN, "Access denied!");
                    }

                    return next();
                } catch {
                    throw new AppError(status.UNAUTHORIZED, "Refresh token invalid or expired");
                }
            }

            // ✅ Generic error
            throw new AppError(status.UNAUTHORIZED, "Invalid authorization!");
        }
    });
};

export default auth;
