import { useState } from "react";

// eslint-disable-next-line react/prop-types
export default function CopyButton({ text, status }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(text).catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <button
            onClick={handleCopy}
            aria-label="Copy short link"
            className={`flex items-center justify-center w-7 h-7 rounded-[7px] border text-xs
        transition-all duration-150 shrink-0
        ${copied ? `bg-emerald-300/20 border-emerald-300/40  text-emerald-300` : `bg-emerald-300/10 border-emerald-300/25 text-emerald-300 hover:bg-emerald-300/20 `}`}
        >
            {copied ? (
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <path d="M2 8l4 4 8-8" />
                </svg>
            ) : (
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <rect x="5" y="5" width="8" height="8" rx="1.5" />
                    <path d="M3 11V3h8" />
                </svg>
            )}
        </button>
    );
}