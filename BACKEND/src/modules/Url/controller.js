import dotenv from "dotenv/config";
import * as urlService from "./service.js";
import logger from "../../../config/logger.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { timeValidation } from "../../validator/date.validator.js";
import { AppError } from "../../utils/AppError.js";
import { success } from "zod";

// CRUD operations for url..
export const shortUrl = asyncHandler(async (req, res) => {
    const url = await urlService.urlShort({
        originalUrl: req.body.originalUrl,
        singleUse: req.body?.singleUse || false,
        password: req.body?.password || null,
        expiry: req.body?.expiry || null,
        userId: req.user?.id || null,
        tempId: req.cookies?.tempId || null,
    });
    if (url?.tempId) {
        res.cookie("tempId", url.tempId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 30,
        })
    }
    return res.status(200).json({ success: true, url, });
});

export const redirectUrl = asyncHandler(async (req, res) => {
    const response = await urlService.urlRedirect({
        shortCode: req.params.shortCode, userAgent: req.headers["user-agent"], ipAdd: process.env.NODE_ENV === 'production' ? req.headers["x-forwarded-for"] || req.socket.remoteAddress : '45.118.167.50'
    });

    if (response?.requiresPassword) {
        res.status(200).json({ success: true, message: "Password Required", response });
        return;
    }
    return res.redirect(response);
});

export const getAllUrls = asyncHandler(async (req, res) => {
    const url = await urlService.getMyUrl({ userId: req.user?.id, status: req.query.status });
    return res.status(200).json({ success: true, url });
});

export const getUrl = asyncHandler(async (req, res) => {
    const url = await urlService.UrlDetails({
        userId: req.user?.id,
        shortcode: req.query?.shortCode,
    });

    return res.status(200).json({ success: true, url });
});

export const deleteUrl = asyncHandler(async (req, res) => {
    const response = await urlService.UrlDelete({
        userId: req.user?.id,
        shortcode: req.query?.shortCode,
    });
    return res.status(204).json({ success: true, response });
});

export const updateUrl = asyncHandler(async (req, res) => {
    const url = await urlService.UrlUpdate({
        userId: req.user?.id,
        originalUrl: req.body.originalUrl,
        expirationDate: req.body.expirationDate,
        isActive: req.body.isActive,
        password: req.body.password,
        shortcode: req.query?.shortCode,
        liveTime: req.body?.liveTime,
    })
    return res.status(204).json({ success: true });
});

export const verifyPassword = asyncHandler(async (req, res) => {
    const result = await urlService.passwordVerify({
        password: req.body.password,
        shortCode: req.params.shortCode
    });
    if (result.isMatch) {
        return res.redirect(result.originalUrl);
    }
})

export const bulkShortUrl = asyncHandler(async (req, res) => {
    const result = await urlService.shortUrlBulk({
        filePath: req.file.path,
        userId: req.user?.id,
    })
    return res.status(200).json({ success: true, url: result })
})