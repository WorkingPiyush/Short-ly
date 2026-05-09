import React from 'react'

function ActionPoster() {
    return (
        <div className='flex justify-center m-15'>
            <div className='w-full max-w-6xl rounded-3xl border border-emerald-500/20 bg-[#0f1a17] px-6 py-15 md:py-10 text-center'>
                <h1 className='text-4xl md:text-6xl font-bold text-white leading-tight'>Start shortening for free today</h1>
                <p className='max-w-3xl mx-auto mt-6 text-lg text-zinc-400 leading-relaxed'>  Join over 50,000 users who trust Short-ly to make their links
                    cleaner, smarter, and trackable.</p>
                <div className='flex flex-col sm:flex-row justify-center gap-2 md:gap-4 mt-5 md:mt-10'>
                    <button className="px-6 py-3 rounded-xl border border-zinc-700 bg-black text-white cursor-pointer hover:border-zinc-500 transition">Create free account</button>
                    <button className="px-6 py-3 rounded-xl border border-zinc-700 bg-black text-zinc-300 cursor-pointer hover:border-zinc-500 hover:text-white transition">View live demo</button>
                </div>
            </div>
        </div>
    )
}

export default ActionPoster
