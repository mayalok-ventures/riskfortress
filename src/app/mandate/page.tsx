'use client'

import { MotionDiv } from '@/lib/motion'
import { ArrowRight, Eye, Shield, Target, TrendingDown, CheckCircle } from 'lucide-react'
import Link from 'next/link'

const mandatePrinciples = [
    {
        icon: Target,
        title: 'High-Stakes Advisory Mandate',
        description: 'We only engage with risks valued at ₹1 Crore or above. This High-Stakes Advisory Mandate ensures our Predictive Risk Intelligence focuses on scenarios where Strategic Foresight for UHNWIs justifies deep forensic investigation.',
    },
    {
        icon: TrendingDown,
        title: '1% Fee Model for Asset Protection',
        description: 'Our fee is exactly 1% of the protected asset value. This value-based pricing attracts high-intent, wealthy clients who understand that Asset Protection Intelligence prevents catastrophic wealth destruction.',
    },
    {
        icon: Shield,
        title: 'HNI Asset Protection Services India',
        description: 'Our Private Intelligence Firm India serves Ultra-HNWIs with ₹100Cr+ assets. Large developers, industrial dynasties, and enterprise founders who need Predictive Risk Intelligence preventing the next corporate collapse.',
    },
]

const caseScenarios = [
    {
        title: 'Preventing the Next Corporate Collapse',
        category: 'Predictive Risk Intelligence',
        description: 'Before the Byju\'s collapse, patterns existed. Governance gaps, unsustainable growth metrics, market risks. Our Corporate Fraud Investigation Services identify these fractures through Due Diligence for Angel Investors.',
        prevented: '₹2,500Cr+ potential exposure',
    },
    {
        title: 'Statutory Land Intelligence',
        category: 'Statutory Forensics',
        description: 'The Noida Twin Tower scenario: Zoning violations, regulatory non-compliance, political risk. Our Statutory Forensics provides statutory land intelligence years before regulatory action.',
        prevented: '₹800Cr+ in stranded assets',
    },
    {
        title: 'Family Office Risk Advisory',
        category: 'HNI Asset Protection',
        description: 'Multi-generational wealth transitions create vulnerability. Our Family Office Risk Advisory provides Personal Threat Assessment for Executives and Kidnap and Ransom Prevention India.',
        prevented: '₹1,200Cr+ in contested inheritance',
    },
]

export default function MandatePage() {
    return (
        <div className="min-h-screen py-32">
            {/* Premium Obsidian Background */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-grid-pattern" />
                </div>
                <div className="absolute top-1/4 right-0 w-px h-64 bg-gradient-to-b from-transparent via-champagne/20 to-transparent" />
                <div className="absolute bottom-1/4 left-0 w-px h-64 bg-gradient-to-b from-transparent via-champagne/20 to-transparent" />
            </div>

            <div className="container relative z-10 mx-auto px-6">
                {/* Header */}
                <MotionDiv 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center space-x-3 px-6 py-3 border border-champagne/20 rounded-none mb-10">
                        <div className="w-2 h-2 bg-champagne rounded-full animate-pulse" />
                        <span className="text-xs tracking-[0.25em] uppercase text-champagne font-light">
                            Premium Filter Engagement Model
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-light mb-8">
                        <span className="text-white">The 1%</span>{' '}
                        <span className="text-champagne">Mandate</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
                        We are not a service provider. We are a strategic filter. 
                        Our mandate ensures we only engage where stakes are existential 
                        and our success is directly tied to your protection.
                    </p>
                </MotionDiv>

                {/* Mandate Principles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {mandatePrinciples.map((principle, index) => (
                        <MotionDiv
                            key={principle.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="p-8 border border-gray-800 hover:border-champagne/30 transition-all"
                        >
                            <div className="p-3 bg-champagne/5 inline-block mb-6">
                                <principle.icon className="h-8 w-8 text-champagne" />
                            </div>
                            <h2 className="text-xl font-light text-white mb-4">{principle.title}</h2>
                            <p className="text-gray-400 text-sm leading-relaxed">{principle.description}</p>
                        </MotionDiv>
                    ))}
                </div>

                {/* Why This Model Section */}
                <MotionDiv
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto mb-24"
                >
                    <div className="p-10 border border-champagne/10">
                        <h2 className="text-3xl font-light text-white mb-8 text-center">
                            Why This <span className="text-champagne">Model?</span>
                        </h2>
                        
                        <div className="space-y-6">
                            {[
                                'Aligned Incentives: When we charge 1% of protected value, we only succeed when you don\'t face catastrophic loss.',
                                'Premium Focus: High thresholds ensure we dedicate our best forensic resources to each engagement.',
                                'No Generic Consulting: We don\'t solve routine problems. We prevent the crises that end dynasties.',
                                'Long-term Relationship: Multi-generational wealth requires multi-generational thinking.',
                            ].map((item, index) => (
                                <div key={index} className="flex items-start space-x-4">
                                    <CheckCircle className="h-5 w-5 text-champagne flex-shrink-0 mt-0.5" />
                                    <p className="text-gray-300 text-sm leading-relaxed">{item}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </MotionDiv>

                {/* Case Scenarios */}
                <MotionDiv
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="mb-24"
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-light text-white mb-4">
                            Case <span className="text-champagne">Scenarios</span>
                        </h2>
                        <p className="text-gray-400 font-light">
                            The patterns we identify. The catastrophes we prevent.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {caseScenarios.map((scenario, index) => (
                            <MotionDiv
                                key={scenario.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="p-8 border border-gray-800 hover:border-champagne/30 transition-all"
                            >
                                <span className="text-xs tracking-[0.15em] uppercase text-champagne font-light">
                                    {scenario.category}
                                </span>
                                <h3 className="text-xl font-light text-white mt-3 mb-4">{scenario.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6">{scenario.description}</p>
                                <div className="pt-4 border-t border-gray-800">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Potential Prevention</p>
                                    <p className="text-lg font-light text-champagne mt-1">{scenario.prevented}</p>
                                </div>
                            </MotionDiv>
                        ))}
                    </div>
                </MotionDiv>

                {/* Final CTA */}
                <MotionDiv
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="max-w-3xl mx-auto text-center"
                >
                    <div className="p-12 border border-champagne/20">
                        <h2 className="text-3xl font-light text-white mb-6">
                            Ready for <span className="text-champagne">Absolute Foresight?</span>
                        </h2>
                        <p className="text-gray-400 mb-10 font-light">
                            If your assets exceed ₹100 Crores and you understand that the cost of 
                            prevention is infinitely less than the cost of catastrophe, we should speak.
                        </p>
                        <Link
                            href="/secure-intake"
                            className="group inline-flex items-center px-10 py-5 bg-champagne text-obsidian font-medium tracking-widest uppercase text-sm transition-all hover:bg-champagne-light hover:shadow-champagne"
                        >
                            <Eye className="h-4 w-4 mr-4" />
                            <span>Request Discrete Consultation</span>
                            <ArrowRight className="h-4 w-4 ml-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <p className="text-gray-500 text-sm mt-8 font-light">
                        RiskFortress is the specialized Risk Intelligence arm of Mayalok Ventures, 
                        dedicated to preserving wealth through advanced predictive forensics.
                    </p>
                </MotionDiv>
            </div>
        </div>
    )
}
