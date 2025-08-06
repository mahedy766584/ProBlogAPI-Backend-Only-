import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CategoryServices } from "./category.service";

const createCategoryIntoDB = catchAsync(async (req, res) => {
    const result = await CategoryServices.createCategoryIntoDB(
        req.body,
    );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Category is created successfully',
        data: result,
    });
});

const getAllCategoriesFromDB = catchAsync(async (req, res) => {
    const result = await CategoryServices.getAllCategoriesFromDB();
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Category is retrieved successfully',
        data: result,
    });
});

const getSingleCategoryFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await CategoryServices.getSingleCategoryFromDB(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Single Category is retrieved successfully',
        data: result,
    });
});

export const CategoryController = {
    createCategoryIntoDB,
    getAllCategoriesFromDB,
    getSingleCategoryFromDB
};