import dotenv from "dotenv/config";
import { client } from '../../../config/db.js';
import { formatBrowser, formatClicks, formatCountry, formatDevice, formatOperating, formatUrl, foromtReferrer, generateQRCode, generateShortCode, hashUrl, isValidUrl, normalizeUrl, passwordCompare, passwordHashing, randomColor, urlKey, urlStatus } from '../../helper/Url.helper.js';
import { analyticsUpdates, findFirstUrl, topBrowser, topOs, topDevice, topCountry, countUrl, totalClick, urlCountUpdate, dailyClicks, topReferrer, totalClicksAnalytics, dailyClicksAnalytics, countriesAnalytics, browsersAnalytics, devicesAnalytics, osAnalytics, mostClickedUrlsAnalytics, referrerAnalytics, categories, getUrlStatus } from "../../helper/Db.query.js";
import { redisClient } from "../../../config/redisClient.js";
import { AppError } from "../../utils/AppError.js";
import logger from "../../../config/logger.js";
import XLSX from 'xlsx';
import fs from 'fs';
import { analyticsQueue } from "../../queues/analytics.queue.js";

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
    let qrCodeImg;
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
        qrCodeImg = await generateQRCode(existing);
        const clicks = await totalClick(existing.id);
        return {
            shortUrl: `${process.env.BACKEND_URL}/${existing.shortCode}`,
            originalUrl: existing.originalUrl,
            shorCode: existing.shortCode,
            expiry_date: existing.expirationDate,
            creation_date: existing.createdAt,
            QrCode: qrCodeImg,
            singleUse: existing.singleUse,
            totalClicks: clicks,
            isPswrdProtected: existing.password ? true : false,
            isActive: await urlStatus(existing),
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
    await redisClient.del(`Allurls:${userId}`);
    await redisClient.del(urlKey(shortCode));
    await redisClient.del(`url:${shortCode}`);
    await redisClient.del(`Allurls:${userId}`);
    await redisClient.del(`urlanalytics:${shortCode}`);
    await redisClient.del(`userAnalytics:${userId}`);
    qrCodeImg = await generateQRCode(newUrl);

    const responseUrl = {
        shortUrl: `${process.env.BACKEND_URL}/${newUrl.shortCode}`,
        shorCode: newUrl.shortCode,
        originalUrl: newUrl.originalUrl,
        isActive: await urlStatus(newUrl),
        expiry_date: newUrl.expirationDate,
        creation_date: newUrl.createdAt,
        totalClicks: await totalClick(newUrl.id),
        QrCode: qrCodeImg,
        singleUse: newUrl.singleUse,
        isPswrdProtected: newUrl.password ? true : false,
        userId: newUrl.userId,
    };

    return responseUrl;
};

