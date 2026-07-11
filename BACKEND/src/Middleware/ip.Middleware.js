import { ipLimiter } from "../lib/rateLimiter.js";
import { emailLimiter } from "../lib/rateLimiter.js";
import crypto from 'crypto';
import { AppError } from "../utils/AppError.js";
import logger from "../../config/logger.js";


export const forgotPasswordIpLimiter = async (req, res, next) => {
    try {
        await ipLimiter.consume(req.ip);
        next();
    } catch (error) {
        console.log(error)
        logger.error("Too many password reset requests. Try again later.")
        return res.status(429).json({
            success: false,
            message: "Too many password reset requests. Try again later.",
        });
    }
}

export const checkEmailLimiter = async (email) => {
    const emailKey = crypto.createHash("sha256").update(email.toLowerCase()).digest("hex");
    try {
        await emailLimiter.consume(emailKey);
    } catch (error) {
        throw new AppError(
            "Too many password reset requests for this email.",
            429
        );
    }
}