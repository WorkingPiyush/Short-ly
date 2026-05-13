import dotenv from "dotenv/config";
import * as urlService from "./service.js";

export const shortUrl = async (req, res) => {
    try {
        const url = await urlService.urlShort(req.body);
        return res.status(200).json({ success: true, data: url, });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: error.message });
    }
}