export const urlRedirect = async ({ shortCode, userAgent, ipAdd, referrer }) => {
    const isBot = /(googlebot|crawler|spider|slackbot|discordbot|twitterbot|facebookexternalhit|curl|wget|bingbot|linkedinbot)/i.test(userAgent);
    if (!shortCode) {
        throw new AppError('Invalid Url', 400);
    }

    const status = await redisClient.get(`url:status:${shortCode}`);
    if (status && status !== null) {
        let res = JSON.parse(status);
        if (res.status !== "UP") {
            return { pageStatus: "Page not available", shortCode }
        };
    };

    const now = new Date();
    let result = null;
    const cached = await redisClient.get(urlKey(shortCode));
    if (cached) {
        result = JSON.parse(cached);
    };
    if (result && Object.keys(result).length > 0) {
        // console.log("cache Hit", result);
        const urlStatus = await getUrlStatus(result.originalUrl)
        if (!urlStatus.ok) {
            await redisClient.set(`url:status:${shortCode}`, JSON.stringify({ status: "DOWN", checkedAt: Date.now() }), "EX", 60,)
            return { pageStatus: "Page not available", shortCode }
        }
        await redisClient.set(`url:status:${shortCode}`, JSON.stringify({ status: "UP", statusCode: 200, checkedAt: Date.now() }), "EX", 300,)
        if (result.expirationDate && new Date(result.expirationDate) < new Date()) {
            throw new AppError('Url Expired !!', 404);
        }
        if (result.isProtected) {
            return { requiresPassword: true, shortCode: url.shortCode };
        }
        if (result.liveTime && result.liveTime > now) {
            throw new AppError("Link is not live yet", 500);
        }
        if (result.userId) {
            if (!isBot) {
                // void analyticsUpdates(result.id, browser, os, device, country, city, referrer, ipAdd).catch(console.error);
                logger.info(await analyticsQueue.getJobCounts());
                void analyticsQueue.add("click", {
                    id: result.id,
                    userAgent,
                    ipAdd,
                    referrer,
                }).catch(console.error);
            }
        } else {
            void urlCountUpdate(result.id);
        }
        return result.originalUrl;
    }
    const url = await findFirstUrl(shortCode);
    if (!url) {
        throw new AppError('Invalid Url', 400);
    }
    const urlStatus = await getUrlStatus(url.originalUrl)
    if (!urlStatus.ok) {
        await redisClient.set(`url:status:${shortCode}`, JSON.stringify({ status: "DOWN", checkedAt: Date.now() }), "EX", 60,)
        return { pageStatus: "Page not available", shortCode }
    }
    await redisClient.set(`url:status:${shortCode}`, JSON.stringify({ status: "UP", statusCode: 200, checkedAt: Date.now() }), "EX", 300,)

    if (url.liveTime && new Date() < url.liveTime) {
        throw new AppError("Link is not live yet", 500);
    }
    if (url.expirationDate && url.expirationDate < new Date()) {
        throw new AppError('Url Expired !!', 404);
    }
    if (url.password) {
        return { requiresPassword: true, shortCode: url.shortCode };
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
    await redisClient.set(urlKey(url.shortCode), JSON.stringify({ originalUrl: url.originalUrl, id: url.id, userId: url.userId, liveTime: url.liveTime, isProtected: url.password ? true : false, expirationDate: url.expirationDate?.toISOString() || "", }), "EX", 1800);

    if (!isBot) {
        // void analyticsUpdates(url.id, browser, os, device, country, city, referrer, ipAdd).catch(console.error);
        logger.info(await analyticsQueue.getJobCounts());
        void analyticsQueue.add("click", {
            id: url.id,
            userAgent,
            ipAdd,
            referrer,
        }).catch(console.error);
    }
    return url.originalUrl;
}

export const getMyUrl = async ({ userId, status = "all" }) => {
    const now = new Date();
    const queyKey = `Allurls:${userId}`;
    const cached = await redisClient.hget(queyKey, status);
    if (cached) {
        let fetchedUrl = JSON.parse(cached);
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
                    tags: u.tags,
                    category: u.category,
                }
            })
        );

    };

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
            createdAt: "desc",
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
            tags: true,
            category: true
        }
    });
    if (!fetchedUrl) {
        throw new AppError("No Url Found !!");
    }
    await redisClient.hset(queyKey, status, JSON.stringify(fetchedUrl));
    await redisClient.expire(queyKey, 600);

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
                tags: u.tags,
                category: u.category,
            }
        })
    );
};

export const UrlInfo = async ({ userId, shortCode }) => {
    if (!shortCode) {
        logger.error("shortCode not found !!");
        throw new AppError("shortCode not found !!", 404);
    };
    const queryKey = `url:${shortCode}`;
    const cached = await redisClient.get(queryKey);
    if (cached) {
        const Url = JSON.parse(cached);
        return {
            short_url: `${process.env.BACKEND_URL}/${Url.shortCode}`,
            original_url: Url.originalUrl,
            isActive: await urlStatus(Url),
            expiry_date: Url.expirationDate,
            creation_date: Url.createdAt,
            last_update_date: Url.updatedAt,
            liveTime: Url.liveTime,
            tags: Url.tags,
            categoryId: Url.categoryId,
            category: await categories(userId),
        }
    }
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
            tags: true,
            categoryId: true,
            category: true
        }
    });

    if (!Url) {
        logger.error("Url not found");
        throw new AppError('Url not found', 404);
    }

    await redisClient.set(queryKey, JSON.stringify(Url), "EX", 600);

    return {
        short_url: `${process.env.BACKEND_URL}/${Url.shortCode}`,
        original_url: Url.originalUrl,
        isActive: await urlStatus(Url),
        expiry_date: Url.expirationDate,
        creation_date: Url.createdAt,
        last_update_date: Url.updatedAt,
        liveTime: Url.liveTime,
        tags: Url.tags,
        categoryId: Url.categoryId,
        category: await categories(userId),
    }
};

export const CategoriedUrls = async ({ userId }) => {
    const data = await client.Category.findMany({
        where: { userId },
        select: {
            id: true,
            name: true,
            color: true,
            urls: {
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
                    tags: true,
                    category: true
                },
            },
        }
    });
    return Promise.all(
        data.map(async (u) => {
            return {
                categoryId: u.id,
                categoryName: u.name,
                color: u.color,
                urlCount: u.urls.length,
                url: await formatUrl(u.urls)
            }
        })
    )

};

