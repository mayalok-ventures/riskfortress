'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import AnimateOnScroll from '@/components/AnimateOnScroll'
import { staggerContainer, fadeUp, fadeIn } from '@/lib/animations'

const paragraphText1 =
    'India is producing wealth faster than its institutions can protect it. New industrial dynasties, first-generation UHNWIs, family offices managing second and third-generation assets — all operating in an environment where the threats are structural, not just operational.'

const paragraphText2 =
    'Governance failures. Regulatory blindspots. Political risk embedded in land and infrastructure. Financial instruments that collapse not because of fraud, but because no one read the patterns early enough. RiskFortress was built for one purpose: to be the intelligence layer that most wealth advisors don\'t have and most risk consultants won\'t provide.'

const words1 = paragraphText1.split(' ')
const words2 = paragraphText2.split(' ')

export default function WhyWeExist() {
    return (
        <section className="relative py-28 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950" />
            <div className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                }}
            />

            <div className="container relative z-10 mx-auto px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left — Text */}
                    <div>
                        <AnimateOnScroll variants={staggerContainer}>
                            <motion.div
                                variants={fadeUp}
                                custom={0}
                                className="inline-flex items-center space-x-3 px-5 py-2.5 border border-champagne/20 rounded-none mb-8"
                            >
                                <div className="w-1.5 h-1.5 bg-champagne rounded-full" />
                                <span className="text-xs tracking-[0.2em] uppercase text-champagne font-light">
                                    Why We Exist
                                </span>
                            </motion.div>

                            <motion.h2
                                variants={fadeUp}
                                custom={0.1}
                                className="text-3xl md:text-4xl font-light text-white mb-8 leading-tight"
                            >
                                Why RiskFortress{' '}
                                <span className="text-champagne">Exists</span>
                            </motion.h2>

                            {/* Word-by-word reveal — paragraph 1 */}
                            <AnimateOnScroll variants={staggerContainer} className="mb-6">
                                <p className="text-gray-400 leading-relaxed text-base">
                                    {words1.map((word, i) => (
                                        <motion.span
                                            key={`p1-${i}`}
                                            variants={fadeIn}
                                            custom={i * 0.012}
                                            style={{ display: 'inline-block', marginRight: '4px' }}
                                        >
                                            {word}
                                        </motion.span>
                                    ))}
                                </p>
                            </AnimateOnScroll>

                            {/* Word-by-word reveal — paragraph 2 */}
                            <AnimateOnScroll variants={staggerContainer}>
                                <p className="text-gray-400 leading-relaxed text-base">
                                    {words2.map((word, i) => (
                                        <motion.span
                                            key={`p2-${i}`}
                                            variants={fadeIn}
                                            custom={i * 0.01}
                                            style={{ display: 'inline-block', marginRight: '4px' }}
                                        >
                                            {word}
                                        </motion.span>
                                    ))}
                                </p>
                            </AnimateOnScroll>
                        </AnimateOnScroll>
                    </div>

                    {/* Right — Image */}
                    <AnimateOnScroll variants={fadeUp} delay={0.2} className="relative">
                        <div className="relative w-full h-[420px] rounded-sm overflow-hidden">
                            <Image
                                src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80"
                                alt="Risk forensic analysis in progress"
                                fill
                                className="object-cover"
                                loading="lazy"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div className="absolute inset-0 bg-black/40" />
                            {/* Champagne border accent */}
                            <div className="absolute bottom-0 left-0 right-0 h-px bg-champagne/30" />
                            <div className="absolute top-0 left-0 bottom-0 w-px bg-champagne/30" />
                        </div>
                    </AnimateOnScroll>
                </div>

                {/* Section divider */}
                <AnimateOnScroll className="mt-20">
                    <motion.hr
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        style={{ transformOrigin: 'left' }}
                        className="border-white/10"
                    />
                </AnimateOnScroll>
            </div>
        </section>
    )
}
