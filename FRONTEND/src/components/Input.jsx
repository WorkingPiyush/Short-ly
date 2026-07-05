/* eslint-disable react/prop-types */
import React from 'react'

function Input({ type = "text", value, onChange, placeholder, className = "" }) {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full rounded-xl bg-[#FFFDF9] dark:bg-zinc-950 border border-[#E7DFD3] dark:border-zinc-700 px-3.5 py-3 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none  transition-all duration-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15 focus:bg-white dark:focus:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 dark:scheme-dark ${className}`}
        />
    );
}

export default Input
