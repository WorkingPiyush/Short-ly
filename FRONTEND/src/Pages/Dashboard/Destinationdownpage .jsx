/* eslint-disable react/prop-types */
import React from "react";
import { AlertTriangle, ArrowLeft, Link2 } from "lucide-react";
import { useParams } from "react-router-dom";

function DestinationDownPage({ onGoBack }) {
    const params = useParams()
    const shortUrl = `${import.meta.env.VITE_BACKEND_URL}/${params.shortCode}`;

    const handleRetry = async () => {
        window.location.replace(shortUrl);
    };

    return (
        <div
            className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-6 py-10"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <div className="w-full max-w-md">
                <div className="relative overflow-hidden rounded-2xl border border-red-400/20 bg-[#0a0a0a] p-8 shadow-[0_0_40px_-20px_rgba(248,113,113,0.35)]">
                    <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-red-400/10 blur-3xl" />

                    <div className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-400/20 bg-red-400/10">
                        <AlertTriangle size={26} className="text-red-400" />
                    </div>

                    <h1
                        className="relative text-center text-2xl font-bold text-white"
                        style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                        Destination unreachable
                    </h1>
                    <p className="relative mx-auto mt-2 max-w-xs text-center text-sm text-white/40">
                        We couldn&apos;t reach the website this link points to. It may be
                        temporarily down or no longer available.
                    </p>

                    <div className="relative mt-6 flex justify-center">
                        <span className="flex items-center gap-1.5 rounded-full bg-red-400/10 px-2 py-1 text-xs cursor-pointer transition-all font-medium text-red-400 hover:scale-104">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                            Down
                        </span>
                    </div>

                    <div className="relative text-center mt-6 space-y-3 rounded-xl border border-white/10 bg-white/2 p-4">
                        <div>
                            <p className="mb-1 flex justify-center items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-white/30">
                                <Link2 size={11} />
                                Short link
                            </p>
                            <p className="truncate text-sm font-semibold text-[#6ee7b7]">
                                {shortUrl}
                            </p>
                        </div>
                    </div>

                    <div className="relative mt-7 flex flex-col gap-2.5">
                        <button
                            type="button"
                            onClick={handleRetry}
                            className="flex items-center justify-center gap-2 rounded-xl bg-[#6ee7b7] px-4 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
                        >
                            Check Status
                        </button>

                        <button
                            type="button"
                            onClick={onGoBack}
                            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                        >
                            <ArrowLeft size={15} />
                            Go back
                        </button>
                    </div>
                </div>

                <p className="mt-5 text-center text-xs text-white/25">
                    Powered by{" "}
                    <span className="font-semibold text-white/40"
                        style={{ fontFamily: "'Syne', sans-serif" }}>
                        Shortly
                    </span>
                </p>
            </div>
        </div>
    );
}
export default DestinationDownPage;