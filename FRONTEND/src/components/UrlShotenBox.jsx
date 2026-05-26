import React from 'react'

function UrlShotenBox() {
    return (
        <div className='w-full max-w-2xl mx-auto p-0.5 rounded-2xl bg-linear-to-r from-zinc-700/40 to-zinc-500/20 mt-8'>
            <div className='flex items-center gap-2 bg-[#0f0f0f] rounded-xl p-2'>
                <input type="text"
                    placeholder='Enter your link'
                    className='flex-1 bg-gray-200/20 dark:bg-gray-300/20 text-white placeholder:text-white/60 
                     px-5 py-2 rounded-sm outline-none border border-zinc-700/50
                     focus:border-zinc-500 transition'
                />
                <button className="px-4 py-2.5 rounded-xl border border-zinc-600 
                           text-zinc-200 hover:bg-zinc-800 transition cursor-pointer">
                    Shorten it
                </button>
            </div>
        </div>
    )
}

export default UrlShotenBox
