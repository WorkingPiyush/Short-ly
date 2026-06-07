import React from 'react'

function PriceCategory() {
    const plans = [
        {
            name: 'Starter',
            price: 0,
            tag: 'Free',
            desc: 'Perfect for personal use and testing.',
            features: [
                '50 links per month',
                'Basic analytics',
                'Standard short URLs',
                'QR code generation',
            ],
            cta: 'Get started free',
            highlighted: false,
        },
        {
            name: 'Pro',
            price: 9,
            tag: 'Most popular',
            desc: 'For creators, marketers, and small teams.',
            features: [
                'Unlimited links',
                'Deep analytics + exports',
                'Custom slugs',
                'Link expiry and passwords',
                'API access',
            ],
            cta: 'Start 14-day trial',
            highlighted: true,
        },
        {
            name: 'Team',
            price: 29,
            tag: 'Enterprise',
            desc: 'For agencies and growing businesses.',
            features: [
                'Everything in Pro',
                'Team workspaces',
                'Bulk CSV shortening',
                'Priority support',
                'Custom domain',
            ],
            cta: 'Contact sales',
            highlighted: false,
        },
    ]

    return (
        <section className="dark:bg-[#0b0f0e] text-white py-20 px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                {plans.map((plan, i) => (
                    <div key={i} className={`rounded-2xl p-8 border ${plan.highlighted ? 'border-emerald-500 dark:bg-[#0f1a17] bg-gray-900' : 'border-gray-800 bg-[#0b0f0e]'}`}>
                        {/* Tag */}
                        <span className={`inline-block px-3 py-1 text-sm rounded-full mb-6 ${plan.highlighted
                            ? 'bg-emerald-400 dark:text-black text-white'
                            : 'dark:bg-transparent bg-white border border-gray-700 dark:text-gray-300 text-black'
                            }`}
                        >
                            {plan.tag}
                        </span>

                        {/* Title */}
                        <h3 className="text-2xl font-bold mb-2 text-white">{plan.name}</h3>

                        {/* Price */}
                        <div className="flex items-end gap-1 mb-3">
                            <span className="text-5xl font-bold ">${plan.price}</span>
                            <span className="dark:text-gray-400 text-gray-500">/mo</span>
                        </div>

                        {/* Desc */}
                        <p className="dark:text-gray-400 text-sm mb-6">{plan.desc}</p>

                        {/* Features */}
                        <ul className="space-y-3 mb-8">
                            {plan.features.map((f, idx) => (
                                <li key={idx} className="flex items-center gap-3 dark:text-gray-300">
                                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                                    {f}
                                </li>
                            ))}
                        </ul>

                        {/* Button */}
                        <button
                            className={`w-full py-3 rounded-lg border ${plan.highlighted
                                ? 'bg-emerald-400 text-black border-emerald-400'
                                : 'border-gray-700 text-white'
                                } hover:scale-105 cursor-pointer transition-all duration-200 ease-in`}
                        >
                            {plan.cta}
                        </button>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default PriceCategory
