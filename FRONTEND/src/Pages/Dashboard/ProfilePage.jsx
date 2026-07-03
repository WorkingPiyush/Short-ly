/* eslint-disable react/prop-types */
import { useUserInfo } from '@/Hooks/useAuth';
import { useUrl } from '@/Hooks/useUrl';
import React, { useState } from 'react'
import { CiMail } from "react-icons/ci";
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom'
import { forgetPassword } from '@/Api/Auth';

// const USER = {
//     name: "Piyush Kumar",
//     role: "Full Stack Developer",
//     location: "Delhi, India",
//     bio: "A normal human being trying to get out of the hell.... 😊 Building cool stuff with React & Node.",
//     tags: ["React", "Node.js", "Full Stack", "Open Source"],
//     avatar: null, // replace with image URL string
//     phone: "+91-8595594378",
//     email: "itsmepiyush855@gmail.com",
//     address: "Rohini, Delhi - 110085",
//     homepage: "github.com/WorkingPiyush",
//     memberSince: "01 Jan 2026",
//     plan: "Free Tier",
//     lastActive: "Today, 2:45 PM",
//     linksUsed: 4,
//     linksLimit: 50,
// };

// const STATS = [
//     { label: "Total Links", value: 4, sub: "All time" },
//     { label: "Total Clicks", value: 6, sub: "All time" },
//     { label: "Active Links", value: 3, sub: "Live now" },
// ];

// const LINKS = [
//     { id: 1, emoji: "🎬", original: "www.youtube.com/watch", short: "sht.ly/FrrQ9fF", clicks: 4, status: "active" },
//     { id: 2, emoji: "🌐", original: "127.0.0.1/index.html", short: "sht.ly/DTSrrlT", clicks: 2, status: "active" },
//     { id: 3, emoji: "🔗", original: "app.bitly.com/Bp83eV8wOnQ", short: "sht.ly/EY4P2sb", clicks: 0, status: "active" },
//     { id: 4, emoji: "🎬", original: "www.youtube.com/watch?v=old", short: "sht.ly/X9kPmR2", clicks: 0, status: "expired" },
// ];


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
        flex items-center justify-center text-emerald-300 shrink-0">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-[11px] text-white/30 mb-0.5">{label}</p>
                <p className="text-[13px] font-medium text-white/80 truncate">{value}</p>
            </div>
        </div>
    );
}

function SectionCard({ title, children }) {
    return (
        <div className="bg-white/3 border border-white/8 rounded-2xl p-5">
            <p className="text-[11px] font-medium text-white/30 tracking-[.08em] uppercase mb-4">
                {title}
            </p>
            {children}
        </div>
    );
}

