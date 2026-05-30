import React, { useState } from 'react'
import ShorturlResult from './ShorturlResult';
import toast from 'react-hot-toast';
import { createUrl } from '../Api/Url';

function UrlShotenBox() {
    const [shortUrl, setShortUrl] = useState();
    const [url, setUrl] = useState("");

    const isValidUrl = (url) => {
        try {
            const parsedUrl = new URL(url);
            const allowedProtocols = ["http:", "https:"];
            return allowedProtocols.includes(parsedUrl.protocol);
        } catch {
            return false;
        }
    }
    const sendShorurl = async (url) => {
        if (!isValidUrl(url)) {
            toast.error("Invalid Url");
            return;
        }
        try {
            const response = await createUrl({ originalUrl: url });
            setShortUrl(response.shortUrl)
        } catch (error) {
            toast.error(error.response.data.message || "Backend Url Issue");
            console.error(error.response.data.message);
        }
    };

    return (
        <>
            <div className='w-full max-w-2xl mx-auto p-0.5 rounded-2xl bg-linear-to-r from-zinc-700/40 to-zinc-500/20 mt-8'>
                <div className='flex items-center gap-2 bg-[#0f0f0f] rounded-xl p-2'>
                    <input type="text"
                        placeholder='Enter your link'
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className='flex-1 bg-gray-200/20 dark:bg-gray-300/20 text-white placeholder:text-white/60 
                     px-5 py-2 rounded-sm outline-none border border-zinc-700/50
                     focus:border-zinc-500 transition'
                    />
                    <button onClick={() => sendShorurl(url)} className="px-5 py-3 md:py-2.5 rounded-xl border border-zinc-600 
                           text-zinc-200 hover:bg-zinc-800 transition cursor-pointer text-xs md:text-sm">
                        Shorten it
                    </button>
                </div>
            </div>
            {shortUrl && <ShorturlResult shortUrl={shortUrl} />}
        </>
    )
}

export default UrlShotenBox
