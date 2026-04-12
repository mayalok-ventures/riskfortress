'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Eye } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'

import AnimateOnScroll from '@/components/AnimateOnScroll'
import { fadeUp, staggerContainer, scaleIn } from '@/lib/animations'

const pillars = [
    { label: '₹100Cr+', sublabel: 'Minimum Asset Threshold' },
    { label: '1%', sublabel: 'Of Protected Value' },
    { label: 'Forensic', sublabel: 'Predictive Intelligence' },
    { label: 'Discrete', sublabel: 'Absolute Confidentiality' },
]

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null)
    const { scrollY } = useScroll()
    const y = useTransform(scrollY, [0, 500], [0, 120])

    return (
        <section
            ref={containerRef}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Hero background image with parallax */}
            <motion.div
                style={{ y }}
                className="absolute inset-0 z-0"
            >
                <Image
                    src="https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=2000&q=80"
                    alt="Strategic risk intelligence overview"
                    fill
                    className="object-cover"
                    priority
                    sizes="100vw"
                />
            </motion.div>

            {/* Dark overlay layers */}
            <div className="absolute inset-0 z-[1] bg-black/70" />
            <div className="absolute inset-0 z-[2] bg-gradient-to-b from-[#0a0a0a]/60 via-[#0d0d0d]/50 to-[#0a0a0a]/80" />

            {/* Champagne Gold accent */}
            <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-[0.04] z-[3]"
                style={{ background: 'radial-gradient(ellipse, #D4AF37 0%, transparent 70%)' }}
            />

            {/* Abstract minimalist lines */}
            <div className="absolute top-1/4 right-0 w-px h-64 bg-gradient-to-b from-transparent via-champagne/20 to-transparent z-[3]" />
            <div className="absolute bottom-1/4 left-0 w-px h-64 bg-gradient-to-b from-transparent via-champagne/20 to-transparent z-[3]" />

            {/* Gradient depth overlays */}
            <div className="absolute inset-0 z-[4] bg-gradient-to-r from-black/40 via-transparent to-black/40 pointer-events-none" />
            <div className="absolute inset-0 z-[4] bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

            <div className="container relative z-10 mx-auto px-6 py-32">
                <div className="max-w-5xl mx-auto text-center">
                    {/* Animated text cascade */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                    >
                        {/* Badge */}
                        <motion.div
                            variants={fadeUp}
                            custom={0}
                            className="inline-flex items-center space-x-3 px-6 py-3 border border-champagne/20 rounded-none mb-12"
                        >
                            <div className="w-2 h-2 bg-champagne rounded-full animate-pulse" />
                            <span className="text-xs tracking-[0.25em] uppercase text-champagne font-light">
                                A Mayalok Ventures Strategic Foresight Entity
                            </span>
                        </motion.div>

                        {/* H1 */}
                        <motion.h1
                            variants={fadeUp}
                            custom={0.1}
                            className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tight mb-8 leading-[1.1]"
                        >
                            <span className="block text-white font-display">We Predict The Crisis</span>
                            <span className="block text-champagne mt-3 font-display">
                                You Don&apos;t See Coming.
                            </span>
                        </motion.h1>

                        {/* Subtext */}
                        <motion.p
                            variants={fadeUp}
                            custom={0.2}
                            className="text-lg md:text-xl text-gray-400 mb-14 max-w-3xl mx-auto leading-relaxed font-light"
                        >
                            Most crises don&apos;t arrive without warning. They arrive after years
                            of ignored signals. We find the signals.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            variants={fadeUp}
                            custom={0.3}
                            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
                        >
                            <motion.div
                                whileHover={{ scale: 1.025, y: -1 }}
                                whileTap={{ scale: 0.975 }}
                                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                            >
                                <Link
                                    href="/secure-intake"
                                    className="group px-10 py-5 bg-champagne text-obsidian font-medium tracking-widest uppercase text-sm transition-all hover:bg-champagne-light inline-flex items-center space-x-4"
                                >
                                    <Eye className="h-4 w-4" />
                                    <span>Request a Discrete Consultation</span>
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.025, y: -1 }}
                                whileTap={{ scale: 0.975 }}
                                transition={{ type: 'spring', stiffness: 380, damping: 22 }}
                            >
                                <Link
                                    href="/mandate"
                                    className="px-10 py-5 border border-gray-800 text-gray-300 font-medium tracking-widest uppercase text-sm hover:border-champagne hover:text-champagne transition-all inline-block"
                                >
                                    The 1% Mandate
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Brand Pillars — stagger on scroll */}
                    <AnimateOnScroll variants={staggerContainer}>
                        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-16 pt-10 border-t border-gray-800/50">
                            {pillars.map((item, index) => (
                                <AnimateOnScroll
                                    key={item.label}
                                    variants={scaleIn}
                                    delay={index * 0.1}
                                >
                                    <div className="text-center">
                                        <p className="text-2xl font-light text-champagne">{item.label}</p>
                                        <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1">
                                            {item.sublabel}
                                        </p>
                                    </div>
                                </AnimateOnScroll>
                            ))}
                        </div>
                    </AnimateOnScroll>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10">
                <div className="w-px h-16 bg-gradient-to-b from-champagne/30 to-transparent" />
            </div>
        </section>
    )
}
