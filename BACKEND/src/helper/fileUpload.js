import cloudinary from '../../config/cloudinary.js';
import streamifier from 'streamifier';

async function uploadImages(file) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, uploadResult) => {
            if (error) {
                return reject(error);
            }
            return resolve(uploadResult);
        }).end(file.buffer);
    }).then((uploadResult) => {
        console.log(`Buffer upload_stream wth promise success - ${uploadResult.public_id}`);
        return uploadResult;
    }).catch((error) => {
        console.error(error);
    });

}

export default uploadImages;