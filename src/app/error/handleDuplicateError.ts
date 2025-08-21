/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

const handleDuplicateError = (err: any): TGenericErrorResponse => {

    const match = err.message.match(/dup key: { (.*?): "(.*?)" }/);
    const fieldName = match?.[1] || Object.keys(err?.keyPattern || {})[0];   // userName
    const fieldValue = match?.[2] || err?.keyValue ? Object.values(err.keyValue)[0] : "";  // user06

    const errorSources: TErrorSources = [{
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

export default handleDuplicateError;