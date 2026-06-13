import dotenv from "dotenv/config";
import { client } from '../../../config/db.js';
import { formatBrowser, formatCountry, formatDevice, formatOperating, generateQRCode, generateShortCode, hashUrl, isValidUrl, normalizeUrl, passwordCompare, passwordHashing, urlKey, urlStatus } from '../../helper/Url.helper.js';
import { analyticsUpdates, findFirstUrl, topBrowser, topOs, topDevice, topCountry, countUrl, totalClick, urlCountUpdate } from "../../helper/Db.query.js";
import { redisClient } from "../../../config/redisClient.js";
import { AppError } from "../../utils/AppError.js";
import logger from "../../../config/logger.js";
import bcrypt from 'bcrypt';
import DeviceDetector from 'device-detector-js';
import geoip from 'geoip-lite';
import XLSX from 'xlsx';
import fs from 'fs';
import { connect } from "http2";

const deviceDetector = new DeviceDetector();
const MAX_TEMP_URLS = 3;
const BATCH_SIZE = 10;

export const urlShort = async ({ originalUrl, userId, tempId, singleUse, password, expiry }) => {
    if (!originalUrl) {
        throw new AppError('Invalid Url', 400);
    }

    if (!isValidUrl(originalUrl)) {
        throw new AppError('Invalid Url', 400);
    }

    const normalizedUrl = normalizeUrl(originalUrl);

    const urlHash = hashUrl(normalizedUrl);

    if (!userId) {
        let newtempId = null;

        if (!tempId) {
            newtempId = crypto.randomUUID();
            tempId = newtempId;
        }
        const tempUrlCount = await countUrl(tempId);
        if (tempUrlCount === MAX_TEMP_URLS) {
            throw new AppError('Signup required', 400);
        }

        const existingTempUrl = await client.url.findFirst({
            where: {
                urlHash,
                userId: null,
            }
        });

        if (existingTempUrl) {
            return {
                originalUrl: existingTempUrl.originalUrl,
                shortUrl: `${process.env.BACKEND_URL}/${existingTempUrl.shortCode}`,
                clicks: existingTempUrl.clicks,
                expirationDate: existingTempUrl.expirationDate,
                tempId,
            }
        }
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() + 30);

        const tempNewUrl = await client.url.create({
            data: {
                originalUrl,
                normalizedUrl,
                urlHash,
                shortCode: generateShortCode(),
                tempId,
                expirationDate,
            }
        })
        return {
            originalUrl: tempNewUrl.originalUrl,
            shortUrl: `${process.env.BACKEND_URL}/${tempNewUrl.shortCode}`,
            clicks: tempNewUrl.clicks,
            expirationDate: tempNewUrl.expirationDate,
            userId: tempNewUrl.userId,
            tempId,
        };
    }

    const existing = await client.url.findFirst({
        where: {
            urlHash,
            userId: userId,
        },
        select: {
            id: true,
            originalUrl: true,
            shortCode: true,
            expirationDate: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            password: true,
            isActive: true,
        }
    });

    if (existing) {
        const clicks = await totalClick(existing.id);
        return {
            shortUrl: `${process.env.BACKEND_URL}/${existing.shortCode}`,
            originalUrl: existing.originalUrl,
            expiry_date: existing.expirationDate,
            creation_date: existing.createdAt,
            singleUse: existing.singleUse,
            totalClicks: clicks,
            isPswrdProtected: existing.password ? true : false,
            isActive: existing.isActive,
            userId: existing.userId,
        }
    }
    let shortCode;
    let shortCodeExists = true;

    while (shortCodeExists) {
        shortCode = generateShortCode();
        shortCodeExists = await client.url.findUnique({
            where: { shortCode },
        })
    }
    let expirationDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
    if (expiry) {
        expirationDate = new Date(expiry);
        if (expiry && expirationDate < new Date()) {
            throw new Error("Invalid Expiry Date");
        };
    };

    let hashedPassword = password ? await passwordHashing(password, 10) : null;
    const newUrl = await client.url.create({
        data: {
            originalUrl,
            normalizedUrl,
            urlHash,
            shortCode,
            userId,
            expirationDate,
            singleUse,
            password: hashedPassword,
        }
    });
    const qrCodeImg = await generateQRCode(newUrl);
    const responseUrl = {
        shortUrl: `${process.env.BACKEND_URL}/${newUrl.shortCode}`,
        originalUrl: newUrl.originalUrl,
        expiry_date: newUrl.expirationDate,
        creation_date: newUrl.createdAt,
        QrCode: qrCodeImg,
        singleUse: newUrl.singleUse,
        isPswrdProtected: newUrl.password ? true : false,
        userId: newUrl.userId,
    };

    return responseUrl;
};

