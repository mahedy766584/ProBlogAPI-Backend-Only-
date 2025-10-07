"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.sendImageToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const config_1 = __importDefault(require("../config"));
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloud_name,
    api_key: config_1.default.cloud_api_key,
    api_secret: config_1.default.cloud_api_secret,
});
const sendImageToCloudinary = async (imageName, path) => {
    return new Promise((resolve, reject) => {
        // Upload an image
        cloudinary_1.v2.uploader
            .upload(path, { public_id: imageName }, function (error, result) {
            if (error) {
                return reject(error);
            }
            if (!result) {
                return reject(new Error('Upload failed with unknown error'));
            }
            resolve(result);
            fs_1.default.unlink(path, (err) => {
                if (err) {
                    return reject(err);
                }
                else {
                    console.log('File is Deleted');
                }
                ;
            });
        });
    });
};
exports.sendImageToCloudinary = sendImageToCloudinary;
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/src/uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024, // ✅ 20MB
    }
});
