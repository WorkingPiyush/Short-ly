import dotenv from "dotenv/config";
import XLSX from 'xlsx';
import fs from 'fs';
import slugify from 'slugify';
import { client } from '../../../config/db.js';
import { checkShortCode, formatBrowser, formatClicks, formatCountry, formatDevice, formatOperating, formatUrl, formaturlInfo, foromtReferrer, generateQRCode, generateShortCode, generateSuggestions, generateValidSuggestions, gethostname, getShortCodeAvailablity, hashUrl, isReadable, isValidUrl, keyWordExtractor, normalizeUrl, passwordCompare, passwordHashing, randomColor, rankKeyWord, urlKey, urlStatus } from '../../helper/Url.helper.js';
import { analyticsUpdates, findFirstUrl, topBrowser, topOs, topDevice, topCountry, totalClick, urlCountUpdate, dailyClicks, topReferrer, totalClicksAnalytics, dailyClicksAnalytics, countriesAnalytics, browsersAnalytics, devicesAnalytics, osAnalytics, mostClickedUrlsAnalytics, referrerAnalytics, categories, getUrlStatus, countTempUrl, findUser, countRegUrl, removeTakenSuggestions } from "../../helper/Db.query.js";
import { redisClient } from "../../../config/redisClient.js";
import { AppError } from "../../utils/AppError.js";
import logger from "../../../config/logger.js";
import { analyticsQueue } from "../../queues/analytics.queue.js";
import { fetchMetaData } from "../../service/url.metadata.service.js";
import { generateAiSuggestions } from "../../service/ai.service.js";

const MAX_TEMP_URLS = 3;
const BATCH_SIZE = 10;