export const urlRedirect = async ({ shortCode, userAgent, ipAdd }) => {
    const isBot = /(googlebot|crawler|spider|slackbot|discordbot|twitterbot|facebookexternalhit|curl|wget|bingbot|linkedinbot)/i.test(userAgent);
    if (!shortCode) {
        throw new AppError('Invalid Url', 400);
    }

    const userInfo = deviceDetector.parse(userAgent);
    const browser = userInfo.client.name || "Unknown";;
    const os = userInfo.os?.name || "Third Client Agent";
    const device = userInfo.device?.type || "desktop";

    const ipLocation = geoip.lookup(ipAdd);
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    const country = ipLocation?.country ? regionNames.of(ipLocation.country) : "Unknown";
    const city = ipLocation?.city || "Unknown";
    const now = new Date();

    let result = null;
    const cached = await redisClient.get(urlKey(shortCode));
    if (cached) {
        result = JSON.parse(cached);
    };
    if (result && Object.keys(result).length > 0) {
        // console.log("cache Hit", result);
        if (result.expirationDate && new Date(result.expirationDate) < new Date()) {
            throw new AppError('Url Expired !!', 404);
        }
        if (result.isProtected) {
            return { requiresPassword: true };
        }
        if (result.liveTime && result.liveTime > now) {
            throw new AppError("Link is not live yet", 500);
        }
        if (result.userId) {
            if (!isBot) {
                void analyticsUpdates(result.id, browser, os, device, country, city).catch(console.error);
            }
        } else {
            void urlCountUpdate(result.id);
        }
        return result.originalUrl;
    }
    const url = await findFirstUrl(shortCode);
    // console.log("cache miss", url)
    if (!url) {
        throw new AppError('Invalid Url', 400);
    }
    if (url.liveTime && new Date() < url.liveTime) {
        throw new AppError("Link is not live yet", 500);
    }
    if (url.password) {
        return { requiresPassword: true, shortCode: url.shortCode };
    }
    if (url.expirationDate && url.expirationDate < new Date()) {
        throw new AppError('Url Expired !!', 404);
    }
    if (url.singleUse) {
        const singleUseUrl = await client.url.updateMany({
            where: {
                id: url.id,
                singleUse: true,
                isActive: true,
                used: false,
            },
            data: {
                used: true,
            }
        });
        if (singleUseUrl.count == 0) {
            throw new AppError("Already used or invalid link", 400);
        }

        return url.originalUrl;
    }

    await redisClient.set(urlKey(url.shortCode), JSON.stringify({ originalUrl: url.originalUrl, id: url.id, userId: url.userId, liveTime: url.liveTime, isProtected: url.password ? true : false, expirationDate: url.expirationDate?.toISOString() || "", }), { EX: 3600, });

    if (!isBot) {
        void analyticsUpdates(url.id, browser, os, device, country, city).catch(console.error);
    }

    return url.originalUrl;
};

