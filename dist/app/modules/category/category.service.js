"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../error/appError"));
const category_model_1 = require("./category.model");
const createCategoryIntoDB = async (payload) => {
    const categoryExist = await category_model_1.Category.findOne({ name: payload?.name });
    if (categoryExist) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'Category is already exist!!');
    }
    ;
    const result = await category_model_1.Category.create(payload);
    return result;
};
const getAllCategoriesFromDB = async () => {
    const result = await category_model_1.Category.find();
    return result;
};
const getSingleCategoryFromDB = async (id) => {
    const result = await category_model_1.Category.findById(id);
    return result;
};
exports.CategoryServices = {
    createCategoryIntoDB,
    getAllCategoriesFromDB,
    getSingleCategoryFromDB,
};
