'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Shield, Lock } from 'lucide-react'
import Link from 'next/link'

export default function CTASection() {
    return (
        <section className="py-32 relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-grid-pattern" />
                </div>
            </div>

            {/* Animated Orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-intelligence/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-industrial/10 rounded-full blur-3xl animate-pulse delay-1000" />

            <div className="container relative z-10 mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center space-x-2 px-6 py-3 rounded-full glass-morphism border border-intelligence/20 mb-8"
                    >
                        <Shield className="h-5 w-5 text-intelligence" />
                        <span className="text-sm font-semibold text-intelligence">
                            ENTERPRISE-ONLY ACCESS
                        </span>
                    </motion.div>

                    {/* Headline */}
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-gray-300">Ready to Secure Your</span>{' '}
                        <span className="gradient-text">Critical Assets?</span>
                    </h2>

                    {/* Description */}
                    <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto">
                        Speak with our intelligence team about predictive risk management,
                        land due diligence, or family office security. No security guard inquiries.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link
                            href="/secure-intake"
                            className="group relative px-8 py-4 bg-gradient-to-r from-intelligence to-industrial rounded-lg font-semibold text-white hover:shadow-intelligence hover:scale-105 transition-all"
                        >
                            <div className="absolute inset-0 bg-white/10 rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative flex items-center justify-center space-x-3">
                                <Lock className="h-5 w-5" />
                                <span>Begin Secure Intake</span>
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>

                        <Link
                            href="tel:+912200000000"
                            className="px-8 py-4 rounded-lg font-semibold border border-intelligence text-intelligence hover:bg-intelligence/10 transition-all"
                        >
                            <span className="flex items-center justify-center space-x-3">
                                <Shield className="h-5 w-5" />
                                <span>Call Secure Line</span>
                            </span>
                        </Link>
                    </div>

                    {/* Enterprise Notice */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        viewport={{ once: true }}
                        className="mt-12 p-6 rounded-2xl glass-morphism border border-gray-800 max-w-2xl mx-auto"
                    >
                        <p className="text-gray-400 text-sm">
                            <span className="font-semibold text-intelligence">Note:</span>{' '}
                            We serve Fortune 500 companies, industrial conglomerates, and family offices only.
                            Corporate email verification required. No security guard or bouncer services.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}