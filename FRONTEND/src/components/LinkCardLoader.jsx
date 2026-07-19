function LinkCardLoader() {
    return (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl bg-white dark:bg-zinc-900/60 p-5 animate-pulse">
            {/* Top Row */}
            <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex-1 min-w-0">
                    {/* Original URL */}
                    <div className="h-5 w-3/4 rounded-md bg-zinc-200 dark:bg-zinc-800 mb-3" />

                    {/* Short URL */}
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                        <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
                        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                    </div>

                    {/* Tags */}
                    <div className="flex gap-2 mt-4 flex-wrap">
                        <div className="h-7 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                        <div className="h-7 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                        <div className="h-7 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 shrink-0">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800"
                        />
                    ))}
                </div>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center gap-3 flex-wrap">
                <div className="h-7 w-20 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-7 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-7 w-36 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 w-44 rounded bg-zinc-200 dark:bg-zinc-800" />
            </div>
        </div>
    );
}
export default LinkCardLoader;