function LinkRow({ link, dimmed = false }) {
    return (
        <div className={`flex items-center gap-3 bg-white/2 border border-white/[0.07]
      rounded-xl px-4 py-3.5 hover:border-white/[0.14] transition-all duration-200
      ${dimmed ? "opacity-50" : ""}`}>
            <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-white/75 truncate mb-0.5">{link.original_url}</p>
                <p className="text-[12px] text-emerald-300">{link.short_url}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <span className="flex items-center gap-1 text-[12px] text-white/35">
                    <Icons.Search /> {link.totalClicks}
                </span>
                <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border
          ${link.isActive === "active"
                        ? "bg-emerald-300/10 text-emerald-300 border-emerald-300/20"
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
            <div className="bg-emerald-300/4 border border-emerald-300/25 rounded-2xl
        px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <span className="inline-block text-[11px] font-medium text-emerald-300
            bg-emerald-300/10 border border-emerald-300/20 px-2.5 py-1 rounded-full mb-2">
                        Current plan
                    </span>
                    <p className="font-extrabold text-[20px] text-white tracking-tight mb-1"
                        style={{ fontFamily: "'Syne', sans-serif" }}>
                        {user?.plan === 'FREE' ? "Free Tier" : "Premium"}
                    </p>
                    <p className="text-[12px] text-white/35">50 links/month · Basic analytics · Standard URLs</p>
                </div>
                {user?.plan === 'FREE' ?
                    <button className="text-[13px] cursor-pointer font-medium text-zinc-900 bg-emerald-300 px-4 py-2.5
          rounded-xl hover:bg-emerald-200 transition-all duration-150 shrink-0">
                        Upgrade to Pro →
                    </button>
                    :
                    <button className="text-[13px] cursor-pointer font-medium text-zinc-900 bg-emerald-300 px-4 py-2.5
          rounded-xl hover:bg-emerald-200 transition-all duration-150 shrink-0">
                        Explore Premium Pro  →
                    </button>
                }
            </div>
            {/* Recent links */}
            <div>
                <div className="flex items-center justify-between mb-3">
                    <p className="font-bold text-[15px] text-white/80"
                        style={{ fontFamily: "'Syne', sans-serif" }}>
                        Recent Links
                    </p>
                    {
                        url.length > 0 ?
                            <button
                                onClick={onGoToLinks}
                                className="text-[12px] cursor-pointer font-medium text-white/50 bg-white/4
              border border-white/10 px-3.5 py-1.5 rounded-xl
              hover:text-white hover:bg-white/8 transition-all duration-200"
                            >
                                See More →
                            </button>
                            : ""
                    }
                </div>
                <div className="flex flex-col gap-2.5">
                    {url?.sort((a, b) => b.totalClicks - a.totalClicks)?.slice(2, 5).map(l => <LinkRow key={l.id} link={l} />)}
                </div>
            </div>
        </div>
    );
}

// ─── Tab: My Links ────────────────────────────────────────────────────────────
function LinksTab({ url, navigate }) {
    return (
        <div className='relative'>
            <div className="flex flex-col gap-2.5">
                {url?.sort((a, b) => b.totalClicks - a.totalClicks)?.slice(6, 10).map(l => <LinkRow key={l.id} link={l} />)}
            </div>
            {
                url.length > 0 ?
                    <button
                        onClick={() => navigate("/dashboard/links")}
                        className="text-[12px] cursor-pointer font-medium text-white/50 bg-white/4
              border border-white/10 px-3.5 py-1.5 rounded-xl
              hover:text-white hover:bg-white/8 transition-all duration-200"
                    >
                        See More →
                    </button>
                    : ""
            }
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

    const inputCls = `w-full bg-white/[0.04] border border-white/[0.09] rounded-xl
    px-3.5 py-3 text-[13px] text-white placeholder-white/20 outline-none
    focus:border-emerald-300/35 focus:bg-emerald-300/[0.02] transition-all duration-200`;
    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <SectionCard title="Account Details">
                    <div className="mb-3">
                        <label className="block text-[12px] text-white/40 mb-1.5">User&apos;s name</label>
                        <input disabled value={name} onChange={e => setName(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                        <label className="block text-[12px] text-white/40 mb-1.5">Email</label>
                        <input disabled type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputCls} />
                    </div>
                </SectionCard>

                <SectionCard title="Reset Password">
                    <div className="mb-3 flex flex-col gap-2">
                        <h1>Reset Password by Mail</h1>
                        <span className='text-[12px] text-white/40'>We&apos;ll send a password reset link to your email address. Click the link in the emial to create new password.</span>
                    </div>
                    <div onClick={handleResetPassword}>
                        <div className='flex items-center w-fit gap-3 border text-emerald-300 border-emerald-400 px-5 py-2 rounded-xl cursor-pointer select-none active:scale-101 transition-all'>
                            <CiMail size={22} />
                            <span> Send password reset link</span>
                        </div>
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
    const { data: user } = useUserInfo()
    const { data: url } = useUrl()
    const navigate = useNavigate();
    const TABS = ["Overview", "My Links", "Settings"];
    const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden mb-4">
                    <div className="h-30 md:h-34" style={{ background: "linear-gradient(135deg, #0d9488 0%, #6ee7b7 100%)" }} />
                    <div className="px-5 relative pb-6">
                        <div className="flex justify-center items-center gap-3 flex-wrap -mt-10 mb-4">
                            <div className="w-20 h-20 rounded-full border-[3px] border-[#0a0a0a] bg-[#2a2a2a] overflow-hidden flex items-center justify-center text-4xl shrink-0">
                                {user?.profileImage ? <img src={user.profileImage} alt={user.name} className="w-full h-full object-cover" /> : <span>👤</span>}
                            </div>
                            <div className='absolute right-0 top-8'>
                                <Link
                                    to="/profile/edit"
                                    className="flex items-center gap-2 text-[13px] font-medium text-white
                  border border-white/20 px-4 py-2 rounded-xl bg-transparent
                  hover:bg-white/[0.07] hover:border-white/35 transition-all duration-200"
                                >
                                    <Icons.Edit /> Edit Profile
                                </Link>
                            </div>
                        </div>
                        <h1 className="font-extrabold text-center text-[22px] text-white tracking-tight mb-0.5" style={{ fontFamily: "'Syne', sans-serif" }}>
                            {user?.name || "No Name"}
                        </h1>
                        <div className='flex flex-col items-center'>
                            <p className="text-[13px] text-white/45 mb-3">
                                {user?.headline || "No Role"} · {user?.location || "No Location"}
                            </p>
                            <p className="text-[14px] text-center text-white/55 leading-relaxed mb-4 max-w-lg">
                                {user?.bio || "No Bio"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                    <div className="bg-white/3 border border-white/[0.07] cursor-pointer rounded-2xl px-4 py-4
                hover:border-emerald-300/20 transition-all duration-200 hover:scale-102">
                        <p className="text-[10px] font-medium text-white/30 tracking-[.06em] uppercase mb-2">
                            Total Links
                        </p>
                        <p className="font-extrabold text-[26px] text-white leading-none tracking-tight mb-1"
                            style={{ fontFamily: "'Syne', sans-serif" }}>
                            {user?.url.linksCount}
                        </p>
                        <p className="text-[11px] text-white/25">All time</p>
                    </div>

                    <div className="bg-white/3 border border-white/[0.07] cursor-pointer rounded-2xl px-4 py-4
                hover:border-emerald-300/20 transition-all duration-200 hover:scale-102">
                        <p className="text-[10px] font-medium text-white/30 tracking-[.06em] uppercase mb-2">
                            Total Clicks
                        </p>
                        <p className="font-extrabold text-[26px] text-white leading-none tracking-tight mb-1"
                            style={{ fontFamily: "'Syne', sans-serif" }}>
                            {user?.url.linksClickCount}
                        </p>
                        <p className="text-[11px] text-white/25">All time</p>
                    </div>

                    <div className="bg-white/3 border border-white/[0.07] cursor-pointer rounded-2xl px-4 py-4
                hover:border-emerald-300/20 transition-all duration-200 hover:scale-102">
                        <p className="text-[10px] font-medium text-white/30 tracking-[.06em] uppercase mb-2">
                            Active Links
                        </p>
                        <p className="font-extrabold text-[26px] text-emerald-400 leading-none tracking-tight mb-1"
                            style={{ fontFamily: "'Syne', sans-serif" }}>
                            {user?.url.activeLinksCount}
                        </p>
                        <p className="text-[11px] text-white/25">Live now</p>
                    </div>


                </div>

                <div className="grid grid-cols-3 gap-1 bg-white/3 border border-white/[0.07] rounded-2xl p-1.5 mb-4">
                    {TABS.map((tab, i) => (
                        <button key={tab} onClick={() => setActiveTab(i)}
                            className={`text-[13px] font-medium py-2.5 rounded-xl cursor-pointer transition-all duration-200
                                     ${activeTab === i
                                    ? "bg-white/8 text-white"
                                    : "text-white/40 hover:text-white/65 hover:bg-white/3"}`}>
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
