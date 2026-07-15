/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { LifeBuoy, Mail, MessageCircle, ChevronDown, Search } from "lucide-react";
import FadeUp from "@/animation/framer-motion";

const FAQS = [
  {
    q: "How do I create a short link?",
    a: "Head to the dashboard, click 'Create Link', paste your destination URL, and hit shorten. Your link is ready instantly.",
  },
  {
    q: "Can I password-protect a link?",
    a: "Yes. Open the Edit Link page for any link and enable password protection under the Access section.",
  },
  {
    q: "What happens when a link expires?",
    a: "Expired links return a 404 to visitors. You can update or remove the expiration date anytime before it expires.",
  },
  {
    q: "Do you offer team accounts?",
    a: "Team workspaces are available on the Business plan, including shared link libraries and role-based access.",
  },
  {
    q: "How do I contact support?",
    a: "Use the email or live chat options below — our team typically responds within a few hours.",
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-white/10 bg-white/2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 cursor-pointer text-left">
        <span className="text-sm font-medium text-white/80">{q}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-white/40 transition-transform delay-75 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <p
        className={`overflow-hidden px-5 text-sm leading-relaxed text-white/60 transition-all duration-220 ${open
            ? "max-h-96 opacity-100 pb-4"
            : "max-h-0 opacity-0 pb-0"
          }`}
      >
        {a}
      </p>
    </div>
  );
}

export default function SupportPage() {
  const [query, setQuery] = useState("");

  const filtered = FAQS.filter((f) =>
    f.q.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-6 py-16" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mx-auto mt-16 max-w-2xl">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6ee7b7]/10 px-3 py-1 text-xs font-medium text-[#6ee7b7]">
            <LifeBuoy size={12} />
            Support
          </span>
          <h1 className="mt-4 text-3xl font-bold text-white sm:text-4xl" style={{ fontFamily: "'Syne', sans-serif" }}>
            How can we help?
          </h1>
          <p className="mt-3 text-xs text-white/40">
            Search our FAQs or reach out to the team directly.
          </p>
        </div>

        <div className="relative mt-8">
          <Search
            size={15}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a topic..."
            className="w-full rounded-xl border border-white/10 bg-black py-3.5 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none focus:border-[#6ee7b7]/50"
          />
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {filtered.length > 0 ? (
            filtered.map((f) =>
              <div key={f.a}>
                <FadeUp>
                  <FaqItem key={f.q} {...f} />
                </FadeUp>
              </div>
            )
          ) : (
            <p className="py-8 text-center text-sm text-white/30">
              No results for `{query}`
            </p>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <a
            href="mailto:support@shortly.app"
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/2 p-5 transition-colors hover:border-[#6ee7b7]/30"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6ee7b7]/10">
              <Mail size={16} className="text-[#6ee7b7]" />
            </span>
            <div>
              <p className="text-sm font-bold text-white">Email us</p>
              <p className="text-xs text-white/40">support@shortly.app</p>
            </div>
          </a>

          <button
            type="button"
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/2 p-5 text-left transition-colors hover:border-[#6ee7b7]/30"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#6ee7b7]/10">
              <MessageCircle size={16} className="text-[#6ee7b7]" />
            </span>
            <div>
              <p className="text-sm font-bold text-white">Live chat</p>
              <p className="text-xs text-white/40">Avg. reply time: 2 hrs</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
