'use client'

import { MotionDiv } from '@/lib/motion'
import { Lock, EyeOff } from 'lucide-react'

export default function Testimonials() {
    return (
        <section className="py-32 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950" />

            <div className="container relative z-10 mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Section heading */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-3 px-5 py-2.5 border border-champagne/20 mb-8">
                            <EyeOff className="h-3.5 w-3.5 text-champagne" />
                            <span className="text-xs tracking-[0.25em] uppercase text-champagne font-light">
                                Client Confidentiality Protocol
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-light mb-6">
                            <span className="text-white">Absolute</span>{' '}
                            <span className="text-champagne">Embargo.</span>
                        </h2>
                    </div>

                    {/* Central Confidentiality Statement */}
                    <MotionDiv
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true, amount: 0.1 }}
                        className="p-12 border border-champagne/15 bg-champagne/[0.03] text-center"
                    >
                        <Lock className="h-8 w-8 text-champagne mx-auto mb-8 opacity-60" />
                        <p className="text-lg text-gray-300 font-light leading-relaxed max-w-3xl mx-auto">
                            Due to the highly sensitive nature of our enterprise intelligence and valuation
                            protection services, all client identities, audit parameters, and threat models
                            are strictly embargoed. We operate on a zero-disclosure architecture.
                        </p>
                        <div className="mt-10 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Client Identity</p>
                                <p className="text-champagne font-light">Permanently Withheld</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Audit Parameters</p>
                                <p className="text-champagne font-light">Classified</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Threat Models</p>
                                <p className="text-champagne font-light">Zero-Retention</p>
                            </div>
                        </div>
                    </MotionDiv>
                </div>
            </div>
        </section>
    )
}
