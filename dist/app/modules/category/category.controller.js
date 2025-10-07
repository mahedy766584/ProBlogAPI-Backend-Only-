"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const category_service_1 = require("./category.service");
const createCategoryIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await category_service_1.CategoryServices.createCategoryIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Category is created successfully',
        data: result,
    });
});
const getAllCategoriesFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await category_service_1.CategoryServices.getAllCategoriesFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Category is retrieved successfully',
        data: result,
    });
});
const getSingleCategoryFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await category_service_1.CategoryServices.getSingleCategoryFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single Category is retrieved successfully',
        data: result,
    });
});
exports.CategoryController = {
    createCategoryIntoDB,
    getAllCategoriesFromDB,
    getSingleCategoryFromDB
};
