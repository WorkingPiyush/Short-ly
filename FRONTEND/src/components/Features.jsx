import React from 'react'
import { Link, Activity, Lock, Database, QrCode, Layers } from "lucide-react";

function Features() {
    const features = [
        {
            icon: Link,
            title: "Custom slugs",
            desc: "Brand your links with memorable, custom short URLs that reflect your identity.",
        },
        {
            icon: Activity,
            title: "Deep analytics",
            desc: "Track clicks, devices, countries, and referrers in real-time with beautiful dashboards.",
        },
        {
            icon: Lock,
            title: "Link protection",
            desc: "Password-protect sensitive links and set expiry dates for time-sensitive campaigns.",
        },
        {
            icon: Database,
            title: "Bulk shortening",
            desc: "Upload a CSV and shorten thousands of URLs in one click. Perfect for campaigns.",
        },
        {
            icon: QrCode,
            title: "QR codes",
            desc: "Auto-generate QR codes for every shortened URL. Download in SVG or PNG instantly.",
        },
        {
            icon: Layers,
            title: "API access",
            desc: "Integrate into your stack with a RESTful API and official SDKs.",
        },
    ];


    return (
        <div className="max-w-6xl mx-auto px-4 py-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                {features.map((item, i) => {
                    const Icon = item.icon;

                    return (
                        <div
                            key={i}
                            className="border dark:bg-[#0f0f0f] dark:border-zinc-800 bg-gray-300 border-zinc-400 rounded-2xl p-6
                         hover:border-zinc-700 transition-all duration-200 ease-in"
                        >

                            {/* Icon box */}
                            <div className="w-12 h-12 flex items-center justify-center 
                              rounded-xl dark:bg-emerald-500/10 bg-emerald-500 border dark:border-emerald-500/20 border-emerald-500 mb-5">
                                <Icon className="w-6 h-6 dark:text-emerald-400 text-white" />
                            </div>

                            {/* Title */}
                            <h3 className="text-lg font-semibold dark:text-white text-black mb-2">
                                {item.title}
                            </h3>

                            {/* Description */}
                            <p className="dark:text-zinc-400 text-zinc-800 text-sm leading-relaxed">
                                {item.desc}
                            </p>

                        </div>
                    );
                })}

            </div>
        </div>
    )
}

export default Features
