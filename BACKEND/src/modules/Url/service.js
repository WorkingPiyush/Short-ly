import dotenv from "dotenv/config";
import { client } from '../../../config/db.js';
import { generateQRCode, generateShortCode, hashUrl, isValidUrl, normalizeUrl } from '../../helper/Url.helper.js';
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

        const tempNewUrl = await client.url.create({
            data: {
                originalUrl,
                normalizedUrl,
                urlHash,
                shortCode: generateShortCode(),
                tempId,
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

    const newUrl = await client.url.create({
        data: {
            originalUrl,
            normalizedUrl,
            urlHash,
            shortCode,
            userId
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
}

export const urlRedirect = async ({shortCode}) => {
    if (!shortCode) {
        throw new Error("Invalid Url");
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

    await client.url.update({
        where: { shortCode },
        data: {
            clicks: {
                increment: 1,
            }
        }
    })

    return url.originalUrl;
}