export const UrlAnalytics = async ({ userId, shortCode, period }) => {
    if (!shortCode) {
        logger.error("shortCode not found !!");
        throw new AppError("shortCode not found !!", 404);
    };
    const queryKey = `urlanalytics:${shortCode}`;

    const cached = await redisClient.hget(queryKey, `${period}d`);
    if (cached) {
        return JSON.parse(cached);
    }

    const Url = await client.url.findFirst({
        where: { userId, shortCode, isDeleted: false },
        select: {
            id: true,
            originalUrl: true,
            shortCode: true,
        }
    });

    if (!Url) {
        logger.error("Url not found");
        throw new AppError('Url not found', 404);
    }
    const [topBrowsers, topOsys, topDevices, topCountries, totalClicks, dailyClick, referrer] = await Promise.all([
        topBrowser(Url.id, period), topOs(Url.id, period), topDevice(Url.id, period), topCountry(Url.id, period), totalClick(Url.id, period), dailyClicks(Url.id, period), topReferrer(Url.id, period)
    ])
    if (!Url) {
        throw new Error("No Url Found");
    }
    const response = {
        short_url: `${process.env.BACKEND_URL}/${Url.shortCode}`,
        original_url: Url.originalUrl,
        totalClicks: totalClicks,
        topBrowsers: formatBrowser(topBrowsers),
        topOperatingSystems: formatOperating(topOsys),
        topDevices: formatDevice(topDevices),
        topCountries: formatCountry(topCountries),
        dailyClicks: formatClicks(dailyClick),
        topReferrer: foromtReferrer(referrer)
    }

    await redisClient.hset(queryKey, `${period}d`, JSON.stringify(response));
    await redisClient.expire(queryKey, 600);
    return response;
};

export const UserAnalytics = async ({ userId, period }) => {
    const queryKey = `userAnalytics:${userId}`;
    const cached = await redisClient.hget(queryKey, `${period}d`);
    if (cached) {
        return JSON.parse(cached);
    }
    const [totalClicks, dailyClicks, totalCountries, totalBrowser, totalDevices, totalOs, totalReferrers, mostClickedUrls] = await Promise.all([
        totalClicksAnalytics(userId, period), dailyClicksAnalytics(userId, period), countriesAnalytics(userId, period), browsersAnalytics(userId, period), devicesAnalytics(userId, period),
        osAnalytics(userId, period), referrerAnalytics(userId, period), mostClickedUrlsAnalytics(userId, period)]);

    const response = {
        totalClicks: totalClicks,
        totalBrowser: totalBrowser,
        topOperatingSystems: totalOs,
        dailyClicks: formatClicks(dailyClicks),
        totalCountries: totalCountries,
        totalDevices: totalDevices,
        mostClickedUrls: mostClickedUrls,
        totalReferrers: totalReferrers
    }
    await redisClient.hset(queryKey, `${period}d`, JSON.stringify(response));
    await redisClient.expire(queryKey, 600)

    return response;
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
    await redisClient.del(urlKey(shortCode));
    await redisClient.del(`url:${shortCode}`);
    await redisClient.del(`Allurls:${userId}`);
    await redisClient.del(`urlanalytics:${shortCode}`);
    await redisClient.del(`userAnalytics:${userId}`);

    return true;
};

