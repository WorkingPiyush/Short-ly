import React from "react";
import { FileText } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Service description",
    body: "Shortly provides link shortening, tracking, and bio-page tools. Features available to you depend on your subscription plan.",
  },
  {
    title: "2. Subscription and billing",
    body: "Paid plans are billed on a recurring basis. You can upgrade, downgrade, or cancel your subscription at any time from your account settings.",
  },
  {
    title: "3. Fair use",
    body: "Free and Pro plans are subject to fair use limits on link creation and API calls. Excessive usage may result in throttling.",
  },
  {
    title: "4. Intellectual property",
    body: "Shortly and its logo are the property of their respective owners. You retain ownership of the content you link to and any bio pages you create.",
  },
  {
    title: "5. Limitation of liability",
    body: "Shortly is provided \"as is\" without warranties of any kind. We are not liable for losses resulting from link downtime or third-party destination content.",
  },
  {
    title: "6. Governing law",
    body: "These terms are governed by the laws of the jurisdiction in which Shortly operates, without regard to conflict-of-law principles.",
  },
];

export default function TermsPage() {
  return (
    <div
      className="min-h-screen bg-[#0a0a0a] px-6 py-16"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="mx-auto max-w-2xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6ee7b7]/10 px-3 py-1 text-xs font-medium text-[#6ee7b7]">
          <FileText size={12} />
          Legal
        </span>
        <h1
          className="mt-4 text-3xl font-bold text-white"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Terms of Service
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
          Questions? Reach out at{" "}
          <span className="text-white/40">legal@shortly.app</span>
        </p>
      </div>
    </div>
  );
}
