import cloudinary from '../../config/cloudinary.js';
import streamifier from 'streamifier';
import { AppError } from '../utils/AppError.js';

function uploadImages(fileBuffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, uploadResult) => {
            if (error) {
                return reject(error);
            }
            resolve(uploadResult);
        });
        stream.end(fileBuffer);
    });
}

export default uploadImages;
