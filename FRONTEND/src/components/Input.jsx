/* eslint-disable react/prop-types */
import React from 'react'

function Input({ type = "text", value, onChange, placeholder, className = "" }) {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full bg-white/4 border border-white/9 rounded-xl
        px-3.5 py-3 text-sm text-white placeholder-white/20
        outline-none focus:border-emerald-300/35 focus:bg-emerald-300/2
        transition-all duration-200 scheme-dark ${className}`}
        />
    );
}

export default Input
