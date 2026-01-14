'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Shield, Lock } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Clean Background */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" />
                {/* Subtle gold accent */}
                <div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-[0.03]"
                    style={{ background: 'radial-gradient(ellipse, #c5a059 0%, transparent 70%)' }}
                />
            </div>

            <div className="container relative z-20 mx-auto px-6 py-32">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Refined Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center space-x-3 px-5 py-2.5 border border-intelligence/30 rounded-sm mb-10"
                    >
                        <div className="w-1.5 h-1.5 bg-intelligence rounded-full" />
                        <span className="text-xs tracking-[0.2em] uppercase text-intelligence font-medium">
                            Trusted by Fortune 500 & Family Offices
                        </span>
                    </motion.div>

                    {/* Elegant Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-8 leading-[1.1]"
                    >
                        <span className="block text-white">Deciphering Uncertainty.</span>
                        <span className="block text-intelligence mt-2">Protecting Sovereignty.</span>
                    </motion.h1>

                    {/* Refined Description */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
                    >
                        Strategic intelligence and risk advisory for India&apos;s leading 
                        industrial conglomerates and distinguished family offices.
                    </motion.p>

                    {/* Professional CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
                    >
                        <Link
                            href="/secure-intake"
                            className="group px-8 py-4 bg-intelligence text-gray-900 font-medium tracking-wide transition-all hover:bg-intelligence-light"
                        >
                            <span className="flex items-center justify-center space-x-3">
                                <span>Request Consultation</span>
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>

                        <Link
                            href="/capabilities"
                            className="px-8 py-4 border border-gray-700 text-gray-300 font-medium tracking-wide hover:border-intelligence hover:text-intelligence transition-all"
                        >
                            Our Capabilities
                        </Link>
                    </motion.div>

                    {/* Elegant Trust Indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-wrap items-center justify-center gap-8 md:gap-12 pt-8 border-t border-gray-800"
                    >
                        {[
                            { label: 'ISO 27001', sublabel: 'Certified' },
                            { label: 'AES-256', sublabel: 'Encryption' },
                            { label: '24/7', sublabel: 'Intelligence' },
                            { label: 'Enterprise', sublabel: 'Grade' },
                        ].map((item) => (
                            <div key={item.label} className="text-center">
                                <p className="text-lg font-medium text-white">{item.label}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-wider">{item.sublabel}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Subtle scroll indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                <div className="w-px h-12 bg-gradient-to-b from-intelligence/50 to-transparent" />
            </div>
        </section>
    )
}
