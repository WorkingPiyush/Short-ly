import dotenv from "dotenv/config";
import { nanoid } from "nanoid";
import qrcode from 'qrcode';
import crypto from 'crypto';

export const isValidUrl = (url) => {
    try {
        const parsedUrl = new URL(url);
        const allowedProtocols = ["http:", "https:"];
        return allowedProtocols.includes(parsedUrl.protocol);
    } catch {
        return false;
    }
}

export const normalizeUrl = (url) => {
    const u = new URL(url);
    u.protocol = u.protocol.toLowerCase();
    u.hostname = u.hostname.toLowerCase();

    if (u.pathname.endsWith('/') && u.pathname !== '/') {
        u.pathname = u.pathname.slice(0, -1);
    }

    if ((u.protocol === "https:" && u.port === "443") || (u.protocol === "http:" && u.port === "80")) {
        u.port = "";
    }
    return u.toString();
}

export const hashUrl = (url) => {
    return crypto.createHash("sha256").update(url).digest("hex");
}

export const generateShortCode = () => {
    return nanoid(7);
};

export const generateQRCode = async (input) => {
    return await qrcode.toDataURL(`${process.env.BACKEND_URL}/${input.shortCode}`);
}
export const urlKey = (shortCode) => {
    return `ShortCode:${shortCode}`
}