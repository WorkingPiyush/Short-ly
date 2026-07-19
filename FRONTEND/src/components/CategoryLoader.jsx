import { Folder } from "lucide-react";

export default function CategoryPageSkeleton() {
    return (
        <div className="min-h-screen bg-[#0a0a0a] animate-pulse" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            <div className="mx-auto max-w-6xl">
                {/* Folder Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i}>
                            <div className="rounded-3xl border border-white/10 bg-[#0d0d0d] p-5">
                                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                                    <div className="h-10 w-10 rounded bg-white/10" />
                                </div>
                                <div className="h-7 w-25 rounded-md bg-white/10" />
                                <div className="mt-3 h-4 w-16 rounded bg-white/10" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};