/* eslint-disable react/prop-types */
import { useUserInfo } from '@/Hooks/useAuth';
import { useUrl } from '@/Hooks/useUrl';
import React, { useState } from 'react'
import { CiMail } from "react-icons/ci";
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom'
import { forgetPassword } from '@/Api/Auth';
import InfoCard from '../../components/InfoCard.jsx';
import FullScreenLoader from '@/components/FullScreenLoader.jsx';



// ─── Inline SVG icons ─────────────────────────────────────────────────────────
const svg = (content) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"
        strokeLinecap="round" strokeLinejoin="round" className="w-3.75 h-3.75"
        dangerouslySetInnerHTML={{ __html: content }} />
);

const Icons = {
    Phone: () => svg('<path d="M22 16.92v3a2 2 0 01-2.18 2A19.8 19.8 0 013.08 4.18 2 2 0 015.09 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L9.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>'),
    Mail: () => svg('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>'),
    Pin: () => svg('<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>'),
    Globe: () => svg('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>'),
    Cal: () => svg('<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>'),
    Shield: () => svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>'),
    Chart: () => svg('<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>'),
    Link: () => svg('<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>'),
    Edit: () => svg('<path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>'),
    Plus: () => svg('<path d="M12 5v14M5 12h14"/>'),
    Trash: () => svg('<polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>'),
    Search: () => svg('<circle cx="10" cy="10" r="7"/><path d="M15 15l6.5 6.5"/>'),
};

// ─── Shared components ────────────────────────────────────────────────────────
function InfoItem({ icon, label, value }) {
    return (
        <div className="flex items-center gap-3 mb-4 last:mb-0">
            <div className="w-9 h-9 rounded-[10px] bg-emerald-300/10 border border-emerald-300/20
        flex items-center justify-center dark:text-emerald-300 text-black shrink-0">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[11px] dark:text-white/30 text-zinc-800 mb-0.5">{label}</p>
                <p className="text-[13px] font-medium dark:text-white/80 text-emerald-500 truncate">{value}</p>
            </div>
        </div>
    );
}

function SectionCard({ title, children }) {
    return (
        <div className="bg-linear-to-br from-[#F6F3EE] via-[#FBFAF7] to-[#EEF8F2] dark:from-[#090909] dark:via-[#0b0b0b] dark:to-[#07110d] border dark:border-white/8 border-black/10 shadow-sm rounded-2xl p-5">
            <p className="text-[11px] font-medium dark:text-white/30 text-zinc-800 tracking-[.08em] uppercase mb-4">
                {title}
            </p>
            {children}
        </div>
    );
}

