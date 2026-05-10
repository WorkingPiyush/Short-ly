import React from 'react'
import { Link } from 'react-router-dom'

function Logo(setIsOpen) {
    return (
        <div className="flex items-center gap-2 cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_8px_#6ee7b7aa]" />
            <Link to="/" onClick={() => setIsOpen(false)} className="font-extrabold text-[15px] md:text-[22px] text-white tracking-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                Short-ly
            </Link>
        </div>
    )
}

export default Logo
