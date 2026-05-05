import React from 'react'
import Hero from '../../components/Hero'
import Stats from '../../components/Stats'
import WhyShortly from '../../components/WhyShortly'
import Features from '../../components/Features'

function Home() {
    return (
        <div className='h-full text-white'>
            <Hero />
            <Stats />
            <WhyShortly />
            <Features />
        </div>
    )
}

export default Home
