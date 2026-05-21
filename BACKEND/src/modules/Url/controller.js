import dotenv from "dotenv/config";
import * as urlService from "./service.js";
import logger from "../../../config/logger.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// CRUD operations for url..
export const shortUrl = asyncHandler(async (req, res) => {
    const result = await urlService.urlShort({
        originalUrl: req.body.originalUrl,
        userId: req.user?.id || null,
        tempId: req.cookies?.tempId || null,
    });

    if (result.tempId) {
        res.cookie("tempId", result.tempId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24 * 30,
        })
    }
    return res.status(200).json({ success: true, data: result, });
});

export const redirectUrl = asyncHandler(async (req, res) => {
    const redirectUrl = await urlService.urlRedirect({
        shortCode: req.params.shortCode, userAgent: req.headers["user-agent"], ipAdd: process.env.NODE_ENV === 'production' ? req.headers["x-forwarded-for"] || req.socket.remoteAddress : '45.118.167.50'
    });
    return res.redirect(redirectUrl);
});

export const getAllUrls = asyncHandler(async (req, res) => {
    const urls = await urlService.getMyUrl({ userId: req.user?.id });
    return res.status(200).json({ success: true, urls });
});

export const getUrl = asyncHandler(async (req, res) => {
    const response = await urlService.UrlDetails({
        userId: req.user?.id,
        shortcode: req.params.shortCode,
    });
    return res.status(200).json({ success: true, response });

});

export const deleteUrl = asyncHandler(async (req, res) => {
    const response = await urlService.UrlDelete({
        userId: req.user?.id,
        shortcode: req.params.shortCode,
    });
    return res.status(200).json({ success: true, response });
});

export const updateUrl = asyncHandler(async (req, res) => {
    const url = await urlService.UrlUpdate({
        userId: req.user?.id,
        originalUrl: req.body.originalUrl,
        expirationDate: req.body.expirationDate,
        isActive: req.body.isActive,
        shortcode: req.params.shortCode,
    })
    return res.status(200).json({ success: true, NewUrl: url });
});


