import multer from 'multer';
import path from 'path';
import { AppError } from '../utils/AppError.js';

const allowedImageMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

const allowedExcelMimeTypes = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv", "application/csv",];
const allowedExt = [".xlsx", ".csv"];

export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

export const excelUpload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 1,
    },
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();

        if (!allowedExt.includes(ext)) {
            return cb(new AppError("Only .xlsx and .csv files are allowed"));
        };
        if (!allowedExcelMimeTypes.includes(file.mimetype)) {
            return cb(new AppError("Invalid file MIME type"))
        };
        cb(null, true);
    }
});


export const imageUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024, },
    fileFilter: (req, file, cb) => {
        if (!allowedImageMimeTypes.includes(file.mimetype)) {
            return cb(new AppError("Invalid File type"))
        };
        cb(null, true);
    }
});