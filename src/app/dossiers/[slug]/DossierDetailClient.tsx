'use client'

import { Shield, Lock, FileText, Building, Cpu, ArrowLeft, Calendar, User, Tag, MapPin, Share2, BookOpen, Code2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

import ExportPDFButton from '@/components/ExportPDFButton'
import ProfessionalEmailModal from '@/components/ProfessionalEmailModal'
import RelatedArticles from '@/components/RelatedArticles'
import { trackShare } from '@/lib/analytics'
import { getContentBySlug, type ContentItem } from '@/lib/content'

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

const getTypeLabel = (type: string) => {
    switch (type) {
        case 'case': return 'Intelligence Dossier'
        case 'article': return 'Intelligence Article'
        case 'blog': return 'Expert Insights'
        default: return 'Content'
    }
}

export default function DossierDetailClient({ slug: initialSlug }: { slug: string }) {
    const pathname = usePathname()
    const [content, setContent] = useState<ContentItem | null>(null)
    const [loading, setLoading] = useState(true)
    const [accessDenied, setAccessDenied] = useState(false)
    const [emailVerified, setEmailVerified] = useState(false)
    const [showEmailModal, setShowEmailModal] = useState(false)
    const [viewMode, setViewMode] = useState<'reading' | 'structured'>('reading')

    const cleanPath = pathname?.replace(/\/$/, '') || ''
    const actualSlug = cleanPath.split('/').filter(Boolean).pop() || initialSlug

    useEffect(() => {
        if (actualSlug && actualSlug !== '_placeholder') {
            loadContent(actualSlug)
        } else if (actualSlug === '_placeholder') {
            setLoading(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actualSlug])

    const loadContent = async (slugToLoad: string, retryCount = 0) => {
        try {
            setLoading(true)
            const item = await getContentBySlug(slugToLoad)
            if (item) {
                setContent(item)
                setAccessDenied(false)
                if (item.accessRequired) {
                    setEmailVerified(false)
                } else if (item.type !== 'case') {
                    setEmailVerified(true)
                } else {
                    const TWENTY_EIGHT_DAYS = 28 * 24 * 60 * 60 * 1000
                    const accessedRaw = localStorage.getItem('rf-case-accessed')
                    let accessedMap: Record<string, number> = {}
                    try { accessedMap = accessedRaw ? JSON.parse(accessedRaw) : {} } catch { /* ignore */ }
                    const lastAccess = accessedMap[slugToLoad]
                    if (lastAccess && (Date.now() - lastAccess) < TWENTY_EIGHT_DAYS) {
                        setEmailVerified(true)
                    }
                }
            } else {
                if (retryCount < 1) {
                    setTimeout(() => loadContent(slugToLoad, retryCount + 1), 1000)
                    return
                }
                setAccessDenied(true)
            }
        } catch {
            if (retryCount < 1) {
                setTimeout(() => loadContent(slugToLoad, retryCount + 1), 1000)
                return
            }
            setAccessDenied(true)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen py-32">
                <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
                <div className="container mx-auto px-6 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-intelligence"></div>
                    <p className="text-gray-400 mt-4">Loading intelligence...</p>
                </div>
            </div>
        )
    }

    if (accessDenied || !content) {
        return (
            <div className="min-h-screen py-32">
                <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-grid-pattern" />
                    </div>
                </div>
                <div className="container relative z-10 mx-auto px-6 max-w-2xl">
                    <Link
                        href="/dossiers/"
                        className="inline-flex items-center space-x-2 text-gray-400 hover:text-intelligence transition-colors mb-8"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to Dossiers</span>
                    </Link>

                    <div className="p-8 rounded-2xl glass-morphism border border-intelligence/20 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                            <Lock className="h-8 w-8 text-red-400" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Access Denied
                        </h1>
                        <p className="text-gray-400 mb-6">
                            This content is restricted. You need a secure access link from a RiskFortress administrator to view this dossier.
                        </p>
                        <div className="p-4 rounded-xl bg-gray-800/50 border border-gray-700">
                            <p className="text-sm text-gray-400">
                                If you believe you should have access, please contact your RiskFortress administrator for a secure viewing link.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (content && content.type === 'case' && !emailVerified) {
        return (
            <div className="min-h-screen py-32">
                <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0 bg-grid-pattern" />
                    </div>
                </div>
                <div className="container relative z-10 mx-auto px-6 max-w-2xl">
                    <Link
                        href="/dossiers/"
                        className="inline-flex items-center space-x-2 text-gray-400 hover:text-intelligence transition-colors mb-8"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to Dossiers</span>
                    </Link>

                    <div className="p-8 rounded-2xl glass-morphism border border-intelligence/20 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-intelligence/10 border border-intelligence/20 mb-6">
                            <Shield className="h-8 w-8 text-intelligence" />
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                            Professional Verification Required
                        </h1>
                        <p className="text-gray-400 mb-6">
                            To access this intelligence dossier, please verify your professional email address.
                        </p>
                        <button
                            onClick={() => setShowEmailModal(true)}
                            className="px-8 py-3 bg-gradient-to-r from-intelligence to-industrial text-white rounded-lg font-semibold hover:shadow-intelligence transition-all"
                        >
                            Verify Professional Email
                        </button>
                    </div>
                </div>
                <ProfessionalEmailModal
                    isOpen={showEmailModal}
                    onClose={() => setShowEmailModal(false)}
                    caseTitle={content.title}
                    caseSlug={content.slug}
                    onSuccess={() => {
                        const accessedRaw = localStorage.getItem('rf-case-accessed')
                        let accessedMap: Record<string, number> = {}
                        try { accessedMap = accessedRaw ? JSON.parse(accessedRaw) : {} } catch { /* ignore */ }
                        accessedMap[actualSlug] = Date.now()
                        localStorage.setItem('rf-case-accessed', JSON.stringify(accessedMap))
                        setShowEmailModal(false)
                        loadContent(actualSlug)
                    }}
                />
            </div>
        )
    }

    const Icon = getIconForSector(content.sector)

    return (
        <div className="min-h-screen py-32">
            <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-grid-pattern" />
                </div>
            </div>

            <div className="container relative z-10 mx-auto px-6 max-w-4xl">
                <Link
                    href="/dossiers/"
                    className="inline-flex items-center space-x-2 text-gray-400 hover:text-intelligence transition-colors mb-8"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Back to Dossiers</span>
                </Link>

                <div className="mb-8">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-morphism border border-intelligence/20 mb-4">
                        <FileText className="h-4 w-4 text-intelligence" />
                        <span className="text-sm font-semibold text-intelligence uppercase">
                            {getTypeLabel(content.type)}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                        {content.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(content.publishedAt || content.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}</span>
                        </div>
                        {content.author && (
                            <div className="flex items-center space-x-2">
                                <User className="h-4 w-4" />
                                <span>{content.author}</span>
                            </div>
                        )}
                        {content.sector && (
                            <div className="flex items-center space-x-2">
                                <Icon className="h-4 w-4" />
                                <span>{content.sector}</span>
                            </div>
                        )}
                        {content.location && (
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4" />
                                <span>{content.location}</span>
                            </div>
                        )}
                    </div>

                    {content.type === 'case' && (
                        <div className="flex flex-wrap items-center gap-4 mb-6">
                            {content.threatLevel && (
                                <span className={`px-4 py-2 text-sm font-semibold rounded-full border ${getThreatLevelColor(content.threatLevel)}`}>
                                    Threat Level: {content.threatLevel}
                                </span>
                            )}
                            {content.confidence && (
                                <span className="px-4 py-2 text-sm font-semibold rounded-full bg-intelligence/10 text-intelligence border border-intelligence/20">
                                    Confidence: {content.confidence}%
                                </span>
                            )}
                            {content.caseStatus && (
                                <span className="px-4 py-2 text-sm font-semibold rounded-full bg-gray-800 text-gray-300 border border-gray-700">
                                    Status: {content.caseStatus}
                                </span>
                            )}
                            <ExportPDFButton contentId={content.id} title={content.title} />
                        </div>
                    )}

                    {content.keywords && content.keywords.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {content.keywords.map((keyword) => (
                                <span
                                    key={keyword}
                                    className="inline-flex items-center space-x-1 px-3 py-1 text-xs rounded-full bg-gray-800 text-gray-400"
                                >
                                    <Tag className="h-3 w-3" />
                                    <span>{keyword}</span>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {content.thumbnail && (
                    <div className="mb-8 rounded-2xl overflow-hidden">
                        <Image
                            src={content.thumbnail}
                            alt={content.title}
                            width={1200}
                            height={600}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                )}

                {content.summary && (
                    <div className="p-6 rounded-2xl glass-morphism border border-gray-800 mb-8">
                        <h2 className="text-lg font-semibold text-intelligence mb-2">Executive Summary</h2>
                        <p className="text-gray-300 leading-relaxed">{content.summary}</p>
                    </div>
                )}

                {/* Main article body — Reading View (default) shows the plain content
                    the author entered; Structured View shows the rich HTML from admin. */}
                {(() => {
                    const plain = (content.content || '').trim()
                    const html = (content.htmlContent || '').trim()
                    const hasBoth = !!plain && !!html
                    // Effective mode: if both exist honour user toggle; otherwise auto-pick
                    const effectiveMode = hasBoth
                        ? viewMode
                        : html
                          ? 'structured'
                          : 'reading'

                    // Reading view: render plain text/markdown-ish content with paragraphs
                    const readingHtml = plain
                        .split(/\n{2,}/)
                        .map((para) => {
                            const safe = para
                                .replace(/&/g, '&amp;')
                                .replace(/</g, '&lt;')
                                .replace(/>/g, '&gt;')
                                .replace(/\n/g, '<br/>')
                            return `<p>${safe}</p>`
                        })
                        .join('')

                    return (
                        <>
                            {hasBoth && (
                                <div className="mb-6 flex items-center justify-between gap-3 flex-wrap">
                                    <div className="inline-flex items-center rounded-full border border-gray-800 bg-gray-900/60 p-1 backdrop-blur">
                                        <button
                                            type="button"
                                            onClick={() => setViewMode('reading')}
                                            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                                                effectiveMode === 'reading'
                                                    ? 'bg-intelligence text-gray-950 shadow-md'
                                                    : 'text-gray-400 hover:text-white'
                                            }`}
                                            aria-pressed={effectiveMode === 'reading'}
                                        >
                                            <BookOpen className="h-3.5 w-3.5" />
                                            Reading View
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setViewMode('structured')}
                                            className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                                                effectiveMode === 'structured'
                                                    ? 'bg-champagne text-gray-950 shadow-md'
                                                    : 'text-gray-400 hover:text-white'
                                            }`}
                                            aria-pressed={effectiveMode === 'structured'}
                                        >
                                            <Code2 className="h-3.5 w-3.5" />
                                            Structured View
                                        </button>
                                    </div>
                                    <span className="text-[10px] uppercase tracking-widest text-gray-600">
                                        {effectiveMode === 'reading'
                                            ? 'Plain narrative as authored'
                                            : 'Rich-formatted HTML render'}
                                    </span>
                                </div>
                            )}

                            <article
                                id={content.id}
                                className="prose prose-invert prose-lg max-w-none mb-8"
                            >
                                <div
                                    className="text-gray-300 leading-relaxed
                                        [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-white [&>h1]:mt-8 [&>h1]:mb-4
                                        [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-8 [&>h2]:mb-4
                                        [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:text-white [&>h3]:mt-6 [&>h3]:mb-3
                                        [&>h4]:text-lg [&>h4]:font-semibold [&>h4]:text-gray-100 [&>h4]:mt-4 [&>h4]:mb-2
                                        [&>p]:mb-4 [&>p]:leading-relaxed
                                        [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4
                                        [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4
                                        [&>li]:mb-2
                                        [&>blockquote]:border-l-4 [&>blockquote]:border-intelligence [&>blockquote]:pl-4 [&>blockquote]:py-1 [&>blockquote]:italic [&>blockquote]:text-gray-400 [&>blockquote]:my-4
                                        [&>a]:text-intelligence [&>a]:hover:underline
                                        [&>code]:bg-gray-800 [&>code]:px-2 [&>code]:py-1 [&>code]:rounded [&>code]:text-sm [&>code]:text-champagne
                                        [&>pre]:bg-gray-900 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:mb-4
                                        [&>img]:rounded-xl [&>img]:max-w-full [&>img]:my-6
                                        [&>hr]:border-gray-700 [&>hr]:my-8
                                        [&>table]:w-full [&>table]:border-collapse [&>table]:mb-4
                                        [&_th]:border [&_th]:border-gray-700 [&_th]:bg-gray-800 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:text-sm
                                        [&_td]:border [&_td]:border-gray-700 [&_td]:px-3 [&_td]:py-2 [&_td]:text-sm
                                        [&>strong]:text-white [&>b]:text-white"
                                    dangerouslySetInnerHTML={{
                                        __html:
                                            effectiveMode === 'structured'
                                                ? html || readingHtml
                                                : readingHtml || html,
                                    }}
                                />
                            </article>
                        </>
                    )
                })()}

                {content.images && content.images.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold text-white mb-6">Related Images</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {content.images.map((image, index) => (
                                <div key={index} className="rounded-xl overflow-hidden">
                                    <Image
                                        src={image}
                                        alt={`${content.title} - Image ${index + 1}`}
                                        width={600}
                                        height={400}
                                        className="w-full h-auto object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}



                {/* Share Buttons */}
                <div className="mt-12 pt-8 border-t border-gray-800">
                    <div className="flex items-center space-x-3 mb-6">
                        <Share2 className="h-5 w-5 text-intelligence" />
                        <span className="text-sm font-semibold text-gray-400">Share this {getTypeLabel(content.type).toLowerCase()}</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {[
                            { name: 'LinkedIn', color: 'bg-[#0A66C2] hover:bg-[#004182]', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}` },
                            { name: 'Twitter/X', color: 'bg-[#1DA1F2] hover:bg-[#0d8bd9]', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(content.title)}` },
                            { name: 'Facebook', color: 'bg-[#1877F2] hover:bg-[#0d65d9]', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}` },
                            { name: 'WhatsApp', color: 'bg-[#25D366] hover:bg-[#1da851]', url: `https://wa.me/?text=${encodeURIComponent(content.title + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}` },
                            { name: 'Telegram', color: 'bg-[#26A5E4] hover:bg-[#1e8abf]', url: `https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(content.title)}` },
                            { name: 'Email', color: 'bg-[#EA4335] hover:bg-[#c5372c]', url: `mailto:?subject=${encodeURIComponent(content.title)}&body=${encodeURIComponent('Check out this intelligence report: ' + (typeof window !== 'undefined' ? window.location.href : ''))}` },
                        ].map(platform => (
                            <a
                                key={platform.name}
                                href={platform.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackShare(pathname || '', content.title, platform.name, content.type, content.id)}
                                className={`px-4 py-2 rounded-lg text-white text-sm font-semibold transition-colors ${platform.color}`}
                            >
                                {platform.name}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-800">
                    <Link
                        href="/dossiers/"
                        className="inline-flex items-center space-x-2 px-6 py-3 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        <span>Back to All Dossiers</span>
                    </Link>
                </div>

                {/* Related Intelligence — always at the very bottom */}
                <RelatedArticles currentSlug={actualSlug} currentType={content.type} />
            </div>
        </div>
    )
}
