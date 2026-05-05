import React from 'react'
import Urlbox from './Urlbox'

function Hero() {
    return (
        <div>
            <div className='text-4xl text-center font-bold'>
                <h1 className='font-extrabold'>Build stronger digital connections</h1>
                <span className='text-2xl p-8 tracking-tight'>Use our URL shortener, QR Codes, and landing pages to engage your audience and connect them to the right information. Build,edit, and track everything inside the Bitly Connections Platform.</span>
            </div>
            <Urlbox />
        </div>
    )
}

export default Hero
