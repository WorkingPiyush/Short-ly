import React from 'react'
import PriceCategory from './PriceCategory'

function PricingSection() {
    return (
        <div>
            <div className='flex flex-col items-center mt-5 p-5'>
                <span className='text-emerald-400 tracking-widest text-sm mb-4'>PRICING</span>
                <span className='text-4xl md:text-5xl text-center font-bold mb-6'>Simple, honest pricing</span>
                <span className='text-gray-400 text-sm leading-relaxed'>No hidden fees. Upgrade or downgrade anytime.</span>
            </div>
            <PriceCategory />
        </div>
    )
}

export default PricingSection
