import { Link, useNavigate } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";
import { CiShare2 } from "react-icons/ci";
import { SiSimpleanalytics } from "react-icons/si";
import { PiCursorClick } from "react-icons/pi";
import { IoIosUnlock } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import ActionButton from "./Actionbtns";
import CopyButton from "./CopyBtn";
import ShareModal from "./ShareLink";
import { useMemo, useState } from "react";
import StatusCard from "./StatusCard";
import { Folder, MoreVertical } from "lucide-react";
import { TagMenu } from "./TagsMenu";
import { debounce } from "@/Hooks/DebounceApi";
import { addTags } from "@/Api/Url";
import { useQueryClient } from "@tanstack/react-query";



/* eslint-disable react/prop-types */
function LinkCard({ link }) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [shareSocial, setShareSocial] = useState(false);

    const [menuOpen, setMenuOpen] = useState(false);
    const [allTags, setAllTags] = useState(link?.tags);
    const TagsToBackend = useMemo(() => debounce(async (tags, shortCode) => {
        try {
            await addTags(tags, shortCode);
            queryClient.invalidateQueries(["url"])
        } catch (error) {
            console.error(error);
        }
    }, 800), []);

    function getRandomHexColor() {
        const randomInt = Math.floor(Math.random() * 0xFFFFFF);
        const hexString = randomInt.toString(16).padStart(6, '0');

        return `#${hexString.toUpperCase()}`;
    }

    const createTags = (name) => {
        setAllTags(prev => {
            const updated = [
                ...prev,
                { id: crypto.randomUUID(), name, color: getRandomHexColor() }
            ];
            TagsToBackend(updated.map((tag) => tag.name), link.short_code);
            return updated;
        }
        );
    };

    const removeTags = (id) => {
        setAllTags(prev => {
            const updated = prev.filter(tag => tag.id !== id)
            TagsToBackend(updated.map((tag) => tag.name), link.short_code);
            return updated;
        });
    }

    const formatedDate = (input) => {
        return new Date(input)?.toLocaleString("en-In", {
            year: "numeric",
            month: "short",
            day: "2-digit"
        })
    };


    return (
        <>
            <div className={`border rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1  hover:shadow-xl hover:shadow-emerald-500/10 border-zinc-200 dark:border-zinc-800
        ${link.isActive === "expired" ? "bg-zinc-100 border-zinc-200 hover:border-zinc-300 dark:bg-zinc-900/40 dark:border-zinc-800 dark:hover:border-zinc-700"
                    : link.isActive === "used" ? "bg-zinc-50 border-zinc-200 hover:border-zinc-300 dark:bg-zinc-900/60 dark:border-zinc-800"
                        : "bg-white border-zinc-200 hover:border-emerald-300 hover:shadow-lg dark:bg-zinc-900/60 dark:border-zinc-800 dark:hover:border-emerald-500/40"
                }`}>
                {/* Top row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex-1 min-w-0">
                        <p className={`font-bold text-[15px] truncate mb-1.5 tracking-tight
                    ${link.isActive === "expired" ? "text-zinc-500 dark:text-zinc-500"
                                : link.isActive === "used" ? "text-zinc-600 dark:text-zinc-400"
                                    : "text-zinc-900 dark:text-white"}`}
                            style={{ fontFamily: "'Syne', sans-serif" }}>
                            {link.original_url}
                        </p>
                        <div className="flex items-center gap-2">
                            <Link to={link.short_url} target="_blank" className={`text-[13px] font-medium transition-colors
                             ${link.isActive === "expired" ? "text-zinc-500 dark:text-zinc-500"
                                    : link.isActive === "used" ? "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                                        : "text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"}`} >
                                {link.short_url}
                            </Link>
                            <CopyButton text={link.short_url} status={link.isActive} />
                        </div>

                        {allTags?.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {allTags.map((cat) => {
                                    return (
                                        <span key={cat.id} className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/4 px-2.5 py-1 text-xs font-medium text-white/70">
                                            <Folder size={11} style={{ color: cat.color }} />
                                            {cat.name}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 shrink-0">
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
                            className={`flex items-center justify-center cursor-pointer w-8 h-8 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 ${link.isActive === "active" ? "hover:text-emerald-600" : "hover:text-zinc-600"} dark:hover:text-white dark:hover:bg-zinc-800 bg-transparent hover:border hover:border-white/10  disabled:cursor-not-allowed  transition-all duration-200`}>
                            <CiShare2 />
                        </button>
                        <button
                            onClick={() => navigate(`/${link.short_code}/analytics`)}
                            aria-label="Analytics"
                            disabled={link.isActive === "used" ? true : link.isActive === "expired" ? true : false}
                            className={`flex items-center justify-center cursor-pointer w-8 h-8 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 ${link.isActive === "active" ? "hover:text-emerald-600" : "hover:text-zinc-600"} dark:hover:text-white dark:hover:bg-zinc-800 bg-transparent hover:border hover:border-white/10  disabled:cursor-not-allowed  transition-all duration-200`}>
                            <SiSimpleanalytics />
                        </button>
                        <div className="relative">
                            <button
                                aria-label="More options"
                                aria-haspopup="menu"
                                aria-expanded={menuOpen}
                                disabled={link.isActive === "used" ? true : link.isActive === "expired" ? true : false}
                                onClick={() => setMenuOpen((o) => !o)}
                                className={`flex items-center justify-center cursor-pointer w-8 h-8 rounded-full text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 ${link.isActive === "active" ? "hover:text-emerald-600" : "hover:text-zinc-600"} dark:hover:text-white dark:hover:bg-zinc-800 bg-transparent hover:border hover:border-white/10  disabled:cursor-not-allowed  transition-all duration-200`}>
                                <MoreVertical size={16} />
                            </button>

                            {menuOpen && (
                                <TagMenu
                                    onClose={() => setMenuOpen(false)}
                                    tags={allTags}
                                    onCreateTags={createTags}
                                    remove={removeTags}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom info row */}
                <div className="flex items-center gap-3 flex-wrap">
                    {/* link.isActive badge */}
                    <StatusCard status={link.isActive} />

                    {/* Clicks */}
                    <span className="inline-flex items-center gap-1.5 text-[12px] rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-1
 text-xs font-medium">
                        <PiCursorClick />
                        {link.totalClicks} {link.totalClicks === 1 ? "click" : "clicks"}
                    </span>
                    {link.isPswrdProtected && <span className="inline-flex items-center gap-1.5 text-[12px] rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2.5 py-1
 text-xs font-medium">
                        <IoIosUnlock />
                        Pasword Protected
                    </span>}

                    {/* Created */}
                    <span className="inline-flex items-center gap-1.5 text-[12px] text-zinc-500 dark:text-zinc-500">
                        <SlCalender />
                        Created&nbsp;<span className="text-zinc-700 dark:text-zinc-300 font-medium">{formatedDate(link.creation_date)}</span>
                    </span>

                    {/* Expiry */}
                    <span className="inline-flex items-center gap-1.5 text-[12px] text-zinc-500 dark:text-zinc-500">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                            <circle cx="8" cy="8" r="6.5" />
                            <path d="M8 4.5V8l2.5 2.5" />
                        </svg>
                        {link.isActive === "expired" ? "Expired" : "Expires"}&nbsp;<span className="text-zinc-700 dark:text-zinc-300 font-medium">{formatedDate(link.expiry_date)}</span>
                    </span>
                </div>
            </div >
            {shareSocial && <ShareModal setStatus={setShareSocial} link={link.short_url} />
            }
        </>
    );
}
export default LinkCard;