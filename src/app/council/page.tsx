import { Shield, Eye, Lock, ArrowRight } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Mayalok Ecosystem & Advisory Council | RiskFortress India',
    description: 'The Mayalok Ecosystem and RiskFortress Advisory Council — the intelligence network behind India\'s most discrete wealth protection firm.',
    keywords: [
        'Mayalok Ventures Risk Management',
        'RiskFortress Security Division',
        'RiskFortress India',
        'Private Intelligence Firm India',
        'Predictive Risk Intelligence',
        'Strategic Foresight for UHNWIs',
        'HNI Asset Protection Services India',
        'High-Stakes Advisory Mandate',
        'Asset Protection Intelligence',
    ],
    openGraph: {
        url: '/council/',
        title: 'Mayalok Ecosystem & Advisory Council | RiskFortress India',
        description: 'The Mayalok Ecosystem and RiskFortress Advisory Council — the intelligence network behind India\'s most discrete wealth protection firm.',
    },
    alternates: {
        canonical: 'https://riskfortress.in/council/',
    },
}

export default function CouncilPage() {
    return (
        <div className="min-h-screen py-32">
            {/* Background */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-wireframe" />
                </div>
            </div>

            <div className="container relative z-10 mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-3 px-6 py-3 border border-champagne/20 rounded-none mb-8">
                        <div className="w-2 h-2 bg-champagne rounded-full animate-pulse" />
                        <span className="text-xs tracking-[0.25em] uppercase text-champagne font-light">
                            A MAYALOK VENTURES ENTITY
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-light mb-6">
                        <span className="text-white">The Intelligence</span>{' '}
                        <span className="text-champagne">Network</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light mb-8">
                        RiskFortress operates as the strategic intelligence arm of Mayalok Ventures.
                        Our advisory network is deliberately confidential — our advisors&apos; identities
                        are protected as rigorously as our clients&apos; assets.
                    </p>
                </div>

                {/* Core Principles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 max-w-5xl mx-auto">
                    {[
                        {
                            icon: Shield,
                            title: 'Absolute Anonymity',
                            description: 'Our advisory council operates under strict confidentiality protocols. No public-facing profiles, no media exposure, no digital footprint.',
                        },
                        {
                            icon: Eye,
                            title: 'Cross-Domain Expertise',
                            description: 'Former intelligence operatives, forensic analysts, regulatory specialists, and strategic advisors — unified under a single intelligence mandate.',
                        },
                        {
                            icon: Lock,
                            title: 'Vetted & Verified',
                            description: 'Every advisor undergoes rigorous background verification. Access is granted only after multi-level security clearance.',
                        },
                    ].map((principle) => (
                        <div key={principle.title} className="p-8 border border-gray-800 hover:border-champagne/30 transition-all">
                            <div className="p-3 bg-champagne/5 inline-block mb-6">
                                <principle.icon className="h-8 w-8 text-champagne" />
                            </div>
                            <h2 className="text-xl font-light text-white mb-4">{principle.title}</h2>
                            <p className="text-gray-400 text-sm leading-relaxed">{principle.description}</p>
                        </div>
                    ))}
                </div>

                {/* Mayalok Ecosystem */}
                <div className="max-w-4xl mx-auto mb-20">
                    <div className="p-10 border border-champagne/10">
                        <h2 className="text-3xl font-light text-white mb-8 text-center">
                            The Mayalok <span className="text-champagne">Ecosystem</span>
                        </h2>
                        <p className="text-gray-400 text-sm leading-relaxed text-center max-w-3xl mx-auto mb-8">
                            Mayalok Ventures is a strategic holding entity that operates across intelligence,
                            advisory, and asset protection verticals. RiskFortress is its dedicated risk
                            intelligence division — purpose-built for Ultra-HNWIs who require forensic
                            foresight rather than reactive security.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center p-6 border border-gray-800">
                                <p className="text-2xl font-light text-champagne">Predictive</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Intelligence Model</p>
                            </div>
                            <div className="text-center p-6 border border-gray-800">
                                <p className="text-2xl font-light text-champagne">Forensic</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Risk Analysis</p>
                            </div>
                            <div className="text-center p-6 border border-gray-800">
                                <p className="text-2xl font-light text-champagne">Discrete</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Advisory Network</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="max-w-3xl mx-auto text-center">
                    <div className="p-12 border border-champagne/20">
                        <h2 className="text-3xl font-light text-white mb-6">
                            Engage <span className="text-champagne">Discretely</span>
                        </h2>
                        <p className="text-gray-400 mb-10 font-light">
                            If your situation demands forensic intelligence and absolute confidentiality,
                            initiate a discrete consultation with our senior intelligence team.
                        </p>
                        <Link
                            href="/secure-intake"
                            className="group inline-flex items-center px-10 py-5 bg-champagne text-obsidian font-medium tracking-widest uppercase text-sm transition-all hover:bg-champagne-light hover:shadow-champagne"
                        >
                            <Eye className="h-4 w-4 mr-4" />
                            <span>Engage Discretely</span>
                            <ArrowRight className="h-4 w-4 ml-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
