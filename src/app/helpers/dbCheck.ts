import status from "http-status";
import AppError from "../error/appError";

export const checkEmptyOrThrow = <T>(
    data: T | null | T[],
    notFoundMessage = "Data not found!"
): T | T[] => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
        throw new AppError(status.NOT_FOUND, notFoundMessage);
    };

    return data;
};