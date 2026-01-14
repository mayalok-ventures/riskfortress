'use client'

import { motion } from 'framer-motion'
import { Check, X, BarChart3, Cpu, Users, Shield, Lock, Zap, Globe } from 'lucide-react'

const advantages = [
    {
        icon: BarChart3,
        title: 'Predictive Analytics Engine',
        description: 'AI-driven risk modeling that forecasts threats 6-12 months before they materialize',
        stat: '94% Prediction Accuracy',
        color: 'from-intelligence to-blue-600',
    },
    {
        icon: Cpu,
        title: 'Technical Surveillance Defense',
        description: 'Military-grade TSCM equipment and expertise for corporate espionage prevention',
        stat: 'Zero Breaches Track Record',
        color: 'from-purple-500 to-purple-700',
    },
    {
        icon: Users,
        title: 'Exclusive Client Focus',
        description: 'We only serve Fortune 500 companies and Ultra-HNWIs. No security guard contracts.',
        stat: '100% Premium Clientele',
        color: 'from-green-500 to-green-700',
    },
    {
        icon: Globe,
        title: 'Global Intelligence Network',
        description: 'Real-time threat intelligence from 50+ countries, localized for Indian context',
        stat: '24/7 Coverage',
        color: 'from-orange-500 to-orange-700',
    },
]

const vsTraditional = [
    {
        aspect: 'Client Focus',
        riskfortress: 'Fortune 500, HNIs, Family Offices',
        traditional: 'Security guards, bouncers, watchmen',
    },
    {
        aspect: 'Service Range',
        riskfortress: 'Predictive intelligence, TSCM, Due diligence',
        traditional: 'Manpower supply, CCTV installation',
    },
    {
        aspect: 'Budget Range',
        riskfortress: '₹50L - ₹50Cr per annum',
        traditional: '₹15k - ₹2L per month',
    },
    {
        aspect: 'Technology',
        riskfortress: 'AI, ML, Satellite imagery, TSCM',
        traditional: 'Basic surveillance equipment',
    },
    {
        aspect: 'Team Expertise',
        riskfortress: 'Ex-military, Intelligence, Data scientists',
        traditional: 'Security guards, Supervisors',
    },
]

export default function RiskFortressEdge() {
    return (
        <section className="relative py-32 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 left-0 w-full h-full bg-wireframe" />
                </div>
            </div>

            {/* Animated Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-intelligence to-transparent animate-shimmer" />

            <div className="container relative z-10 mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-intelligence/10 border border-intelligence/20 mb-6">
                        <Zap className="h-4 w-4 text-intelligence" />
                        <span className="text-sm font-medium text-intelligence">
                            COMPETITIVE ADVANTAGE
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-gray-300">The</span>{' '}
                        <span className="gradient-text">RiskFortress Edge</span>
                    </h2>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Why Fortune 500 companies choose us over traditional security agencies for their most critical assets.
                    </p>
                </motion.div>

                {/* Advantages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                    {advantages.map((advantage, index) => (
                        <motion.div
                            key={advantage.title}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative group"
                        >
                            <div className={`p-8 rounded-2xl bg-gradient-to-br ${advantage.color}/10 border ${advantage.color.replace('from-', 'border-').replace(' to-', '/30')} h-full`}>
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${advantage.color} flex items-center justify-center mb-6`}>
                                    <advantage.icon className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-4">{advantage.title}</h3>
                                <p className="text-gray-400 mb-6">{advantage.description}</p>
                                <div className="mt-auto">
                                    <div className="inline-block px-4 py-2 rounded-full bg-white/5">
                                        <span className="text-lg font-bold text-white">{advantage.stat}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Comparison Table */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="mb-20"
                >
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-white mb-4">
                            RiskFortress vs Traditional Security Agencies
                        </h3>
                        <p className="text-gray-400">
                            We serve different markets. They handle security guards. We handle enterprise risk.
                        </p>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-gray-800">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-800">
                                    <th className="py-6 px-8 text-left text-gray-400 font-semibold">Aspect</th>
                                    <th className="py-6 px-8 text-left">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 rounded-full bg-intelligence" />
                                            <span className="text-intelligence font-bold">RiskFortress</span>
                                        </div>
                                    </th>
                                    <th className="py-6 px-8 text-left">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 rounded-full bg-gray-600" />
                                            <span className="text-gray-400 font-bold">Traditional Agencies</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {vsTraditional.map((row, index) => (
                                    <tr key={row.aspect} className={`border-b border-gray-800 ${index % 2 === 0 ? 'bg-gray-900/30' : ''}`}>
                                        <td className="py-6 px-8 text-gray-300 font-medium">{row.aspect}</td>
                                        <td className="py-6 px-8">
                                            <div className="flex items-center space-x-2">
                                                <Check className="h-5 w-5 text-green-400" />
                                                <span className="text-white">{row.riskfortress}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-8">
                                            <div className="flex items-center space-x-2">
                                                <X className="h-5 w-5 text-red-400" />
                                                <span className="text-gray-400">{row.traditional}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Zero Compromise Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="p-8 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-950 border border-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="p-3 rounded-xl bg-red-500/10">
                                        <Shield className="h-8 w-8 text-red-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Zero Compromise Policy</h3>
                                </div>
                                <ul className="space-y-4">
                                    {[
                                        '❌ No security guard contracts',
                                        '❌ No bouncer services',
                                        '❌ No basic CCTV installation',
                                        '❌ No low-budget clients (below ₹50L)',
                                    ].map((item) => (
                                        <li key={item} className="flex items-center text-gray-300">
                                            <div className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="p-3 rounded-xl bg-green-500/10">
                                        <Lock className="h-8 w-8 text-green-400" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">Premium Focus Areas</h3>
                                </div>
                                <ul className="space-y-4">
                                    {[
                                        '✅ Enterprise Risk Management India',
                                        '✅ Corporate Intelligence Services',
                                        '✅ Land Due Diligence & TSCM',
                                        '✅ Family Office Security Architecture',
                                    ].map((item) => (
                                        <li key={item} className="flex items-center text-gray-300">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}