function LinkRow({ link, dimmed = false }) {
    return (
        <div className={`flex items-center gap-3 dark:bg-white/2 bg-black/10 border dark:border-white/[0.07] border-black/10 rounded-xl px-4 py-3.5 dark:hover:border-white/[0.14] hover:border-black/60 transition-all duration-200
      ${dimmed ? "opacity-50" : ""}`}>
            <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium dark:text-white/75 text-zinc-900 truncate mb-0.5">{link.original_url}</p>
                <p className="text-[12px] dark:text-emerald-300 text-emerald-500">{link.short_url}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <span className="flex items-center gap-1 text-[12px] dark:text-white/35 text-black/66">
                    <Icons.Search /> {link.totalClicks}
                </span>
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border
          ${link.isActive === "active"
                        ? "dark:bg-emerald-300/10 bg-emerald-300/20 dark:text-emerald-300 text-emerald-600 dark:border-emerald-300/20 border-emerald-300"
                        : "bg-red-400/10 text-red-400 border-red-400/15"}`}>
                    {link.isActive === "active" ? "Active" : "Expired"}
                </span>
            </div>
        </div>
    );
}

const formatDate = (date) => {

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = new Date(date).getDate();
    const month = monthNames[new Date(date).getMonth()];
    const year = new Date(date).getFullYear();

    return `${day}-${month}-${year}`;
}
const formatDateTime = (date) => {
    const now = new Date(date);
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = new Date(date).getDate();
    const month = monthNames[new Date(date).getMonth()];
    const year = new Date(date).getFullYear();

    return `${hours}:${minutes} [ ${day}-${month}-${year} ]`;
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────
function OverviewTab({ onGoToLinks, user, url }) {
    const memberSince = formatDate(user?.memberSince);
    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SectionCard title="Contact">
                    <InfoItem icon={<Icons.Phone />} label="Mobile" value={user?.phone || "No Mobile"} />
                    <InfoItem icon={<Icons.Mail />} label="Email" value={user?.email} />
                    <InfoItem icon={<Icons.Pin />} label="Address" value={user?.address || "No Address"} />
                    <InfoItem icon={<Icons.Cal />} label="Member since" value={memberSince || "27/07/2005"} />
                </SectionCard>
                <SectionCard title="Account">
                    <InfoItem icon={<Icons.Shield />} label="Plan" value={user?.plan} />
                    <InfoItem icon={<Icons.Chart />} label="Last active" value={formatDateTime(user?.lastActive)} />
                    <InfoItem icon={<Icons.Link />} label="Links used" value={`${user?.url.linksCount} / ${user?.totalAvailableLinks} this month`} />
                </SectionCard>
            </div>

            {/* Plan card */}
            <div className="dark:bg-emerald-300/4 bg-emerald-300/50 border dark:border-emerald-300/25 border-emerald-300/50 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <span className="inline-block text-gray-950/85 text-[11px] font-medium dark:text-emerald-300 dark:bg-emerald-300/10 bg-emerald-300/50 border border-emerald-300/20 px-2.5 py-1 rounded-full mb-2">
                        Current plan
                    </span>
                    <p className="font-extrabold text-[20px] dark:text-white text-gray-950/85 tracking-tight mb-1"
                        style={{ fontFamily: "'Syne', sans-serif" }}>
                        {user?.plan === 'FREE' ? "Free Tier" : "Premium"}
                    </p>
                    <p className="text-[12px] dark:text-white/35 text-gray-500">50 links/month · Basic analytics · Standard URLs</p>
                </div>
                {user?.plan === 'FREE' ?
                    <button className="text-[13px] cursor-pointer font-medium text-zinc-900 dar:bg-emerald-300 bg-emerald-400 px-4 py-2.5
          rounded-xl dark:hover:bg-emerald-200 hover:bg-emerald-300 transition-all duration-150 shrink-0">
                        Upgrade to Pro →
                    </button>
                    :
                    <button className="text-[13px] cursor-pointer font-medium text-zinc-900 dar:bg-emerald-300 bg-emerald-400 px-4 py-2.5
          rounded-xl dark:hover:bg-emerald-200 hover:bg-emerald-300 transition-all duration-150 shrink-0">
                        Explore Premium Pro  →
                    </button>
                }
            </div>
            {/* Recent links */}
            {url?.length > 0 ? (
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <p className="font-bold text-[15px] text-white/80"
                            style={{ fontFamily: "'Syne', sans-serif" }}>
                            Recent Links
                        </p>
                        <button onClick={onGoToLinks}
                            className="text-[12px] cursor-pointer font-medium dark:text-white/50 text-zinc-900 dark:bg-white/4 bg-black/4
              border dark:border-white/10 border-black/10 px-3.5 py-1.5 rounded-xl dark:hover:text-white  hover:text-zinc-800 hover:bg-white/8 transition-all duration-200"
                        >
                            See More →
                        </button>
                    </div>
                    <div className="flex flex-col gap-2.5">
                        {url?.sort((a, b) => b.totalClicks - a.totalClicks)?.slice(0, 5).map(l => <LinkRow key={l.id} link={l} />)}

                    </div>
                </div>
            ) :
                (
                    <div className='h-25 flex justify-center items-center'>
                        <h1 style={{ fontFamily: "'Syne', sans-serif" }}>No data to show</h1>
                    </div>
                )
            }
        </div>
    );
}

// ─── Tab: My Links ────────────────────────────────────────────────────────────
function LinksTab({ url, navigate }) {
    if (url.length < 0) {
        return <div className='h-25 flex justify-center items-center'>
            <h1 style={{ fontFamily: "'Syne', sans-serif" }}>No data to show</h1>
        </div>
    }
    return (
        <div className='relative'>
            <div className="flex flex-col gap-2.5">
                {url?.sort((a, b) => b.totalClicks - a.totalClicks)?.slice(0, 10).map(l => <LinkRow key={l.id} link={l} />)}
            </div>
            <button onClick={() => navigate("/dashboard/links")}
                className="text-[12px] cursor-pointer font-medium dark:text-white/50 text-zinc-900 dark:bg-white/4 bg-black/4
              border dark:border-white/10 border-black/10 px-3.5 py-1.5 rounded-xl absolute mt-2 right-0
              dark:hover:text-white  hover:text-zinc-800 hover:bg-white/8 transition-all duration-200"
            >
                See More →
            </button>
        </div>
    );
}

// ─── Tab: Settings ───────────────────────────────────────────────────────────
function SettingsTab({ user }) {
    // const navigate = useNavigate();
    const [name, setName] = useState(user?.name);
    const [email, setEmail] = useState(user?.email);
    const handleResetPassword = async () => {
        const reset = await forgetPassword({ email });
        if (reset.success) {
            toast.success("Mail Sent !!")
        }
    };

    const inputCls = `w-full dark:bg-white/[0.04] bg-yellow-600/20 border dark:border-white/[0.09] border-black/20 rounded-sm
    px-3.5 py-3 text-[13px] dark:text-white text-black dark:placeholder-white/20 placeholder-gray-500/20 outline-none
    focus:border-emerald-300/35 focus:bg-emerald-300/[0.02] transition-all duration-200`;
    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SectionCard title="Account Details">
                    <div className="mb-3">
                        <label className="block text-[12px] dark:dark:text-white/40 text-zinc-800 mb-1.5">User&apos;s name</label>
                        <input disabled value={name} onChange={e => setName(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                        <label className="block text-[12px] dark:text-white/40 text-zinc-800 mb-1.5">Email</label>
                        <input disabled type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
                    </div>
                </SectionCard>

                <SectionCard title="Reset Password">
                    <div className="mb-3 flex flex-col gap-2">
                        <h1>Reset Password by Mail</h1>
                        <span className='text-[12px] dark:text-white/40 text-zinc-600'>We&apos;ll send a password reset link to your email address. Click the link in the emial to create new password.</span>
                    </div>
                    <div
                        onClick={handleResetPassword}
                        className='flex items-center w-fit gap-3 border dark:text-emerald-300 text-emerald-600  dark:border-emerald-400 border-emerald-400 hover:scale-102 px-5 py-2 rounded-xl cursor-pointer select-none active:scale-101 active:bg-emerald-400 active:text-white transition-all'>
                        <CiMail size={22} />
                        <span> Send password reset link</span>
                    </div>
                </SectionCard>
            </div>

            {/* <div className="bg-red-400/4 border border-red-400/15 rounded-2xl
        px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h4 className="text-[14px] font-medium text-red-400/85 mb-1">Delete Account</h4>
                    <p className="text-[12px] text-white/25 leading-relaxed max-w-xs">
                        Permanently deletes your account, all links, analytics, and bio pages. Cannot be undone.
                    </p>
                </div>
                <button
                    onClick={handleDelete}
                    className={`text-[13px] font-medium px-4 py-2.5 rounded-xl border
            transition-all duration-200 shrink-0 whitespace-nowrap
            ${confirm
                            ? "bg-red-500/20 border-red-400/40 text-red-300"
                            : "bg-red-400/8 border-red-400/20 text-red-400 hover:bg-red-400/15"}`}
                >
                    {confirm ? "Tap again to confirm" : "Delete account"}
                </button>
            </div> */}
        </div>
    );
}




function ProfilePage() {
    const { data: user, isLoading } = useUserInfo()
    const { data: url } = useUrl()
    const navigate = useNavigate();
    const TABS = ["Overview", "My Links", "Settings"];
    const [activeTab, setActiveTab] = useState(0);
    if (isLoading) return <FullScreenLoader />;
    return (
        <div className="min-h-screen bg-linear-to-br from-[#F6F3EE] via-[#FBFAF7] to-[#EEF8F2] dark:from-[#090909] dark:via-[#0b0b0b] dark:to-[#07110d] text-zinc-900 dark:text-white">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-[#FFFDF9] dark:bg-zinc-900/70 border border-[#E7DFD3] dark:border-zinc-800 rounded-xl overflow-hidden mb-4">
                    <div className="h-30 md:h-34" style={{ background: "linear-gradient(135deg, #10b981 0%, #34d399 45%,#a7f3d0 100%)" }} />
                    <div className="px-5 relative pb-6">
                        <div className="flex justify-center items-center gap-3 flex-wrap -mt-10 mb-4">
                            <div className="w-20 h-20 rounded-full border-[3px] border-[#FFFDF9] dark:border-zinc-900 bg-white dark:bg-zinc-800 overflow-hidden flex items-center justify-center text-4xl shrink-0">
                                {user?.profileImage ? <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" /> : <span>👤</span>}
                            </div>
                            <div className='absolute right-0 top-8'>
                                <Link
                                    to="/profile/edit"
                                    className="flex items-center gap-2 text-[13px] font-medium dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-[#F8F4EC] dark:hover:bg-zinc-800 hover:border-emerald-400
                  border border-[#E7DFD3] px-4 py-2 rounded-xl transition-all duration-200"
                                >
                                    <Icons.Edit /> Edit Profile
                                </Link>
                            </div>
                        </div>
                        <h1 className="font-extrabold text-center text-[22px] text-zinc-900 dark:text-white tracking-tight mb-0.5" style={{ fontFamily: "'Syne', sans-serif" }}>
                            {user?.name || "No Name"}
                        </h1>
                        <div className='flex flex-col items-center'>
                            <p className="text-[13px] text-zinc-600 dark:text-zinc-300 mb-3">
                                {user?.headline || "No Role"} · {user?.location || "No Location"}
                            </p>
                            <p className="text-[14px] text-center text-white/55 leading-relaxed mb-4 max-w-lg">
                                {user?.bio || "No Bio"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    {
                        [
                            { label: "Total Links", value: user?.url.linksCount, footer: "All time" },
                            { label: "Total Clicks", value: user?.url.linksClickCount, footer: "All time" },
                            { label: " Active Links", value: user?.url.activeLinksCount, footer: "Live now" },
                        ].map(({ label, footer, value }) => (
                            <InfoCard key={label} label={label} value={value} footer={footer} />
                        ))
                    }
                </div>
                <div className="grid grid-cols-3 gap-1 dark:bg-white/3 bg-yellow-600/10 border dark:border-white/[0.07] border-black/[0.07] rounded-2xl p-1.5 mb-4">
                    {TABS.map((tab, i) => (
                        <button key={tab} onClick={() => setActiveTab(i)}
                            className={`text-[13px] font-medium py-2.5 rounded-xl cursor-pointer transition-all duration-200
                                     ${activeTab === i ? "dark:bg-white/8 text bg-yellow-500/40 border border-black/45 dark:text-white text-zinc-800"
                                    : "dark:text-white/40 text-gray-600 dark:hover:text-white/65 hover:text-black/49 hover:bg-white/3"}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* ── Content ── */}
                {activeTab === 0 && <OverviewTab user={user} url={url?.filter((l) => l.isActive = "active")} onGoToLinks={() => setActiveTab(1)} />}
                {activeTab === 1 && <LinksTab navigate={navigate} url={url?.filter((l) => l.isActive = "active")} />}
                {activeTab === 2 && <SettingsTab user={user} />}
            </div>
        </div>
    )
}

export default ProfilePage;
