'use client'

import { motion, useInView } from 'framer-motion'
import { Shield, Users, Globe, Target } from 'lucide-react'
import { useRef } from 'react'

const metrics = [
    { icon: Shield, label: 'Enterprise Clients', value: 150, suffix: '+' },
    { icon: Users, label: 'Fortune 500 Companies', value: 47, suffix: '' },
    { icon: Globe, label: 'Countries Covered', value: 12, suffix: '' },
    { icon: Target, label: 'Threats Neutralized', value: 234, suffix: '+' },
]

export default function IntelligenceMetrics() {
    const ref = useRef(null)
    const isInView = useInView(ref, { once: true })

    return (
        <section ref={ref} className="py-20 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-gray-900" />

            <div className="container relative z-10 mx-auto px-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {metrics.map((metric, index) => (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="text-center"
                        >
                            <div className="p-4 rounded-2xl glass-morphism mb-4 inline-block">
                                <metric.icon className="h-8 w-8 text-intelligence" />
                            </div>
                            <div className="text-4xl font-bold text-white mb-2">
                                {isInView ? metric.value : 0}{metric.suffix}
                            </div>
                            <div className="text-gray-400">{metric.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}