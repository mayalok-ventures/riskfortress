'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Factory, Users, Cpu, ChevronRight, Shield, Lock, Target } from 'lucide-react'
import { useState } from 'react'

const sectors = [
    {
        id: 'financial',
        title: 'Macro-Financial Forensics',
        icon: Factory,
        color: 'from-champagne to-champagne-dark',
        borderColor: 'border-champagne/30',
        capabilities: [
            'Business Model Collapse Prediction',
            'Market Shift Analysis',
            'Corporate Governance Forensics',
            'Pre-Investment Risk Intelligence',
            'Competitor Vulnerability Assessment',
            'Financial Fraud Early Detection',
            'Exit Strategy Risk Analysis',
        ],
        caseStudy: 'Identified governance gaps in a ₹3,000Cr enterprise 18 months before public collapse (The "Byju\'s Scenario")',
        clients: 'Private Equity Firms, Industrial Conglomerates, Ultra-HNWIs investing in ventures',
    },
    {
        id: 'statutory',
        title: 'Statutory & Structural Intelligence',
        icon: Users,
        color: 'from-champagne to-champagne-dark',
        borderColor: 'border-champagne/30',
        capabilities: [
            'Zoning & Land Use Risk Prediction',
            'Regulatory Change Forecasting',
            'Political Risk Assessment',
            'Infrastructure Policy Analysis',
            'Title & Encumbrance Forensics',
            'Multi-jurisdiction Compliance Foresight',
            'Developer Risk Profiling',
        ],
        caseStudy: 'Predicted demolition risk for ₹800Cr real estate project 2 years before regulatory action (The "Noida Twin Tower" foresight)',
        clients: 'Large Developers, Real Estate Conglomerates, Infrastructure Companies',
    },
    {
        id: 'environmental',
        title: 'Geo-Environmental Risk',
        icon: Cpu,
        color: 'from-champagne to-champagne-dark',
        borderColor: 'border-champagne/30',
        capabilities: [
            'Climate Impact Projection (30-50 years)',
            'Geographical Vulnerability Mapping',
            'Multi-generational Asset Protection',
            'Coastal & Flood Risk Analysis',
            'Agricultural Land Viability',
            'Resource Scarcity Forecasting',
            'Environmental Litigation Risk',
        ],
        caseStudy: 'Protected ₹1,200Cr multi-generational agricultural holdings from 30-year climate impact trajectory',
        clients: 'Family Offices, Agricultural Dynasties, Multi-generational Asset Owners',
    },
]

export default function SectorFocus() {
    const [activeSector, setActiveSector] = useState(sectors[0])

    return (
        <section className="relative py-32">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-gray-900">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-industrial/20 to-transparent" />
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-legacy/20 to-transparent" />
                </div>
            </div>

            <div className="container relative z-10 mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center space-x-3 px-5 py-2.5 border border-champagne/20 rounded-none mb-8">
                        <div className="w-1.5 h-1.5 bg-champagne rounded-full" />
                        <span className="text-xs tracking-[0.2em] uppercase text-champagne font-light">
                            Core Intelligence Domains
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-light mb-6">
                        <span className="text-white">Forensic</span>{' '}
                        <span className="text-champagne">Specializations</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
                        Three core verticals where predictive forensics prevents catastrophic wealth destruction.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {/* Sector Selector */}
                    <div className="lg:col-span-1 space-y-4">
                        {sectors.map((sector) => (
                            <button
                                key={sector.id}
                                onClick={() => setActiveSector(sector)}
                                className={`w-full p-6 rounded-xl text-left transition-all ${activeSector.id === sector.id
                                    ? `bg-gradient-to-r ${sector.color}/10 border-l-4 ${sector.borderColor}`
                                    : 'glass-morphism hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg bg-gradient-to-r ${sector.color} bg-opacity-20`}>
                                        <sector.icon className={`h-6 w-6 ${activeSector.id === sector.id
                                            ? 'text-white'
                                            : 'text-gray-400'
                                            }`} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">{sector.title}</h3>
                                        <div className="flex items-center text-sm text-gray-400">
                                            <span>Explore</span>
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Active Sector Details */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSector.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                <div className={`p-8 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-950 border ${activeSector.borderColor}`}>
                                    {/* Header */}
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className={`p-3 rounded-xl bg-gradient-to-r ${activeSector.color} bg-opacity-20`}>
                                                    <activeSector.icon className="h-8 w-8 text-white" />
                                                </div>
                                                <h3 className="text-2xl font-bold text-white">{activeSector.title}</h3>
                                            </div>
                                            <p className="text-gray-400">
                                                Premium intelligence solutions for {activeSector.id === 'industrial' ? 'industrial assets' : activeSector.id === 'hni' ? 'private legacies' : 'digital sovereignty'}
                                            </p>
                                        </div>
                                        <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${activeSector.color} bg-opacity-20 border ${activeSector.borderColor}`}>
                                            <span className="text-sm font-semibold text-white">Premium Tier</span>
                                        </div>
                                    </div>

                                    {/* Capabilities Grid */}
                                    <div className="mb-8">
                                        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                                            <Shield className="h-5 w-5 mr-2 text-intelligence" />
                                            Key Capabilities
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {activeSector.capabilities.map((capability) => (
                                                <div
                                                    key={capability}
                                                    className="p-3 rounded-lg bg-gray-900/50 border border-gray-800 flex items-center space-x-2"
                                                >
                                                    <Target className="h-4 w-4 text-intelligence flex-shrink-0" />
                                                    <span className="text-gray-300 text-sm">{capability}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Case Study */}
                                    <div className="mb-8 p-6 rounded-xl bg-gray-900/30 border border-gray-800">
                                        <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                                            <Lock className="h-5 w-5 mr-2 text-green-400" />
                                            Real-World Impact
                                        </h4>
                                        <p className="text-gray-300 mb-2">{activeSector.caseStudy}</p>
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                                            <div>
                                                <p className="text-sm text-gray-400">Typical Client Budget</p>
                                                <p className="text-lg font-bold text-white">₹2-50 Crores/annum</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Client Segment</p>
                                                <p className="text-lg font-semibold text-white">{activeSector.clients}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* CTA */}
                                    <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-gray-900 to-gray-950 border border-gray-800">
                                        <div>
                                            <p className="text-gray-300">
                                                Ready to secure your {activeSector.id === 'industrial' ? 'industrial assets' : activeSector.id === 'hni' ? 'family legacy' : 'digital infrastructure'}?
                                            </p>
                                        </div>
                                        <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-intelligence to-industrial text-white font-semibold hover:shadow-intelligence transition-all">
                                            Request Intelligence Brief
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>


            </div>
        </section>
    )
}