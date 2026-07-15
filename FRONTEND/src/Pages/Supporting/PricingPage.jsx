import React from "react";
import { Check, Sparkles } from "lucide-react";
import { useUser } from "@/Hooks/useAuth";

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
  },
]

export default function PricingPage() {
  const { data: user } = useUser()
  const Currentplan = user?.plan;

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] px-6 py-16"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mt-14 max-w-xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6ee7b7]/10 px-3 py-1 text-xs font-medium text-[#6ee7b7]">
            <Sparkles size={12} />
            Pricing
          </span>
          <h1 className="mt-4 text-2xl font-bold text-white sm:text-4xl" style={{ fontFamily: "'Syne', sans-serif" }}>
            Simple pricing, no surprises
          </h1>
          <p className="mt-3 text-sm text-white/40 sm:text-base">
            Start with Starter. Upgrade when you need more links, more insight, or
            more control.
          </p>
        </div>
        <div className="max-w-6xl mt-10 mx-auto grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div key={i} className={`rounded-2xl p-8 border hover:scale-102 transition-all ${plan.tag.toUpperCase() === Currentplan ? 'border-emerald-500 dark:bg-[#0f1a17] bg-gray-900' : 'border-gray-800 bg-[#0b0f0e]'}`}>

              <span className={`inline-block px-3 py-1 text-sm rounded-full mb-6 ${plan.tag.toUpperCase() === Currentplan
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
              <ul className="space-y-3 mb-8 h-40">
                {plan.features.map((f, idx) => (
                  <li key={idx} className="flex items-center gap-3 dark:text-gray-300">
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button
                className={`w-full py-3 rounded-lg border ${plan.tag.toUpperCase() === Currentplan
                  ? 'bg-emerald-400 text-black border-emerald-400 active:scale-95'
                  : 'border-gray-700 text-white active:scale-102'
                  } cursor-pointer transition-all duration-200 ease-in`}
              >
                {plan.tag.toUpperCase() === Currentplan ? "Your current paln" : plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
