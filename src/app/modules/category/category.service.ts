import status from "http-status";
import AppError from "../../error/appError";
import { TCategory } from "./category.interface";
import { Category } from "./category.model";

const createCategoryIntoDB = async (payload: TCategory) => {
    const categoryExist = await Category.findOne({ name: payload?.name });
    if (categoryExist) {
        throw new AppError(
            status.BAD_REQUEST,
            'Category is must be unique!!'
        );
    };
    const result = await Category.create(payload);
    return result;
};

const getAllCategoriesFromDB = async () => {
    const result = await Category.find();
    return result;
};

const getSingleCategory = async (id: string) => {
    const result = await Category.findById(id);
    return result;
};

export const CategoryServices = {
    createCategoryIntoDB,
    getAllCategoriesFromDB,
    getSingleCategory,
};