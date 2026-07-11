/* eslint-disable react/prop-types */
import React from 'react'

function Section({ icon, title, children }) {
    return (
        <div className="bg-[#FFFCF7] dark:bg-zinc-900/60 border border-[#eae8e4] dark:border-zinc-800 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 text-[11px] font-medium dark:text-white/40 text-zinc-900 tracking-[.08em] uppercase mb-5">
                {icon}
                {title}
            </div>
            {children}
        </div>
    );
}

export default Section
