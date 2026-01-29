import {
    Shield,
    Building,
    Users,
    Cpu,
    Target,
    BarChart3,
    Zap
} from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Intelligence Verticals | TSCM Services Delhi | Corporate Espionage Countermeasures India',
    description: 'Predictive Risk Intelligence capabilities preventing the next corporate collapse. TSCM Services Delhi & India, Corporate Espionage Countermeasures, Insider Threat Detection Services, HNI Asset Protection Services India. Statutory Forensics and Strategic Foresight for UHNWIs.',
    keywords: [
        'TSCM Services Delhi',
        'TSCM Services India',
        'Corporate Espionage Countermeasures India',
        'Insider Threat Detection Services',
        'HNI Asset Protection Services India',
        'Family Office Risk Advisory',
        'Startup Intellectual Property Protection',
        'Due Diligence for Angel Investors',
        'Statutory Forensics',
        'Leak Investigation for Companies',
        'RiskFortress Security Division',
        'Private Intelligence Firm India',
        'Predictive Risk Intelligence',
        'High Net Worth Security Audit',
    ],
}

const capabilities = [
    {
        id: 'tscm',
        title: 'TSCM Services India & Delhi',
        icon: Cpu,
        description: 'Technical Surveillance Counter-Measures preventing corporate espionage. Bug sweeping and leak investigation for companies.',
        features: [
            'Bug Sweeping & Detection (TSCM Services Delhi)',
            'Corporate Espionage Countermeasures India',
            'Leak Investigation for Companies',
            'Secure Communication Channels',
            'Insider Threat Detection Services',
        ],
        keywords: ['TSCM Services India', 'TSCM Services Delhi', 'Corporate Espionage Countermeasures India'],
    },
    {
        id: 'hni',
        title: 'HNI Asset Protection Services India',
        icon: Shield,
        description: 'Asset Protection Intelligence for Ultra-HNWIs with ₹100Cr+ assets. Strategic Foresight preventing the next corporate collapse.',
        features: [
            'High Net Worth Security Audit',
            'Personal Threat Assessment for Executives',
            'Kidnap and Ransom (K&R) Prevention India',
            'Secure Transport for Valuables India',
            'Executive Reputation Management Crisis',
        ],
        keywords: ['HNI Asset Protection Services India', 'High Net Worth Security Audit', 'K&R Prevention India'],
    },
    {
        id: 'family',
        title: 'Family Office Risk Advisory',
        icon: Users,
        description: 'Predictive Risk Intelligence for Family Offices. Preventing succession crises and protecting multi-generational wealth.',
        features: [
            'Family Office Risk Advisory',
            'Legacy Succession Security',
            'Wealth Transfer Intelligence',
            'Digital Footprint Sanitization',
            'Reputation Risk Management',
        ],
        keywords: ['Family Office Risk Advisory', 'HNI Asset Protection Services India', 'Legacy Security'],
    },
    {
        id: 'corporate',
        title: 'Corporate Fraud Investigation Services',
        icon: BarChart3,
        description: 'Predictive Risk Intelligence detecting fraud and insider threats before they cause catastrophic damage.',
        features: [
            'Corporate Fraud Investigation Services',
            'Insider Threat Detection Services',
            'Due Diligence for Angel Investors',
            'Startup Intellectual Property Protection',
            'Competitor Vulnerability Assessment',
        ],
        keywords: ['Corporate Fraud Investigation Services', 'Insider Threat Detection Services', 'Due Diligence for Angel Investors'],
    },
    {
        id: 'statutory',
        title: 'Statutory Forensics',
        icon: Building,
        description: 'Statutory land intelligence preventing the next Noida Twin Tower scenario. Regulatory and zoning risk prediction.',
        features: [
            'Statutory Land Intelligence',
            'Regulatory Change Forecasting',
            'Zoning & Land Use Risk Prediction',
            'Political Risk Assessment',
            'Title & Encumbrance Forensics',
        ],
        keywords: ['Statutory Forensics', 'Statutory Land Intelligence', 'RiskFortress Asset Protection'],
    },
    {
        id: 'intelligence',
        title: 'Predictive Risk Intelligence',
        icon: Target,
        description: 'Strategic Foresight for UHNWIs preventing the next corporate collapse. High-Stakes Advisory Mandate.',
        features: [
            'Predictive Risk Intelligence',
            'Preventing the next corporate collapse',
            'Strategic Foresight for UHNWIs',
            'Business Model Collapse Prediction',
            'High-Stakes Advisory Mandate',
        ],
        keywords: ['Predictive Risk Intelligence', 'Strategic Foresight for UHNWIs', 'Private Intelligence Firm India'],
    },
]

