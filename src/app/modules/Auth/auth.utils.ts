import jwt, { Secret, SignOptions, JwtPayload } from "jsonwebtoken";

export const createToke = (
    jwtPayload: { userName: string, role: string },
    secret: Secret,
    expiresIn: string,
): string => {
    const options: SignOptions = {
        expiresIn: expiresIn as SignOptions['expiresIn'],
    };
    return jwt.sign(jwtPayload, secret, options);
};

export const verifyToken = (token: string, secret: string) => {
    return jwt.verify(
        token,
        secret,
    ) as JwtPayload;
};