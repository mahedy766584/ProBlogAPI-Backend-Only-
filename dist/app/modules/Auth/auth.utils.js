"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const generateAccessToken = async (jwtPayload) => {
    const secret = config_1.default.jwt_access_secret;
    const expiresIn = config_1.default.jwt_access_expires_in;
    const options = {
        expiresIn: expiresIn
    };
    return Promise.resolve(jsonwebtoken_1.default.sign(jwtPayload, secret, options));
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = async (jwtPayload) => {
    const secret = config_1.default.jwt_refresh_secret;
    const expiresIn = config_1.default.jwt_refresh_expires_in;
    const options = {
        expiresIn: expiresIn
    };
    return Promise.resolve(jsonwebtoken_1.default.sign(jwtPayload, secret, options));
};
exports.generateRefreshToken = generateRefreshToken;
const verifyAccessToken = async (token) => {
    const secret = config_1.default.jwt_access_secret;
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
            if (err)
                return reject(err);
            resolve(decoded);
        });
    });
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = async (token) => {
    const secret = config_1.default.jwt_refresh_secret;
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, secret, (err, decoded) => {
            if (err)
                return reject(err);
            resolve(decoded);
        });
    });
};
exports.verifyRefreshToken = verifyRefreshToken;
