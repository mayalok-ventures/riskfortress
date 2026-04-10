'use client'

import { MotionDiv } from '@/lib/motion'
import { Shield, Eye, Lock } from 'lucide-react'

const valueProps = [
    {
        icon: Shield,
        title: 'Beyond Compliance',
        description: 'Traditional risk management reacts to threats. We predict them — identifying the fractures in governance, regulation, and market structure that precede catastrophic loss.',
    },
    {
        icon: Eye,
        title: 'Forensic Foresight',
        description: 'Our intelligence methodology combines statutory forensics, macro-financial analysis, and geo-environmental mapping to deliver foresight that no single discipline can provide.',
    },
    {
        icon: Lock,
        title: 'Absolute Confidentiality',
        description: 'Every engagement is protected by military-grade encryption and zero-retention protocols. Our advisors\' identities are as rigorously protected as our clients\' assets.',
    },
]

export default function Testimonials() {
    return (
        <section className="py-32 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950" />

            <div className="container relative z-10 mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-light mb-6">
                        <span className="text-white">Why</span>{' '}
                        <span className="text-champagne">RiskFortress</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
                        Preserving generational wealth through absolute foresight.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {valueProps.map((prop, index) => (
                        <MotionDiv
                            key={prop.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            viewport={{ once: true, amount: 0.1 }}
                            className="p-8 rounded-2xl glass-morphism border border-gray-800 hover:border-champagne/30 transition-all"
                        >
                            <div className="p-3 rounded-xl bg-champagne/10 inline-block mb-6">
                                <prop.icon className="h-8 w-8 text-champagne" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-4">{prop.title}</h3>
                            <p className="text-gray-400 leading-relaxed">{prop.description}</p>
                        </MotionDiv>
                    ))}
                </div>
            </div>
        </section>
    )
}
