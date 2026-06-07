import { Link } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";
import { CiShare2 } from "react-icons/ci";
import { SiSimpleanalytics } from "react-icons/si";
import { BsThreeDotsVertical } from "react-icons/bs";
import { PiCursorClick } from "react-icons/pi";
import { IoIosUnlock } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import ActionButton from "./Actionbtns";
import CopyButton from "./CopyBtn";

/* eslint-disable react/prop-types */
export default function LinkCard({ link }) {


    const formatedDate = (input) => {
        return new Date(input)?.toLocaleString("en-In", {
            year: "numeric",
            month: "short",
            day: "2-digit"
        })
    };

    return (
        <div
            className={`border rounded-2xl p-5 transition-all duration-200
        ${link.isActive === "expired" ? "bg-white/1.5 border-white/6 hover:border-white/10"
                    : "bg-white/3 border-white/8 hover:bg-white/5 hover:border-white/[0.14]"
                }`}>
            {/* Top row */}
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                    <p
                        className={`font-bold text-[15px] truncate mb-1.5 tracking-tight
              ${link.isActive === "expired" ? "text-white/35" : "text-white"}`}
                        style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                        {link.original_url}
                    </p>
                    <div className="flex items-center gap-2">
                        <Link to="#" className={`text-[13px] font-medium transition-colors ${link.isActive === "expired" ? "text-emerald-300/35" : "text-emerald-300 hover:text-emerald-200"}`} >
                            {link.short_url}
                        </Link>
                        <CopyButton text={link.short_url} />
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-0.5 shrink-0">
                    <ActionButton
                        label="Edit"
                        icon={<MdModeEdit />}
                    />
                    <ActionButton
                        label="Share"
                        icon={<CiShare2 />}
                    />
                    <ActionButton
                        label="Analytics"
                        icon={<SiSimpleanalytics />}
                    />
                    <ActionButton
                        label="More options"
                        icon={<BsThreeDotsVertical />}
                    />
                </div>
            </div>

            {/* Bottom info row */}
            <div className="flex items-center gap-3 flex-wrap">
                {/* link.isActive badge */}
                <span
                    className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-full border
            ${link.isActive === "expired"
                            ? "bg-red-400/10 text-red-400 border-red-400/20" :
                            link.isActive === "scheduled" ? "bg-yellow-500/70 text-white border-yellow-400/20"
                                : "bg-emerald-300/10 text-emerald-300 border-emerald-300/25"
                        }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${link.isActive === "expired" ? "bg-red-400" : link.isActive === "scheduled" ? "bg-yellow-300" : "bg-emerald-300"}`} />
                    {link.isActive === "expired" ? "Expired" : link.isActive === "scheduled" ? "Scheduled" : "Active"}
                </span>

                {/* Clicks */}
                <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-full bg-white/5 text-white/50">
                    <PiCursorClick />
                    {link.totalClicks} {link.totalClicks === 1 ? "click" : "clicks"}
                </span>
                {link.isPswrdProtected &&
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-full bg-white/5 text-white/50">
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