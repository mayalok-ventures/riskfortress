'use client'

import { motion } from 'framer-motion'
import { Shield, TrendingDown, Zap, Lock } from 'lucide-react'

import AnimateOnScroll from '@/components/AnimateOnScroll'
import { staggerContainer, scaleIn } from '@/lib/animations'

const pillars = [
    {
        icon: Shield,
        title: 'Enterprise Value Protection',
        subtitle: 'Engineered for high-margin SaaS & Hybrid Consulting',
    },
    {
        icon: TrendingDown,
        title: 'Forensic Architecture',
        subtitle: 'Identifying silent valuation killers before they strike',
    },
    {
        icon: Zap,
        title: 'Deployment Speed',
        subtitle: 'Rapid infrastructure securization, zero operational drag',
    },
    {
        icon: Lock,
        title: 'Zero-Disclosure Architecture',
        subtitle: 'Client identities & threat models strictly embargoed',
    },
]

export default function IntelligenceMetrics() {
    return (
        <section className="py-20 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-gray-900" />

            <div className="container relative z-10 mx-auto px-6">
                <AnimateOnScroll variants={staggerContainer}>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {pillars.map((pillar, index) => (
                            <AnimateOnScroll
                                key={pillar.title}
                                variants={scaleIn}
                                delay={index * 0.1}
                                className="text-center"
                            >
                                <motion.div
                                    className="p-4 rounded-2xl glass-morphism mb-4 inline-block"
                                    whileHover={{ scale: 1.08, y: -2 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                >
                                    <pillar.icon className="h-8 w-8 text-champagne" />
                                </motion.div>
                                <div className="text-lg font-light text-white mb-2">
                                    {pillar.title}
                                </div>
                                <div className="text-sm text-gray-400">{pillar.subtitle}</div>
                            </AnimateOnScroll>
                        ))}
                    </div>
                </AnimateOnScroll>
            </div>
        </section>
    )
}
