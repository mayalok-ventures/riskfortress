import { Lock, Shield, Key, EyeOff } from 'lucide-react'
import { Metadata } from 'next'

import IntakeForm from '@/components/SecureForm/IntakeForm'

export const metadata: Metadata = {
    title: 'Hire Private Intelligence Agency India | Discrete Consultation | RiskFortress',
    description: 'Hire Private Intelligence Agency India for HNI Asset Protection Services. Discrete consultation for Predictive Risk Intelligence, Corporate Fraud Investigation Services, and TSCM Services Delhi. RiskFortress India - A Mayalok Ventures Division.',
    keywords: [
        'Hire Private Intelligence Agency India',
        'Discrete Consultation',
        'RiskFortress India',
        'HNI Asset Protection Services India',
        'Corporate Fraud Investigation Services',
        'TSCM Services Delhi',
        'Private Intelligence Firm India',
        'Executive Reputation Management Crisis',
        'Kidnap and Ransom Prevention India',
        'Leak Investigation for Companies',
    ],
    openGraph: {
        title: 'Hire Private Intelligence Agency India | Discrete Consultation',
        description: 'Discrete consultation for Predictive Risk Intelligence. Private Intelligence Firm India for Ultra-HNWIs with ₹100Cr+ assets.',
    },
}

export default function SecureIntakePage() {
    return (
        <div className="min-h-screen py-32">
            {/* Background */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-grid-pattern" />
                </div>
            </div>

            <div className="container relative z-10 mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center space-x-3 px-6 py-3 border border-champagne/20 rounded-none mb-8">
                            <div className="w-2 h-2 bg-champagne rounded-full animate-pulse" />
                            <span className="text-xs tracking-[0.25em] uppercase text-champagne font-light">
                                HIRE PRIVATE INTELLIGENCE AGENCY INDIA
                            </span>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-light mb-6">
                            <span className="text-white">Discrete</span>{' '}
                            <span className="text-champagne">Consultation</span>
                        </h1>

                        <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light mb-4">
                            Request Predictive Risk Intelligence, Corporate Fraud Investigation Services, 
                            or TSCM Services Delhi from RiskFortress India—A Mayalok Ventures Division.
                        </p>
                        
                        <p className="text-sm text-gray-500 max-w-2xl mx-auto">
                            HNI Asset Protection Services India for Ultra-HNWIs with ₹100Cr+ assets. 
                            All submissions encrypted and purged after 72 hours.
                        </p>
                    </div>

                    {/* Security Features */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {[
                            {
                                icon: Shield,
                                title: 'Zero Data Retention',
                                description: 'Automated deletion after 72 hours',
                                color: 'text-green-400',
                            },
                            {
                                icon: Lock,
                                title: 'AES-256-GCM',
                                description: 'Military-grade encryption',
                                color: 'text-intelligence',
                            },
                            {
                                icon: Key,
                                title: 'Corporate Email Only',
                                description: 'No personal email domains',
                                color: 'text-purple-400',
                            },
                            {
                                icon: EyeOff,
                                title: 'No Third-Party Access',
                                description: 'End-to-end encrypted',
                                color: 'text-yellow-400',
                            },
                        ].map((feature) => (
                            <div
                                key={feature.title}
                                className="p-6 rounded-xl glass-morphism text-center"
                            >
                                <feature.icon className={`h-8 w-8 ${feature.color} mx-auto mb-4`} />
                                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-sm text-gray-400">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Form Container */}
                    <div className="mb-12">
                        <IntakeForm />
                    </div>

                    {/* Alternative Contact */}
                    <div className="p-8 rounded-2xl glass-morphism border border-intelligence/20">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-white mb-4">
                                Prefer Direct Contact?
                            </h3>
                            <p className="text-gray-400 mb-6">
                                For ultra-sensitive matters or to establish a secure communication channel
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 rounded-xl bg-gray-900/50">
                                    <h4 className="font-semibold text-white mb-2">Secure Phone</h4>
                                    <a
                                        href="tel:+912200000000"
                                        className="text-2xl font-bold text-intelligence hover:text-intelligence/80 transition-colors"
                                    >
                                        +91 22 XXXX XXXX
                                    </a>
                                    <p className="text-sm text-gray-400 mt-2">24/7 encrypted line</p>
                                </div>
                                <div className="p-6 rounded-xl bg-gray-900/50">
                                    <h4 className="font-semibold text-white mb-2">Encrypted Email</h4>
                                    <a
                                        href="mailto:intelligence@riskfortress.in"
                                        className="text-xl text-intelligence hover:text-intelligence/80 transition-colors"
                                    >
                                        kunal@riskfortress.in
                                    </a>
                                    <p className="text-sm text-gray-400 mt-2">PGP key available upon request</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
