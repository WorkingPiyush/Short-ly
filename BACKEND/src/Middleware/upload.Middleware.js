import multer from 'multer';
import { AppError } from '../utils/AppError.js';

const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

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
    limits: { fileSize: 5 * 1024 * 1024, },
    fileFilter: (req, file, cb) => {
        const allowedExt = [".xlsx", ".csv"];
        const allowedMimeTypes = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv",];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new AppError("Invalid File type"))
        };
        if (!allowedExt.some(ext => file.originalname.toLowerCase().endsWith(ext))) {
            return cb(new AppError("Invalid File"));
        };
        cb(null, true);
    }
});


export const imageUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024, },
    fileFilter: (req, file, cb) => {
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new AppError("Invalid File type"))
        };
        cb(null, true);
    }
});