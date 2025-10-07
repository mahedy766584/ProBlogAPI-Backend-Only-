"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorRequestController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const authorRequest_service_1 = require("./authorRequest.service");
const createAuthorRequestIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await authorRequest_service_1.AuthorRequestService.createAuthorRequestIntoDB(req.body, req.user);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Author is requested successfully",
        data: result,
    });
});
const getAllAuthorRequestFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const result = await authorRequest_service_1.AuthorRequestService.getAllAuthorRequestFromDB();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Author is retrieved successfully",
        data: result,
    });
});
const getSingleAuthorRequestFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await authorRequest_service_1.AuthorRequestService.getSingleAuthorRequestFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Single Author is retrieved successfully",
        data: result,
    });
});
const updateSingleAuthorRequestIntoDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await authorRequest_service_1.AuthorRequestService.updateSingleAuthorRequestIntoDB(id, payload, req.user);
    if (result.tokens) {
        const { accessToken, refreshToken } = result.tokens;
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days example
        });
        res.setHeader('x-access-token', accessToken);
        return (0, sendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: "Author request approved and tokens issued",
            data: {
                authorRequest: result.updateRequest,
                accessToken,
            },
        });
    }
    ;
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Single Author is updated successfully",
        data: result,
    });
});
const deletedAuthorRequestFromDB = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await authorRequest_service_1.AuthorRequestService.deletedAuthorRequestFromDB(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Single Author is deleted successfully",
        data: result,
    });
});
exports.AuthorRequestController = {
    createAuthorRequestIntoDB,
    getAllAuthorRequestFromDB,
    getSingleAuthorRequestFromDB,
    updateSingleAuthorRequestIntoDB,
    deletedAuthorRequestFromDB,
};
