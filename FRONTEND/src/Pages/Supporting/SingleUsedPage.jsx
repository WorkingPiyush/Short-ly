/* eslint-disable react/prop-types */
import React from "react";
import { Ban, Home, Link2, CheckCircle2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

function SingleUsedPage({ usedOn = "31 Jul 2026, 04:12 PM" }) {
  const navigate = useNavigate();
  const { shortCode } = useParams();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 py-10" style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="w-full max-w-md">
        <div className="relative overflow-hidden rounded-2xl border border-purple-400/20 bg-[#0a0a0a] p-8 text-center shadow-[0_0_40px_-20px_rgba(192,132,252,0.35)]">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-purple-400/10 blur-3xl" />

          <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-400/10">
            <Ban size={26} className="text-gray-400" />
          </div>

          <h1
            className="relative text-2xl font-bold text-white"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            This link has already been used
          </h1>
          <p className="relative mx-auto mt-2 max-w-xs text-sm text-white/40">
            This link was created for single use only, and it&apos;s already been
            consumed once.
          </p>

          <div className="relative mt-6 flex justify-center">
            <span className="flex items-center gap-1.5 rounded-full bg-gray-400/10 px-3 py-1 text-xs font-medium text-gray-300">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
              Single used
            </span>
          </div>

          <div className="relative mt-6 rounded-xl border border-white/10 bg-white/2 p-4 text-left">
            <p className="mb-1 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-white/30">
              <Link2 size={11} />
              Short link
            </p>
            <p className="truncate text-sm font-semibold text-[#6ee7b7]">
              {`${import.meta.env.VITE_REDIRECT_URL}/${shortCode}`}

            </p>
          </div>

          {/* <p className="relative mt-4 flex items-center justify-center gap-1.5 text-xs text-white/30">
            <CheckCircle2 size={12} />
            Used on {usedOn}
          </p> */}

          <button
            type="button"
            onClick={() => navigate('/')}
            className="relative mt-7 cursor-pointer flex w-full items-center justify-center gap-2 rounded-xl bg-[#6ee7b7] px-4 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90"
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

export default SingleUsedPage;