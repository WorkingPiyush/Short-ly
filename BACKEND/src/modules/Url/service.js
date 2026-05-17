import dotenv from "dotenv/config";
import { client } from '../../../config/db.js';
import { generateQRCode, generateShortCode, hashUrl, isValidUrl, normalizeUrl, urlKey } from '../../helper/Url.helper.js';
import { redisClient } from "../../../config/redisClient.js";
const MAX_TEMP_URLS = 3;

export const urlShort = async ({ originalUrl, userId, tempId }) => {

    if (!originalUrl) {
        throw new Error('Invalid Url');
    }

    if (!isValidUrl(originalUrl)) {
        throw new Error('Invalid Url');
    }

    const normalizedUrl = normalizeUrl(originalUrl);

    const urlHash = hashUrl(normalizedUrl);

    if (!userId) {
        let newtempId = null;

        if (!tempId) {
            newtempId = crypto.randomUUID();
            tempId = newtempId;
        }
        const tempUrlCount = await client.url.count({
            where: { tempId },
        })

        if (tempUrlCount >= MAX_TEMP_URLS) {
            throw new Error("Signup required");
        }

        const existingTempUrl = await client.url.findFirst({
            where: {
                urlHash,
                userId: null,
            }
        })
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

export const urlRedirect = async ({ shortCode }) => {

    if (!shortCode) {
        throw new Error("Invalid Url");
    }

    const cached = await redisClient.get(urlKey(shortCode));
    const result = JSON.parse(cached);

    if (result && Object.keys(result).length > 0) {
        if (result.expirationDate && new Date(result.expirationDate) < new Date()) {
            throw new Error("Url Expired !!");
        }

        client.url.update({
            where: { shortCode },
            data: {
                clicks: {
                    increment: 1,
                }
            }
        }).catch(console.error)

        return result.originalUrl;
    }

    const url = await client.url.findUnique({
        where: { shortCode }
    })

    if (!url) {
        throw new Error("Invalid Url");
    }

    if (url.expirationDate && url.expirationDate < new Date()) {
        throw new Error("Url Expired !!");
    }

    await redisClient.set(urlKey(url.shortCode), JSON.stringify({ originalUrl: url.originalUrl, expirationDate: url.expirationDate?.toISOString() || "", }), { EX: 3600, });
    client.url.update({
        where: { shortCode },
        data: {
            clicks: {
                increment: 1,
            }
        }
    }).catch(console.error);

    return url.originalUrl;
};

export const getMyUrl = async ({ userId }) => {
    let fetchedUrl;
    fetchedUrl = await client.url.findMany({
        where: { userId },
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
        "last_update_date": u.updatedAt
    }));
};

export const UrlDetails = async ({ userId, shortcode }) => {

    const Url = await client.url.findUnique({
        where: { userId, shortCode: shortcode },
        select: {
            originalUrl: true,
            shortCode: true,
            clicks: true,
            expirationDate: true,
            createdAt: true,
            updatedAt: true,
        }
    });
    if (!Url) {
        throw new Error("No Url Found");
    }
    return {
        "short_url": `${process.env.BACKEND_URL}/${Url.shortCode}`,
        "original_url": Url.originalUrl,
        "clicks": Url.clicks,
        "expiry_date": Url.expirationDate,
        "creation_date": Url.createdAt,
        "last_update_date": Url.updatedAt
    }
}

export const UrlDelete = async ({ userId, shortcode }) => {
    const result = await client.url.delete({
        where: { userId, shortCode: shortcode },
    })
    console.log(result)
}