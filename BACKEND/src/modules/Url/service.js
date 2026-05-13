import dotenv from "dotenv/config";
import { client } from '../../../config/db.js';
import qrcode from 'qrcode';
import { generateShortCode, hashUrl, isValidUrl, normalizeUrl } from '../../helper/Url.helper.js';


export const urlShort = async ({ originalUrl, userId = null }) => {
    if (!originalUrl) {
        throw new Error('Invalid Url');
    }

    if (!isValidUrl(originalUrl)) {
        throw new Error('Invalid Url');
    }

    const normalizedUrl = normalizeUrl(originalUrl);

    const urlHash = await hashUrl(normalizedUrl);

    const existing = await client.Url.findUnique({
        where: { urlHash, },
    })

    if (existing) {
        return {
            originalUrl: existing.originalUrl,
            shortUrl: `${process.env.BACKEND_URL}/${existing.shortcode}`,
            clicks: existing.clicks,
            expirationDate: existing.expirationDate,
            userId: existing.userId,
        }
    }

    let shortcode;
    let shortcodeExits = true;

    while (shortcodeExits) {
        shortcode = generateShortCode();
        shortcodeExits = await client.Url.findUnique({
            where: { shortcode, },
        })
    }
    const newUrl = await client.Url.create({
        data: {
            originalUrl,
            normalizedUrl,
            urlHash,
            shortcode,
            userId
        }
    })
    const qrCodeImg = await qrcode.toDataURL(`${process.env.BACKEND_URL}/${newUrl.shortcode}`);
    const responseUrl = {
        originalUrl: newUrl.originalUrl,
        shortUrl: `${process.env.BACKEND_URL}/newUrl.shortcode`,
        clicks: newUrl.clicks,
        expirationDate: newUrl.expirationDate,
        userId: newUrl.userId,
        QrCode: qrCodeImg
    }
    return responseUrl;
}

