import React from 'react'

// eslint-disable-next-line react/prop-types
function Toggle({ checked, onChange, label }) {
    return (
        <label className="flex items-center gap-2.5 cursor-pointer select-none group">
            <div onClick={() => onChange(!checked)} className={`relative w-9 h-5 rounded-full border transition-all duration-200 shrink-0
          ${checked ? "dark:bg-emerald-300 bg-gray-400 dark:border-emerald-300 border-black/10" : "dark:bg-white/5 dark:border-white/15 border-black/10"}`}>

                <span className={`absolute top-0.75 w-3.5 h-3.5 rounded-full transition-all duration-200 ${checked ? "left-4.5 dark:bg-zinc-900 bg-gray-600" : "left-0.75 dark:bg-white/40 bg-zinc-900"}`} />
            </div> 
            <span className="text-[13px] dark:text-white/50 dark:group-hover:text-white/70 group-hover:text-gray-900 transition-colors duration-200">
                {label}
            </span>
        </label>
    );
}

export default Toggle
