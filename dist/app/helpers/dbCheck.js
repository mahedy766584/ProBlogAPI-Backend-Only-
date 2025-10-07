"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkEmptyOrThrow = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../error/appError"));
const checkEmptyOrThrow = (data, notFoundMessage = "Data not found!") => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, notFoundMessage);
    }
    ;
    return data;
};
exports.checkEmptyOrThrow = checkEmptyOrThrow;
