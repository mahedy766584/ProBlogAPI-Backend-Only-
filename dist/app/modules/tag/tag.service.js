"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const appError_1 = __importDefault(require("../../error/appError"));
const tag_model_1 = require("./tag.model");
const creteTagIntoDB = async (payload) => {
    const isExists = await tag_model_1.Tag.findOne({ name: payload?.name });
    if (isExists) {
        throw new appError_1.default(http_status_1.default.BAD_REQUEST, 'This tag already exist');
    }
    ;
    const result = await tag_model_1.Tag.create(payload);
    return result;
};
const getAllTagsFromDB = async () => {
    const result = await tag_model_1.Tag.find();
    return result;
};
const getSingleTagFromDB = async (id) => {
    const result = await tag_model_1.Tag.findById(id);
    if (!result) {
        throw new appError_1.default(http_status_1.default.NOT_FOUND, 'Tag not found!');
    }
    ;
    return result;
};
exports.TagService = {
    creteTagIntoDB,
    getAllTagsFromDB,
    getSingleTagFromDB
};
