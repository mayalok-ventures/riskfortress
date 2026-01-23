'use client'

import { useState, useEffect } from 'react'
import { Shield, Lock, Eye, FileText, Building, Cpu, BookOpen, Newspaper } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { getPublishedContent, type ContentItem } from '@/lib/admin/api-store'

const getIconForSector = (sector?: string) => {
    switch (sector) {
        case 'Technical': return Cpu
        case 'HNI': return Shield
        case 'Government': return Lock
        default: return Building
    }
}

const getThreatLevelColor = (level?: string) => {
    switch (level) {
        case 'Critical': return 'text-red-500 bg-red-500/10 border-red-500/20'
        case 'High': return 'text-orange-500 bg-orange-500/10 border-orange-500/20'
        case 'Medium': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
        case 'Low': return 'text-green-500 bg-green-500/10 border-green-500/20'
        default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20'
    }
}

export default function DossiersPage() {
    const [activeTab, setActiveTab] = useState('cases')
    const [cases, setCases] = useState<ContentItem[]>([])
    const [articles, setArticles] = useState<ContentItem[]>([])
    const [blogs, setBlogs] = useState<ContentItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadPublishedContent()
    }, [])

    const loadPublishedContent = async (retryCount = 0) => {
        try {
            const allPublished = await getPublishedContent()
            setCases(allPublished.filter(i => i.type === 'case'))
            setArticles(allPublished.filter(i => i.type === 'article'))
            setBlogs(allPublished.filter(i => i.type === 'blog'))
        } catch {
            console.error('Failed to load content')
            // Retry once after 1 second on failure
            if (retryCount < 1) {
                setTimeout(() => loadPublishedContent(retryCount + 1), 1000)
                return
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen py-32">
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-grid-pattern" />
                </div>
            </div>

            <div className="container relative z-10 mx-auto px-6">
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

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-intelligence"></div>
                        <p className="text-gray-400 mt-4">Loading intelligence...</p>
                    </div>
                ) : (
                    <>
                        {activeTab === 'cases' && (
                            <>
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

                                {cases.length === 0 ? (
                                    <div className="text-center py-20">
                                        <Building className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                                        <h3 className="text-2xl font-bold text-white mb-4">No Cases Published</h3>
                                        <p className="text-gray-400">Intelligence dossiers will appear here when published by admin.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                                        {cases.map((item) => {
                                            const Icon = getIconForSector(item.sector)
                                            return (
                                                <Link
                                                    href={`/dossiers/${item.slug}/`}
                                                    key={item.id}
                                                    className="group p-6 rounded-2xl glass-morphism border border-gray-800 hover:border-intelligence/30 transition-all cursor-pointer text-left w-full block"
                                                >
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="p-2 rounded-lg bg-intelligence/10">
                                                                <Icon className="h-5 w-5 text-intelligence" />
                                                            </div>
                                                            <div>
                                                                <span className="text-xs text-gray-500 font-mono">{item.id.toUpperCase()}</span>
                                                                <h3 className="font-bold text-white group-hover:text-intelligence transition-colors">
                                                                    {item.title}
                                                                </h3>
                                                            </div>
                                                        </div>
                                                        {item.threatLevel && (
                                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getThreatLevelColor(item.threatLevel)}`}>
                                                                {item.threatLevel}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-gray-400 mb-4">{item.summary}</p>

                                                    <div className="flex items-center justify-between text-sm">
                                                        <div className="flex items-center space-x-4 text-gray-500">
                                                            <span>{item.sector}</span>
                                                            {item.location && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>{item.location}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                        {item.confidence && (
                                                            <div className="flex items-center space-x-2">
                                                                <span className="text-gray-500">Confidence:</span>
                                                                <span className="text-intelligence font-semibold">{item.confidence}%</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {item.keywords && item.keywords.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-4">
                                                            {item.keywords.slice(0, 3).map((keyword) => (
                                                                <span
                                                                    key={keyword}
                                                                    className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-400"
                                                                >
                                                                    {keyword}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </Link>
                                            )
                                        })}
                                    </div>
                                )}

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
                                                { title: 'Enterprise Clients', description: 'Fortune 500 & Major Corporates', color: 'bg-intelligence/10' },
                                                { title: 'Family Offices', description: 'HNWI with ₹500Cr+ assets', color: 'bg-green-500/10' },
                                                { title: 'Government Entities', description: 'Authorized agencies only', color: 'bg-purple-500/10' },
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
                                {articles.length === 0 ? (
                                    <div className="text-center py-20">
                                        <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                                        <h3 className="text-2xl font-bold text-white mb-4">No Articles Published</h3>
                                        <p className="text-gray-400">Intelligence articles will appear here when published.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                                        {articles.map((article) => (
                                            <Link href={`/dossiers/${article.slug}/`} key={article.id} className="group p-8 rounded-2xl glass-morphism border border-gray-800 hover:border-intelligence/30 transition-all block">
                                                {article.thumbnail && (
                                                    <Image
                                                        src={article.thumbnail}
                                                        alt={article.title}
                                                        width={400}
                                                        height={250}
                                                        className="w-full h-48 object-cover rounded-xl mb-4"
                                                    />
                                                )}
                                                <div className="flex items-center text-sm text-gray-400 mb-2">
                                                    <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString()}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{article.author || 'RiskFortress Intelligence Team'}</span>
                                                </div>
                                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-intelligence transition-colors">
                                                    {article.title}
                                                </h3>
                                                <p className="text-gray-400 mb-4">{article.summary}</p>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {article.keywords?.map((keyword) => (
                                                        <span
                                                            key={keyword}
                                                            className="px-3 py-1 text-xs rounded-full bg-intelligence/5 text-intelligence border border-intelligence/10"
                                                        >
                                                            {keyword}
                                                        </span>
                                                    ))}
                                                </div>
                                                <span className="text-intelligence hover:text-intelligence/80 transition-colors font-semibold">
                                                    Read Full Article →
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'blogs' && (
                            <>
                                {blogs.length === 0 ? (
                                    <div className="text-center py-20">
                                        <Newspaper className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                                        <h3 className="text-2xl font-bold text-white mb-4">Coming Soon</h3>
                                        <p className="text-gray-400">Expert insights and thought leadership blogs will be published here.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                                        {blogs.map((blog) => (
                                            <Link href={`/dossiers/${blog.slug}/`} key={blog.id} className="group p-8 rounded-2xl glass-morphism border border-gray-800 hover:border-intelligence/30 transition-all block">
                                                {blog.thumbnail && (
                                                    <Image
                                                        src={blog.thumbnail}
                                                        alt={blog.title}
                                                        width={400}
                                                        height={250}
                                                        className="w-full h-48 object-cover rounded-xl mb-4"
                                                    />
                                                )}
                                                <div className="flex items-center text-sm text-gray-400 mb-2">
                                                    <span>{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{blog.author || 'RiskFortress Intelligence Team'}</span>
                                                </div>
                                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-intelligence transition-colors">
                                                    {blog.title}
                                                </h3>
                                                <p className="text-gray-400 mb-4">{blog.summary}</p>
                                                <span className="text-intelligence hover:text-intelligence/80 transition-colors font-semibold">
                                                    Read More →
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
