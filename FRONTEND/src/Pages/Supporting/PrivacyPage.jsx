import React from "react";
import { ShieldCheck } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Information we collect",
    body: "We collect information you provide directly, such as your email and links you create, along with usage data like click timestamps, approximate location, and device type.",
  },
  {
    title: "2. How we use your information",
    body: "We use collected data to operate and improve Shortly, provide analytics on your links, and communicate important account updates.",
  },
  {
    title: "3. Data sharing",
    body: "We do not sell your personal data. We may share limited data with service providers who help us run Shortly, under strict confidentiality agreements.",
  },
  {
    title: "4. Cookies",
    body: "We use cookies to keep you signed in and to understand how the app is used. You can disable cookies in your browser, though some features may not work correctly.",
  },
  {
    title: "5. Data retention",
    body: "We retain your data for as long as your account is active. You can request deletion of your account and associated data at any time.",
  },
  {
    title: "6. Your rights",
    body: "Depending on your location, you may have the right to access, correct, or delete your personal data. Contact us to exercise these rights.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-6 py-16" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mx-auto max-w-2xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6ee7b7]/10 px-3 py-1 text-xs font-medium text-[#6ee7b7]">
          <ShieldCheck size={12} />
          Legal
        </span>
        <h1
          className="mt-4 text-3xl font-bold text-white"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-white/30">Last updated: July 13, 2026</p>

        <div className="mt-8 flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
          {SECTIONS.map((s) => (
            <div key={s.title}>
              <h2
                className="text-base font-bold text-white"
                style={{ fontFamily: "'Syne', sans-serif" }}
              >
                {s.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-white/25">
          Privacy questions? Reach out at{" "}
          <span className="text-white/40">privacy@shortly.app</span>
        </p>
      </div>
    </div>
  );
}
