import { client } from '../../config/db.js';

export const findFirstUrl = async (shortCode) => {
    return await client.url.findFirst({
        where: { shortCode, isActive: true, isDeleted: false }
    })
}

export const analyticsUpdates = async (id, browser, os, device, country, city) => {
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
            }
        }),
    ]);
}

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
}

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
}
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
}
export const totalClick = (id) => {
    return client.urlRecord.count({
        where: { urlId: id },
    })
}

export const countUrl = async (tempId) => {
    await client.url.count({
        where: { tempId },
    })
};