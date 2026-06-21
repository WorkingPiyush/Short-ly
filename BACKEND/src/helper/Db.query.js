import { client } from '../../config/db.js';
import { formatedReferrer, hashIP } from './Url.helper.js';
import crypto from 'crypto';

export const findFirstUrl = async (shortCode) => {
    return await client.url.findFirst({
        where: { shortCode, isActive: true, isDeleted: false }
    })
};
export const analyticsUpdates = async (id, browser, os, device, country, city, referrer, ipAdd) => {

    const newReferrer = formatedReferrer(referrer);
    await Promise.all([
        client.url.update({
            where: { id },
            data: {
                lastVisitedAt: new Date()
            }
        }),

        client.urlRecord.create({
            data: {
                urlId: id,
                browser,
                os,
                device,
                country,
                city,
                referrer: newReferrer,
                ipHash: hashIP(ipAdd)
            }
        }),
    ]);
};
export const urlCountUpdate = async (id) => {
    return client.url.update({
        where: { id },
        data: {
            clicks: { increment: 1 },
            lastVisitedAt: new Date()
        }
    })
};
export const topBrowser = (id) => {
    return client.urlRecord.groupBy({
        by: ["browser"],
        where: {
            urlId: id
        },
        _count: {
            browser: true,
        },
        orderBy: {
            _count: {
                browser: "desc",
            },
        },
        take: 5
    })
};
export const dailyClicks = (id, period) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    return client.$queryRaw`
    SELECT 
    ("visitedAt" AT TIME ZONE 'Asia/Kolkata')::date AS date,
    COUNT(*)::int AS clicks
    FROM "UrlRecord"
    WHERE "urlId" = ${id}
    AND "visitedAt" >= ${startDate}
    GROUP BY date
    ORDER BY date;
    `
}
export const topOs = (id) => {
    return client.urlRecord.groupBy({
        by: ["os"],
        where: {
            urlId: id
        },
        _count: {
            os: true
        },
        orderBy: {
            _count: {
                os: "desc"
            },
        },
        take: 5,
    })
};
export const topDevice = (id) => {
    return client.urlRecord.groupBy({
        by: ["device"],
        where: {
            urlId: id,
        },
        _count: {
            device: true
        },
        orderBy: {
            _count: {
                device: "desc",
            },
        },
        take: 5,
    })
};
export const topReferrer = (id) => {
    return client.urlRecord.groupBy({
        by: ["referrer"],
        where: {
            urlId: id,
        },
        _count: {
            referrer: true
        },
        orderBy: {
            _count: {
                referrer: "desc",
            },
        },
    })
};
export const topCountry = (id) => {
    return client.urlRecord.groupBy({
        by: ["country"],
        where: {
            urlId: id
        },
        _count: {
            country: true,
        },
        orderBy: {
            _count: {
                country: "desc",
            },
        },
        take: 5,
    })
};
export const totalClick = (id) => {
    return client.urlRecord.count({
        where: { urlId: id },
    })
};
export const countUrl = async (tempId) => {
    return await client.url.count({
        where: { tempId },
    })
};