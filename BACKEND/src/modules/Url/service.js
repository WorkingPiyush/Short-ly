import dotenv from "dotenv/config";
import { client } from '../../../config/db.js';
import { formatBrowser, formatCountry, formatDevice, formatOperating, generateQRCode, generateShortCode, hashUrl, isValidUrl, normalizeUrl, urlKey } from '../../helper/Url.helper.js';
import { analyticsUpdates, findFirstUrl, topBrowser, topOs, topDevice, topCountry, countUrl, totalClick } from "../../helper/Db.query.js";
import { redisClient } from "../../../config/redisClient.js";
import DeviceDetector from 'device-detector-js';
import geoip from 'geoip-lite';
import { AppError } from "../../utils/AppError.js";
import logger from "../../../config/logger.js";

const deviceDetector = new DeviceDetector();
const MAX_TEMP_URLS = 3;

export const urlShort = async ({ originalUrl, userId, tempId }) => {

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
        const tempUrlCount = countUrl(tempId);

        if (tempUrlCount >= MAX_TEMP_URLS) {
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
                url: {
                    originalUrl: existingTempUrl.originalUrl,
                    shortUrl: `${process.env.BACKEND_URL}/${existingTempUrl.shortCode}`,
                    clicks: existingTempUrl.clicks,
                    expirationDate: existingTempUrl.expirationDate,
                },
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
            url: {
                originalUrl: tempNewUrl.originalUrl,
                shortUrl: `${process.env.BACKEND_URL}/${tempNewUrl.shortCode}`,
                clicks: tempNewUrl.clicks,
                expirationDate: tempNewUrl.expirationDate,
                userId: tempNewUrl.userId,
            },
            tempId,
        };
    }

    const existing = await client.url.findFirst({
        where: {
            urlHash,
            userId,
        },
    })
    if (existing) {
        return {
            originalUrl: existing.originalUrl,
            shortUrl: `${process.env.BACKEND_URL}/${existing.shortCode}`,
            clicks: existing.clicks,
            expirationDate: existing.expirationDate,
            userId: existing.userId,
        }
    }

    let shortCode;
    let shortCodeExists = true;

    while (shortCodeExists) {
        shortCode = generateShortCode();
        shortCodeExists = await client.url.findUnique({
            where: { shortCode, },
        })
    }
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 60);

    const newUrl = await client.url.create({
        data: {
            originalUrl,
            normalizedUrl,
            urlHash,
            shortCode,
            userId,
            expirationDate
        }
    })

    const qrCodeImg = await generateQRCode(newUrl);
    const responseUrl = {
        originalUrl: newUrl.originalUrl,
        shortUrl: `${process.env.BACKEND_URL}/${newUrl.shortCode}`,
        clicks: newUrl.clicks,
        expirationDate: newUrl.expirationDate,
        userId: newUrl.userId,
        QrCode: qrCodeImg,
    }
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

    let result = null;
    const cached = await redisClient.get(urlKey(shortCode));
    if (cached) {
        result = JSON.parse(cached);
    }
    if (result && Object.keys(result).length > 0) {
        if (result.expirationDate && new Date(result.expirationDate) < new Date()) {
            throw new AppError('Url Expired !!', 404);
        }
        if (!isBot) {
            void analyticsUpdates(result.id, browser, os, device, country, city).catch(console.error);
        }
        return result.originalUrl;
    }

    const url = await findFirstUrl(shortCode);

    if (!url) {
        throw new AppError('Invalid Url', 400);
    }

    if (url.expirationDate && url.expirationDate < new Date()) {
        throw new AppError('Url Expired !!', 404);
    }

    await redisClient.set(urlKey(url.shortCode), JSON.stringify({ originalUrl: url.originalUrl, id: url.id, expirationDate: url.expirationDate?.toISOString() || "", }), { EX: 3600, });

    if (!isBot) {
        void analyticsUpdates(url.id, browser, os, device, country, city).catch(console.error);
    }

    return url.originalUrl;
};

export const getMyUrl = async ({ userId }) => {
    let fetchedUrl;
    fetchedUrl = await client.url.findMany({
        where: { userId, isActive: true, isDeleted: false },
        select: {
            shortCode: true,
            originalUrl: true,
            clicks: true,
            expirationDate: true,
            createdAt: true,
            updatedAt: true,
        }
    })

    if (!fetchedUrl) {
        throw new Error("No Url Found !!");
    }
    return fetchedUrl.map(u => ({
        "short_url": `${process.env.BACKEND_URL}/${u.shortCode}`,
        "original_url": u.originalUrl,
        "clicks": u.clicks,
        "expiry_date": u.expirationDate,
        "creation_date": u.createdAt,
        "last_update_date": u.updatedAt,
        "userId": u.userId
    }));
};

export const UrlDetails = async ({ userId, shortcode }) => {
    const Url = await client.url.findFirst({
        where: { userId, shortCode: shortcode, isActive: true, isDeleted: false },
        select: {
            id: true,
            originalUrl: true,
            shortCode: true,
            expirationDate: true,
            createdAt: true,
            updatedAt: true,
            lastVisitedAt: true,
            isActive: true
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
        "short_url": `${process.env.BACKEND_URL}/${Url.shortCode}`,
        "original_url": Url.originalUrl,
        "totalClicks": totalClicks,
        "topBrowsers": formatBrowser(topBrowsers),
        "topOperatingSystems": formatOperating(topOsys),
        "topDevices": formatDevice(topDevices),
        "topCountries": formatCountry(topCountries),
        "expiry_date": Url.expirationDate,
        "creation_date": Url.createdAt,
        "last_update_date": Url.updatedAt
    }
};

export const UrlDelete = async ({ userId, shortcode }) => {
    const result = await client.url.update({
        where: { userId, shortCode: shortcode, isActive: true, isDeleted: false },
        data: {
            isDeleted: true,
            deletedAt: new Date(),
        }
    })
    if (!result) {
        throw new Error("Error happend !!");
    };
    return true;
};

export const UrlUpdate = async ({ userId, originalUrl, expirationDate, isActive, shortcode }) => {

    let updatedData = {};

    if (originalUrl) {
        if (!isValidUrl(originalUrl)) {
            throw new Error("Invalid Url");
        }

        const normalizedUrl = normalizeUrl(originalUrl);

        const urlHash = hashUrl(normalizedUrl);

        updatedData.originalUrl = originalUrl;
        updatedData.normalizedUrl = normalizedUrl;
        updatedData.urlHash = urlHash;
        updatedData.clicks = 0;
    }

    if (expirationDate !== undefined) {
        if (expirationDate && new Date(expirationDate) < new Date()) {
            throw new Error("Invalid Expiry Date");
        }

        updatedData.expirationDate = expirationDate;
    }

    if (isActive !== undefined) {
        updatedData.isActive = isActive;
    }

    if (Object.entries(updatedData).length === 0) {
        throw new Error("No fields to update");
    }

    const existing = await client.url.findFirst({
        where: { userId, shortCode: shortcode, isDeleted: false }
    })

    if (!existing) {
        throw new Error("Invalid Url");
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
        }
    });

    await redisClient.del(
        urlKey(shortcode)
    );
    return {
        "short_url": `${process.env.BACKEND_URL}/${updatedUrl.shortCode}`,
        "original_url": updatedUrl.originalUrl,
        "clicks": updatedUrl.clicks,
        "expiry_date": updatedUrl.expirationDate,
        "creation_date": updatedUrl.createdAt,
        "last_update_date": updatedUrl.updatedAt
    }
};