import DeviceDetector from 'device-detector-js';
import geoip from 'geoip-lite';
import { client } from '../../config/db.js';
import logger from '../../config/logger.js';
import { formatedReferrer, hashIP } from './Url.helper.js';
import crypto from 'crypto';
const deviceDetector = new DeviceDetector();

export const findFirstUrl = async (shortCode) => {
    return await client.url.findFirst({
        where: { shortCode, isActive: true, isDeleted: false }
    })
};

export const analyticsUpdates = async (id, userAgent, ipAdd, referrer) => {
    const userInfo = deviceDetector.parse(userAgent);
    const browser = userInfo.client.name || "Unknown";;
    const os = userInfo.os?.name || "Third Client Agent";
    const device = userInfo.device?.type || "desktop";

    const ipLocation = geoip.lookup(ipAdd);
    const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
    const country = ipLocation?.country ? regionNames.of(ipLocation.country) : "Unknown";
    const city = ipLocation?.city || "Unknown";

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
    logger.info("Analytics updated");
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
export const topBrowser = (id, period) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    return client.$queryRaw`
    SELECT COALESCE("browser",'Unknown') AS browser,
    COUNT(*)::int AS clicks
    FROM "UrlRecord"
    WHERE "urlId" = ${id}
    AND "visitedAt" >= ${startDate}
    GROUP BY browser
    ORDER BY clicks DESC;
    `;
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
    `;
};
export const topOs = (id, period) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    return client.$queryRaw`
    SELECT COALESCE("os",'Unknown') AS os,
    COUNT(*)::int AS clicks
    FROM "UrlRecord"
    WHERE "urlId" = ${id}
    AND "visitedAt" >= ${startDate}
    GROUP BY os
    ORDER BY clicks DESC;
    `;
};
export const topDevice = (id, period) => {
    const startDate = new Date();
    if (period) {
        startDate.setDate(startDate.getDate() - period);
    }
    return client.$queryRaw`
    SELECT COALESCE("device",'Unknown') AS device,
    COUNT(*)::int AS clicks
    FROM "UrlRecord"
    WHERE "urlId" = ${id}
    AND "visitedAt" >= ${startDate}
    GROUP BY device
    ORDER BY clicks DESC;
    `;
};
export const topReferrer = (id, period) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    return client.$queryRaw`
    SELECT COALESCE("referrer",'Unknown') AS referrer,
    COUNT(*)::int AS clicks
    FROM "UrlRecord"
    WHERE "urlId" = ${id}
    AND "visitedAt" >= ${startDate}
    GROUP BY referrer
    ORDER BY clicks DESC;
    `;




};
export const topCountry = (id, period) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    return client.$queryRaw`
    SELECT COALESCE("country",'Unknown') AS country,
    COUNT(*)::int AS clicks
    FROM "UrlRecord"
    WHERE "urlId" = ${id}
    AND "visitedAt" >= ${startDate}
    GROUP BY country
    ORDER BY clicks DESC;
    `;
};

export const totalClick = (id) => {
    return client.urlRecord.count({
        where: { urlId: id, },
    })

};
export const countUrl = async (tempId) => {
    return await client.url.count({
        where: { tempId },
    })
};

export const userDetails = async (id) => {
    return await client.user.findUnique({
        where: { id },
        select: {
            role: true,
            profileImage: true,
            plan: true,
            phone: true,
            location: true,
            lastLoginAt: true,
            id: true,
            headline: true,
            createdAt: true,
            email: true,
            bio: true,
            address: true,
            name: true,
        }
    })
};

export const createUser = async (name, email, hashedPassword) => {
    return await client.user.create({
        data: {
            name: name,
            email,
            password: hashedPassword
        }
    })
}
export const findUser = async (id) => {
    return await client.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            profileImage: true,
            role: true,
            headline: true,
            location: true,
            bio: true,
            location: true,
            plan: true,
            createdAt: true,
            isVerified: true,
            address: true,
        }
    })
};

export const stats = async (id) => {
    const now = new Date();
    const [linksCount, linksClickCount, activeLinksCount, monthlyLinks] = await Promise.all([
        await client.$queryRaw`
    SELECT
    COUNT(*)::int AS count
    FROM "Url" u
    WHERE u."userId" = ${id};
    `,
        await client.$queryRaw`
    SELECT
    COUNT(*)::int AS clicks
    FROM "UrlRecord" r
    JOIN "Url" u
    ON r."urlId" = u.id
    WHERE u."userId" = ${id};
    `,
        await client.$queryRaw`
    SELECT
    COUNT(*)::int AS count
    FROM "Url" u
    WHERE u."userId" = ${id}
    AND u."isDeleted" = false
    AND(
         u."liveTime" IS NULL
         OR u."liveTime" <= ${now}
    )
    AND u."expirationDate">${now}
    AND NOT ( u."singleUse" AND u."used");`,

        await client.$queryRaw`
    SELECT
    COUNT(*)::int AS count
    FROM "Url" u
    WHERE u."userId" = ${id}
    AND u."createdAt" >= DATE_TRUNC('month', CURRENT_DATE)
    AND u."createdAt" < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month';`,
    ]);
    return { linksCount: linksCount[0]?.count ?? 0, linksClickCount: linksClickCount[0]?.clicks ?? 0, activeLinksCount: activeLinksCount[0]?.count ?? 0, monthlyLinks: monthlyLinks[0]?.count ?? 0 }
};

export const categories = async (id) => {
    return await client.category.findMany({
        where: { userId: id },
    })
}

export const getUrlStatus = async (url) => {
    return await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: AbortSignal.timeout(3000),
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138.0.0.0 Safari/537.36"
        }
    })
}

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

export const referrerAnalytics = (userid, period) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - period);

    return client.$queryRaw`
    SELECT COALESCE(r."referrer",'Unknown') AS referrer,
    COUNT(*)::int AS clicks
    FROM "UrlRecord" r
    JOIN "Url" u
    ON r."urlId" = u.id
    WHERE u."userId" = ${userid}
    AND r."visitedAt" >= ${startDate}
    GROUP BY referrer
    ORDER BY clicks DESC;    
    `;

}

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
