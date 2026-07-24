import { allAnalytics, allUrl, bulkUrl, emailpassword, forgetPassword, login, profileUpdate, signup, url, urlAnalytics, urlCreate, urlUpdate, userInfo } from "../lib/rateLimiter.js";
import crypto from 'crypto';
import { AppError } from "../utils/AppError.js";
import logger from "../../config/logger.js";


export const forgotPasswordLimiter = async (req, res, next) => {
    const key = req.ip;
    try {
        await forgetPassword.consume(key);
        next();
    } catch (error) {
        logger.warn(`Forgot password rate limit exceeded: ${key}`);
        return res.status(429).set({
            "Retry-After": Math.ceil(error.msBeforeNext / 1000),
        }).json({
            success: false,
            message: "Too many password reset requests. Try again later.",
        });
    }
}

export const checkEmailLimiter = async (email) => {
    const emailKey = crypto.createHash("sha256").update(email.toLowerCase()).digest("hex");
    try {
        await emailpassword.consume(emailKey);
    } catch (error) {
        logger.warn(`Email check rate limit exceeded: ${emailKey}`);
        logger.warn("Too many password reset requests. Try again later.")
        throw new AppError(
            "Too many email check requests received for this email.",
            429
        );
    }
}

export const signupLimiter = async (req, res, next) => {
    const key = req.ip;
    try {
        await signup.consume(key);
        next();
    } catch (error) {
        logger.warn(`Signup user rate limit exceeded: ${key}`);
        return res.status(429).set({
            "Retry-After": Math.ceil(error.msBeforeNext / 1000),
        }).json({
            success: false,
            message: "Too many Signup requests. Try again later.",
        });
    }
}

export const loginLimiter = async (req, res, next) => {
    const key = req.ip;
    try {
        await login.consume(key);
        next();
    } catch (error) {
        logger.warn(`login user rate limit exceeded: ${key}`);
        return res.status(429).set({
            "Retry-After": Math.ceil(error.msBeforeNext / 1000),
        }).json({
            success: false,
            message: "Too many login requests. Try again later.",
        });
    }
}

export const getMeLimiter = async (req, res, next) => {
    const key = req.user?.id || req.ip;
    try {
        await userInfo.consume(key);
        next();
    } catch (error) {
        logger.warn(`User info rate limit exceeded: ${key}`);
        return res.status(429).set({
            "Retry-After": Math.ceil(error.msBeforeNext / 1000),
        }).json({
            success: false,
            message: "Too many get Userinfo requests. Try again later.",
        });
    }
};

export const updateLimiter = async (req, res, next) => {
    const key = req.user?.id || req.ip;
    try {
        await profileUpdate.consume(key);
        next();
    } catch (error) {
        logger.warn(`Update user profile rate limit exceeded: ${key}`);
        return res.status(429).set({
            "Retry-After": Math.ceil(error.msBeforeNext / 1000),
        }).json({
            success: false,
            message: "Too many user update requests. Try again later.",
        });
    }
}

export const urlCreateLimiter = async (req, res, next) => {
    const key = req.user?.id || req.ip;
    try {
        await urlCreate.consume(key);
        next();
    } catch (error) {
        logger.warn(`url creating rate limit exceeded: ${key}`);
        return res.status(429).set({
            "Retry-After": Math.ceil(error.msBeforeNext / 1000),
        }).json({
            success: false,
            message: "Too create user requests. Try again later.",
        });
    }
}

export const bulkUrlLimiter = async (req, res, next) => {
    const key = req.user?.id || req.ip;
    try {
        await bulkUrl.consume(key);
        next();
    } catch (error) {
        logger.warn(`Bulk url creating rate limit exceeded: ${key}`);
        return res.status(429).set({
            "Retry-After": Math.ceil(error.msBeforeNext / 1000),
        }).json({
            success: false,
            message: "Too many bulk urls requests. Try again later.",
        });
    }
}

export const allUrlLimiter = async (req, res, next) => {
    const key = req.user?.id || req.ip;
    try {
        await allUrl.consume(key);
        next();
    } catch (error) {
        logger.warn(`All url getting rate limit exceeded: ${key}`);
        return res.status(429).set({
            "Retry-After": Math.ceil(error.msBeforeNext / 1000),
        }).json({
            success: false,
            message: "Too many urls info requests. Try again later.",
        });
    }
}

export const urlLimiter = async (req, res, next) => {
    const key = req.user?.id || req.ip;
    try {
        await url.consume(key);
        next();
    } catch (error) {
        logger.warn(`Url getting rate limit exceeded: ${key}`);
        return res.status(429).set({
            "Retry-After": Math.ceil(error.msBeforeNext / 1000),
        }).json({
            success: false,
            message: "Too many urls info requests. Try again later.",
        });
    }
}

export const allAnalyticsLimiter = async (req, res, next) => {
    const key = req.user?.id || req.ip;
    try {
        await allAnalytics.consume(key);
        next();
    } catch (error) {
        logger.warn(`All Url Analytics rate limit exceeded: ${key}`);
        return res.status(429).set({
            "Retry-After": Math.ceil(error.msBeforeNext / 1000),
        }).json({
            success: false,
            message: "Too many analytics requests. Try again later.",
        });
    }
}

export const urlAnalyticsLimiter = async (req, res, next) => {
    const key = req.user?.id || req.ip;
    try {
        await urlAnalytics.consume(key);
        next();
    } catch (error) {
        logger.warn(`Url Analytics rate limit exceeded: ${key}`);
        return res.status(429).set({
            "Retry-After": Math.ceil(error.msBeforeNext / 1000),
        }).json({
            success: false,
            message: "Too many analytics requests. Try again later.",
        });
    }
}

export const urlUpdateLimiter = async (req, res, next) => {
    const key = req.user?.id || req.ip;
    try {
        await urlUpdate.consume(key);
        next();
    } catch (error) {
        logger.warn(`Url Update rate limit exceeded: ${key}`);
        return res.status(429).set({
            "Retry-After": Math.ceil(error.msBeforeNext / 1000),
        }).json({
            success: false,
            message: "Too many url update requests. Try again later.",
        });
    }
}