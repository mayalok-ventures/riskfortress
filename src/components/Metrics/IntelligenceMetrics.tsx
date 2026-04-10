'use client'

import { useInView } from 'framer-motion'
import { MotionDiv } from '@/lib/motion'
import { Shield, Eye, Lock, Target } from 'lucide-react'
import { useRef } from 'react'

const pillars = [
    { icon: Shield, title: 'Absolute Discretion', subtitle: 'Every engagement is confidential by design' },
    { icon: Eye, title: 'Predictive Intelligence', subtitle: 'We identify crises before they become catastrophes' },
    { icon: Lock, title: '₹100Cr+ Threshold', subtitle: 'We only engage where the stakes are existential' },
    { icon: Target, title: '1% Fee Model', subtitle: 'Aligned incentives — we succeed only when you don\'t lose' },
]

export default function IntelligenceMetrics() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    return (
        <section ref={ref} className="py-20 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-gray-900" />

            <div className="container relative z-10 mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {pillars.map((pillar, index) => (
                        <MotionDiv
                            key={pillar.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="p-4 rounded-2xl glass-morphism mb-4 inline-block">
                                <pillar.icon className="h-8 w-8 text-intelligence" />
                            </div>
                            <div className="text-lg font-semibold text-white mb-2">
                                {pillar.title}
                            </div>
                            <div className="text-sm text-gray-400">{pillar.subtitle}</div>
                        </MotionDiv>
                    ))}
                </div>
            </div>
        </section>
    )
}