export const UrlUpdate = async ({ userId, originalUrl, expirationDate, isActive, shortCode, password, liveTime, tags, categoryName }) => {
    // logger.info(userId, originalUrl, expirationDate, isActive, shortCode, password, liveTime, tags, categoryName)

    let updatedData = {};
    if (originalUrl !== null && originalUrl !== undefined) {
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

    if (expirationDate !== null && originalUrl !== undefined) {
        if (expirationDate && new Date(expirationDate) < new Date()) {
            throw new Error("Invalid Expiry Date");
        }

        updatedData.expirationDate = new Date(expirationDate);
    };

    if (isActive !== null && isActive !== undefined) {
        updatedData.isActive = isActive;
    };

    if (password && password !== undefined) {
        const hashedPassword = await passwordHashing(password, 10);
        updatedData.password = hashedPassword;
    };

    if (liveTime !== null && liveTime !== undefined) {
        updatedData.liveTime = liveTime;
    };

    if (tags) {
        const existing = await client.url.findFirst({
            where: { userId, shortCode, isDeleted: false }
        });

        if (!existing) {
            throw new AppError("Invalid Url", 500);
        };

        const tagsCount = await client.url.update({
            where: {
                shortCode
            },
            data: {
                tags: {
                    set: [],
                    connectOrCreate: tags.map((tag) => ({
                        where: {
                            userId_name: {
                                userId,
                                name: tag.toLowerCase().trim(),
                            },
                        },
                        create: {
                            userId,
                            name: tag.toLowerCase().trim(),
                            color: randomColor()
                        },
                    })),
                }
            }
        });
        return tagsCount;
    };
    if (categoryName) {
        const result = client.$transaction(async (tx) => {
            const existing = await tx.url.findFirst({
                where: { userId, shortCode, isDeleted: false }
            });
            if (!existing) {
                throw new AppError("URL not found", 404);
            };
            const normalizedName = categoryName.trim().replace(/\s+/g, " ").toLowerCase();
            const category = await tx.category.upsert({
                where: {
                    userId_name: {
                        userId,
                        name: normalizedName
                    },
                },
                update: {},
                create: {
                    userId,
                    name: normalizedName,
                    color: randomColor(),
                }
            });
            await tx.url.update({
                where: { id: existing.id },
                data: {
                    categoryId: category.id,
                }
            })
            return category;
        })
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
            tags
        }
    });

    await redisClient.del(urlKey(shortCode));
    await redisClient.del(`url:${shortCode}`);
    await redisClient.del(`Allurls:${userId}`);
    await redisClient.del(`urlanalytics:${shortCode}`);
    await redisClient.del(`userAnalytics:${userId}`);

    return {
        short_url: `${process.env.BACKEND_URL}/${updatedUrl.shortCode}`,
        original_url: updatedUrl.originalUrl,
        expiry_date: updatedUrl.expirationDate,
        isPswrdProtected: updatedUrl.password ? true : false,
        Start_at: updatedUrl.liveTime,
        creation_date: updatedUrl.createdAt,
        last_update_date: updatedUrl.updatedAt,
        liveTime: updatedUrl.liveTime,
    };

    return true;
};

export const passwordVerify = async ({ password, shortCode, userAgent, ipAdd }) => {
    const url = await client.url.findUnique({
        where: { shortCode },
        select: {
            id: true,
            password: true,
            originalUrl: true
        }
    });

    let isMatch = await passwordCompare(password, url.password)
    if (!isMatch) {
        throw new AppError("Invalid password", 500);
    } else {
        void analyticsQueue.add("click", {
            id: result.id,
            userAgent,
            ipAdd,
            referrer,
        }).catch(console.error);
        return { isMatch: true, originalUrl: url.originalUrl };
    }
};

export const shortUrlBulk = async ({ filePath, userId }) => {
    try {
        let workbook;
        try {
            workbook = XLSX.readFile(filePath, {
                cellFormula: false,
                cellHTML: false,
                cellText: false,
                sheetStubs: false,
            });
        } catch {
            throw new AppError("Invalid Excel file");
        }
        if (workbook.SheetNames.length > 10) {
            throw new AppError("Too many sheets");
        }
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const range = XLSX.utils.decode_range(sheet['!ref'] || "A1");
        const cells = (range.e.r - range.s.r + 1) * (range.e.c - range.s.c + 1);

        if (cells > 100000) {
            throw new AppError("Excel contains too many cells");
        }
        const urls = [
            ...new Set(
                XLSX.utils.sheet_to_json(sheet, { header: 1 })
                    .flat()
                    .filter(
                        row =>
                            typeof row === "string" &&
                            isValidUrl(row)
                    )
                    .map(url => url.trim())
            )
        ];
        if (urls.length > 50) {
            throw new AppError("Maximum 50 URLs allowed", 400);
        }
        const finalResults = [];

        for (let i = 0; i < urls.length; i += BATCH_SIZE) {
            const batch = urls.slice(i, i + BATCH_SIZE);
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
    const queryKey = `urlQuery:${query}`;
    let fetchedUrl;
    const cached = await redisClient.hGet(queryKey, query,);
    if (cached) {
        fetchedUrl = JSON.parse(cached);
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
    }

    fetchedUrl = await client.$queryRaw`
        SELECT *,  
        GREATEST(
        similarity("originalUrl",${query}),
        similarity("shortCode",${query})
        ) AS score
        FROM "Url"
        WHERE "userId" = ${userId}
        AND (
            "originalUrl" ILIKE ${`%${query}%`}
            OR "shortCode" ILIKE ${`%${query}%`}
            OR  similarity("originalUrl",${query}) >0.3
            OR  similarity("shortCode",${query}) >0.3
        )
        ORDER BY score DESC,"createdAt" DESC
        LIMIT 10
        `;

    if (!fetchedUrl) {
        throw new AppError("No matching url found !!", 404);
    }
    await redisClient.hSet(queryKey, query, JSON.stringify(fetchedUrl));
    await redisClient.expire(queryKey, query, 1800);
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