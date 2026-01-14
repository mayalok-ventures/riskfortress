import { Metadata } from 'next'
import {
    Shield,
    Lock,
    Globe,
    Building,
    Users,
    Cpu,
    Target,
    BarChart3,
    Eye,
    Network,
    Zap
} from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Corporate Intelligence Capabilities | RiskFortress',
    description: 'Enterprise Risk Management, Land Due Diligence, TSCM Services, and Family Office Security for Fortune 500 companies and HNIs.',
    keywords: [
        'Enterprise Risk Management India',
        'Corporate Intelligence Agency',
        'Land Due Diligence India',
        'TSCM Services India',
        'Family Office Risk Management',
        'Predictive Risk Analytics',
        'Strategic Security Consulting',
        'Industrial Espionage Countermeasures',
    ],
}

const capabilities = [
    {
        id: 'erm',
        title: 'Enterprise Risk Management',
        icon: Shield,
        description: 'Comprehensive risk assessment and mitigation strategies for Fortune 500 companies',
        features: [
            'Risk Identification & Assessment',
            'Business Continuity Planning',
            'Crisis Management Framework',
            'Regulatory Compliance Advisory',
            'Risk Appetite Framework Development',
        ],
        keywords: ['Enterprise Risk Management India', 'Corporate Risk Framework', 'Business Continuity Planning'],
    },
    {
        id: 'land',
        title: 'Land Due Diligence',
        icon: Building,
        description: 'End-to-end land verification and encroachment prevention for industrial projects',
        features: [
            'Title Verification & Chain Analysis',
            'Encroachment Risk Assessment',
            'Environmental Compliance Check',
            'Political Risk Analysis',
            'Dispute Prevention Strategy',
        ],
        keywords: ['Land Due Diligence India', 'Industrial Land Verification', 'Encroachment Monitoring'],
    },
    {
        id: 'tscm',
        title: 'TSCM Services',
        icon: Cpu,
        description: 'Technical Surveillance Counter-Measures for corporate espionage prevention',
        features: [
            'Bug Sweeping & Detection',
            'Electronic Surveillance Audit',
            'Secure Communication Setup',
            'Cybersecurity Threat Assessment',
            'Insider Threat Detection',
        ],
        keywords: ['TSCM Services India', 'Bug Sweeping', 'Electronic Surveillance Defense'],
    },
    {
        id: 'family',
        title: 'Family Office Security',
        icon: Users,
        description: 'Complete security architecture for ultra-high-net-worth families',
        features: [
            'Legacy Succession Security',
            'Digital Footprint Management',
            'Executive Protection Planning',
            'Reputation Risk Management',
            'Private Asset Protection',
        ],
        keywords: ['Family Office Risk Management', 'HNI Security', 'Legacy Succession Security'],
    },
    {
        id: 'intelligence',
        title: 'Predictive Intelligence',
        icon: BarChart3,
        description: 'AI-driven threat forecasting and risk modeling',
        features: [
            'Threat Intelligence Gathering',
            'Predictive Analytics Modeling',
            'Geopolitical Risk Analysis',
            'Market Intelligence',
            'Competitive Intelligence',
        ],
        keywords: ['Predictive Risk Analytics', 'AI-Driven Risk Modeling', 'Threat Intelligence'],
    },
    {
        id: 'industrial',
        title: 'Industrial Security',
        icon: Target,
        description: 'Security solutions for manufacturing and infrastructure sectors',
        features: [
            'Supply Chain Security',
            'Labor Unrest Prediction',
            'Industrial Espionage Prevention',
            'Critical Infrastructure Protection',
            'Greenfield Project Security',
        ],
        keywords: ['Industrial Security', 'Supply Chain Security', 'Critical Infrastructure Protection'],
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
                    <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full glass-morphism border border-intelligence/20 mb-6">
                        <Zap className="h-5 w-5 text-intelligence" />
                        <span className="text-sm font-semibold text-intelligence">
                            PREMIUM CORPORATE CAPABILITIES
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-gray-300">Intelligence</span>{' '}
                        <span className="gradient-text">Capabilities</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Unlike security guard agencies, we focus exclusively on strategic intelligence
                        and risk management for India's most critical assets and private legacies.
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

                {/* What We Don't Do */}
                <div className="p-8 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-950 border border-gray-800 max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h3 className="text-3xl font-bold text-white mb-4">
                            What We <span className="text-red-400">Don't</span> Do
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