'use client'

import { Shield, Lock, Eye, FileText, AlertTriangle, Building, Users, Cpu, BookOpen, Newspaper, X } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import DossierCard from '@/components/DossierCard/DossierCard'

const metadata = {
    title: 'Risk Intelligence Dossiers | RiskFortress',
    description: 'Confidential threat intelligence briefs and risk analysis for enterprise clients. Land disputes, labor unrest, corporate espionage case studies.',
    keywords: [
        'Risk Intelligence Dossiers',
        'Threat Analysis Reports',
        'Corporate Espionage Cases',
        'Land Dispute Intelligence',
        'Labor Unrest Prediction Reports',
        'TSCM Service Case Studies',
        'Family Office Security Briefs',
    ],
}

const dossiers = [
    {
        id: 'rf-2024-001',
        title: 'Industrial Land Encroachment - Western Maharashtra',
        sector: 'Industrial',
        threatLevel: 'High',
        confidence: 92,
        date: '2024-01-15',
        location: 'Pune, Maharashtra',
        summary: 'Systematic land encroachment targeting 500+ acre industrial park',
        status: 'Active',
        icon: Building,
        keywords: ['Land Due Diligence', 'Factory Encroachment Monitoring', 'Industrial Risk'],
    },
    {
        id: 'rf-2024-002',
        title: 'Corporate Espionage Network - Bengaluru Tech Hub',
        sector: 'Technical',
        threatLevel: 'Critical',
        confidence: 88,
        date: '2024-01-10',
        location: 'Bengaluru, Karnataka',
        summary: 'Organized TSCM breach in 3 major technology companies',
        status: 'Neutralized',
        icon: Cpu,
        keywords: ['TSCM Services', 'Digital Espionage Defense', 'Insider Threat'],
    },
    {
        id: 'rf-2024-003',
        title: 'Labor Unrest Prediction - Auto Manufacturing Belt',
        sector: 'Industrial',
        threatLevel: 'Medium',
        confidence: 85,
        date: '2024-01-05',
        location: 'Chennai, Tamil Nadu',
        summary: 'Predictive analytics indicating 65% probability of major strike',
        status: 'Monitoring',
        icon: Users,
        keywords: ['Labor Unrest Prediction', 'Supply Chain Security', 'Industrial Intelligence'],
    },
    {
        id: 'rf-2024-004',
        title: 'Family Office Digital Footprint Analysis',
        sector: 'HNI',
        threatLevel: 'High',
        confidence: 90,
        date: '2024-01-03',
        location: 'Mumbai, Maharashtra',
        summary: 'Comprehensive digital footprint audit for ₹5,000Cr family office',
        status: 'Resolved',
        icon: Shield,
        keywords: ['Digital Footprint Sanitization', 'Family Office Security', 'HNI Protection'],
    },
    {
        id: 'rf-2024-005',
        title: 'Critical Infrastructure Threat Assessment',
        sector: 'Industrial',
        threatLevel: 'Critical',
        confidence: 95,
        date: '2023-12-20',
        location: 'Gujarat Industrial Corridor',
        summary: 'Security audit for ₹10,000Cr infrastructure project',
        status: 'Active',
        icon: AlertTriangle,
        keywords: ['Critical Infrastructure Protection', 'Asset Hardening', 'Industrial Security'],
    },
    {
        id: 'rf-2024-006',
        title: 'Executive Protection Intelligence - Delhi NCR',
        sector: 'HNI',
        threatLevel: 'High',
        confidence: 87,
        date: '2023-12-15',
        location: 'Delhi NCR',
        summary: 'Threat assessment for Fortune 500 CEO relocation',
        status: 'Ongoing',
        icon: Lock,
        keywords: ['HNI Executive Protection', 'Corporate Security', 'Risk Assessment'],
    },
]

