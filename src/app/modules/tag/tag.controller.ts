import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import { TagService } from "./tag.service";
import sendResponse from "../../utils/sendResponse";

const creteTagIntoDB = catchAsync(async (req, res) => {
    const result = await TagService.creteTagIntoDB(req.body);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Tag is created successfully',
        data: result,
    });
});

const getAllTagFromDB = catchAsync(async (req, res) => {
    const result = await TagService.getAllTagsFromDB();
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Tag is retrieved successfully',
        data: result,
    });
});

const getSingleTagFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await TagService.getSingleTagFromDB(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: 'Tag Category is retrieved successfully',
        data: result,
    });
});

export const TagController = {
    creteTagIntoDB,
    getAllTagFromDB,
    getSingleTagFromDB,
};