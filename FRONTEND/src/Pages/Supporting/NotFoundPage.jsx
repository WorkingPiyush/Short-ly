import React from "react";
import { SearchX, Home, ArrowLeft, Link2 } from "lucide-react";
import { replace, useNavigate } from "react-router-dom";

function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="w-full max-w-md text-center">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a0a0a] p-10">
          {/* Ambient glow */}
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-[#6ee7b7]/10 blur-3xl" />

          {/* Icon */}
          <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#6ee7b7]/20 bg-[#6ee7b7]/10">
            <SearchX size={26} className="text-[#6ee7b7]" />
          </div>

          {/* Big 404 */}
          <p className="relative text-6xl font-bold tracking-tight text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            404
          </p>

          <h1 className="relative mt-3 text-xl font-bold text-white" style={{ fontFamily: "'Syne', sans-serif" }}>
            This page doesn&lsquo;t exist
          </h1>
          <p className="relative mx-auto mt-2 max-w-xs text-sm text-white/40">
            The link or route you followed may be broken, expired, or never
            existed in the first place.
          </p>

          {/* Actions */}
          <div className="relative mt-8 flex flex-col gap-2.5 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex cursor-pointer flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
            >
              <ArrowLeft size={15} />
              Go back
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="flex cursor-pointer flex-1 items-center justify-center gap-2 rounded-xl bg-[#6ee7b7] px-4 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              <Home size={15} />
              Go home
            </button>
          </div>
        </div>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-white/25">
          <Link2 size={12} />
          <span>
            Powered by{" "}
            <span
              className="font-semibold text-white/40"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Shortly
            </span>
          </span>
        </p>
      </div>
    </div >
  );
}

export default NotFoundPage;