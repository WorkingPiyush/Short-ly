import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { createUrl } from '../../Api/Url';

function CreateLink() {
    const inputRef = useRef();
    const location = useLocation();
    const navigate = useNavigate();
    const [shortUrl, setShortUrl] = useState();
    const [url, setUrl] = useState("");
    const [singleUse, setSingleUse] = useState(false);

    useEffect(() => {
        if (location.state?.focustInput) {
            inputRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            })
            inputRef.current?.focus();
            navigate(location.pathname, {
                replace: true,
                state: {},
            });
        }

    }, [location, navigate])

    const isValidUrl = (url) => {
        try {
            const parsedUrl = new URL(url);
            const allowedProtocols = ["http:", "https:"];
            return allowedProtocols.includes(parsedUrl.protocol);
        } catch {
            return false;
        }
    };
    const sendShortUrl = async (url) => {
        if (!isValidUrl(url)) {
            toast.error("Invalid Url");
            return;
        }
        try {
            const response = await createUrl({ originalUrl: url, singleUse });
            setShortUrl(response.shortUrl)
        } catch (error) {
            toast.error(error.response.data.message || "Backend Url Issue");
            console.error(error.response.data.message);
        }
    };

    return (
        <div className='max-w-xl mx-auto my-20'>
            <h1>Link Details: </h1>
            <form onSubmit={(e) => { e.preventDefault(); sendShortUrl(url); }} className="space-y-4">
                <div>
                    <label htmlFor="destination-url" className="block mb-2 font-medium">
                        Destination URL
                    </label>
        
                    <div className="flex flex-col md:flex-row gap-3">
                        <input
                            ref={inputRef}
                            id="destination-url"
                            type="url"
                            placeholder="https://your-long-url.com"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="flex-1 px-6 py-3 rounded-xl border border-zinc-600 bg-zinc-100/20 outline-none focus:ring-1 focus:ring-emerald-300 transition" />
                        <button type="submit" className="px-6 py-3 rounded-xl cursor-pointer bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition">
                            Shorten URL
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        id="singleUse"
                        checked={singleUse}
                        onChange={(e) => setSingleUse(e.target.checked)}
                        className="h-4 w-4 cursor-pointer"
                    />

                    <label htmlFor="singleUse" className="cursor-pointer select-none" >
                        Single-use URL
                    </label>
                </div>
            </form>
        </div>
    )
}

export default CreateLink
