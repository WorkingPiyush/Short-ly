import React, { useState } from 'react'
import ShorturlResult from './ShorturlResult';
import toast from 'react-hot-toast';
import { createUrl } from '../Api/Url';
import { IoIosLink } from 'react-icons/io';

function UrlShotenBox() {
    const [shortUrl, setShortUrl] = useState();
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);

    const isValidUrl = (url) => {
        try {
            const parsedUrl = new URL(url);
            const allowedProtocols = ["http:", "https:"];
            return allowedProtocols.includes(parsedUrl.protocol);
        } catch {
            return false;
        }
    }
    const sendShortUrl = async () => {
        if (!isValidUrl(url)) {
            toast.error("Invalid Url");
            return;
        }
        try {
            setLoading(true);
            const response = await createUrl({ originalUrl: url });
            setShortUrl(response.shortUrl)
        } catch (error) {
            toast.error(error.response.data.message || "Backend Url Issue");
            console.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className='w-full max-w-2xl mx-auto p-0.5 rounded-2xl bg-linear-to-r from-zinc-700/40 to-zinc-500/20 mt-8'>
                <div className="flex gap-2.5 p-2">
                    <div className="relative flex-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-white/25 text-black pointer-events-none">
                            <IoIosLink />
                        </span>
                        <input
                            type="url"
                            value={url}
                            autoComplete="url"
                            onChange={(e) => setUrl(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendShortUrl()}
                            placeholder="https://your-long-url.com"
                            disabled={Boolean(shortUrl)}
                            className="w-full dark:bg-white/4 bg-black/15 border dark:border-white/10 border-black/50 rounded-xl
                                      pl-10 pr-4 py-3.5 text-sm dark:text-white text-black dark:placeholder-white/22 placeholder-gray-600
                                      outline-none focus:border-emerald-300/40 dark:focus:bg-emerald-300/2 focus:bg-black/5
                                      transition-all duration-200 disabled:opacity-50"
                        />
                    </div>
                    <button
                        onClick={sendShortUrl}
                        disabled={Boolean(shortUrl) || !url.trim() || loading}
                        className="text-sm font-medium text-zinc-900 bg-emerald-300 px-5 py-3.5
                                    rounded-xl hover:bg-emerald-400 cursor-pointer hover:scale-[1.02] transition-all duration-150
                                    disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
                                    dark:disabled:hover:bg-emerald-300 disabled:hover:bg-emerald-500 disabled:text-zinc-900 shrink-0 whitespace-nowrap">
                        Shorten URL
                    </button>
                </div>
            </div>
            {shortUrl && <ShorturlResult shortUrl={shortUrl} setShortUrl={setShortUrl} placeholderUrl={setUrl} />}
        </>
    )
}

export default UrlShotenBox
