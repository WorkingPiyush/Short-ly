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
            <div className="w-170 rounded-lg bg-black p-8 shadow-2xl shadow-gray-900 relative">
                {/* Close Button */}
                <button onClick={() => setStatus(false)} className="absolute top-4 right-6 h-10 w-10 text-3xl rounded-sm cursor-pointer text-gray-600 transition-all delay-10 ease-in-out duration-100 hover:bg-gray-300">
                    ×
                </button>

                {/* Heading */}
                <h2 className="text-3xl font-bold text-white mb-8">
                    Share your Short.ly Link
                </h2>

                {/* Social Icons */}
                <div className="flex gap-6 mb-10 ">
                    {socials.map((item, index) => (
                        <div key={index} className="text-center">
                            <a href={item.url} target="_blank" className="w-20 h-20 border rounded-lg flex items-center justify-center text-white hover:bg-gray-50 hover:text-black cursor-pointer" rel="noopener noreferrer">
                                {item.icon}
                            </a>
                            <p className="mt-3 text-sm text-white">{item.label}</p>
                        </div>
                    ))}
                </div>

                {/* Link Input */}
                <div className="border border-emerald-300 rounded-lg flex items-center justify-between overflow-hidden">
                    <input readOnly value={link} className="flex-1 px-5 py-4 text-xl outline-none text-white" />
                    <div className="flex px-5 py-3 gap-2 flex-wrap">
                        <button
                            onClick={handleCopy}
                            className="flex items-center gap-2 cursor-pointer text-[13px] font-medium text-zinc-900 bg-emerald-300 px-4 py-2.5 rounded-[10px] hover:bg-emerald-200 transition-all duration-150">
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