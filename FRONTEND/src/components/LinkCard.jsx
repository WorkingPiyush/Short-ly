import { Link, useNavigate } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";
import { CiShare2 } from "react-icons/ci";
import { SiSimpleanalytics } from "react-icons/si";
import { BsThreeDotsVertical } from "react-icons/bs";
import { PiCursorClick } from "react-icons/pi";
import { IoIosUnlock } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import ActionButton from "./Actionbtns";
import CopyButton from "./CopyBtn";
import ShareModal from "./ShareLink";
import { useState } from "react";

/* eslint-disable react/prop-types */
function LinkCard({ link }) {
    const [shareSocial, setShareSocial] = useState(false);
    const formatedDate = (input) => {
        return new Date(input)?.toLocaleString("en-In", {
            year: "numeric",
            month: "short",
            day: "2-digit"
        })
    };
    const navigate = useNavigate();

    return (
        <div
            className={`border rounded-2xl p-5 transition-all duration-200
        ${link.isActive === "expired" ? "bg-white/1.5 border-white/6 hover:border-white/10" : link.isActive === "used" ?
                    "bg-white/1 border-white/6 hover:border-white/10" : "bg-white/3 border-white/8 hover:bg-white/5 hover:border-white/[0.14]"
                }`}>
            {/* Top row */}
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                    <p className={`font-bold text-[15px] truncate mb-1.5 tracking-tight ${link.isActive === "expired" ? "text-white/35" : link.isActive === "used" ? "text-gray-300/10" : "text-white"}`}
                        style={{ fontFamily: "'Syne', sans-serif" }}>
                        {link.original_url}
                    </p>
                    <div className="flex items-center gap-2">
                        <Link to={link.short_url} target="_blank" className={`text-[13px] font-medium transition-colors ${link.isActive === "expired" ? "text-emerald-300/35" : link.isActive === "used" ? "text-gray-400 hover:text-gray-200/35" : "text-emerald-300 hover:text-emerald-200"}`} >
                            {link.short_url}
                        </Link>
                        <CopyButton text={link.short_url} status={link.isActive} />
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-0.5 shrink-0">
                    <ActionButton
                        panelChange={`/dashboard/links/${link.short_code}`}
                        label="Edit"
                        disable={link.isActive}
                        icon={<MdModeEdit />}
                    />
                    <button
                        onClick={() => setShareSocial(true)}
                        aria-label="Share"
                        disabled={link.isActive === "used" ? true : link.isActive === "expired" ? true : false}
                        className="flex items-center cursor-pointer justify-center w-8 h-8 rounded-lg bg-transparent hover:border hover:border-white/10 text-white/30 hover:text-white/80 hover:bg-white/[0.07] disabled:cursor-not-allowed  transition-all duration-200">
                        <CiShare2 />
                    </button>
                    <button
                        onClick={() => navigate(`/${link.short_code}/analytics`)}
                        aria-label="Analytics"
                        disabled={link.isActive === "used" ? true : link.isActive === "expired" ? true : false}
                        className="flex items-center cursor-pointer justify-center w-8 h-8 rounded-lg bg-transparent hover:border hover:border-white/10 text-white/30 hover:text-white/80 hover:bg-white/[0.07] disabled:cursor-not-allowed  transition-all duration-200">
                        <SiSimpleanalytics />
                    </button>
                    <ActionButton
                        label="More options"
                        disable={link.isActive}
                        icon={<BsThreeDotsVertical />}
                    />
                </div>
            </div>
            {shareSocial && <ShareModal setStatus={setShareSocial} link={link.short_url} />}

            {/* Bottom info row */}
            <div className="flex items-center gap-3 flex-wrap">
                {/* link.isActive badge */}
                <span
                    className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-full border
            ${link.isActive === "expired"
                            ? "bg-red-400/10 text-red-400 border-red-400/20" :
                            link.isActive === "scheduled" ? "bg-yellow-500/70 text-white border-yellow-400/20" :
                                link.isActive === "used" ? "bg-gray-300/70 text-black border-gray-400/20"
                                    : "bg-emerald-300/10 text-emerald-300 border-emerald-300/25"
                        }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${link.isActive === "expired" ? "bg-red-400" : link.isActive === "scheduled" ? "bg-yellow-300" : link.isActive === "used" ? "bg-gray-900" : "bg-emerald-300"}`} />
                    {link.isActive === "expired" ? "Expired" : link.isActive === "scheduled" ? "Scheduled" : link.isActive === "used" ? "Single Used" : "Active"}
                </span>

                {/* Clicks */}
                <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-full bg-white/5 text-white/50">
                    <PiCursorClick />
                    {link.totalClicks} {link.totalClicks === 1 ? "click" : "clicks"}
                </span>
                {link.isPswrdProtected && <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-full bg-white/5 text-white/50">
                    <IoIosUnlock />
                    Pasword Protected
                </span>}

                {/* Created */}
                <span className="inline-flex items-center gap-1.5 text-[12px] text-white/30">
                    <SlCalender />
                    Created&nbsp;<span className="text-white/50 font-medium">{formatedDate(link.creation_date)}</span>
                </span>

                {/* Expiry */}
                <span className="inline-flex items-center gap-1.5 text-[12px] text-white/30">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                        <circle cx="8" cy="8" r="6.5" />
                        <path d="M8 4.5V8l2.5 2.5" />
                    </svg>
                    {link.isActive === "expired" ? "Expired" : "Expires"}&nbsp;<span className="text-white/50 font-medium">{formatedDate(link.expiry_date)}</span>
                </span>
            </div>
        </div>
    );
}
export default LinkCard;