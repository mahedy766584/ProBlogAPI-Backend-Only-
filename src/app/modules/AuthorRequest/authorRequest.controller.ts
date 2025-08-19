import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthorRequestService } from "./authorRequest.service";

const createAuthorRequestIntoDB = catchAsync(async (req, res) => {
    const result = await AuthorRequestService.createAuthorRequestIntoDB(
        req.body,
        req.user,
    );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Author is requested successfully",
        data: result,
    });
});

const getAllAuthorRequestFromDB = catchAsync(async (req, res) => {
    const result = await AuthorRequestService.getAllAuthorRequestFromDB();
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Author is retrieved successfully",
        data: result,
    });
});

const getSingleAuthorRequestFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AuthorRequestService.getSingleAuthorRequestFromDB(
        id
    );
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Single Author is retrieved successfully",
        data: result,
    });
});

const updateSingleAuthorRequestIntoDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const payload = req.body;
    const result = await AuthorRequestService.updateSingleAuthorRequestIntoDB(
        id,
        payload,
        req.user
    );

    if (result.tokens) {
        const { accessToken, refreshToken } = result.tokens;

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days example
        });

        res.setHeader('x-access-token', accessToken);

        return sendResponse(res, {
            statusCode: status.OK,
            success: true,
            message: "Author request approved and tokens issued",
            data: {
                authorRequest: result.updateRequest,
                accessToken,
            },
        });

    };

    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Single Author is updated successfully",
        data: result,
    });
});

const deletedAuthorRequestFromDB = catchAsync(async (req, res) => {
    const { id } = req.params;
    const result = await AuthorRequestService.deletedAuthorRequestFromDB(id);
    sendResponse(res, {
        statusCode: status.OK,
        success: true,
        message: "Single Author is deleted successfully",
        data: result,
    });
});

export const AuthorRequestController = {
    createAuthorRequestIntoDB,
    getAllAuthorRequestFromDB,
    getSingleAuthorRequestFromDB,
    updateSingleAuthorRequestIntoDB,
    deletedAuthorRequestFromDB,
};