import React from 'react'

function InfoCard({ label, value, footer }) {
    return (
        <div className="rounded-2xl bg-linear-to-br from-[#FFFDF9] to-[#F7F2EA] dark:from-zinc-900 dark:to-zinc-950 border border-[#E7DFD3] dark:border-zinc-800 shadow-sm cursor-pointer px-4 py-4
                 transition-all duration-200 hover:scale-102 hover:shadow-sm hover:shadow-black hover:-translate-y-0.5 ">
            <p className="text-[10px] font-medium text-zinc-500 dark:text-zinc-500 tracking-[.06em] uppercase mb-2">
                {label}
            </p>
            <p className="font-extrabold text-[26px] text-zinc-900 dark:text-white leading-none tracking-tight mb-1"
                style={{ fontFamily: "'Syne', sans-serif" }}>
                {value}
            </p>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500">{footer}</p>
        </div>
    )
}

export default InfoCard;
