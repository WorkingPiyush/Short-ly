import * as cheerio from 'cheerio';
import { AppError } from '../utils/AppError.js';

export async function fetchMetaData(url) {
    const res = await fetch(url, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
        signal: AbortSignal.timeout(5000),
    })
    if (!res.ok) {
        return null
    }
    const html = await res.text();
    const $ = cheerio.load(html);
    const title = $("meta[property='og:title']").attr("content") || $("title").text().trim() || "";
    const description = $("meta[property='og:description']").attr("content") || $("meta[name='description']").attr("content") || "";
    const image = $("meta[property='og:image']").attr("content") || "";
    const favicon = $("link[rel='icon']").attr("href") || $("link[rel='shortcut icon']").attr("href") || "/favicon.ico";
    return {
        title,
        description,
        image: image ? new URL(image, url).href : null,
        favicon: new URL(favicon, url).href,
        hostname: new URL(url).hostname,
    };
}