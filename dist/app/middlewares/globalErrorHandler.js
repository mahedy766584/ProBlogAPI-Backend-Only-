"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const v3_1 = require("zod/v3");
const handleZodError_1 = __importDefault(require("../error/handleZodError"));
const config_1 = __importDefault(require("../config"));
const handleValidationError_1 = __importDefault(require("../error/handleValidationError"));
const handleCastError_1 = __importDefault(require("../error/handleCastError"));
const handleDuplicateError_1 = __importDefault(require("../error/handleDuplicateError"));
const appError_1 = __importDefault(require("../error/appError"));
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong';
    let errorSources = [{
            path: '',
            message: 'Something went wrong',
        }];
    if (err instanceof v3_1.ZodError) {
        const simplifiedError = (0, handleZodError_1.default)(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err.name === "ValidationError") {
        const simplifiedError = (0, handleValidationError_1.default)(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err.name === "CastError") {
        const simplifiedError = (0, handleCastError_1.default)(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err?.code === 11000) {
        const simplifiedError = (0, handleDuplicateError_1.default)(err);
        statusCode = simplifiedError?.statusCode;
        message = simplifiedError?.message;
        errorSources = simplifiedError.errorSources;
    }
    else if (err instanceof appError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
        errorSources = [{
                path: '',
                message: err?.message,
            }];
    }
    else if (err instanceof Error) {
        message = err?.message;
        errorSources = [{
                path: '',
                message: err?.message,
            }];
    }
    ;
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        // error: err,
        stack: config_1.default.NODE_DEV === 'development' ? err.stack : null,
    });
};
exports.default = globalErrorHandler;
