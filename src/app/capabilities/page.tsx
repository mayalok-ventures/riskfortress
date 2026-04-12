'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, BarChart3, Building, Target } from 'lucide-react'
import { Metadata } from 'next'

import AnimateOnScroll from '@/components/AnimateOnScroll'
import { fadeUp, staggerContainer, scaleIn } from '@/lib/animations'

// Metadata moved to layout.tsx

const verticals = [
    {
        id: 'financial',
        icon: BarChart3,
        title: 'Macro-Financial Forensics',
        description: 'Advanced forensic intelligence for enterprise financial structures',
        capabilities: [
            'Business Model Collapse Prediction',
            'Corporate Governance Forensics',
            'Pre-Investment Risk Intelligence',
            'Financial Fraud Early Detection',
            'Market Shift Analysis',
            'Exit Strategy Risk Analysis',
            'Competitor Vulnerability Assessment',
        ],
        pattern:
            "Before the Byju's collapse, patterns existed — governance gaps, unsustainable growth metrics, regulatory blind spots. We identify these fractures 18–24 months before they surface publicly.",
        clients: 'Private Equity Firms, Industrial Conglomerates, Ultra-HNWIs',
        budget: '₹2–50 Crores/annum',
    },
    {
        id: 'statutory',
        icon: Building,
        title: 'Statutory & Structural Intelligence',
        description: 'Regulatory risk mapping and structural compliance forensics',
        capabilities: [
            'Regulatory Compliance Gap Analysis',
            'Zoning & Land Use Risk Assessment',
            'Corporate Structural Fraud Detection',
            'Political & Policy Risk Mapping',
            'Statutory Non-Compliance Early Warning',
            'License & Permit Risk Forensics',
            'Cross-Border Regulatory Intelligence',
        ],
        pattern:
            'Zoning violations, non-compliant structural approvals, and political risk in land-use decisions — visible in regulatory filings years before action is taken. The Noida Tower scenario is a pattern, not an exception.',
        clients: 'Real Estate Developers, Industrial Conglomerates, Infrastructure Funds',
        budget: '₹1–20 Crores/annum',
    },
    {
        id: 'geo',
        icon: Target,
        title: 'Geo-Environmental Risk',
        description: 'Geographic and environmental exposure intelligence for high-value assets',
        capabilities: [
            'Climate & Environmental Risk Forecasting',
            'Natural Disaster Exposure Mapping',
            'Supply Chain Geographic Risk Analysis',
            'Environmental Liability Due Diligence',
            'Industrial Site Risk Assessment',
            'Geo-Political Hotspot Intelligence',
        ],
        pattern:
            'Infrastructure built in flood corridors, industrial facilities in contested environmental zones, supply chains routed through geopolitical chokepoints — each one a predictable, mappable risk that most due diligence processes ignore.',
        clients: 'Infrastructure Funds, Family Offices, Large Industrial Manufacturers',
        budget: '₹75L–10 Crores/annum',
    },
]

