import React, { useEffect } from 'react'
import Hero from '../../components/Hero'
import Stats from '../../components/Stats'
import WhyShortly from '../../components/WhyShortly'
import Features from '../../components/Features'
import HowItWorks from '../../components/HowItWorks'
import PricingSection from '../../components/PricingSection'
import ActionPoster from '../../components/ActionPoster'
import FadeUp from '../../animation/framer-motion'
import { useUser } from '@/Hooks/useAuth'

function Home() {
    const { data: user, isLoding } = useUser()
    return (
        <div className='h-full'>
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
                <PricingSection plan={user?.plan} />
            </FadeUp>
            {!user && <FadeUp>
                <ActionPoster />
            </FadeUp>}
        </div>
    )
}

export default Home
