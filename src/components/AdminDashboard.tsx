'use client'

import { useState, useEffect, useCallback } from 'react'
import { getAllContent, ContentItem } from '@/lib/admin/client-store'
import {
    BarChart3, FileText, RefreshCw, BookOpen, Briefcase, PenTool,
    Clock, CheckCircle, Archive, AlertCircle
} from 'lucide-react'

interface TypeStats {
    total: number
    published: number
    draft: number
    archived: number
    lastUpdated: string | null
}

function computeTypeStats(items: ContentItem[], type: ContentItem['type']): TypeStats {
    const filtered = items.filter(i => i.type === type)
    const published = filtered.filter(i => i.status === 'published').length
    const draft = filtered.filter(i => i.status === 'draft').length
    const archived = filtered.filter(i => i.status === 'archived').length
    const sorted = [...filtered].sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    return {
        total: filtered.length,
        published,
        draft,
        archived,
        lastUpdated: sorted[0]?.updatedAt ?? null,
    }
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    })
}

function StatusBadge({ status }: { status: ContentItem['status'] }) {
    const styles: Record<string, string> = {
        published: 'bg-green-500/15 text-green-400 border-green-500/20',
        draft: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
        archived: 'bg-gray-500/15 text-gray-400 border-gray-500/20',
    }
    return (
        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${styles[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    )
}

const typeIcons: Record<ContentItem['type'], typeof Briefcase> = {
    case: Briefcase,
    article: BookOpen,
    blog: PenTool,
}

const typeLabels: Record<ContentItem['type'], string> = {
    case: 'Cases',
    article: 'Articles',
    blog: 'Blogs',
}

export default function AdminDashboard() {
    const [items, setItems] = useState<ContentItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [lastFetched, setLastFetched] = useState<Date | null>(null)

    const fetchContent = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await getAllContent()
            setItems(data)
            setLastFetched(new Date())
        } catch {
            setError('Failed to load content from Firestore.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchContent()
    }, [fetchContent])

    if (loading && items.length === 0) {
        return (
            <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-intelligence" />
                <p className="text-gray-400 mt-4">Loading content stats...</p>
            </div>
        )
    }

    if (error && items.length === 0) {
        return (
            <div className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-400 font-medium">{error}</p>
                <button
                    onClick={fetchContent}
                    className="mt-4 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
                >
                    Retry
                </button>
            </div>
        )
    }

    const totalCount = items.length
    const publishedCount = items.filter(i => i.status === 'published').length
    const draftCount = items.filter(i => i.status === 'draft').length
    const archivedCount = items.filter(i => i.status === 'archived').length

    const caseStats = computeTypeStats(items, 'case')
    const articleStats = computeTypeStats(items, 'article')
    const blogStats = computeTypeStats(items, 'blog')

    const recentItems = [...items]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 10)

    const pctPublished = totalCount ? Math.round((publishedCount / totalCount) * 100) : 0
    const pctDraft = totalCount ? Math.round((draftCount / totalCount) * 100) : 0
    const pctArchived = totalCount ? 100 - pctPublished - pctDraft : 0

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-intelligence" />
                        Content Dashboard
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        {lastFetched && `Last updated: ${lastFetched.toLocaleTimeString()}`}
                    </p>
                </div>
                <button
                    onClick={fetchContent}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Content Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-6 rounded-xl glass-morphism border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <FileText className="h-5 w-5 text-intelligence" />
                        <span className="text-xs text-gray-500">Total</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{totalCount}</div>
                    <div className="text-sm text-gray-400 mt-1">content items</div>
                </div>
                <div className="p-6 rounded-xl glass-morphism border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <span className="text-xs text-gray-500">Published</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{publishedCount}</div>
                    <div className="text-sm text-gray-400 mt-1">live on site</div>
                </div>
                <div className="p-6 rounded-xl glass-morphism border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <Clock className="h-5 w-5 text-yellow-400" />
                        <span className="text-xs text-gray-500">Drafts</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{draftCount}</div>
                    <div className="text-sm text-gray-400 mt-1">in progress</div>
                </div>
                <div className="p-6 rounded-xl glass-morphism border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <BarChart3 className="h-5 w-5 text-purple-400" />
                        <span className="text-xs text-gray-500">Breakdown</span>
                    </div>
                    <div className="text-lg font-bold text-white mt-1">
                        {caseStats.total}C / {articleStats.total}A / {blogStats.total}B
                    </div>
                    <div className="text-sm text-gray-400 mt-1">cases / articles / blogs</div>
                </div>
            </div>

            {/* Content by Type */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Content by Type</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(['case', 'article', 'blog'] as const).map(type => {
                        const stats = { case: caseStats, article: articleStats, blog: blogStats }[type]
                        const Icon = typeIcons[type]
                        return (
                            <div key={type} className="p-6 rounded-xl glass-morphism border border-gray-800">
                                <div className="flex items-center gap-3 mb-4">
                                    <Icon className="h-5 w-5 text-intelligence" />
                                    <h4 className="text-white font-semibold">{typeLabels[type]}</h4>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Total</span>
                                        <span className="text-white font-medium">{stats.total}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Published</span>
                                        <span className="text-green-400 font-medium">{stats.published}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Drafts</span>
                                        <span className="text-yellow-400 font-medium">{stats.draft}</span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-gray-800">
                                        <span className="text-gray-500">Last Updated</span>
                                        <span className="text-gray-400">
                                            {stats.lastUpdated ? formatDate(stats.lastUpdated) : '—'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Recent Content */}
            <div className="p-6 rounded-xl glass-morphism border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-intelligence" />
                    Recent Content
                </h3>
                {recentItems.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No content items yet.</p>
                ) : (
                    <>
                        <div className="hidden md:grid grid-cols-12 gap-4 text-xs text-gray-500 uppercase tracking-wider pb-3 border-b border-gray-800">
                            <div className="col-span-5">Title</div>
                            <div className="col-span-2 text-center">Type</div>
                            <div className="col-span-2 text-center">Status</div>
                            <div className="col-span-3 text-right">Last Updated</div>
                        </div>
                        <div className="space-y-1 mt-2">
                            {recentItems.map(item => {
                                const Icon = typeIcons[item.type]
                                return (
                                    <div
                                        key={item.id}
                                        className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                                    >
                                        <div className="col-span-5 text-white font-medium truncate">
                                            {item.title}
                                        </div>
                                        <div className="col-span-2 flex items-center justify-center gap-1.5">
                                            <Icon className="h-3.5 w-3.5 text-gray-400" />
                                            <span className="text-gray-300 text-sm capitalize">{item.type}</span>
                                        </div>
                                        <div className="col-span-2 flex items-center justify-center">
                                            <StatusBadge status={item.status} />
                                        </div>
                                        <div className="col-span-3 text-right text-sm text-gray-400">
                                            {formatDate(item.updatedAt)}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Content Status Overview */}
            {totalCount > 0 && (
                <div className="p-6 rounded-xl glass-morphism border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Archive className="h-5 w-5 text-intelligence" />
                        Content Status Overview
                    </h3>
                    <div className="h-4 rounded-full overflow-hidden flex bg-gray-800">
                        {pctPublished > 0 && (
                            <div
                                className="bg-green-500 transition-all duration-500"
                                style={{ width: `${pctPublished}%` }}
                            />
                        )}
                        {pctDraft > 0 && (
                            <div
                                className="bg-yellow-500 transition-all duration-500"
                                style={{ width: `${pctDraft}%` }}
                            />
                        )}
                        {pctArchived > 0 && (
                            <div
                                className="bg-gray-500 transition-all duration-500"
                                style={{ width: `${pctArchived}%` }}
                            />
                        )}
                    </div>
                    <div className="flex items-center gap-6 mt-3 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-green-500" />
                            <span className="text-gray-400">Published {pctPublished}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-yellow-500" />
                            <span className="text-gray-400">Draft {pctDraft}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-gray-500" />
                            <span className="text-gray-400">Archived {pctArchived}%</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
