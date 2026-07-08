import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';
import { IoIosLink } from "react-icons/io";
import { Eye, EyeOff } from 'lucide-react';
import { MdContentCopy } from "react-icons/md";
import { createUrl } from '../Api/Url';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Toggle from './Toggle';
import '../index.css'



function CTAUrlbox() {
    const inputRef = useRef();
    const location = useLocation();
    const navigate = useNavigate();
    const [url, setUrl] = useState("");
    const [expiry, setExpiry] = useState("");
    const [singleUse, setSingleUse] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [userPassword, setUserPassword] = useState("");
    const [passwordProtect, setPasswordProtect] = useState(false);
    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState(false);

    const isValidUrl = (url) => {
        try {
            const parsedUrl = new URL(url);
            const allowedProtocols = ["http:", "https:"];
            return allowedProtocols.includes(parsedUrl.protocol);
        } catch {
            return false;
        }
    };

    const handleShorten = async () => {
        if (!isValidUrl(url.trim())) {
            toast.error("Invalid Url");
            return;
        }
        try {
            const response = await createUrl({ originalUrl: url, singleUse, password: userPassword, expiry });
            setResult(response.shortUrl)
            setResult({
                short: response.shortUrl,
                expiry: response.expiry_date,
                singleUse: response.singleUse,
                passwordProtect: response.isPswrdProtected,
                qrCode: response.QrCode,
            })
        } catch (error) {
            toast.error(error.response.data.message || "Backend Url Issue");
            console.error(error.response.data.message);
        }
    };

    const handleCopy = () => {
        if (!result) return;
        navigator.clipboard.writeText(result.short).catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleReset = () => {
        setUrl("");
        setExpiry("");
        setSingleUse(false);
        setPasswordProtect(false);
        setResult(null);
        setCopied(false);
    };
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: "2-digit",
            month: "long",
            year: "numeric",
        })
    }
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
    return (
        <div className="min-h-screen  dark:text-black text-black dark:bg-[#0a0a0a] px-4 py-10 flex items-start justify-center">
            <div className="w-full max-w-xl md:max-w-3xl">

                {/* Header */}
                <div className="mb-7">
                    <div className='inline-flex items-center gap-2 px-5 py-1 mb-2 rounded-full bg-linear-to-r from-emerald-500/10 to-emerald-400/5 border border-emerald-400/20 text-emerald-300 text-xs font-medium shadow-[0_0_20px_rgba(16,185,129,0,0.15)] md:text-sm'>
                        <span className="w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_8px_#6ee7b7aa]" />
                        <span>URL Shortener</span>
                    </div>

                    <h1 className="font-extrabold text-[26px] tracking-tight dark:text-white text-black mb-1.5"
                        style={{ fontFamily: "'Syne', sans-serif" }}>
                        Create Short Link
                    </h1>
                    <p className="text-[15px] dark:text-white/40 text-black leading-relaxed">
                        Paste a long URL and get a clean, trackable short link instantly.
                    </p>
                </div>

                {/* Form card */}
                <div className="bg-black/6 border border-white/8 rounded-2xl p-8 md:p-7">
                    {/* URL input + button */}
                    <div className="flex gap-2.5 mb-4">
                        <div className="relative flex-1">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-white/25 text-black pointer-events-none">
                                <IoIosLink />
                            </span>
                            <input
                                ref={inputRef}
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleShorten()}
                                placeholder="https://your-long-url.com"
                                disabled={Boolean(result)}
                                className="w-full dark:bg-white/4 bg-black/15 border dark:border-white/10 border-black/50 rounded-xl
                  pl-10 pr-4 py-3.5 text-sm dark:text-white text-black dark:placeholder-white/22 placeholder-gray-600
                  outline-none focus:border-emerald-300/40 dark:focus:bg-emerald-300/2 focus:bg-black/5
                  transition-all duration-200 disabled:opacity-50"/>
                        </div>
                        <button
                            onClick={handleShorten}
                            disabled={Boolean(result) || !url.trim()}
                            className="text-sm font-medium text-zinc-900 bg-emerald-300 px-5 py-3.5
                rounded-xl hover:bg-emerald-400 cursor-pointer hover:scale-[1.02] transition-all duration-150
                disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100
                dark:disabled:hover:bg-emerald-300 disabled:hover:bg-emerald-500 disabled:text-zinc-900 shrink-0 whitespace-nowrap">
                            Shorten UR
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="h-px dark:bg-white/6 bg-black/50 my-5" />

                    {/* Advanced options */}
                    <p className="text-[11px] font-medium dark:text-white/30 tracking-widest uppercase mb-4">
                        Advanced options
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                        {/* 
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-medium text-white/50">
                                Custom slug <span className="text-white/25">(optional)</span>
                            </label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="e.g. my-link"
                                disabled={Boolean(result)}
                                className="bg-white/3 border border-white/8 rounded-[10px]
                  px-3 py-2.5 text-[13px] text-white placeholder-white/20
                  outline-none focus:border-emerald-300/35 transition-colors duration-200
                  disabled:opacity-40"
                            />
                        </div>
                        */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[12px] font-medium dark:text-white/50">
                                Expiry date <span className="dark:text-white/25">(optional)</span>
                            </label>
                            <input
                                type="date"
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                disabled={Boolean(result)}
                                className="dark:bg-white/3 border text-black dark:border-white/8 border-black/20 rounded-[10px]
                  px-3 py-2.5 text-[13px] dark:text-white/70
                  outline-none dark:focus:border-emerald-300/35 transition-colors duration-200
                  disabled:opacity-40 dark:scheme-dark" />
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="flex flex-wrap gap-x-6 gap-y-3">
                        <Toggle checked={singleUse} onChange={setSingleUse} label="Single-use URL" />
                        <Toggle checked={passwordProtect} onChange={setPasswordProtect} label="Password protect" />
                    </div>
                    {passwordProtect && (
                        <>
                            <div className='relative flex justify-start items-center py-4'>
                                <input
                                    type={`${showPassword ? "text" : "password"}`}
                                    value={userPassword}
                                    onChange={(e) => setUserPassword(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleShorten()}
                                    placeholder="Password for Url Protection"
                                    disabled={Boolean(result)}
                                    className="w-full max-w-sm dark:bg-white/4 bg-black/10 border dark:border-white/10 border-black/10 rounded-xl
                   pl-10 py-3.5 text-sm dark:text-white dark:placeholder-white/22 placeholder-black
                  outline-none transition-all duration-200 disabled:opacity-50"/>

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute left-84 translate-y-0 h-12 w-12 rounded-xl border border-zinc-700
                           flex items-center justify-center text-zinc-800
                           dark:text-zinc-400 hover:text-black hover:dark:text-white cursor-pointer transition-all delay-150 ease-in"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </>
                    )
                    }
                    {/* Result box */}
                    {result && (
                        <div className="relative mt-5 dark:bg-emerald-300/5 bg-zinc-100 border dark:border-emerald-300/25 border-black/22
              rounded-2xl p-5 animate-slide-down">
                            <p className="text-[11px] font-medium dark:text-emerald-300 text-emerald-600 tracking-widest uppercase mb-3">
                                ✦ Your short link is ready
                            </p>
                            <p className="font-extrabold text-[20px] dark:text-white tracking-tight break-all mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                                {result.short}
                            </p>
                            <div className='h-30 w-30 absolute top-5 right-5 rounded-xl cursor-pointer shadow shadow-white'>
                                <img src={result.qrCode} className='h-30 w-30 rounded-xl' alt="" />
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-2 text-[13px] font-medium text-zinc-900
                    dark:bg-emerald-300 bg-emerald-500 px-4 py-2.5 rounded-[10px] dark:hover:bg-emerald-200 hover:bg-emerald-300 cursor-pointer transition-all duration-150"
                                >
                                    {copied ? (
                                        <>
                                            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2"
                                                strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                                                <path d="M2 8l4 4 8-8" />
                                            </svg>
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <MdContentCopy />
                                            Copy link
                                        </>
                                    )}
                                </button>

                                <button
                                    onClick={handleReset}
                                    className="text-[13px] font-medium dark:text-white/50 text-zinc-800 dark:bg-white/5 bg-black/26 border dark:border-white/10
                    px-4 py-2.5 rounded-[10px] dark:hover:text-white dark:hover:bg-white/9 transition-all duration-200" >
                                    Shorten another
                                </button>

                                <Link
                                    to="/dashboard/links"
                                    className="text-[13px] font-medium dark:text-emerald-300/70 bg-transparent border dark:border-emerald-300/20 border-black/20
                    px-4 py-2.5 rounded-[10px] dark:hover:text-emerald-300 hover:text-gray-700 dark:hover:border-emerald-300/40 hover:border-zinc-600 transition-all duration-200"
                                >
                                    View all links →
                                </Link>
                            </div>
                            {/* Meta tags */}
                            {(result.expiry || result.singleUse || result.trackClicks || result.passwordProtect) && (
                                <div className="flex gap-4 flex-wrap mt-4 pt-4 border-t border-white/[0.07]">
                                    {result.expiry && (
                                        <span className="flex items-center gap-1.5 text-[12px] dark:text-white/30 text-black">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" className="w-3.5 h-3.5 opacity-50">
                                                <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
                                            </svg>
                                            Expires <span className="dark:text-white/55 text-zinc-700 font-medium ml-0.5">{formatDate(result.expiry)}</span>
                                        </span>
                                    )}
                                    {result.singleUse && (
                                        <span className="flex items-center gap-1.5 text-[12px] text-white/30">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" className="w-3.5 h-3.5 opacity-50">
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </svg>
                                            <span className="dark:text-white/55 text-zinc-700 font-medium ml-0.5">Single-use</span>
                                        </span>
                                    )}
                                    {result.trackClicks && (
                                        <span className="flex items-center gap-1.5 text-[12px] text-white/30">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" className="w-3.5 h-3.5 opacity-50">
                                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                                            </svg>
                                            <span className="dark:text-white/55 text-zinc-700 font-medium ml-0.5">Click tracking on</span>
                                        </span>
                                    )}
                                    {result.passwordProtect && (
                                        <span className="flex items-center gap-1.5 text-[12px] text-white/30">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                                                strokeLinecap="round" className="w-3.5 h-3.5 opacity-50">
                                                <rect x="3" y="11" width="18" height="11" rx="2" />
                                                <path d="M7 11V7a5 5 0 0110 0v4" />
                                            </svg>
                                            <span className="dark:text-white/55 text-zinc-700 font-medium ml-0.5">Password protected</span>
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CTAUrlbox
