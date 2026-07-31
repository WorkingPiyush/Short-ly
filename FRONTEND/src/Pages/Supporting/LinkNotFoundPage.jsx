import React from "react";
import { Unlink, Home, Link2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function LinkNotFoundPage({ attemptedUrl = "http://localhost:5000/xxxxxxx", onGoHome, }) {
  const navigate = useNavigate();
  const { shortCode } = useParams();

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 py-10"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-8 text-center">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-[#6ee7b7]/10 blur-3xl" />

          <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#6ee7b7]/20 bg-[#6ee7b7]/10">
            <Unlink size={26} className="text-[#6ee7b7]" />
          </div>
          <p className="relative text-6xl font-bold tracking-tight text-white mb-2" style={{ fontFamily: "'Syne', sans-serif" }}>
            404
          </p>
          <h1
            className="relative text-xl font-bold text-white"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Link not found
          </h1>
          <p className="relative mx-auto mt-2 max-w-xs text-sm text-white/40">
            This short link doesn&apos;t exist. It may have been deleted, or the
            URL was typed incorrectly.
          </p>

          <div className="relative mt-6 flex justify-center">
            <span className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-white/40">
              <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
              Not found
            </span>
          </div>

          <div className="relative mt-6 rounded-xl border border-white/10 bg-white/2 p-4 text-left">
            <p className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-white/30">
              <Link2 size={11} />
              You tried to visit
            </p>
            <p className="truncate text-sm font-semibold text-white/50 line-through decoration-white/20">
              {`${import.meta.env.VITE_REDIRECT_URL}/${shortCode}`}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="relative mt-7 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#6ee7b7] px-4 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            <Home size={15} />
            Go home
          </button>
        </div>

        <p className="mt-5 text-center text-xs text-white/25">
          Powered by{" "}
          <span
            className="font-semibold text-white/40"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Shortly
          </span>
        </p>
      </div>
    </div>
  );
}
