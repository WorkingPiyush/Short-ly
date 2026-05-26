import React from 'react'

function HowItWorks() {
    const steps = [
        {
            id: '01',
            title: 'Paste your URL',
            desc: 'Drop any long, messy link into the box. We accept any valid URL, no sign-up required to start.',
        },
        {
            id: '02',
            title: 'Customize it',
            desc: 'Choose a custom slug, set an expiry, or add a password. Or just click shorten for instant results.',
        },
        {
            id: '03',
            title: 'Share and track',
            desc: 'Copy your short link and share it anywhere. Watch clicks roll in through your analytics dashboard.',
        },
    ]
    return (
        <section className="dark:bg-[#0f0f0f]  mx-auto w-fit p-10 rounded-2xl border border-zinc-800 dark:text-white text-black hover:border-zinc-700 transition-all duration-150 ease-in-out">
            {/* Top heading */}
            <div className="text-center mb-20">
                <p className="text-emerald-400 tracking-widest text-sm mb-4">HOW IT WORKS</p>
                <h2 className="text-4xl md:text-5xl font-bold">Three steps to shorter</h2>
            </div>
            {/* Steps */}
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 relative py-8">

                {steps.map((step, i) => (
                    <div key={i} className="text-center relative">
                        {/* divider */}
                        {i !== steps.length - 1 && (
                            <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 h-40 w-px bg-gray-800" />
                        )}


                        <div className="text-7xl font-bold text-emerald-900 opacity-30 mb-6">
                            {step.id}
                        </div>


                        <h3 className="text-xl font-semibold mb-3">
                            {step.title}
                        </h3>


                        <p className="text-gray-400 text-sm leading-relaxed">
                            {step.desc}
                        </p>
                    </div>
                ))}

            </div>
        </section>
    )
}

export default HowItWorks
