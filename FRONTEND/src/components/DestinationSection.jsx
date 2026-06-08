/* eslint-disable react/prop-types */
import React from 'react'

function Section({ icon, title, children }) {
    return (
        <div className="bg-white/3 border border-white/8 rounded-[18px] p-6 mb-3.5">
            <div className="flex items-center gap-2 text-[11px] font-medium text-white/40
        tracking-[.08em] uppercase mb-5">
                {icon}
                {title}
            </div>
            {children}
        </div>
    );
}

export default Section
