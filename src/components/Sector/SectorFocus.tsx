'use client'

import { AnimatePresence } from 'framer-motion'

import { MotionDiv } from '@/lib/motion'
import { Factory, Users, Cpu, ChevronRight, Shield, Lock, Target } from 'lucide-react'
import { useState } from 'react'

const sectors = [
    {
        id: 'financial',
        title: 'Macro-Financial Forensics',
        description: 'Advanced forensic intelligence for enterprise financial structures',
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
        budgetRange: '₹2–50 Crores/annum',
    },
    {
        id: 'statutory',
        title: 'Statutory & Structural Intelligence',
        description: 'Regulatory risk mapping and structural compliance forensics',
        icon: Users,
        color: 'from-champagne to-champagne-dark',
        borderColor: 'border-champagne/30',
        capabilities: [
            'Land title forensics and zoning risk',
            'Regulatory compliance trajectory analysis',
            'Political and litigation risk mapping',
            'Pre-acquisition statutory due diligence',
            'Cross-jurisdictional legal exposure assessment',
            'Title & Encumbrance Forensics',
            'Developer Risk Profiling',
        ],
        caseStudy: 'Identified critical zoning violations in a major Delhi NCR development project — preventing ₹800Cr+ in stranded asset exposure.',
        clients: 'Real estate dynasties, large developers, infrastructure funds',
        budgetRange: '₹1–20 Crores/annum',
    },
    {
        id: 'environmental',
        title: 'Geo-Environmental Risk',
        description: 'Geographic and environmental exposure intelligence for high-value assets',
        icon: Cpu,
        color: 'from-champagne to-champagne-dark',
        borderColor: 'border-champagne/30',
        capabilities: [
            'Climate and environmental liability forecasting',
            'ESG risk trajectory mapping',
            'Water, land, and resource conflict prediction',
            'Cross-border territorial risk analysis',
            'Force majeure scenario modeling',
            'Coastal & Flood Risk Analysis',
            'Environmental Litigation Risk',
        ],
        caseStudy: 'Flagged critical environmental litigation risk for an industrial conglomerate 24 months before regulatory enforcement action.',
        clients: 'Industrial conglomerates, infrastructure developers, family offices',
        budgetRange: '₹50L–10 Crores/annum',
    },
]

export default function SectorFocus() {
    const [activeSector, setActiveSector] = useState(sectors[0])

    return (
        <section className="relative py-32">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-gray-900">
                <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }} />
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-industrial/20 to-transparent" />
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-legacy/20 to-transparent" />
                </div>
            </div>

            <div className="container relative z-10 mx-auto px-6">
                <MotionDiv
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true, amount: 0.1 }}
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
                        Three disciplines. Each one built for a different class of invisible risk.
                    </p>
                </MotionDiv>

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
                            <MotionDiv
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
                                                {activeSector.description || 'Advanced forensic intelligence for enterprise financial structures'}
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
                                            Pattern We Identify
                                        </h4>
                                        <p className="text-gray-300 mb-2">{activeSector.caseStudy}</p>
                                        <p className="text-xs opacity-50 mt-1 italic text-gray-500">Illustrative scenario based on publicly reported information</p>
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                                            <div>
                                                <p className="text-sm text-gray-400">Typical Client Budget</p>
                                                <p className="text-lg font-bold text-white">{activeSector.budgetRange}</p>
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
                                                Ready to protect generational wealth?
                                            </p>
                                        </div>
                                        <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-intelligence to-industrial text-white font-semibold hover:shadow-intelligence transition-all">
                                            Request a Discrete Consultation
                                        </button>
                                    </div>
                                </div>
                            </MotionDiv>
                        </AnimatePresence>
                    </div>
                </div>


            </div>
        </section>
    )
}