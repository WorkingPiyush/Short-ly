import dotenv from "dotenv/config";
import { nanoid } from "nanoid";
import qrcode from 'qrcode';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

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

export const formatBrowser = (result) => {
    return result.map(b => ({
        browser: b.browser,
        clicks: b._count.browser,
    }))
};

export const formatOperating = (result) => {
    return result.map(b => ({
        os: b.os,
        clicks: b._count.os,
    }))
};

export const formatDevice = (result) => {
    return result.map(b => ({
        device: b.device,
        clicks: b._count.device,
    }))
};

export const formatCountry = (result) => {
    return result.map(b => ({
        country: b.country,
        clicks: b._count.country,
    }))
};
export const passwordHashing = async (password, salt) => {
    return await bcrypt.hash(password, salt);
}
export const passwordCompare = async (password, userPassword) => {
    return await bcrypt.compare(password, userPassword);
}
export const urlStatus = async (url) => {
    // console.log(`${url.shortCode} | ${url.singleUse} | ${url.used}`)
    const now = new Date();
    const expiryDate = new Date(url?.expirationDate);

    if (url.liveTime) {
        return "scheduled";
    }
    if (url.singleUse && url.used) {
        return "expired";
    } if (expiryDate <= now) {
        return "expired";
    }
    return "active";
}
