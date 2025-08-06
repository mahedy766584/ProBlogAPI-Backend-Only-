import Jwt, { Secret, SignOptions } from "jsonwebtoken";

export const createToke = (
    jwtPayload: { userName: string, role: string },
    secret: Secret,
    expiresIn: string,
): string => {
    const options: SignOptions = {
        expiresIn: expiresIn as SignOptions['expiresIn'],
    };
    return Jwt.sign(jwtPayload, secret, options);
};