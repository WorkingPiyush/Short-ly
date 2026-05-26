import React from 'react'
import UrlShotenBox from './UrlShotenBox'
import { useTheme } from '../Context/ThemeContext';

function Hero() {
    // bg-white text-black dark:bg-zinc-900 dark:text-white
    return (
        <div className='flex flex-col items-center justify-center mt-40'>
            <div className='inline-flex items-center gap-2 px-5 py-2 rounded-full bg-linear-to-r from-emerald-500/10 to-emerald-400/5 border border-emerald-400/20 text-emerald-300 text-xs font-medium shadow-[0_0_20px_rgba(16,185,129,0,0.15)] md:text-sm'>
                <span className="w-2 h-2 rounded-full bg-emerald-300 shadow-[0_0_8px_#6ee7b7aa]" />
                <span>Trusted by 50,000+ users worldwide</span>
            </div>
            <div className='flex flex-col items-center mt-8 font-gravitas text-3xl md:text-4xl'>
                <span className='text-black dark:text-white'>Make every link</span>
                <span className='text-emerald-300 text-center'>unforgettably short</span>
            </div>
            <div className='flex flex-1 flex-col justify-center items-center text-black dark:text-white/50 mt-7 font-roboto text-center text-xs md:text-2xl'>
                <span>Shorten, brand and track your URLs in seconds. Powerful</span>
                <span>analytics, custom slugs and zero clutter.</span>
            </div>
            <UrlShotenBox />
        </div>
    )
}

export default Hero