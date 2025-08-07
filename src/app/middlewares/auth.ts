import status from "http-status";
import AppError from "../error/appError";
import { TUserRole } from "../modules/user/user.interface";
import catchAsync from "../utils/catchAsync";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";
import { User } from "../modules/user/user.model";

const auth = (...requiredRole: TUserRole[]) => {
    return catchAsync(async (req, res, next) => {

        const token = req.headers.authorization;
        if (!token) {
            throw new AppError(
                status.UNAUTHORIZED,
                'You are not authorized!!'
            );
        };

        const decoded = jwt.verify(
            token,
            config.jwt_access_secret as string
        ) as JwtPayload;
        const { userName, role, iat } = decoded;

        const user = await User.isUserByCustomUserName(userName);

        if (!user) {
            throw new AppError(status.NOT_FOUND, 'This user is not found !');
        }

        const isDeleted = user?.isDeleted;

        if (isDeleted) {
            throw new AppError(status.FORBIDDEN, 'This user is deleted !');
        }

        if (user.passwordChangedAt && User.isJWTIssuedBeforePasswordChanged(
            user.passwordChangedAt, 
            iat as number
        )
        ) {
            throw new AppError(status.UNAUTHORIZED, 'Your not authorize!!');
        };

        if (requiredRole && !requiredRole.includes(role)) {
            throw new AppError(status.UNAUTHORIZED, 'Your not authorize!!');
        };

        req.user = decoded as JwtPayload;
        next();

    });
};

export default auth;