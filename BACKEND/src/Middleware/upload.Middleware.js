import multer from 'multer';
import { AppError } from '../utils/AppError.js';
export const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./src/uploads");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024, },
    fileFilter: (req, file, cb) => {
        const allowedExt = [".xlsx", ".csv"];
        const allowedMimeTypes = ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "text/csv",];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new new AppError("Invalid File type"))
        };
        if (!allowedExt.some(ext => file.originalname.toLowerCase().endsWith(ext))) {
            return cb(new new AppError("Invalid File"));
        };
        cb(null, true);
    }
});