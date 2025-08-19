/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources, TGenericErrorResponse } from "../interface/error";

const handleDuplicateError = (err: any): TGenericErrorResponse => {

    const match = err.message.match(/dup key: { (.*?): "(.*?)" }/);

    const fieldName = match?.[1];   // userName
    const fieldValue = match?.[2];  // user06
    
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