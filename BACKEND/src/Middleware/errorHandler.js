import logger from "../../config/logger.js";

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    logger.error(err.message)
    res.status(err.statusCode).json({
        success: false,
        status: err.status,
        message: err.message,
    });
};

export default errorHandler;