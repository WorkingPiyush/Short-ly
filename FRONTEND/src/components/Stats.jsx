import React from 'react'

function Stats() {
    const stats = [
        { value: "2B+", label: "Links shortened" },
        { value: "50K+", label: "Active users" },
        { value: "99.9", label: "Uptime SLA" },
        { value: "140+", label: "Countries served" },
    ];
    return (
        <div className="w-full border-y border-zinc-800 bg-black mt-18 mb-18 py-8">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">

                {stats.map((stat, i) => (
                    <div key={i} className="space-y-2">

                        <h2 className="text-4xl md:text-5xl font-bold text-white">
                            {stat.value.split(/(\+)/)[0]}
                            {stat.value.includes("+") && (
                                <span className="text-emerald-400">+</span>
                            )}
                            {stat.value.includes(".9") && (
                                <span className="text-emerald-400">%</span>
                            )}
                        </h2>

                        <p className="text-zinc-500 text-sm">
                            {stat.label}
                        </p>

                    </div>
                ))}
            </div>

        </div>
    )
}

export default Stats
