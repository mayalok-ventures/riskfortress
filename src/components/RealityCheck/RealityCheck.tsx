'use client'

import { motion } from 'framer-motion'
import { X, Check, AlertTriangle, Shield, Lock, Users, Building } from 'lucide-react'

const realities = [
    {
        myth: 'Security Guard Agencies provide comprehensive protection',
        reality: 'Traditional agencies focus on manpower. We deliver predictive intelligence and strategic risk management.',
        icon: Users,
        keywords: ['Predictive Intelligence', 'Strategic Risk Management'],
    },
    {
        myth: 'CCTV installation prevents corporate espionage',
        reality: 'Modern threats require TSCM (Technical Surveillance Counter-Measures) and digital footprint analysis.',
        icon: Building,
        keywords: ['TSCM Services', 'Digital Espionage Defense'],
    },
    {
        myth: 'Physical security is enough for family offices',
        reality: 'HNIs need layered security including digital footprint sanitization and legacy succession planning.',
        icon: Shield,
        keywords: ['Digital Footprint Sanitization', 'Legacy Succession Security'],
    },
    {
        myth: 'Land disputes can be resolved after purchase',
        reality: 'Pre-emptive Land Due Diligence prevents 90% of disputes and saves crores in litigation.',
        icon: Lock,
        keywords: ['Land Due Diligence', 'Pre-emptive Risk Mitigation'],
    },
]

const negativeKeywords = [
    'Security Guard Agency',
    'Bouncer Services',
    'CCTV Installation',
    'Gunman for Hire',
    'Private Detective',
    'Bodyguard Services',
    'Watchman Company',
    'Security Patrol',
]

export default function RealityCheck() {
    return (
        <section className="relative py-32 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-950">
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-full h-full bg-topographic" />
                </div>
            </div>

            {/* X Pattern */}
            <div className="absolute inset-0 opacity-5">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-px h-full bg-gray-500"
                        style={{
                            left: `${(i * 10) % 100}%`,
                            transform: `rotate(${i % 2 === 0 ? '45deg' : '-45deg'})`,
                        }}
                    />
                ))}
            </div>

            <div className="container relative z-10 mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                        <span className="text-sm font-medium text-red-300">
                            GROUND REALITY CHECK
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-gray-300">If You're Searching For</span>{' '}
                        <span className="text-red-400">These Words</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        You're attracting ₹15,000/month security guard inquiries. We help you target Crore+ budget clients instead.
                    </p>
                </motion.div>

                {/* Negative Keywords Grid */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {negativeKeywords.map((keyword) => (
                            <div
                                key={keyword}
                                className="p-4 rounded-lg bg-gray-900/50 border border-gray-800 text-center group hover:border-red-500/30 transition-colors"
                            >
                                <div className="flex items-center justify-center space-x-2">
                                    <X className="h-4 w-4 text-red-400" />
                                    <span className="text-gray-400 group-hover:text-red-300 transition-colors">
                                        {keyword}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-gray-500 mt-6 text-sm">
                        ❌ These keywords attract low-budget clients. We help you avoid them completely.
                    </p>
                </motion.div>

                {/* Reality vs Myth */}
                <div className="max-w-4xl mx-auto">
                    {realities.map((item, index) => (
                        <motion.div
                            key={item.myth}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="mb-8 last:mb-0"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Myth Side */}
                                <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800">
                                    <div className="flex items-start space-x-3 mb-4">
                                        <div className="p-2 rounded-lg bg-red-500/10">
                                            <X className="h-5 w-5 text-red-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-red-300 mb-2">The Myth</h3>
                                            <p className="text-gray-300">{item.myth}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Reality Side */}
                                <div className="p-6 rounded-2xl bg-intelligence/5 border border-intelligence/20">
                                    <div className="flex items-start space-x-3 mb-4">
                                        <div className="p-2 rounded-lg bg-intelligence/10">
                                            <item.icon className="h-5 w-5 text-intelligence" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-intelligence mb-2">The Reality</h3>
                                            <p className="text-gray-300 mb-3">{item.reality}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {item.keywords.map((keyword) => (
                                                    <span
                                                        key={keyword}
                                                        className="px-3 py-1 text-sm rounded-full bg-intelligence/10 text-intelligence border border-intelligence/20"
                                                    >
                                                        {keyword}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Target Client Profile */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="mt-20 p-8 rounded-2xl glass-morphism max-w-3xl mx-auto"
                >
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
                            <Check className="h-4 w-4 text-green-400" />
                            <span className="text-sm font-medium text-green-300">
                                YOUR TARGET CLIENT PROFILE
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Searching For These Premium Keywords
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            'Enterprise Risk Management India',
                            'Corporate Intelligence Agency',
                            'Predictive Risk Analytics',
                            'Strategic Security Consulting',
                            'Land Due Diligence India',
                            'TSCM Services India',
                            'Family Office Risk Management',
                            'HNI Executive Protection',
                            'AI-Driven Risk Modeling',
                        ].map((keyword) => (
                            <div
                                key={keyword}
                                className="p-3 rounded-lg bg-green-500/5 border border-green-500/20 text-center"
                            >
                                <span className="text-sm text-green-300">{keyword}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 rounded-lg bg-gray-900/50 border border-gray-800">
                        <p className="text-center text-gray-300">
                            <span className="font-semibold text-green-400">Budget Range:</span>{' '}
                            ₹50 Lakhs to ₹50 Crores+ per annum |{' '}
                            <span className="font-semibold text-green-400">Client Type:</span>{' '}
                            Fortune 500, Industrial Conglomerates, Family Offices, HNIs
                        </p>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}