const articles = [
    {
        id: 'art-001',
        title: 'The Rise of Cyber Threats in Indian Manufacturing',
        image: '/images/topographic-bg.webp',
        summary: 'An in-depth analysis of evolving cyber risks facing India\'s manufacturing sector, including supply chain vulnerabilities and insider threats.',
        date: '2024-01-10',
        author: 'RiskFortress Intelligence Team',
        content: 'The manufacturing sector in India has become increasingly digitized, leading to heightened exposure to cyber threats. From ransomware attacks targeting production lines to intellectual property theft through compromised supply chains, companies must adopt comprehensive cybersecurity frameworks. This article explores real-world case studies and provides actionable strategies for risk mitigation.',
        keywords: ['Cybersecurity', 'Manufacturing', 'Supply Chain Security', 'Ransomware'],
    },
]

const blogs = [
    // Placeholder for blogs
]

export default function DossiersPage() {
    const [activeTab, setActiveTab] = useState('cases')
    const [selectedArticle, setSelectedArticle] = useState<typeof articles[0] | null>(null)

    return (
        <div className="min-h-screen py-32">
            {/* Background */}
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-grid-pattern" />
                </div>
            </div>

            <div className="container relative z-10 mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-2 px-6 py-3 rounded-full glass-morphism border border-intelligence/20 mb-6">
                        <FileText className="h-5 w-5 text-intelligence" />
                        <span className="text-sm font-semibold text-intelligence">
                            {activeTab === 'cases' ? 'CONFIDENTIAL INTELLIGENCE BRIEFS' : activeTab === 'articles' ? 'PUBLIC INTELLIGENCE ARTICLES' : 'EXPERT INSIGHTS & BLOGS'}
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        <span className="text-gray-300">Risk Intelligence</span>{' '}
                        <span className="gradient-text">{activeTab === 'cases' ? 'Dossiers' : activeTab === 'articles' ? 'Articles' : 'Blogs'}</span>
                    </h1>

                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        {activeTab === 'cases' ? 'Confidential threat analysis and case studies. All information is sanitized and encrypted to protect client identities and operational security.' : activeTab === 'articles' ? 'Free, in-depth articles on risk management, cybersecurity, and strategic intelligence for professionals.' : 'Expert insights, analysis, and thought leadership on emerging risks and security trends.'}
                    </p>
                </div>

                {/* Tab Buttons */}
                <div className="flex justify-center space-x-4 mb-12">
                    <button
                        onClick={() => setActiveTab('cases')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'cases' ? 'bg-intelligence text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        Cases
                    </button>
                    <button
                        onClick={() => setActiveTab('articles')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'articles' ? 'bg-intelligence text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        Articles
                    </button>
                    <button
                        onClick={() => setActiveTab('blogs')}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === 'blogs' ? 'bg-intelligence text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                    >
                        Blogs
                    </button>
                </div>

                {/* Conditional Content */}
                {activeTab === 'cases' && (
                    <>
                        {/* Access Level */}
                        <div className="max-w-3xl mx-auto mb-12">
                            <div className="p-6 rounded-2xl glass-morphism border border-intelligence/20">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Eye className="h-6 w-6 text-intelligence" />
                                        <div>
                                            <h3 className="font-semibold text-white">Access Level: RESTRICTED</h3>
                                            <p className="text-sm text-gray-400">Enterprise clients only. All dossiers are AES-256 encrypted.</p>
                                        </div>
                                    </div>
                                    <div className="px-4 py-2 rounded-full bg-intelligence/10 border border-intelligence/20">
                                        <span className="text-sm font-semibold text-intelligence">LEVEL 3 CLEARANCE</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dossiers Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                            {dossiers.map((dossier) => (
                                <DossierCard key={dossier.id} dossier={dossier} />
                            ))}
                        </div>

                        {/* Request Access */}
                        <div className="max-w-4xl mx-auto p-8 rounded-2xl glass-morphism border border-intelligence/20">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-white mb-4">
                                    Request Full Dossier Access
                                </h3>
                                <p className="text-gray-400 mb-6">
                                    Complete, unsanitized dossiers are available to verified enterprise clients
                                    with appropriate security clearance.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    {[
                                        {
                                            title: 'Enterprise Clients',
                                            description: 'Fortune 500 & Major Corporates',
                                            color: 'bg-intelligence/10',
                                        },
                                        {
                                            title: 'Family Offices',
                                            description: 'HNWI with ₹500Cr+ assets',
                                            color: 'bg-green-500/10',
                                        },
                                        {
                                            title: 'Government Entities',
                                            description: 'Authorized agencies only',
                                            color: 'bg-purple-500/10',
                                        },
                                    ].map((tier) => (
                                        <div key={tier.title} className={`p-6 rounded-xl ${tier.color} border border-white/5`}>
                                            <h4 className="font-semibold text-white mb-2">{tier.title}</h4>
                                            <p className="text-sm text-gray-400">{tier.description}</p>
                                        </div>
                                    ))}
                                </div>
                                <button className="px-8 py-3 bg-gradient-to-r from-intelligence to-industrial text-white rounded-lg font-semibold hover:shadow-intelligence transition-all">
                                    Request Intelligence Access
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'articles' && (
                    <>
                        {/* Articles Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                            {articles.map((article) => (
                                <div key={article.id} className="group p-8 rounded-2xl glass-morphism border border-gray-800 hover:border-intelligence/30 transition-all">
                                    <div className="mb-6">
                                        <Image
                                            src={article.image}
                                            alt={article.title}
                                            width={400}
                                            height={250}
                                            className="w-full h-48 object-cover rounded-xl mb-4"
                                        />
                                        <div className="flex items-center text-sm text-gray-400 mb-2">
                                            <span>{article.date}</span>
                                            <span className="mx-2">•</span>
                                            <span>{article.author}</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-intelligence transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-400 mb-4">{article.summary}</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {article.keywords.map((keyword) => (
                                                <span
                                                    key={keyword}
                                                    className="px-3 py-1 text-xs rounded-full bg-intelligence/5 text-intelligence border border-intelligence/10"
                                                >
                                                    {keyword}
                                                </span>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setSelectedArticle(article)}
                                            className="text-intelligence hover:text-intelligence/80 transition-colors font-semibold"
                                        >
                                            Read Full Article →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {activeTab === 'blogs' && (
                    <>
                        {/* Blogs Section - Placeholder */}
                        <div className="text-center py-20">
                            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-4">Coming Soon</h3>
                            <p className="text-gray-400">Expert insights and thought leadership articles will be published here.</p>
                        </div>
                    </>
                )}
            </div>

            {/* Article Modal */}
            {selectedArticle && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedArticle(null)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors z-10"
                        >
                            <X className="h-6 w-6 text-gray-400 hover:text-white" />
                        </button>

                        {/* Modal Content */}
                        <div className="p-8">
                            {/* Article Image */}
                            <div className="mb-6">
                                <Image
                                    src={selectedArticle.image}
                                    alt={selectedArticle.title}
                                    width={800}
                                    height={400}
                                    className="w-full h-64 object-cover rounded-xl"
                                />
                            </div>

                            {/* Article Header */}
                            <div className="mb-6">
                                <div className="flex items-center text-sm text-gray-400 mb-4">
                                    <span>{selectedArticle.date}</span>
                                    <span className="mx-2">•</span>
                                    <span>{selectedArticle.author}</span>
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-4">{selectedArticle.title}</h2>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {selectedArticle.keywords.map((keyword) => (
                                        <span
                                            key={keyword}
                                            className="px-3 py-1 text-xs rounded-full bg-intelligence/10 text-intelligence border border-intelligence/20"
                                        >
                                            {keyword}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Article Content */}
                            <div className="prose prose-invert max-w-none">
                                <p className="text-gray-300 leading-relaxed text-lg">{selectedArticle.content}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}