export default function CapabilitiesPage() {
    return (
        <div className="min-h-screen py-32">
            {/* Background */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-topographic" />
                </div>
            </div>

            <div className="container relative z-10 mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center space-x-3 px-6 py-3 border border-champagne/20 rounded-none mb-8">
                        <div className="w-2 h-2 bg-champagne rounded-full animate-pulse" />
                        <span className="text-xs tracking-[0.25em] uppercase text-champagne font-light">
                            RISKFORTRESS SECURITY DIVISION
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-light mb-6">
                        <span className="text-white">Intelligence</span>{' '}
                        <span className="text-champagne">Verticals</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light mb-6">
                        Predictive Risk Intelligence preventing the next corporate collapse. 
                        Private Intelligence Firm India specializing in HNI Asset Protection Services, 
                        Corporate Espionage Countermeasures, and Statutory Forensics.
                    </p>
                    
                    <p className="text-sm text-gray-500 max-w-2xl mx-auto">
                        Strategic Foresight for UHNWIs with ₹100Cr+ assets. High-Stakes Advisory Mandate 
                        by RiskFortress India—A Mayalok Ventures Division.
                    </p>
                </div>

                {/* Capabilities Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {capabilities.map((capability) => (
                        <div
                            key={capability.id}
                            id={capability.id}
                            className="group p-8 rounded-2xl glass-morphism border border-gray-800 hover:border-intelligence/30 transition-all hover:scale-[1.02]"
                        >
                            <div className="flex items-start space-x-4 mb-6">
                                <div className="p-3 rounded-xl bg-intelligence/10 group-hover:bg-intelligence/20 transition-colors">
                                    <capability.icon className="h-8 w-8 text-intelligence" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">{capability.title}</h3>
                                    <p className="text-gray-400">{capability.description}</p>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {capability.features.map((feature, index) => (
                                    <li key={index} className="flex items-center text-gray-300">
                                        <div className="w-2 h-2 bg-intelligence rounded-full mr-3" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <div className="flex flex-wrap gap-2">
                                {capability.keywords.map((keyword) => (
                                    <span
                                        key={keyword}
                                        className="px-3 py-1 text-xs rounded-full bg-intelligence/5 text-intelligence border border-intelligence/10"
                                    >
                                        {keyword}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-800">
                                <Link
                                    href="/secure-intake"
                                    className="inline-flex items-center text-intelligence hover:text-intelligence/80 transition-colors"
                                >
                                    <span className="font-semibold">Request Detailed Brief</span>
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* What We Don&apos;t Do */}
                <div className="p-8 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-950 border border-gray-800 max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold text-white mb-4">
                            What We <span className="text-red-400">Don&apos;t</span> Do
                        </h3>
                        <p className="text-gray-400">
                            To maintain our premium positioning and serve only Fortune 500 & HNI clients
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/20">
                            <h4 className="font-bold text-red-300 mb-4">❌ Services We Avoid</h4>
                            <ul className="space-y-2">
                                {[
                                    'Security Guard Deployment',
                                    'Bouncer Services',
                                    'CCTV Installation',
                                    'Watchman Services',
                                    'Cash Van Security',
                                    'Event Security Guards',
                                ].map((service) => (
                                    <li key={service} className="text-gray-300 flex items-center">
                                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3" />
                                        {service}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-6 rounded-xl bg-green-500/5 border border-green-500/20">
                            <h4 className="font-bold text-green-300 mb-4">✅ Services We Focus On</h4>
                            <ul className="space-y-2">
                                {[
                                    'Predictive Intelligence',
                                    'Strategic Risk Management',
                                    'Corporate Due Diligence',
                                    'Technical Surveillance Defense',
                                    'Family Office Security',
                                    'Industrial Risk Assessment',
                                ].map((service) => (
                                    <li key={service} className="text-gray-300 flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
                                        {service}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}