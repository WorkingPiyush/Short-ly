import { getShortSuggestions } from "@/Api/Url";
import { useState } from "react";
import toast from "react-hot-toast";

// eslint-disable-next-line react/prop-types
export default function ShortCodeSuggestions({ url, disabled, setShortCode, shortCode, showSuggestions, setShowSuggestions }) {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const isValidUrl = (url) => {
        try {
            const parsedUrl = new URL(url);
            const allowedProtocols = ["http:", "https:"];
            return allowedProtocols.includes(parsedUrl.protocol);
        } catch {
            return false;
        }
    };
    const handleGenerateSuggestions = async () => {
        // eslint-disable-next-line react/prop-types
        if (!isValidUrl(url.trim())) {
            toast.error("Invalid Url");
            return;
        }
        setLoading(true);
        setShowSuggestions(true);
        try {
            const data = await getShortSuggestions({ originalUrl: url });
            setSuggestions(data);
        } catch (err) {
            console.error("Failed to fetch suggestions:", err);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (code) => {
        setShortCode(code);
        setShowSuggestions(false);
    };

    return (
        <div className="flex flex-col gap-1.5 mt-1">
            <label className="text-[12px] font-medium dark:text-white/50">
                Short Code <span className="text-white/40">(Optional)</span>
            </label>

            <div className="flex gap-3">
                <input
                    type="text"
                    disabled={disabled}
                    value={shortCode}
                    onChange={(e) => setShortCode(e.target.value)}
                    placeholder="e.g. my-link"
                    className="w-full dark:bg-white/4 bg-black/15 border dark:border-white/10 border-black/50 rounded-xl
                  pl-5 pr-4 py-3.5 text-sm dark:text-white text-black dark:placeholder-white/22 placeholder-gray-600
                  outline-none focus:border-emerald-300/40 dark:focus:bg-emerald-300/2 focus:bg-black/5
                  transition-all duration-200 disabled:opacity-50"
                />

                <button
                    onClick={handleGenerateSuggestions}
                    disabled={loading || disabled}
                    className="px-5 py-2.5 cursor-pointer rounded-xl border border-emerald-300/50 text-emerald-300
                     font-medium text-sm hover:bg-emerald-300/10 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {loading ? "Generating..." : "Generate Suggestions"}
                </button>
            </div>

            {showSuggestions && (
                <div className="flex flex-wrap gap-2 pt-1">
                    {loading ? (
                        <span className="text-xs text-white/40">Fetching suggestions…</span>
                    ) : suggestions.length > 0 ? (
                        suggestions.map((code) => (
                            <button
                                key={code}
                                onClick={() => handleSelect(code)}
                                className="px-3 py-1.5 mb-1 rounded-lg text-xs font-medium
                           bg-emerald-300/10 border border-emerald-300/30
                           text-emerald-200 hover:bg-emerald-300/20
                           hover:border-emerald-300/50 transition-colors"
                            >
                                {code}
                            </button>
                        ))
                    ) : (
                        <span className="text-xs text-white/40">No suggestions available.</span>
                    )}
                </div>
            )}
        </div>
    );
}