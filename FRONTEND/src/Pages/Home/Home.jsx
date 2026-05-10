import React from 'react'
import Hero from '../../components/Hero'
import Stats from '../../components/Stats'
import WhyShortly from '../../components/WhyShortly'
import Features from '../../components/Features'
import HowItWorks from '../../components/HowItWorks'
import PricingSection from '../../components/PricingSection'
import ActionPoster from '../../components/ActionPoster'
import FadeUp from '../../animation/framer-motion'

function Home() {
    return (
        <div className='h-full text-white'>
            <Hero />
            <Stats />
            <FadeUp>
                <WhyShortly />
            </FadeUp>
            <FadeUp>
                <Features />
            </FadeUp>
            <FadeUp>
                <HowItWorks />
            </FadeUp>
            <FadeUp>
                <PricingSection />
            </FadeUp>
            <FadeUp>
                <ActionPoster />
            </FadeUp>
        </div>
    )
}

export default Home
