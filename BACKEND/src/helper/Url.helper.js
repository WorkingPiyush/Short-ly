import dotenv from "dotenv/config";
import { nanoid } from "nanoid";
import qrcode from 'qrcode';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { totalClick } from "./Db.query.js";

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
        browser: b.browser || "unknown",
        clicks: b.clicks,
    }))
};
export const formateDate = (date) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day}-${month}`;
}
export const formatClicks = (result) => {
    return result.map(b => ({
        day: formateDate(new Date(b.date)),
        clicks: b.clicks,
    }))
};

export const formatOperating = (result) => {
    return result.map(b => ({
        os: b.os,
        clicks: b.clicks,
    }))
};

export const formatDevice = (result) => {
    return result.map(b => ({
        device: b.device,
        clicks: b.clicks,
    }))
};

export const foromtReferrer = (result) => {
    return result.map(b => ({
        clicks: b.clicks,
        referrer: b.referrer,
    }))
}

export const formatCountry = (result) => {
    return result.map(b => ({
        country: b.country,
        clicks: b.clicks,
    }))
};

export const formatUrl = (url) => {
    return Promise.all(
        url.map(async (l) => {
            const clicks = await totalClick(l.id);
            const status = await urlStatus(l);
            return {
                id: l.id,
                short_url: `${process.env.BACKEND_URL}/${l.shortCode}`,
                short_code: l.shortCode,
                original_url: l.originalUrl,
                totalClicks: clicks,
                expiry_date: l.expirationDate,
                creation_date: l.createdAt,
                last_update_date: l.updatedAt,
                isPswrdProtected: l.password ? true : false,
                lastVisitedAt: l.lastVisitedAt,
                isActive: status,
                liveTime: l.liveTime,
                singleUse: l.singleUse,
                userId: l.userId,
                tags: l.tags,
                category: l.category,
            }
        })
    )
};

export const passwordHashing = async (password, salt) => {
    return await bcrypt.hash(password, salt);
};

export const passwordCompare = async (password, userPassword) => {
    return await bcrypt.compare(password, userPassword);
};
export const urlStatus = async (url) => {
    const now = new Date();
    const expiryDate = new Date(url?.expirationDate);

    if (url.liveTime > now) {
        return "scheduled";
    }
    if (url.singleUse && url.used) {
        if (expiryDate <= now) {
            return "expired";
        }
        return "used";
    }
    if (expiryDate <= now) {
        return "expired";
    }
    return "active";
};

export const formatedReferrer = (ref) => {
    if (!ref) return "direct";

    if (ref.includes("google"))
        return "Google";

    if (ref.includes("twitter"))
        return "Twitter";

    if (ref.includes("linkedin"))
        return "LinkedIn";

    return "Other";
};

export const hashIP = (ipAdd) => {
    return crypto.createHash("sha256").update(ipAdd).digest("hex");
};

export const randomColor = () => {
    const palette = [
        "#6ee7b7",
        "#93c5fd",
        "#fca5a5",
        "#fcd34d",
        "#c4b5fd"
    ];
    const color = palette[Math.floor(Math.random() * palette.length)];
    return color;
}

export const tokenRefresh = (id) => {
    return jwt.sign(
        { userId: id },
        process.env.REFRESH_SECRET,
        { expiresIn: "7d" }
    );
}
export const tokenAccess = (id) => {
    return jwt.sign(
        { userId: id },
        process.env.ACCESS_SECRET,
        { expiresIn: "15m" }
    );
}