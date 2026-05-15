import dotenv from "dotenv/config";
import * as urlService from "./service.js";

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
}
export const redirectUrl = async (req, res) => {
    try {
        const redirectUrl = await urlService.urlRedirect(req.params);
        return res.redirect(redirectUrl);
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message });
    }
}