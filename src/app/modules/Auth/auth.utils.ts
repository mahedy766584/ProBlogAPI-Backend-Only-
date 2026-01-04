import jwt, { SignOptions, JwtPayload } from "jsonwebtoken";
import config from "../../config";

export type AccessPayload = {
    userId: string;
    userName?: string;
    role?: string;
    tokenVersion?: number;
};

export const generateAccessToken = async (jwtPayload: AccessPayload): Promise<string> => {
    const secret = config.jwt_access_secret as string;
    const expiresIn = config.jwt_access_expires_in;
    const options: SignOptions = {
        expiresIn: expiresIn as SignOptions["expiresIn"]
    };
    return Promise.resolve(jwt.sign(jwtPayload as string | object | Buffer, secret, options));
};

export const generateRefreshToken = async (jwtPayload: { userId: string, tokenVersion?: number }): Promise<string> => {
    const secret = config.jwt_refresh_secret as string;
    const expiresIn = config.jwt_refresh_expires_in
    const options: SignOptions = {
        expiresIn: expiresIn as SignOptions["expiresIn"]
    };
    return Promise.resolve(jwt.sign(jwtPayload as string | object | Buffer, secret, options))
};

export const verifyAccessToken = async (token: string): Promise<JwtPayload> => {
    const secret = config.jwt_access_secret as string;
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) return reject(err);
            resolve(decoded as JwtPayload);
        });
    });
};

export const verifyRefreshToken = async (token: string): Promise<JwtPayload> => {
    //  console.log("Verifying Refresh Token:", token);
    const secret = config.jwt_refresh_secret as string;
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            // console.log("Refresh Token Verify Error:", err);
            if (err) return reject(err);
            // console.log("Refresh Token Verified:", decoded);
            resolve(decoded as JwtPayload);
        });
    });
};


