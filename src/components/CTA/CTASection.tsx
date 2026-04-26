'use client'

import { MotionDiv } from '@/lib/motion'
import { ArrowRight, Fingerprint, Lock, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

const auditSignals = [
    {
        icon: AlertTriangle,
        label: 'Silent Valuation Erosion',
        detail: 'Governance gaps & regulatory blind-spots consuming enterprise value undetected',
    },
    {
        icon: Fingerprint,
        label: 'Structural Threat Mapping',
        detail: 'Forensic identification of insider vectors, statutory exposure & counterparty risk',
    },
    {
        icon: Lock,
        label: 'Infrastructure Securization',
        detail: 'Rapid deployment of zero-trust intelligence protocols across critical asset perimeters',
    },
]

export default function CTASection() {
    return (
        <section className="py-32 relative overflow-hidden">
            {/* Premium Obsidian Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-grid-pattern" />
                </div>
            </div>

            {/* Subtle Champagne accents */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-champagne/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-champagne/3 rounded-full blur-3xl" />

            <div className="container relative z-10 mx-auto px-6">
                <MotionDiv
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true, amount: 0.1 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    {/* Badge */}
                    <MotionDiv
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        viewport={{ once: true, amount: 0.1 }}
                        className="inline-flex items-center space-x-3 px-6 py-3 border border-champagne/20 rounded-none mb-10"
                    >
                        <Lock className="h-4 w-4 text-champagne" />
                        <span className="text-xs tracking-[0.2em] uppercase text-champagne font-light">
                            Access: By Invitation Only
                        </span>
                    </MotionDiv>

                    {/* Headline */}
                    <h2 className="text-4xl md:text-5xl font-light mb-6">
                        <span className="text-white">Secure Your Enterprise</span>{' '}
                        <span className="text-champagne">Valuation.</span>
                    </h2>

                    {/* Sub-headline */}
                    <p className="text-xl text-gray-400 mb-6 max-w-3xl mx-auto font-light">
                        Initiate a preliminary forensic intelligence audit.
                    </p>
                    <p className="text-sm text-gray-500 mb-14 max-w-2xl mx-auto tracking-wide uppercase">
                        Availability strictly limited to qualified corporate entities.
                    </p>

                    {/* Three audit signal cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14 text-left">
                        {auditSignals.map((signal) => (
                            <div
                                key={signal.label}
                                className="p-6 border border-gray-800 hover:border-champagne/20 transition-all bg-white/[0.02]"
                            >
                                <signal.icon className="h-5 w-5 text-champagne mb-4 opacity-80" />
                                <p className="text-sm font-medium text-white mb-2">{signal.label}</p>
                                <p className="text-xs text-gray-500 leading-relaxed">{signal.detail}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            href="/secure-intake"
                            className="group px-10 py-5 bg-champagne text-obsidian font-medium tracking-widest uppercase text-sm transition-all hover:bg-champagne-light hover:shadow-champagne"
                        >
                            <span className="flex items-center justify-center space-x-4">
                                <Fingerprint className="h-4 w-4" />
                                <span>Request Confidential Audit</span>
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>

                        <Link
                            href="/mandate"
                            className="px-10 py-5 border border-gray-800 text-gray-300 font-medium tracking-widest uppercase text-sm hover:border-champagne hover:text-champagne transition-all"
                        >
                            Understand The 1% Mandate
                        </Link>
                    </div>

                    {/* Qualification Notice */}
                    <MotionDiv
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        viewport={{ once: true, amount: 0.1 }}
                        className="mt-16 p-8 border border-champagne/10 max-w-3xl mx-auto"
                    >
                        <h3 className="text-sm font-light text-champagne mb-4 tracking-[0.2em] uppercase">Qualification Threshold</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            RiskFortress accepts engagements exclusively from corporate entities, family offices,
                            and institutional mandates with assets under active management exceeding{' '}
                            <span className="text-champagne">₹1 Crore</span>. Preliminary forensic audits are
                            conducted under strict NDA prior to formal engagement. All intake submissions are
                            reviewed within 48 hours by our senior intelligence team.
                        </p>
                        <div className="mt-6 pt-6 border-t border-gray-800 grid grid-cols-3 gap-6">
                            <div className="text-center">
                                <p className="text-2xl font-light text-champagne">₹1Cr+</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Minimum Threshold</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-light text-champagne">48h</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Intake Review SLA</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-light text-champagne">NDA</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Pre-Engagement</p>
                            </div>
                        </div>
                    </MotionDiv>
                </MotionDiv>
            </div>
        </section>
    )
}