export const getMyUrl = async ({ userId, status = "all" }) => {
    const now = new Date();
    let fetchedUrl;
    fetchedUrl = await client.url.findMany({
        where: {
            userId,
            isDeleted: false,
            ...(status === "active" && {
                AND: [
                    {
                        OR: [
                            { liveTime: null },
                            { liveTime: { lte: now } },
                        ],
                    },
                    { expirationDate: { gt: now }, },
                    {
                        NOT: { AND: [{ singleUse: true }, { used: true },], },
                    }
                ],
            }),
            ...(status === "expired" && {
                expirationDate: { lte: now }
            }),
            ...(status === "SingleUse" && {
                singleUse: true,
                used: true,
                expirationDate: { gt: now },
            }),
        },
        orderBy: {
            createdAt: "asc",
        },
        select: {
            id: true,
            originalUrl: true,
            shortCode: true,
            expirationDate: true,
            password: true,
            createdAt: true,
            updatedAt: true,
            liveTime: true,
            singleUse: true,
            isActive: true,
            userId: true,
            lastVisitedAt: true,
            used: true,
        }
    });
    if (!fetchedUrl) {
        throw new AppError("No Url Found !!");
    }
    return Promise.all(
        fetchedUrl.map(async (u) => {
            const clicks = await totalClick(u.id);
            return {
                id: u.id,
                short_url: `${process.env.BACKEND_URL}/${u.shortCode}`,
                short_code: u.shortCode,
                original_url: u.originalUrl,
                totalClicks: clicks,
                expiry_date: u.expirationDate,
                creation_date: u.createdAt,
                last_update_date: u.updatedAt,
                isPswrdProtected: u.password ? true : false,
                lastVisitedAt: u.lastVisitedAt,
                isActive: await urlStatus(u),
                liveTime: u.liveTime,
                singleUse: u.singleUse,
                userId: u.userId,
            }
        })
    );
};

export const UrlDetails = async ({ userId, shortCode }) => {
    if (!shortCode) {
        logger.error("shortCode not found !!");
        throw new AppError("shortCode not found !!", 404);
    };
    const Url = await client.url.findFirst({
        where: { userId, shortCode, isDeleted: false },
        select: {
            id: true,
            originalUrl: true,
            shortCode: true,
            expirationDate: true,
            createdAt: true,
            updatedAt: true,
            liveTime: true,
            lastVisitedAt: true,
            isActive: true,
        }
    });
    if (!Url) {
        logger.error("Url not found");
        throw new AppError('Url not found', 404);
    }
    const [topBrowsers, topOsys, topDevices, topCountries, totalClicks] = await Promise.all([
        topBrowser(Url.id), topOs(Url.id), topDevice(Url.id), topCountry(Url.id), totalClick(Url.id)
    ])

    if (!Url) {
        throw new Error("No Url Found");
    }
    return {
        short_url: `${process.env.BACKEND_URL}/${Url.shortCode}`,
        original_url: Url.originalUrl,
        totalClicks: totalClicks,
        topBrowsers: formatBrowser(topBrowsers),
        topOperatingSystems: formatOperating(topOsys),
        topDevices: formatDevice(topDevices),
        topCountries: formatCountry(topCountries),
        isActive: Url.isActive,
        expiry_date: Url.expirationDate,
        creation_date: Url.createdAt,
        last_update_date: Url.updatedAt,
        liveTime: Url.liveTime,
    }
};

export const UrlDelete = async ({ userId, shortCode }) => {
    const result = await client.url.update({
        where: { userId, shortCode, isDeleted: false },
        data: {
            isDeleted: true, deletedAt: new Date(),
        }
    })
    if (!result) {
        throw new Error("Error happend !!");
    };
    return true;
};

