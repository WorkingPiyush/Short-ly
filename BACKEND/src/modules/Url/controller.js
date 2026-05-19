import dotenv from "dotenv/config";
import * as urlService from "./service.js";

// CRUD operations for url..
export const shortUrl = async (req, res) => {
    try {
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
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const redirectUrl = async (req, res) => {
    try {
        const redirectUrl = await urlService.urlRedirect({
            shortCode: req.params.shortCode, userAgent: req.headers["user-agent"], ipAdd: process.env.NODE_ENV === 'production' ? req.headers["x-forwarded-for"] || req.socket.remoteAddress : '45.118.167.50'
        });
        return res.redirect(redirectUrl);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllUrls = async (req, res) => {
    try {
        const urls = await urlService.getMyUrl(req.user?.id);
        return res.status(200).json({ success: true, urls });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const getUrl = async (req, res) => {
    try {
        const response = await urlService.UrlDetails({
            userId: req.user?.id,
            shortcode: req.params.shortCode,
        });
        return res.status(200).json({ success: true, response });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message });
    }

};

export const deleteUrl = async (req, res) => {
    try {
        const response = await urlService.UrlDelete({
            userId: req.user?.id,
            shortcode: req.params.shortCode,
        });
        return res.status(200).json({ success: true, response });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateUrl = async (req, res) => {
    try {
        const url = await urlService.UrlUpdate({
            userId: req.user?.id,
            originalUrl: req.body.originalUrl,
            expirationDate: req.body.expirationDate,
            isActive: req.body.isActive,
            shortcode: req.params.shortCode,
        })
        return res.status(200).json({ success: true, NewUrl: url });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message });
    }

};


