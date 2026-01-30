'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Eye, Lock } from 'lucide-react'
import Link from 'next/link'

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
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    viewport={{ once: true, amount: 0.1 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        viewport={{ once: true, amount: 0.1 }}
                        className="inline-flex items-center space-x-3 px-6 py-3 border border-champagne/20 rounded-none mb-10"
                    >
                        <Lock className="h-4 w-4 text-champagne" />
                        <span className="text-xs tracking-[0.2em] uppercase text-champagne font-light">
                            ₹100Cr+ Assets Only
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <h2 className="text-4xl md:text-5xl font-light mb-8">
                        <span className="text-white">The Crisis You Prevent</span>{' '}
                        <span className="text-champagne">Is The One You Never Face.</span>
                    </h2>

                    {/* Description */}
                    <p className="text-xl text-gray-400 mb-14 max-w-3xl mx-auto font-light">
                        Speak with our forensic intelligence team about protecting your legacy 
                        from unseen threats. We don&apos;t solve generic problems—we prevent catastrophic losses.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            href="/secure-intake"
                            className="group px-10 py-5 bg-champagne text-obsidian font-medium tracking-widest uppercase text-sm transition-all hover:bg-champagne-light hover:shadow-champagne"
                        >
                            <span className="flex items-center justify-center space-x-4">
                                <Eye className="h-4 w-4" />
                                <span>Request Discrete Consultation</span>
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

                    {/* The 1% Rule Notice */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        viewport={{ once: true, amount: 0.1 }}
                        className="mt-16 p-8 border border-champagne/10 max-w-3xl mx-auto"
                    >
                        <h3 className="text-lg font-light text-champagne mb-4 tracking-wide">THE 1% MANDATE</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            We are a premium filter. We only accept engagements involving assets worth ₹1Cr+ 
                            and charge 1% of the protected asset value. This ensures our interests are perfectly 
                            aligned with yours—we only succeed when we prevent your catastrophic loss.
                        </p>
                        <div className="mt-6 pt-6 border-t border-gray-800 grid grid-cols-3 gap-6">
                            <div className="text-center">
                                <p className="text-2xl font-light text-champagne">₹1Cr+</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Minimum Risk</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-light text-champagne">1%</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Of Asset Value</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-light text-champagne">₹100Cr+</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider mt-1">Target Clients</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}