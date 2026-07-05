import React from 'react'

// eslint-disable-next-line react/prop-types
function StatusCard({ status }) {
    return (
        <span className={`inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-full border
            ${status === "expired" ? "bg-red-400/10 text-red-400 border-red-400/20" :
                status === "scheduled" ? "bg-yellow-500/70 text-white border-yellow-400/20" :
                    status === "used" ? "bg-yellow-400/10 text-yellow-400 border-gray-400/20"
                        : "bg-emerald-300/10 text-emerald-300 border-emerald-300/25"
            }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === "expired" ? "bg-red-400" : status === "scheduled" ? "bg-yellow-300" : status === "used" ? "bg-gray-900" : "bg-emerald-300"}`} />
            {status === "expired" ? "Expired" : status === "scheduled" ? "Scheduled" : status === "used" ? "Single Used" : "Active"}
        </span>
    )
}

export default StatusCard
