/* eslint-disable react/prop-types */
import React from 'react'

function ToggleBtn({ checked, onChange }) {
    return (
        <div onClick={() => onChange(!checked)}
            className={`relative w-10 h-5.5 rounded-full border cursor-pointer transition-all duration-250 shrink-0 ${checked ? "dark:bg-emerald-300 bg-black dark:border-emerald-300 border-zinc-300" : "bg-white/6 dark:border-white/12 border-black/30"}`}>
            <span className={`absolute top-0.75 w-4 h-4 rounded-full transition-all duration-250 ${checked ? "left-5 dark:bg-zinc-900 bg-white" : "left-0.75 dark:bg-white/40 bg-black"}`} />
        </div>
    );
}

export default ToggleBtn
