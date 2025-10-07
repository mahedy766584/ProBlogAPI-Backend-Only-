"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("./user.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const createUserIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserServices.createUserIntoDB(req.file, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User is created successfully',
        data: result,
    });
});
const getAllUserFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await user_service_1.UserServices.getAllUserFromDB(req.query);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All user is retrieved successfully',
        data: result,
    });
});
const getSingleUserFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await user_service_1.UserServices.getSingleUserFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single user is retrieved successfully',
        data: result,
    });
});
const updateSingleUserIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await user_service_1.UserServices.updateSingleUserIntoDB(id, req.body, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single user is updated successfully',
        data: result,
    });
});
const deleteUserFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await user_service_1.UserServices.deleteUserFromDB(id, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User is Deleted successfully',
        data: result,
    });
});
exports.UserController = {
    createUserIntoDB,
    getAllUserFromDB,
    getSingleUserFromDB,
    updateSingleUserIntoDB,
    deleteUserFromDB
};
