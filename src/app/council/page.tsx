import { Users, Shield, Award, Briefcase, Globe, Cpu, Lock, Star } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Security Intelligence Council | RiskFortress',
    description: 'Our council of former intelligence officers, military leaders, and corporate security experts providing strategic guidance.',
    keywords: [
        'Security Intelligence Council',
        'Corporate Security Advisors',
        'Risk Management Experts',
        'Former Intelligence Officers',
        'Military Security Consultants',
        'Enterprise Risk Advisory Board',
    ],
}

const councilMembers = [
    {
        name: 'Col. Rajesh Verma (Retd.)',
        role: 'Strategic Security Advisor',
        background: 'Former RAW Operations Head, 25+ years intelligence experience',
        expertise: ['Geo-political Risk', 'Counter-Intelligence', 'Crisis Management'],
        icon: Shield,
        clearance: 'Level 1',
    },
    {
        name: 'Ms. Priya Sharma',
        role: 'Corporate Intelligence Director',
        background: 'Ex-Interpol, Fortune 500 Security Consultant',
        expertise: ['Corporate Espionage', 'Due Diligence', 'Regulatory Compliance'],
        icon: Briefcase,
        clearance: 'Level 1',
    },
    {
        name: 'Maj. Gen. Arjun Singh (Retd.)',
        role: 'Physical Security Architect',
        background: 'Former NSG Commander, 30+ years special operations',
        expertise: ['Critical Infrastructure', 'Executive Protection', 'Asset Hardening'],
        icon: Award,
        clearance: 'Level 1',
    },
    {
        name: 'Dr. Amit Patel',
        role: 'Cyber Intelligence Lead',
        background: 'PhD in Cybersecurity, Ex-National Cyber Security Coordinator',
        expertise: ['TSCM', 'Digital Forensics', 'Insider Threat Detection'],
        icon: Cpu,
        clearance: 'Level 1',
    },
    {
        name: 'Ms. Naina Desai',
        role: 'Family Office Security Specialist',
        background: '20+ years protecting ultra-HNWI families globally',
        expertise: ['Legacy Security', 'Digital Footprint Management', 'Private Security'],
        icon: Users,
        clearance: 'Level 2',
    },
    {
        name: 'Mr. Vikram Mehta',
        role: 'Industrial Risk Analyst',
        background: 'Former Industrial Security Bureau, Manufacturing Sector Expert',
        expertise: ['Labor Intelligence', 'Supply Chain Security', 'Industrial Espionage'],
        icon: Globe,
        clearance: 'Level 2',
    },
]

export default function CouncilPage() {
    return (
        <div className="min-h-screen py-32">
            {/* Background */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-wireframe" />
                </div>
            </div>

            <div className="container relative z-10 mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full glass-morphism border border-intelligence/20 mb-6">
                        <Users className="h-5 w-5 text-intelligence" />
                        <span className="text-sm font-semibold text-intelligence">
                            STRATEGIC INTELLIGENCE COUNCIL
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-gray-300">Security</span>{' '}
                        <span className="gradient-text">Intelligence Council</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Former intelligence officers, military leaders, and corporate security experts
                        providing strategic guidance for India's most critical assets.
                    </p>
                </div>

                {/* Council Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {councilMembers.map((member) => (
                        <div key={member.name} className="group p-8 rounded-2xl glass-morphism border border-gray-800 hover:border-intelligence/30 transition-all">
                            <div className="flex items-start space-x-4 mb-6">
                                <div className="p-3 rounded-xl bg-intelligence/10 group-hover:bg-intelligence/20 transition-colors">
                                    <member.icon className="h-8 w-8 text-intelligence" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                                    <p className="text-intelligence font-semibold mb-2">{member.role}</p>
                                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-800">
                                        <Lock className="h-3 w-3 mr-1" />
                                        <span className="text-xs font-medium">CLEARANCE: {member.clearance}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <p className="text-gray-400 text-sm mb-4">{member.background}</p>
                                <div className="space-y-2">
                                    {member.expertise.map((skill) => (
                                        <div key={skill} className="flex items-center text-sm text-gray-300">
                                            <Star className="h-3 w-3 text-intelligence mr-2" />
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-gray-800">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-400">Advisory Since</span>
                                    <span className="text-sm font-semibold text-white">2018+</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Advisory Process */}
                <div className="max-w-6xl mx-auto mb-20">
                    <div className="p-8 rounded-2xl glass-morphism border border-intelligence/20">
                        <h3 className="text-2xl font-bold text-white mb-8 text-center">
                            Council Advisory Process
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                {
                                    step: '01',
                                    title: 'Threat Assessment',
                                    description: 'Multi-disciplinary analysis of security threats',
                                },
                                {
                                    step: '02',
                                    title: 'Council Review',
                                    description: 'Round-table discussion with relevant experts',
                                },
                                {
                                    step: '03',
                                    title: 'Strategy Formulation',
                                    description: 'Custom security architecture development',
                                },
                                {
                                    step: '04',
                                    title: 'Implementation Oversight',
                                    description: 'Continuous monitoring and adjustment',
                                },
                            ].map((process) => (
                                <div key={process.step} className="text-center">
                                    <div className="w-12 h-12 rounded-full bg-intelligence/10 border border-intelligence/20 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-xl font-bold text-intelligence">{process.step}</span>
                                    </div>
                                    <h4 className="font-semibold text-white mb-2">{process.title}</h4>
                                    <p className="text-sm text-gray-400">{process.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Request Council Briefing */}
                <div className="max-w-4xl mx-auto p-8 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-950 border border-gray-800">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold text-white mb-4">
                            Request Council Briefing
                        </h3>
                        <p className="text-gray-400 mb-6">
                            Schedule a confidential briefing with relevant council members for your specific security concerns.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="p-6 rounded-xl bg-gray-900/50">
                                <h4 className="font-semibold text-white mb-2">Standard Briefing</h4>
                                <p className="text-gray-400 text-sm mb-3">2 council members, 2-hour session</p>
                                <p className="text-2xl font-bold text-intelligence">₹5,00,000</p>
                            </div>
                            <div className="p-6 rounded-xl bg-intelligence/5 border border-intelligence/20">
                                <h4 className="font-semibold text-white mb-2">Executive Briefing</h4>
                                <p className="text-gray-400 text-sm mb-3">Full council, day-long strategy session</p>
                                <p className="text-2xl font-bold text-intelligence">₹25,00,000</p>
                            </div>
                        </div>
                        <button className="px-8 py-3 bg-gradient-to-r from-intelligence to-industrial text-white rounded-lg font-semibold hover:shadow-intelligence transition-all">
                            Schedule Confidential Briefing
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}