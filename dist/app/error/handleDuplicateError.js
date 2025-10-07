"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (err) => {
    const match = err.message.match(/dup key: { (.*?): "(.*?)" }/);
    const fieldName = match?.[1] || Object.keys(err?.keyPattern || {})[0]; // userName
    const fieldValue = match?.[2] || err?.keyValue ? Object.values(err.keyValue)[0] : ""; // user06
    const errorSources = [{
            path: fieldName || '',
            message: `${fieldValue} : is already exists`,
        }];
    const statusCode = 400;
    return {
        statusCode,
        message: 'Validation Error',
        errorSources
    };
};
exports.default = handleDuplicateError;
