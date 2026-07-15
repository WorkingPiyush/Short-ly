import React from "react";
import { ScrollText } from "lucide-react";

const SECTIONS = [
  {
    title: "1. Acceptance of terms",
    body: "By accessing or using Shortly, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the service.",
  },
  {
    title: "2. Use of the service",
    body: "You agree to use Shortly only for lawful purposes. You may not use the service to shorten links that lead to malicious, fraudulent, or infringing content.",
  },
  {
    title: "3. Account responsibility",
    body: "You're responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account.",
  },
  {
    title: "4. Link availability",
    body: "Shortly does not guarantee that shortened links will remain active indefinitely. Links may expire, be disabled, or be removed for violations of these terms.",
  },
  {
    title: "5. Termination",
    body: "We reserve the right to suspend or terminate accounts that violate these terms, without prior notice.",
  },
  {
    title: "6. Changes to these terms",
    body: "We may update these terms from time to time. Continued use of the service after changes take effect constitutes acceptance of the revised terms.",
  },
];

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-6 py-16" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="mx-auto mt-15 max-w-2xl">
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6ee7b7]/10 px-3 py-1 text-xs font-medium text-[#6ee7b7]">
            <ScrollText size={12} />
            Legal
          </span>
        </div>
        <h1 className="mt-4 text-3xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
          Terms and Conditions
        </h1>
        <p className="mt-2 text-sm text-white/30">Last updated: July 31, 2026</p>

        <div className="mt-8 flex flex-col gap-6 rounded-2xl border border-white/10 bg-white/2 p-6 sm:p-8">
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
          Questions about these terms? Reach out at{" "}
          <span className="text-white/40">legal@shortly.app</span>
        </p>
      </div>
    </div>
  );
}
