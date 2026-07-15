import React from "react";
import { Zap, Link2, Database, BarChart2, Lock, QrCode, FolderOpen, Clock } from "lucide-react";
import FadeUp from "@/animation/framer-motion";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant short links",
    desc: "Turn long URLs into clean, shareable links in under a second.",
  },
  {
    icon: BarChart2,
    title: "Real-time analytics",
    desc: "Track clicks, locations, and devices as they happen.",
  },
  {
    icon: Lock,
    title: "Password protection",
    desc: "Restrict access to sensitive links with a passcode.",
  },
  {
    icon: QrCode,
    title: "QR codes",
    desc: "Every link comes with a downloadable QR code, automatically.",
  },
  {
    icon: FolderOpen,
    title: "Categories",
    desc: "Organize links into folders so nothing gets lost.",
  },
  {
    icon: Clock,
    title: "Scheduling & expiry",
    desc: "Set links to go live or expire at a specific date and time.",
  },
  {
    icon: Database,
    title: "Bulk Urls",
    desc: "Shorten bulk urls by uploading a single excel or csv file",
  },
  {
    icon: Link2,
    title: "Custom aliases",
    desc: "Replace random slugs with a short link that's easy to remember.",
  },
];

function FeaturesPage() {
  return (
    <>
      <div className="min-h-screen px-6 py-16" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-xl text-center">
            <span className="inline-flex mt-14 items-center gap-1.5 rounded-full bg-[#6ee7b7]/10 px-3 py-1 text-xs font-medium text-[#6ee7b7]">
              <Zap size={12} />
              Features
            </span>
            <h1 className="mt-4 text-xl font-bold text-white sm:text-4xl" style={{ fontFamily: "'Syne', sans-serif" }}>
              Everything you need to manage links
            </h1>
            <p className="mt-3 text-sm text-white/40 sm:text-base">
              From shortening to scheduling, Shortly gives you full control
              over every link you share.
            </p>
          </div>

          <FadeUp>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map(({ icon: Icon, title, desc }) =>
              (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/2 p-5 transition-colors hover:border-zinc-700">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6ee7b7]/10">
                    <Icon size={18} className="text-[#6ee7b7]" />
                  </div>
                  <p
                    className="mt-4 text-sm font-bold text-white"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    {title}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/40">
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </div >
    </>
  );
}

export default FeaturesPage;