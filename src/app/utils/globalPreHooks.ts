/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model } from "mongoose";
import slugify from "slugify";

export const generateUniqSlug = async (
    model: Model<any>,
    value: string,
    key: string = 'slug',
): Promise<string> => {

    const baseSlag = slugify(value, {
        lower: true,
        replacement: '_',
        remove: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/g,
        strict: true,
        trim: true,
    });

    let slug = baseSlag;
    let count = 1;

    while (await model.exists({ [key]: slug })) {
        slug = `${baseSlag}_${count}`;
        count++;
    };

    return slug;

};