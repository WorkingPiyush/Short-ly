import React, { useState } from "react";
import { Code2, Copy, Check, ChevronRight } from "lucide-react";

const SECTIONS = [
  { id: "auth", label: "Authentication" },
  { id: "create-link", label: "Create a link" },
  { id: "get-link", label: "Get link details" },
  { id: "list-links", label: "List links" },
  { id: "delete-link", label: "Delete a link" },
];

const ENDPOINTS = {
  auth: {
    method: "—",
    path: "All requests",
    desc: "Authenticate every request with your API key in the Authorization header.",
    code: `curl https://api.shortly.app/v1/links \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
  },
  "create-link": {
    method: "POST",
    path: "/v1/links",
    desc: "Create a new short link from a destination URL.",
    code: `curl -X POST https://api.shortly.app/v1/links \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com"}'`,
  },
  "get-link": {
    method: "GET",
    path: "/v1/links/:id",
    desc: "Retrieve details and click stats for a single link.",
    code: `curl https://api.shortly.app/v1/links/2tUyi6U \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
  },
  "list-links": {
    method: "GET",
    path: "/v1/links",
    desc: "List all links in your account, paginated.",
    code: `curl https://api.shortly.app/v1/links?page=1 \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
  },
  "delete-link": {
    method: "DELETE",
    path: "/v1/links/:id",
    desc: "Permanently delete a short link.",
    code: `curl -X DELETE https://api.shortly.app/v1/links/2tUyi6U \\
  -H "Authorization: Bearer YOUR_API_KEY"`,
  },
};

const METHOD_COLORS = {
  GET: "text-[#6ee7b7] bg-[#6ee7b7]/10",
  POST: "text-[#93c5fd] bg-[#93c5fd]/10",
  DELETE: "text-[#fca5a5] bg-[#fca5a5]/10",
  "—": "text-white/40 bg-white/5",
};

export default function ApiDocsPage() {
  const [active, setActive] = useState("auth");
  const [copied, setCopied] = useState(false);
  const endpoint = ENDPOINTS[active];

  const handleCopy = () => {
    navigator.clipboard?.writeText(endpoint.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] px-6 py-16"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="mx-auto max-w-4xl">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6ee7b7]/10 px-3 py-1 text-xs font-medium text-[#6ee7b7]">
          <Code2 size={12} />
          API Docs
        </span>
        <h1
          className="mt-4 text-3xl font-bold text-white sm:text-4xl"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Shortly API reference
        </h1>
        <p className="mt-3 max-w-lg text-sm text-white/40">
          Programmatically create, fetch, and manage short links. Base URL:{" "}
          <span className="text-white/60">https://api.shortly.app</span>
        </p>

        <div className="mt-10 flex flex-col gap-6 sm:flex-row">
          {/* Sidebar nav */}
          <nav className="flex shrink-0 flex-row gap-1.5 overflow-x-auto sm:w-52 sm:flex-col sm:overflow-visible">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                className={`flex items-center justify-between gap-1 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-left text-sm font-medium transition-colors ${
                  active === s.id
                    ? "bg-[#6ee7b7]/10 text-[#6ee7b7]"
                    : "text-white/50 hover:bg-white/5 hover:text-white/80"
                }`}
              >
                {s.label}
                {active === s.id && <ChevronRight size={14} />}
              </button>
            ))}
          </nav>

          {/* Content */}
          <div className="min-w-0 flex-1 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className={`rounded-md px-2 py-1 text-xs font-bold ${METHOD_COLORS[endpoint.method]}`}
              >
                {endpoint.method}
              </span>
              <code className="text-sm text-white/70">{endpoint.path}</code>
            </div>
            <p className="mt-3 text-sm text-white/40">{endpoint.desc}</p>

            <div className="relative mt-5 overflow-hidden rounded-xl border border-white/10 bg-black">
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-2">
                <span className="text-xs font-medium text-white/30">cURL</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-medium text-white/40 hover:text-[#6ee7b7]"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-white/70">
                <code>{endpoint.code}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
