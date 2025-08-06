import status from "http-status";
import AppError from "../../error/appError";
import { TTag } from "./tag.interface";
import { Tag } from "./tag.model";

const creteTagIntoDB = async (payload: TTag) => {
    const isExists = await Tag.findOne({ name: payload?.name });
    if (isExists) {
        throw new AppError(
            status.BAD_REQUEST,
            'This tag already exist'
        );
    };
    const result = await Tag.create(payload);
    return result;
};

const getAllTagsFromDB = async () => {
    const result = await Tag.find();
    return result;
};

const getSingleTagFromDB = async (id: string) => {
    const result = await Tag.findById(id);
    if (!result) {
        throw new AppError(
            status.NOT_FOUND,
            'Tag not found!'
        )
    };
    return result;
};

export const TagService = {
    creteTagIntoDB,
    getAllTagsFromDB,
    getSingleTagFromDB
};