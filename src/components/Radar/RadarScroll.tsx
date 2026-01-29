'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { AlertTriangle, Shield, Users, Building, Cpu, Globe } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

import RadarCard from './RadarCard'

const intelligenceVerticals = [
    {
        id: 1,
        title: 'Macro-Financial Forensics',
        sector: 'Financial',
        severity: 'Critical' as const,
        probability: '95%',
        icon: AlertTriangle,
        description: 'Predicting business model collapses and market shifts before they happen. Identifying the "Byju\'s Scenario" before it unfolds.',
        keywords: ['Business Model Collapse Prediction', 'Market Shift Analysis', 'Financial Forensics', 'Corporate Foresight'],
    },
    {
        id: 2,
        title: 'Statutory & Structural Intelligence',
        sector: 'Real Estate',
        severity: 'Critical' as const,
        probability: '90%',
        icon: Building,
        description: 'Predicting legal, zoning, and policy risks for large-scale real estate. The "Noida Twin Tower" foresight before demolition orders.',
        keywords: ['Zoning Risk Analysis', 'Policy Change Prediction', 'Real Estate Intelligence', 'Structural Risk Assessment'],
    },
    {
        id: 3,
        title: 'Geo-Environmental Risk',
        sector: 'Environmental',
        severity: 'High' as const,
        probability: '85%',
        icon: Globe,
        description: 'Long-term climate and geographical impact analysis for multi-generational assets. Protecting legacy wealth from environmental shifts.',
        keywords: ['Climate Risk Analysis', 'Environmental Impact Prediction', 'Multi-generational Asset Protection', 'Geographical Risk Intelligence'],
    },
    {
        id: 4,
        title: 'Succession & Legacy Forensics',
        sector: 'Family Office',
        severity: 'High' as const,
        probability: '80%',
        icon: Users,
        description: 'Predicting succession conflicts and family disputes before they threaten multi-generational wealth.',
        keywords: ['Succession Planning', 'Family Office Security', 'Legacy Protection', 'Wealth Transfer Intelligence'],
    },
    {
        id: 5,
        title: 'Regulatory Foresight',
        sector: 'Compliance',
        severity: 'High' as const,
        probability: '88%',
        icon: Shield,
        description: 'Anticipating regulatory changes that could impact business operations and asset values before announcements.',
        keywords: ['Regulatory Intelligence', 'Compliance Prediction', 'Policy Foresight', 'Government Action Analysis'],
    },
    {
        id: 6,
        title: 'Counter-Intelligence & TSCM',
        sector: 'Security',
        severity: 'Critical' as const,
        probability: '92%',
        icon: Cpu,
        description: 'Detecting and neutralizing corporate espionage attempts. Protecting sensitive negotiations and strategic decisions.',
        keywords: ['TSCM Services', 'Corporate Espionage Defense', 'Counter-Intelligence', 'Secure Communications'],
    },
]

export default function RadarScroll() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })

    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1])

    const [activeCard, setActiveCard] = useState<number | null>(null)

    return (
        <section ref={containerRef} className="relative min-h-screen py-32">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-grid-pattern" />
                </div>
            </div>

            {/* Animated Radar */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative w-[800px] h-[800px]">
                    {/* Radar Circles */}
                    {[1, 2, 3, 4].map((circle) => (
                        <div
                            key={circle}
                            className="absolute inset-0 border border-gray-800 rounded-full"
                            style={{
                                width: `${circle * 160}px`,
                                height: `${circle * 160}px`,
                                left: '50%',
                                top: '50%',
                                transform: 'translate(-50%, -50%)',
                            }}
                        />
                    ))}

                    {/* Scanning Line */}
                    <motion.div
                        className="absolute top-0 left-1/2 w-px h-1/2 origin-top"
                        style={{
                            background: 'linear-gradient(to bottom, transparent, #0ea5e9)',
                        }}
                        animate={{ rotate: 360 }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: 'linear'
                        }}
                    />
                </div>
            </div>

            <div className="container relative z-10 mx-auto px-6">
                <motion.div
                    style={{ opacity, scale }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center space-x-3 px-5 py-2.5 border border-champagne/20 rounded-none mb-8">
                        <div className="w-1.5 h-1.5 bg-champagne rounded-full" />
                        <span className="text-xs tracking-[0.2em] uppercase text-champagne font-light">
                            Strategic Foresight Capabilities
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-light mb-6">
                        <span className="text-white">Intelligence</span>{' '}
                        <span className="text-champagne">Verticals</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
                        Predictive forensics across financial, statutory, and environmental domains.
                        We identify catastrophic risks before they materialize.
                    </p>
                </motion.div>

                {/* Intelligence Verticals Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {intelligenceVerticals.map((risk, index) => (
                        <motion.div
                            key={risk.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true, amount: 0.3 }}
                            onMouseEnter={() => setActiveCard(risk.id)}
                            onMouseLeave={() => setActiveCard(null)}
                            className="relative"
                        >
                            <RadarCard
                                {...risk}
                                isActive={activeCard === risk.id}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Legend */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    viewport={{ once: true }}
                    className="mt-16 p-6 rounded-2xl glass-morphism max-w-2xl mx-auto"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { color: 'bg-red-500', label: 'Critical Risk', desc: 'Immediate action required' },
                            { color: 'bg-orange-500', label: 'High Risk', desc: 'Close monitoring needed' },
                            { color: 'bg-yellow-500', label: 'Medium Risk', desc: 'Standard protocols apply' },
                            { color: 'bg-green-500', label: 'Low Risk', desc: 'Routine surveillance' },
                        ].map((item) => (
                            <div key={item.label} className="flex items-center space-x-3">
                                <div className={`w-3 h-3 ${item.color} rounded-full`} />
                                <div>
                                    <p className="font-semibold text-white">{item.label}</p>
                                    <p className="text-sm text-gray-400">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}