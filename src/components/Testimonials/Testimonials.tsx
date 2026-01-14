'use client'

import { motion } from 'framer-motion'
import { Quote, Building, Users, Shield } from 'lucide-react'

const testimonials = [
    {
        quote: "RiskFortress prevented a ₹250Cr land dispute through pre-emptive due diligence. Their intelligence network is unparalleled.",
        author: "Rajesh Mehta",
        company: "Fortune 500 Manufacturing Conglomerate",
        icon: Building,
    },
    {
        quote: "As a family office managing ₹5,000Cr in assets, their digital footprint sanitization and legacy security gave us complete peace of mind.",
        author: "Priya Sharma",
        company: "Third-Generation Industrial Family",
        icon: Users,
    },
    {
        quote: "Their TSCM services detected and neutralized a corporate espionage attempt that would have cost us ₹150Cr in intellectual property.",
        author: "Amit Patel",
        company: "NASDAQ-Listed Technology Company",
        icon: Shield,
    },
]

export default function Testimonials() {
    return (
        <section className="py-32 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950" />

            <div className="container relative z-10 mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-gray-300">Trusted by</span>{' '}
                        <span className="gradient-text">Enterprise Leaders</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.author}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="p-8 rounded-2xl glass-morphism border border-gray-800 hover:border-intelligence/30 transition-all"
                        >
                            <Quote className="h-8 w-8 text-intelligence mb-4" />
                            <p className="text-gray-300 mb-6 italic">"{testimonial.quote}"</p>
                            <div className="flex items-center space-x-3">
                                <div className="p-2 rounded-lg bg-intelligence/10">
                                    <testimonial.icon className="h-5 w-5 text-intelligence" />
                                </div>
                                <div>
                                    <div className="font-semibold text-white">{testimonial.author}</div>
                                    <div className="text-sm text-gray-400">{testimonial.company}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}