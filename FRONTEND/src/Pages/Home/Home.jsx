import React from 'react'
import Hero from '../../components/Hero'
import Stats from '../../components/Stats'
import WhyShortly from '../../components/WhyShortly'
import Features from '../../components/Features'
import HowItWorks from '../../components/HowItWorks'
import PricingSection from '../../components/PricingSection'
import ActionPoster from '../../components/ActionPoster'

function Home() {
    return (
        <div className='h-full text-white'>
            <Hero />
            <Stats />
            <WhyShortly />
            <Features />
            <HowItWorks />
            <PricingSection />
            <ActionPoster />
        </div>
    )
}

export default Home
