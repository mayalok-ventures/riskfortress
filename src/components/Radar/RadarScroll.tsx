'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { AlertTriangle, Shield, Users, Building, Cpu, Globe } from 'lucide-react'
import RadarCard from './RadarCard'

const riskData = [
    {
        id: 1,
        title: 'Labor Unrest Prediction',
        sector: 'Industrial',
        severity: 'High',
        probability: '75%',
        icon: Users,
        description: 'AI-driven analysis of labor patterns to predict and prevent industrial strikes',
        keywords: ['Labor Unrest Prediction', 'Factory Encroachment Monitoring', 'Industrial Risk Management'],
    },
    {
        id: 2,
        title: 'Land Due Diligence',
        sector: 'Real Estate',
        severity: 'Critical',
        probability: '90%',
        icon: Building,
        description: 'Comprehensive land title verification and encroachment risk assessment',
        keywords: ['Land Due Diligence India', 'Greenfield Project Risk Assessment', 'Asset Hardening Solutions'],
    },
    {
        id: 3,
        title: 'TSCM Services',
        sector: 'Technical',
        severity: 'High',
        probability: '65%',
        icon: Cpu,
        description: 'Technical Surveillance Counter-Measures for corporate espionage detection',
        keywords: ['TSCM Services India', 'Digital Espionage Defense', 'Secure Communication Channels'],
    },
    {
        id: 4,
        title: 'Family Office Security',
        sector: 'HNI',
        severity: 'Medium',
        probability: '80%',
        icon: Shield,
        description: 'Complete security architecture for ultra-high-net-worth families',
        keywords: ['Family Office Risk Management', 'HNI Executive Protection', 'Legacy Succession Security'],
    },
    {
        id: 5,
        title: 'Geo-political Intelligence',
        sector: 'Strategic',
        severity: 'High',
        probability: '70%',
        icon: Globe,
        description: 'Real-time analysis of geopolitical events impacting business operations',
        keywords: ['Geo-political Risk Intelligence', 'Business Continuity Planning', 'Corporate Sovereignty Protection'],
    },
    {
        id: 6,
        title: 'Insider Threat Detection',
        sector: 'Corporate',
        severity: 'Critical',
        probability: '85%',
        icon: AlertTriangle,
        description: 'Advanced behavioral analytics to identify potential insider threats',
        keywords: ['Insider Threat Detection', 'Predictive Risk Analytics', 'Enterprise Risk Management'],
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
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-gray-300">Live Risk</span>{' '}
                        <span className="gradient-text">Intelligence Radar</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Real-time monitoring of emerging threats across Industrial, HNI, and Corporate sectors.
                        No security guards. Only predictive intelligence.
                    </p>
                </motion.div>

                {/* Radar Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {riskData.map((risk, index) => (
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