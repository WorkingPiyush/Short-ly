import React from 'react'

// eslint-disable-next-line react/prop-types
function Toggle({ checked, onChange, label }) {
    return (
        <label className="flex items-center gap-2.5 cursor-pointer select-none group">
            <div onClick={() => onChange(!checked)} className={`relative w-9 h-5 rounded-full border transition-all duration-200 shrink-0
          ${checked ? "bg-emerald-300 border-emerald-300" : "bg-white/5 border-white/15"}`}>

                <span className={`absolute top-0.75 w-3.5 h-3.5 rounded-full transition-all duration-200 ${checked ? "left-4.5 bg-zinc-900" : "left-0.75 bg-white/40"}`} />
            </div> 
            <span className="text-[13px] text-white/50 group-hover:text-white/70 transition-colors duration-200">
                {label}
            </span>
        </label>
    );
}

export default Toggle
