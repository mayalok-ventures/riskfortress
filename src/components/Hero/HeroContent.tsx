'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Eye } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Premium Obsidian Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0d0d0d] to-[#0a0a0a]" />
                {/* Champagne Gold accent */}
                <div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-[0.02]"
                    style={{ background: 'radial-gradient(ellipse, #D4AF37 0%, transparent 70%)' }}
                />
                {/* Abstract minimalist line */}
                <div className="absolute top-1/4 right-0 w-px h-64 bg-gradient-to-b from-transparent via-champagne/20 to-transparent" />
                <div className="absolute bottom-1/4 left-0 w-px h-64 bg-gradient-to-b from-transparent via-champagne/20 to-transparent" />
            </div>

            <div className="container relative z-20 mx-auto px-6 py-32">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Strategic Foresight Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center space-x-3 px-6 py-3 border border-champagne/20 rounded-none mb-12"
                    >
                        <div className="w-2 h-2 bg-champagne rounded-full animate-pulse" />
                        <span className="text-xs tracking-[0.25em] uppercase text-champagne font-light">
                            A Mayalok Ventures Strategic Foresight Entity
                        </span>
                    </motion.div>

                    {/* Premium Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-8 leading-[1.1]"
                    >
                        <span className="block text-white font-display">We Predict The Crisis</span>
                        <span className="block text-champagne mt-3 font-display">You Don&apos;t See Coming.</span>
                    </motion.h1>

                    {/* Strategic Sub-headline */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-lg md:text-xl text-gray-400 mb-14 max-w-3xl mx-auto leading-relaxed font-light"
                    >
                        Strategic Risk Intelligence for assets worth ₹100Cr+. 
                        Moving beyond compliance into the realm of absolute foresight.
                    </motion.p>

                    {/* Premium CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
                    >
                        <Link
                            href="/secure-intake"
                            className="group px-10 py-5 bg-champagne text-obsidian font-medium tracking-widest uppercase text-sm transition-all hover:bg-champagne-light"
                        >
                            <span className="flex items-center justify-center space-x-4">
                                <Eye className="h-4 w-4" />
                                <span>Request a Discrete Consultation</span>
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>

                        <Link
                            href="/mandate"
                            className="px-10 py-5 border border-gray-800 text-gray-300 font-medium tracking-widest uppercase text-sm hover:border-champagne hover:text-champagne transition-all"
                        >
                            The 1% Mandate
                        </Link>
                    </motion.div>

                    {/* Ultra-Premium Indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-wrap items-center justify-center gap-12 md:gap-16 pt-10 border-t border-gray-800/50"
                    >
                        {[
                            { label: '₹100Cr+', sublabel: 'Minimum Asset Threshold' },
                            { label: '1%', sublabel: 'Of Protected Value' },
                            { label: 'Forensic', sublabel: 'Predictive Intelligence' },
                            { label: 'Discrete', sublabel: 'Absolute Confidentiality' },
                        ].map((item) => (
                            <div key={item.label} className="text-center">
                                <p className="text-2xl font-light text-champagne">{item.label}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1">{item.sublabel}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Minimal scroll indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
                <div className="w-px h-16 bg-gradient-to-b from-champagne/30 to-transparent" />
            </div>
        </section>
    )
}
