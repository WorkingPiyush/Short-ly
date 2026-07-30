/* eslint-disable react/prop-types */
import { useState } from "react";
import { FaWhatsapp, FaFacebook, FaInstagram, FaXTwitter, FaThreads, FaEnvelope } from "react-icons/fa6";
import { MdContentCopy } from "react-icons/md";

function ShareModal({ setStatus, link }) {
    const sharingLink = encodeURIComponent(link)
    const [copied, setCopied] = useState(false);

    const socials = [
        { icon: <FaWhatsapp size={28} />, label: "WhatsApp", url: `https://wa.me/?text=${sharingLink}`, },
        { icon: <FaFacebook size={28} />, label: "Facebook", url: `https://twitter.com/intent/tweet?url=${sharingLink}`, },
        { icon: <FaInstagram size={28} />, label: "Instagram", url: null },
        { icon: <FaXTwitter size={28} />, label: "X", url: `https://twitter.com/intent/tweet?url=${sharingLink}`, },
        { icon: <FaThreads size={28} />, label: "Threads", url: `https://www.threads.net/intent/post?text=${sharingLink}`, },
        { icon: <FaEnvelope size={28} />, label: "Email", url: `mailto:?subject=Check%20this%20out&body=${sharingLink}`, },
    ];

    const handleCopy = () => {
        if (!link) return;
        navigator.clipboard.writeText(link).catch(() => { });
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0  dark:bg-black/30 bg-white/60 flex items-center justify-center">
            <div className="md:w-170 w-95 rounded-lg bg-black md:p-8 p-5 shadow-2xl shadow-gray-900 relative">
                {/* Close Button */}
                <button onClick={() => setStatus(false)} className="absolute top-4 right-6 h-10 w-10 text-3xl rounded-sm cursor-pointer text-gray-600 transition-all delay-10 ease-in-out duration-100 hover:bg-gray-300">
                    ×
                </button>

                {/* Heading */}
                <h2 className="md:text-3xl text-2xl font-bold text-white md:mb-8 mb-5">
                    Share your Short.ly Link
                </h2>

                {/* Social Icons */}
                <div className="flex md:gap-6 gap-3 mb-10">
                    {socials.map((item, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <a href={item.url} target="_blank" className="md:w-20 md:h-20 h-8 w-8 border rounded-lg flex items-center justify-center text-white hover:bg-gray-50 hover:text-black cursor-pointer" rel="noopener noreferrer">
                                {item.icon}
                            </a>
                            <p className="md:mt-3 mt-2 md:text-sm text-xs text-white">{item.label}</p>
                        </div>
                    ))}
                </div>

                {/* Link Input */}
                <div className="border border-emerald-300 rounded-lg flex items-center justify-between overflow-hidden">
                    <input readOnly value={link} className="flex-1 md:px-5 md:py-4 px-2 py-2 md:text-xl text-sm outline-none text-white" />
                    <div className="flex px-5 py-3 gap-2 flex-wrap">
                        <button
                            onClick={handleCopy}
                            className="flex items-center md:gap-2 gap-1 cursor-pointer md:text-[13px] text-xs md:font-medium font-semibold text-zinc-900 bg-emerald-300 md:px-4 px-2 md:py-2.5 py-2 rounded-[10px] hover:bg-emerald-200 transition-all duration-150">
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
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ShareModal;