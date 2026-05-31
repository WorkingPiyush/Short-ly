import React from 'react'
import '../index.css'
import toast from 'react-hot-toast'

// eslint-disable-next-line react/prop-types
function ShorturlResult({ shortUrl }) {
    const copyBtn = () => {
        navigator.clipboard.writeText(shortUrl);
        toast.success("Link Copied !!")
    }

    return (
        <div className='mt-5 flex justify-around rounded-xl bg-linear-to-r dark:from-emerald-500/10 dark:to-emerald-400/5 from-emerald-500 to-emerald-900 border dark:border-emerald-400/20 border-emerald-700 text-emerald-300 font-medium shadow-[0_0_20px_rgba(16,185,129,0,0.15)] text-center text-sm md:text-xl p-4 w-full max-w-xl animate-slide-down'>
            <div className='flex justify-center text-white items-center w-[80%]'>
                <p>{shortUrl}</p>
            </div>
            <button onClick={copyBtn} className='bg-gray-200/20 dark:bg-gray-300/10 text-white outline-none border border-zinc-600 cursor-pointer px-4 py-2 min-w-20 rounded-sm text-xs md:text-sm active:scale-105'>Copy</button>
        </div>
    )
}

export default ShorturlResult