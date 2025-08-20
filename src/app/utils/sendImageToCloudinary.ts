import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import config from '../config';
import fs from "fs";
import multer from 'multer';

cloudinary.config({
    cloud_name: config.cloud_name,
    api_key: config.cloud_api_key,
    api_secret: config.cloud_api_secret,
});

export const sendImageToCloudinary = async (imageName: string, path: string): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        // Upload an image
        cloudinary.uploader
            .upload(
                path,
                { public_id: imageName },
                function (error, result) {

                    if (error) {
                        return reject(error);
                    }

                    if (!result) {
                        return reject(new Error('Upload failed with unknown error'));
                    }
                    resolve(result);


                    fs.unlink(path, (err) => {
                        if (err) {
                            return reject(err);
                        } else {
                            console.log('File is Deleted');
                        };
                    });

                }
            );
    });
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, process.cwd() + '/src/uploads')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 20 * 1024 * 1024, // ✅ 20MB
    }
});