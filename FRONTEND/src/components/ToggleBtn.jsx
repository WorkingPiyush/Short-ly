/* eslint-disable react/prop-types */
import React from 'react'

function ToggleBtn({ checked, onChange }) {
    return (
        <div onClick={() => onChange(!checked)}
            className={`relative w-10 h-5.5 rounded-full border cursor-pointer transition-all duration-250 shrink-0
        ${checked ? "bg-emerald-300 border-emerald-300" : "bg-white/6 border-white/12"}`}>
            <span className={`absolute top-0.75 w-4 h-4 rounded-full transition-all duration-250
          ${checked ? "left-5 bg-zinc-900" : "left-0.75 bg-white/40"}`} />
        </div>
    );
}

export default ToggleBtn