export const urlShort = async ({ originalUrl, userId, tempId, singleUse, password, expiry, shortCode }) => {
    if (!originalUrl) {
        throw new AppError('Invalid Url', 400);
    }

    if (!isValidUrl(originalUrl)) {
        throw new AppError('Invalid Url', 400);
    }
    shortCode = await getShortCodeAvailablity(shortCode);
    let user;
    const normalizedUrl = normalizeUrl(originalUrl);
    const urlHash = hashUrl(normalizedUrl);
    if (userId) {
        user = await findUser(userId);
        const userPlan = user?.plan
        if (user.urls.length > (userPlan === "FREE" ? 50 : 1000)) {
            throw new AppError('Maximum URL Quota Reached', 300);
        }
    }

    if (!user) {
        let newtempId = null;

        if (!tempId) {
            newtempId = crypto.randomUUID();
            tempId = newtempId;
        }
        const tempUrlCount = await countTempUrl(tempId);
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
                shortUrl: `${process.env.REDIRECT_URL}/${existingTempUrl.shortCode}`,
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
            shortUrl: `${process.env.BACREDIRECT_URLKEND_URL}/${tempNewUrl.shortCode}`,
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
            shortUrl: `${process.env.REDIRECT_URL}/${existing.shortCode}`,
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
    qrCodeImg = await generateQRCode(newUrl);

    const responseUrl = {
        shortUrl: `${process.env.REDIRECT_URL}/${newUrl.shortCode}`,
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

export const shortCodeSuggestions = async ({ originalUrl }) => {
    if (!originalUrl) {
        throw new AppError('Invalid Url', 400);
    };

    if (!isValidUrl(originalUrl)) {
        throw new AppError('Invalid Url', 400);
    };

    let result;
    const cached = await redisClient.get(originalUrl);
    if (cached) {
        let response = JSON.parse(cached);
        result = await removeTakenSuggestions(response.localAvailableSuggestions);
        return result.slice(0, 5);
    };
    let urlMetaData = null;
    try {
        urlMetaData = await fetchMetaData(originalUrl);
    } catch (error) {
        urlMetaData = null;
        logger.error({
            url: originalUrl,
            error: error.message
        });
    }

    if (urlMetaData) {
        console.log("got url metadata")
        const titleKeyWords = keyWordExtractor(urlMetaData.title);
        const descriptionKeyWords = keyWordExtractor(urlMetaData.description);
        const hostname = gethostname(urlMetaData.hostname);
        const rankedWords = rankKeyWord(titleKeyWords, hostname, descriptionKeyWords);
        const localSuggestions = generateSuggestions(rankedWords);
        const localValidSuggestions = generateValidSuggestions(localSuggestions);
        const localAvailableSuggestions = await removeTakenSuggestions(localValidSuggestions);

        let aiSuggestions = [];

        if (localAvailableSuggestions.length < 5) {
            console.log("we are going to take ai suggestion", localAvailableSuggestions.length)
            try {
                aiSuggestions = await generateAiSuggestions({
                    title: urlMetaData.title,
                    hostname,
                    keywords: rankedWords,
                    localAvailableSuggestions,
                })

            } catch (error) {
                logger.error(error.message)
                aiSuggestions = [];
            }
            if (aiSuggestions.length > 0) {
                const mergedSuggestions = [
                    ...new Set([
                        ...localAvailableSuggestions,
                        ...aiSuggestions
                    ])
                ];
                const validSuggestions = generateValidSuggestions(mergedSuggestions);
                const availableSuggestions = await removeTakenSuggestions(validSuggestions);
                await redisClient.set(originalUrl, JSON.stringify({ availableSuggestions }, "EX", 1800,))
                return availableSuggestions.slice(0, 5);
            }
        }
        await redisClient.set(originalUrl, JSON.stringify({ localAvailableSuggestions }, "EX", 1800,))
        return localAvailableSuggestions.slice(0, 5);
    };

    const url = new URL(originalUrl);
    const hostname = gethostname(url.hostname);
    const pathWords = url.pathname.split("/").filter(Boolean).filter(isReadable);
    const suggestions = new Set();
    suggestions.add(hostname);
    if (pathWords[0]) {
        suggestions.add(`${hostname}-${pathWords[0]}`);
    }
    if (pathWords[1]) {
        suggestions.add(`${pathWords[0]}-${pathWords[1]}`);
    }
    const validSuggestions = generateValidSuggestions([...suggestions]);
    const availableSuggestions = await removeTakenSuggestions(validSuggestions);
    return availableSuggestions.slice(0, 5);
};

export const urlRedirect = async ({ shortCode, userAgent, ipAdd, referrer }) => {
    const isBot = /(googlebot|crawler|spider|slackbot|discordbot|twitterbot|facebookexternalhit|curl|wget|bingbot|linkedinbot)/i.test(userAgent);
    if (!shortCode) {
        throw new AppError('Invalid Url', 400);
    }

    const status = await redisClient.get(`url:status:${shortCode}`);
    if (status && status !== null) {
        let res = JSON.parse(status);
        if (res.status === "SERVER_ERROR") {
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
        const response = await getUrlStatus(result.originalUrl)
        const httpStatus = response.status;
        let webStatus;

        if (httpStatus >= 200 && httpStatus < 500) {
            webStatus = "ONLINE";
        }
        else if (httpStatus === 999) {
            webStatus = "ONLINE";
        }
        if (httpStatus >= 500 && httpStatus < 600) {
            webStatus = "SERVER_ERROR";
        }
        else {
            webStatus = "UNKNOWN";
        }
        await redisClient.set(`url:status:${shortCode}`, JSON.stringify({ status: webStatus, httpStatus, checkedAt: Date.now() }), "EX", 300,)

        if (webStatus === "SERVER_ERROR") {
            return {
                pageStatus: "Page not available",
                shortCode,
            };
        }
        if (result.expirationDate && new Date(result.expirationDate) < new Date()) {
            // throw new AppError('Url Expired !!', 404);
            return { expired: true, shortCode: result.shortCode, expTime: result.expirationDate }
        }
        if (result.isProtected) {
            return { requiresPassword: true, shortCode: result.shortCode };
        }
        if (result.liveTime && result.liveTime > now) {
            // throw new AppError("Link is not live yet", 500);
            return { scheduled: true, shortCode: result.shortCode, liveTime: result.liveTime };
        }
        if (result.userId) {
            if (!isBot) {
                // void analyticsUpdates(result.id, browser, os, device, country, city, referrer, ipAdd).catch(console.error);
                logger.info(await analyticsQueue.getJobCounts());
                await redisClient.del(`urlanalytics:${shortCode}`);
                await redisClient.del(`userAnalytics:${result.userId}`);
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
        // throw new AppError('Invalid Url', 400);
        return { notFound: true, shortCode: url.shortCode }
    }
    const response = await getUrlStatus(url.originalUrl)
    const httpStatus = response.status;
    let webStatus;

    if (httpStatus >= 200 && httpStatus < 500) {
        webStatus = "ONLINE";
    }
    else if (httpStatus === 999) {
        webStatus = "ONLINE";
    }
    if (httpStatus >= 500 && httpStatus < 600) {
        webStatus = "SERVER_ERROR";
    }
    else {
        webStatus = "UNKNOWN";
    }
    await redisClient.set(`url:status:${shortCode}`, JSON.stringify({ status: webStatus, httpStatus, checkedAt: Date.now() }), "EX", 300,)

    if (webStatus === "SERVER_ERROR") {
        return {
            pageStatus: "Page not available",
            shortCode,
        };
    }

    if (url.liveTime && new Date() < url.liveTime) {
        // throw new AppError("Link is not live yet", 500);
        return { scheduled: true, shortCode: url.shortCode, liveTime: url.liveTime };
    }
    if (url.expirationDate && url.expirationDate < new Date()) {
        // throw new AppError('Url Expired !!', 404);
        return { expired: true, shortCode: url.shortCode, expTime: url.expirationDate }

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
            // throw new AppError("Already used or invalid link", 400);
            return { singleUse: true, shortCode: url.shortCode }
        }

        return url.originalUrl;
    }
    await redisClient.set(urlKey(url.shortCode), JSON.stringify({ originalUrl: url.originalUrl, id: url.id, userId: url.userId, liveTime: url.liveTime, isProtected: url.password ? true : false, expirationDate: url.expirationDate?.toISOString() || "", }), "EX", 3600);

    if (!isBot) {
        // void analyticsUpdates(url.id, browser, os, device, country, city, referrer, ipAdd).catch(console.error);
        logger.info(await analyticsQueue.getJobCounts());
        await redisClient.del(`urlanalytics:${shortCode}`);
        await redisClient.del(`userAnalytics:${url.id}`);
        void analyticsQueue.add("click", {
            id: url.id,
            userAgent,
            ipAdd,
            referrer,
        }).catch(console.error);
    }
    return url.originalUrl;
}

export const getMyUrl = async ({ userId, cursor, limit, status = "all" }) => {
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
            createdAt: "desc",
        },
        take: limit + 1,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
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

    if (fetchedUrl.length === 0) {
        throw new AppError("No urls", 404);
    };

    let nxtCursor = null;
    if (fetchedUrl.length > limit) {
        const next = fetchedUrl.pop();
        nxtCursor = next.id;
    }
    let formatedUrl = await formatUrl(fetchedUrl);
    return {
        urls: formatedUrl,
        nxtCursor,
        hasNextPage: nxtCursor !== null,
        limit
    }
};

export const UrlInfo = async ({ userId, shortCode }) => {
    if (!shortCode) {
        logger.error("shortCode not found !!");
        throw new AppError("shortCode not found !!", 404);
    };
    const queryKey = `url:${shortCode}`;
    const cached = await redisClient.get(queryKey);
    if (cached) {
        return JSON.parse(cached);
    }
    const Url = await client.url.findFirst({
        where: { userId, shortCode, isDeleted: false },
        select: {
            id: true,
            originalUrl: true,
            userId: true,
            shortCode: true,
            expirationDate: true,
            createdAt: true,
            updatedAt: true,
            liveTime: true,
            lastVisitedAt: true,
            tags: true,
            isActive: true,
            categoryId: true,
            category: true,
        }
    });

    if (!Url) {
        logger.error("Url not found");
        throw new AppError('Url not found', 404);
    }
    const urlInfo = await formaturlInfo(Url);
    await redisClient.set(queryKey, JSON.stringify(urlInfo), "EX", 600);
    return urlInfo;

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
        short_url: `${process.env.REDIRECT_URL}/${Url.shortCode}`,
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
    // logger.info({ userId, originalUrl, expirationDate, isActive, shortCode, password, liveTime, tags, categoryName })

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
        const scheduleTime = new Date(liveTime);
        if (scheduleTime <= new Date()) {
            throw new Error("Schedule time must be in the future.");
        }
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
    if (Object.entries(updatedData).length === 0 && !tags && !categoryName) {
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
        short_url: `${process.env.REDIRECT_URL}/${updatedUrl.shortCode}`,
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

export const passwordVerify = async ({ password, shortCode, userAgent, ipAdd, referrer }) => {
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
            id: url.id,
            userAgent,
            ipAdd,
            referrer,
        }).catch(console.error);
        return { isMatch: true, originalUrl: url.originalUrl };
    }
};

export const shortUrlBulk = async ({ fileBuffer, userId }) => {
    let workbook;
    try {
        try {
            workbook = XLSX.read(fileBuffer, {
                type: "buffer",
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
    } catch (err) {
        console.log(err)
        throw new AppError("Invalid Input", 500);
    }
};

export const searchUrl = async ({ query, userId }) => {
    if (!query) {
        logger.error("Query not Found")
        throw new AppError("Query not Found", 404);
    };
    const queryKey = `urlQuery:${query}`;
    let fetchedUrl;
    const cached = await redisClient.hget(queryKey, query,);
    if (cached) {
        fetchedUrl = JSON.parse(cached);
        return Promise.all(
            fetchedUrl.map(async (u) => {
                const clicks = await totalClick(u.id);
                return {
                    id: u.id,
                    short_url: `${process.env.REDIRECT_URL}/${u.shortCode}`,
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
    await redisClient.hset(queryKey, query, JSON.stringify(fetchedUrl));
    await redisClient.expire(queryKey, 1800);
    return Promise.all(
        fetchedUrl.map(async (u) => {
            const clicks = await totalClick(u.id);
            return {
                id: u.id,
                short_url: `${process.env.REDIRECT_URL}/${u.shortCode}`,
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