function VerticalCard({ vertical, index }: { vertical: typeof verticals[0]; index: number }) {
    const [open, setOpen] = useState(index === 0)
    const Icon = vertical.icon

    return (
        <AnimateOnScroll variants={scaleIn} delay={index * 0.1}>
            <div className="border border-gray-800 hover:border-champagne/30 transition-colors">
                <button
                    onClick={() => setOpen(!open)}
                    className="w-full p-8 flex items-center justify-between text-left"
                >
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-champagne/10">
                            <Icon className="h-7 w-7 text-champagne" />
                        </div>
                        <div>
                            <h2 className="text-xl font-light text-white">{vertical.title}</h2>
                            <p className="text-sm text-gray-500 mt-1">{vertical.description}</p>
                        </div>
                    </div>
                    <motion.div
                        animate={{ rotate: open ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    </motion.div>
                </button>

                <AnimatePresence initial={false}>
                    {open && (
                        <motion.div
                            key="card-content"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                        >
                            <div className="px-8 pb-8 pt-0 border-t border-gray-800">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                                    {/* Capabilities */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">
                                            Key Capabilities
                                        </h3>
                                        <ul className="space-y-2">
                                            {vertical.capabilities.map((cap) => (
                                                <li key={cap} className="flex items-center space-x-3 text-gray-300 text-sm">
                                                    <div className="w-1.5 h-1.5 bg-champagne rounded-full flex-shrink-0" />
                                                    <span>{cap}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Pattern + details */}
                                    <div className="space-y-4">
                                        <div className="p-5 bg-gray-900/60 border border-gray-800">
                                            <h4 className="text-sm font-medium text-champagne uppercase tracking-wider mb-3">
                                                Pattern We Identify
                                            </h4>
                                            <p className="text-gray-300 text-sm leading-relaxed">
                                                {vertical.pattern}
                                            </p>
                                            <p className="text-xs opacity-50 mt-2 italic text-gray-500">
                                                Illustrative scenario based on publicly reported information
                                            </p>
                                        </div>
                                        <div className="flex justify-between text-sm pt-2">
                                            <div>
                                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Who it&apos;s for</p>
                                                <p className="text-gray-300 text-sm">{vertical.clients}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Budget Range</p>
                                                <p className="text-champagne font-light">{vertical.budget}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AnimateOnScroll>
    )
}

export default function CapabilitiesPage() {
    return (
        <div className="min-h-screen py-32">
            {/* Background */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />

            <div className="container relative z-10 mx-auto px-6">
                {/* Header */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                    className="text-center mb-16"
                >
                    <motion.div variants={fadeUp} custom={0}
                        className="inline-flex items-center space-x-3 px-6 py-3 border border-champagne/20 rounded-none mb-8">
                        <div className="w-2 h-2 bg-champagne rounded-full animate-pulse" />
                        <span className="text-xs tracking-[0.25em] uppercase text-champagne font-light">
                            Intelligence Verticals
                        </span>
                    </motion.div>

                    <motion.h1 variants={fadeUp} custom={0.1} className="text-4xl md:text-5xl font-light mb-6">
                        <span className="text-white">Intelligence</span>{' '}
                        <span className="text-champagne">Verticals</span>
                    </motion.h1>

                    <motion.p variants={fadeUp} custom={0.2} className="text-xl text-gray-400 max-w-3xl mx-auto font-light">
                        Three disciplines. Each one built for a different class of invisible risk.
                    </motion.p>
                </motion.div>

                {/* Hero image */}
                <AnimateOnScroll variants={fadeUp} className="relative w-full h-[280px] mb-20 overflow-hidden">
                    <Image
                        src="https://images.unsplash.com/photo-1543286386-713bdd548da4?auto=format&fit=crop&w=1600&q=80"
                        alt="Forensic financial intelligence analysis"
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent" />
                </AnimateOnScroll>

                {/* Three Verticals */}
                <div className="max-w-4xl mx-auto space-y-4 mb-24">
                    {verticals.map((vertical, index) => (
                        <VerticalCard key={vertical.id} vertical={vertical} index={index} />
                    ))}
                </div>

                {/* Bottom CTA */}
                <AnimateOnScroll variants={fadeUp} className="max-w-3xl mx-auto">
                    <div className="p-12 border border-champagne/20 text-center">
                        <h2 className="text-3xl font-light text-white mb-4">
                            Every Vertical.{' '}
                            <span className="text-champagne">One Purpose.</span>
                        </h2>
                        <p className="text-gray-400 mb-10 font-light max-w-2xl mx-auto">
                            Preventing the crises that end dynasties, drain inheritances, and collapse
                            enterprises — before they begin.
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.025, y: -1 }}
                            whileTap={{ scale: 0.975 }}
                            transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                            className="inline-block"
                        >
                            <Link
                                href="/secure-intake"
                                className="inline-flex items-center px-10 py-5 bg-champagne text-obsidian font-medium tracking-widest uppercase text-sm transition-all hover:bg-champagne-light"
                            >
                                Request Discrete Consultation
                            </Link>
                        </motion.div>
                    </div>
                </AnimateOnScroll>
            </div>
        </div>
    )
}
