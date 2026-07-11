/* eslint-disable react/prop-types */
import React from 'react'

function Field({ label, hint, children }) {
    return (
        <div className="mb-4 last:mb-0">
            {label && (
                <label className="block text-[12px] font-medium dark:text-white/45 text-zinc-800 mb-1.5">
                    {label}
                </label>
            )}
            {children}
            {hint && (
                <p className="text-[11px] dark:text-white/25 mt-1.5 leading-relaxed">{hint}</p>
            )}
        </div>
    );
}

export default Field
