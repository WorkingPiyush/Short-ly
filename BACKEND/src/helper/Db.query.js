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
};
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




// user based analytics
export const totalClicksAnalytics = async (userid, period) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    const result = await client.$queryRaw`
    SELECT
    COUNT(*)::int AS clicks
    FROM "UrlRecord" r
    JOIN "Url" u
    ON r."urlId" = u.id
    WHERE u."userId" = ${userid}
    AND r."visitedAt" >= ${startDate}
    `;
    return result[0]?.clicks ?? 0;
};

export const dailyClicksAnalytics = (userid, period) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    return client.$queryRaw`
    SELECT (r."visitedAt" AT TIME ZONE 'Asia/Kolkata')::date AS date,
    COUNT(*)::int AS clicks
    FROM "UrlRecord" r
    JOIN "Url" u
    ON r."urlId" = u.id
    WHERE u."userId" = ${userid}
    AND r."visitedAt" >= ${startDate}
    GROUP BY (r."visitedAt" AT TIME ZONE 'Asia/Kolkata')::date
    ORDER BY date;
    `;
};

export const countriesAnalytics = (userid, period) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    return client.$queryRaw`
    SELECT COALESCE(r."country",'Unknown') AS country,
    COUNT(*)::int AS clicks
    FROM "UrlRecord" r
    JOIN "Url" u
    ON r."urlId" = u.id
    WHERE u."userId" = ${userid}
    AND r."visitedAt" >= ${startDate}
    GROUP BY country
    ORDER BY clicks DESC
    LIMIT 10;
    `;
};

export const browsersAnalytics = (userid, period) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    return client.$queryRaw`
    SELECT COALESCE(r."browser",'Unknown') AS browser,
    COUNT(*)::int AS clicks
    FROM "UrlRecord" r
    JOIN "Url" u
    ON r."urlId" = u.id
    WHERE u."userId" = ${userid}
    AND r."visitedAt" >= ${startDate}
    GROUP BY browser
    ORDER BY clicks DESC;
    `;
};

export const devicesAnalytics = (userid, period) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    return client.$queryRaw`
    SELECT COALESCE(r."device",'Unknown') AS device,
    COUNT(*)::int AS clicks
    FROM "UrlRecord" r
    JOIN "Url" u
    ON r."urlId" = u.id
    WHERE u."userId" = ${userid}
    AND r."visitedAt" >= ${startDate}
    GROUP BY device
    ORDER BY clicks DESC;
    `;
};

export const osAnalytics = (userid, period) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    return client.$queryRaw`
    SELECT COALESCE(r."os",'Unknown') AS os,
    COUNT(*)::int AS clicks
    FROM "UrlRecord" r
    JOIN "Url" u
    ON r."urlId" = u.id
    WHERE u."userId" = ${userid}
    AND r."visitedAt" >= ${startDate}
    GROUP BY os
    ORDER BY clicks DESC;
    `;
};

export const mostClickedUrlsAnalytics = (userid, period) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    return client.$queryRaw`
    SELECT u.id , u."shortCode",
    COUNT(r.id)::int AS clicks
    FROM "Url" u
    LEFT JOIN "UrlRecord" r
    ON r."urlId" = u.id
    WHERE u."userId" = ${userid}
    AND (
        r."visitedAt" >= ${startDate}
        OR r."visitedAt" IS NULL
    )
    GROUP BY u.id
    ORDER BY clicks DESC
    LIMIT 5;
    `;

};
