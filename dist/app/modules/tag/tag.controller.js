"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const tag_service_1 = require("./tag.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const creteTagIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await tag_service_1.TagService.creteTagIntoDB(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Tag is created successfully',
        data: result,
    });
});
const getAllTagFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await tag_service_1.TagService.getAllTagsFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Tag is retrieved successfully',
        data: result,
    });
});
const getSingleTagFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await tag_service_1.TagService.getSingleTagFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Tag Category is retrieved successfully',
        data: result,
    });
});
exports.TagController = {
    creteTagIntoDB,
    getAllTagFromDB,
    getSingleTagFromDB,
};