export const UrlUpdate = async ({ userId, originalUrl, expirationDate, isActive, shortCode, password, liveTime }) => {
    console.log({ userId, originalUrl, expirationDate, isActive, shortCode, password, liveTime })
    // console.log(!userId, !originalUrl, !expirationDate, !isActive, !shortcode, !password, !liveTime)

    let updatedData = {};

    if (originalUrl !== null) {
        console.log("url Block")
        if (!isValidUrl(originalUrl)) {
            throw new Error("Invalid Url");
        }

        const normalizedUrl = normalizeUrl(originalUrl);

        const urlHash = hashUrl(normalizedUrl);

        updatedData.originalUrl = originalUrl;
        updatedData.normalizedUrl = normalizedUrl;
        updatedData.urlHash = urlHash;
        updatedData.clicks = 0;
    };

    if (expirationDate !== null) {
        if (expirationDate && new Date(expirationDate) < new Date()) {
            throw new Error("Invalid Expiry Date");
        }

        updatedData.expirationDate = new Date(expirationDate);
    };

    if (isActive !== null) {
        updatedData.isActive = isActive;
    };

    if (password) {
        const hashedPassword = await passwordHashing(password, 10);
        updatedData.password = hashedPassword;
    };

    if (liveTime !== null) {
        updatedData.liveTime = liveTime;
    };

    if (Object.entries(updatedData).length === 0) {
        throw new Error("No fields to update");
    };

    const existing = await client.url.findFirst({
        where: { userId, shortCode, isDeleted: false }
    });

    if (!existing) {
        throw new AppError("Invalid Url", 500);
    };

    if (originalUrl) {
        await client.UrlRecord.deleteMany({
            where: { urlId: existing.id },
        });
    }
    const updatedUrl = await client.url.update({
        where: { id: existing.id },
        data: updatedData,
        select: {
            originalUrl: true,
            shortCode: true,
            clicks: true,
            expirationDate: true,
            createdAt: true,
            updatedAt: true,
            password: true,
            isActive: true,
            liveTime: true,
        }
    });

    await redisClient.del(
        urlKey(updatedUrl.shortCode)
    );

    return {
        short_url: `${process.env.BACKEND_URL}/${updatedUrl.shortCode}`,
        original_url: updatedUrl.originalUrl,
        expiry_date: updatedUrl.expirationDate,
        isPswrdProtected: updatedUrl.password ? true : false,
        Start_at: updatedUrl.liveTime,
        creation_date: updatedUrl.createdAt,
        last_update_date: updatedUrl.updatedAt,
        liveTime: updatedUrl.liveTime,
    }
    return true;
};

export const passwordVerify = async ({ password, shortCode }) => {
    const url = await client.url.findUnique({
        where: { shortCode },
        select: {
            password: true,
            originalUrl: true
        }
    });
    let isMatch = await passwordCompare(password, url.password)
    if (!isMatch) {
        throw new AppError("Invalid password", 500);
    }
    return { isMatch: true, originalUrl: url.originalUrl };
};
export const shortUrlBulk = async ({ filePath, userId }) => {
    try {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }).flat().filter(row => typeof row === 'string');
        const uniqueBatch = [...new Set(rows)];
        if (uniqueBatch.length > 50) {
            throw new AppError("maximum limit exceeded", 400);
        }
        let finalResults = [];
        for (let i = 0; i < uniqueBatch.length; i += BATCH_SIZE) {
            const batch = uniqueBatch.slice(i, i + BATCH_SIZE);
            const result = await Promise.all(batch.map(url => urlShort({ originalUrl: url.trim(), userId })));
            finalResults.push(...result);
        }
        return finalResults;
    } finally {
        if (fs.existsSync(filePath)) { fs.unlinkSync(filePath) };
    }
};
export const searchUrl = async ({ query, userId }) => {
    if (!query) {
        logger.error("Query not Found")
        throw new AppError("Query not Found", 404);
    };
    let fetchedUrl;
    fetchedUrl = await client.$queryRaw`
        SELECT *,  
        GREATEST(similarity("originalUrl",${query}),similarity("shortCode",${query})) AS score
        FROM "Url"
        WHERE "userId" = ${userId}
        AND (
            "originalUrl" ILIKE ${'%' + query + '%'}
            OR 
            "shortCode" ILIKE ${'%' + query + '%'}
        )
        
        ORDER BY score DESC
        LIMIT 10
        `;
    if (!fetchedUrl) {
        throw new AppError("No matching url found !!", 404);
    }
    return Promise.all(
        fetchedUrl.map(async (u) => {
            const clicks = await totalClick(u.id);
            return {
                id: u.id,
                short_url: `${process.env.BACKEND_URL}/${u.shortCode}`,
                short_code: u.shortCode,
                original_url: u.originalUrl,
                totalClicks: clicks,
                expiry_date: u.expirationDate,
                creation_date: u.createdAt,
                last_update_date: u.updatedAt,
                isPswrdProtected: u.password ? true : false,
                lastVisitedAt: u.lastVisitedAt,
                isActive: await urlStatus(u),
                liveTime: u.liveTime,
                singleUse: u.singleUse,
                userId: u.userId,
            }
        })
    );
};