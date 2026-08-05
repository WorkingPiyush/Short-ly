import dotenv from "dotenv/config";
import { nanoid } from "nanoid";
import qrcode from 'qrcode';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import slugify from "slugify";
import { categories, totalClick } from "./Db.query.js";
import logger from "../../config/logger.js";
import { client } from "../../config/db.js";
const AVOID_WORDS = [
    "the",
    "a",
    "an",
    "of",
    "for",
    "to",
    "in",
    "and",
    "on",
    "with"
]

const RESERVED_WORDS = new Set([
    "signup",
    "login",
    "features",
    "pricing",
    "support",
    "terms-and-conditions",
    "dashboard",
    "analytics",
    "profile",
    "shortCode",
    "reset",
    "password",
])

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
    return await qrcode.toDataURL(`${process.env.REDIRECT_URL}/${input.shortCode}`);
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
                short_url: `${process.env.REDIRECT_URL}/${l.shortCode}`,
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

export const formaturlInfo = async (url) => {
    const status = await urlStatus(url);
    const category = await categories(url.userId);
    return {
        short_url: `${process.env.REDIRECT_URL}/${url.shortCode}`,
        original_url: url.originalUrl,
        isActive: status,
        expiry_date: url.expirationDate,
        creation_date: url.createdAt,
        last_update_date: url.updatedAt,
        liveTime: url.liveTime,
        tags: url.tags,
        categoryId: url.categoryId,
        category: category
    }
}

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
    if (url.isActive === false) {
        return "inactive"
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

export const checkShortCode = (text) => {
    let words = text.toLowerCase().trim().split(/\s+/);
    for (const word of words) {
        if (AVOID_WORDS.includes(word) || RESERVED_WORDS.has(word)) {
            logger.error("Invalid Short Code");
            throw new Error("Invalid Short Code");
        }
    }
    return words.join("-");
}

export const keyWordExtractor = (text) => {
    return slugify(text, {
        lower: true,
        strict: true,
        trim: true,
    }).split("-").filter(Boolean).filter(word => !AVOID_WORDS.includes(word));
};

export const rankKeyWord = (title, hostname, description) => {
    const scores = new Map();
    // scoring the title words
    for (const word of title) {
        scores.set(word, (scores.get(word) || 0) + 10);
    }
    // scoring the hostname words
    scores.set(hostname, (scores.get(hostname) || 0) + 8);
    if (title.length < 2) {
        // scoring the description words
        for (const word of description) {
            scores.set(word, (scores.get(word) || 0) + 3);
        }
    }

    const sortedEntries = [...scores.entries()].sort((a, b) => b[1] - a[1]);
    return sortedEntries.map(([word, score]) => word);
}

export const generateSuggestions = (words) => {
    const suggestions = new Set();

    if (words[0]) {
        suggestions.add(words[0]);
    }
    if (words[0] && words[1]) {
        suggestions.add(`${words[0]}-${words[1]}`);
    }
    if (words[1] && words[0]) {
        suggestions.add(`${words[1]}-${words[0]}`);
    }
    if (words[0] && words[2]) {
        suggestions.add(`${words[0]}-${words[2]}`);
    }
    if (words[2] && words[0]) {
        suggestions.add(`${words[2]}-${words[0]}`);
    }
    if (words[0] && words[3]) {
        suggestions.add(`${words[0]}-${words[3]}`);
    }
    if (words[3] && words[2]) {
        suggestions.add(`${words[3]}-${words[2]}`);
    }
    if (words[1] && words[2] && words[3]) {
        const slug = `${words[1]}-${words[2]}-${words[3]}`;

        if (slug.length <= 25) {
            suggestions.add(slug);
        }
    }
    return [...suggestions];

}

export const generateValidSuggestions = (words) => {
    return words.filter(w => {
        if (w.length < 4) return false;
        if (w.length > 25) return false;
        if (RESERVED_WORDS.has(w) && AVOID_WORDS.includes(w)) return false;
        return true;
    })
}

export const isReadable = (word) => {
    return /^[a-z-]{3,20}$/i.test(word);
}

export const gethostname = (host) => {
    return host.replace("www.", "").split('.')[0];
}

export const getShortCodeAvailablity = async (customShortCode) => {
    if (customShortCode) {
        const normalized = checkShortCode(customShortCode);

        const exists = await client.url.findUnique({
            where: { shortCode: normalized },
            select: { shortCode: true, }
        });
        if (exists) {
            throw new AppError("Short code already exists", 409);
        };
        return normalized;
    }

    let generated;
    const exists = await client.url.findUnique({
        where: {
            shortCode: generated
        },
        select: {
            shortCode: true
        }
    });
    if (!exists) {
        return generated;
    }

}