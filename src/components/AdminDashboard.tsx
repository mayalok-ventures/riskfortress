'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, BarChart, Bar
} from 'recharts'
import {
    Eye, Users, Activity, TrendingUp, Globe, RefreshCw,
    BarChart3, Clock, ArrowUpRight, Share2, Monitor
} from 'lucide-react'
import { format, parseISO, isToday } from 'date-fns'

interface TopPage {
    path: string
    title: string
    views: number
    avgScrollDepth: number
    avgEngagement: number
    exitRate: number
}

interface DailyStat {
    date: string
    pageviews: number
    visitors: number
    sessions: number
}

interface AnalyticsResponse {
    dates: string[]
    totalPageviews: number
    uniqueVisitors: number
    uniqueSessions: number
    newVisitors: number
    returningVisitors: number
    sources: Record<string, number>
    topPages: TopPage[]
    contentTypeExits: Record<string, number>
    activeUsers: number
    dailyStats: DailyStat[]
}

const TIME_RANGES = [
    { label: '7 Days', days: 7 },
    { label: '15 Days', days: 15 },
    { label: '1 Month', days: 30 },
    { label: '6 Months', days: 180 },
] as const

const GOLD = '#D4AF37'
const TEAL = '#14B8A6'

function formatEngagement(seconds: number): string {
    if (seconds < 60) return `${Math.round(seconds)}s`
    const mins = Math.floor(seconds / 60)
    const secs = Math.round(seconds % 60)
    return `${mins}m ${secs}s`
}

function ChartTooltipContent({ active, payload, label }: {
    active?: boolean
    payload?: Array<{ value: number; dataKey: string; color: string }>
    label?: string
}) {
    if (!active || !payload?.length) return null
    const dateLabel = (() => {
        try {
            return format(parseISO(label as string), 'MMM d, yyyy')
        } catch {
            return label
        }
    })()

    return (
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-3 shadow-xl">
            <p className="text-xs text-gray-400 mb-2">{dateLabel}</p>
            {payload.map((entry) => (
                <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
                    <span
                        className="inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-gray-300 capitalize">{entry.dataKey}:</span>
                    <span className="font-semibold text-white">{entry.value.toLocaleString()}</span>
                </div>
            ))}
        </div>
    )
}

export default function AdminDashboard() {
    const [days, setDays] = useState(7)
    const [data, setData] = useState<AnalyticsResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [activeUsers, setActiveUsers] = useState(0)
    const liveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    const fetchData = useCallback(async (rangeDays: number) => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`/api/analytics?days=${rangeDays}`)
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const json: AnalyticsResponse = await res.json()
            setData(json)
            setActiveUsers(json.activeUsers)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load analytics')
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchLiveUsers = useCallback(async () => {
        try {
            const res = await fetch('/api/analytics?days=1')
            if (!res.ok) return
            const json: AnalyticsResponse = await res.json()
            setActiveUsers(json.activeUsers)
        } catch {
            // silently ignore live refresh errors
        }
    }, [])

    useEffect(() => {
        fetchData(days)
    }, [days, fetchData])

    useEffect(() => {
        liveIntervalRef.current = setInterval(fetchLiveUsers, 30000)
        return () => {
            if (liveIntervalRef.current) clearInterval(liveIntervalRef.current)
        }
    }, [fetchLiveUsers])

    const todaysViews = (() => {
        if (!data?.dailyStats?.length) return 0
        const last = data.dailyStats[data.dailyStats.length - 1]
        try {
            if (isToday(parseISO(last.date))) return last.pageviews
        } catch {
            // fall through
        }
        const first = data.dailyStats[0]
        try {
            if (isToday(parseISO(first.date))) return first.pageviews
        } catch {
            // fall through
        }
        return 0
    })()

    const totalSources = data
        ? Object.values(data.sources).reduce((a, b) => a + b, 0)
        : 0

    const sortedSources = data
        ? Object.entries(data.sources).sort(([, a], [, b]) => b - a)
        : []

    const contentPages = data
        ? data.topPages.filter((p) => p.path.startsWith('/dossiers/'))
        : []

    if (loading && !data) {
        return (
            <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-intelligence" />
                <p className="text-gray-400 mt-4">Loading analytics...</p>
            </div>
        )
    }

    if (error && !data) {
        return (
            <div className="p-8 text-center">
                <Monitor className="h-12 w-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-400 font-medium">{error}</p>
                <button
                    onClick={() => fetchData(days)}
                    className="mt-4 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 hover:text-white transition-colors"
                >
                    Retry
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header + Time Range */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-intelligence" />
                        Analytics Dashboard
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        Site performance &amp; traffic insights
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex rounded-lg border border-gray-700 overflow-hidden">
                        {TIME_RANGES.map((range) => (
                            <button
                                key={range.days}
                                onClick={() => setDays(range.days)}
                                className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                                    days === range.days
                                        ? 'bg-intelligence text-gray-950'
                                        : 'bg-gray-800 text-gray-400 hover:text-white'
                                }`}
                            >
                                {range.label}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => fetchData(days)}
                        disabled={loading}
                        className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-6 rounded-xl glass-morphism border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <Eye className="h-5 w-5 text-intelligence" />
                        <span className="text-xs text-gray-500">Total Views</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                        {(data?.totalPageviews ?? 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                        in last {days} day{days > 1 ? 's' : ''}
                    </div>
                </div>

                <div className="p-6 rounded-xl glass-morphism border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <Activity className="h-5 w-5 text-green-400" />
                        <span className="text-xs text-gray-500">Live Now</span>
                    </div>
                    <div className="text-3xl font-bold text-white flex items-center gap-2">
                        {activeUsers}
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
                        </span>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">active users</div>
                </div>

                <div className="p-6 rounded-xl glass-morphism border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="h-5 w-5 text-blue-400" />
                        <span className="text-xs text-gray-500">Today</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                        {todaysViews.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">pageviews today</div>
                </div>

                <div className="p-6 rounded-xl glass-morphism border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <Users className="h-5 w-5 text-purple-400" />
                        <span className="text-xs text-gray-500">Returning</span>
                    </div>
                    <div className="text-3xl font-bold text-white">
                        {(data?.returningVisitors ?? 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">returning visitors</div>
                </div>
            </div>

            {/* Views Graph */}
            <div className="p-6 rounded-xl glass-morphism border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-intelligence" />
                    Traffic Overview
                </h3>
                {data?.dailyStats && data.dailyStats.length > 0 ? (
                    <ResponsiveContainer width="100%" height={320}>
                        <AreaChart data={data.dailyStats}>
                            <defs>
                                <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={GOLD} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={GOLD} stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={TEAL} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={TEAL} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis
                                dataKey="date"
                                stroke="#6B7280"
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                tickFormatter={(v) => {
                                    try {
                                        return format(parseISO(v), 'MMM d')
                                    } catch {
                                        return v
                                    }
                                }}
                            />
                            <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                            <Tooltip content={<ChartTooltipContent />} />
                            <Area
                                type="monotone"
                                dataKey="pageviews"
                                stroke={GOLD}
                                strokeWidth={2}
                                fill="url(#goldGradient)"
                            />
                            <Area
                                type="monotone"
                                dataKey="visitors"
                                stroke={TEAL}
                                strokeWidth={2}
                                fill="url(#tealGradient)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-gray-500 text-center py-12">No traffic data available.</p>
                )}
                <div className="flex items-center gap-6 mt-3 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: GOLD }} />
                        <span className="text-gray-400">Pageviews</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: TEAL }} />
                        <span className="text-gray-400">Visitors</span>
                    </div>
                </div>
            </div>

            {/* Most Viewed Pages */}
            <div className="p-6 rounded-xl glass-morphism border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Eye className="h-5 w-5 text-intelligence" />
                    Most Viewed Pages
                </h3>
                {data?.topPages && data.topPages.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-800">
                                    <th className="text-left py-3 pr-4 w-10">#</th>
                                    <th className="text-left py-3 pr-4">Page</th>
                                    <th className="text-right py-3 pr-4">Views</th>
                                    <th className="text-right py-3 pr-4">Scroll Depth</th>
                                    <th className="text-right py-3 pr-4">Avg Engagement</th>
                                    <th className="text-right py-3">Exit Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.topPages.map((page, idx) => (
                                    <tr
                                        key={page.path}
                                        className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                                    >
                                        <td className="py-3 pr-4 text-gray-500 font-medium">{idx + 1}</td>
                                        <td className="py-3 pr-4">
                                            <div className="text-white font-medium truncate max-w-xs">
                                                {page.title || page.path}
                                            </div>
                                            <div className="text-xs text-gray-500 truncate max-w-xs">
                                                {page.path}
                                            </div>
                                        </td>
                                        <td className="py-3 pr-4 text-right text-white font-medium">
                                            {page.views.toLocaleString()}
                                        </td>
                                        <td className="py-3 pr-4 text-right text-gray-300">
                                            {Math.round(page.avgScrollDepth)}%
                                        </td>
                                        <td className="py-3 pr-4 text-right text-gray-300">
                                            {formatEngagement(page.avgEngagement)}
                                        </td>
                                        <td className="py-3 text-right text-gray-300">
                                            {Math.round(page.exitRate)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No page data available.</p>
                )}
            </div>

            {/* Most Viewed Content (Dossiers) */}
            <div className="p-6 rounded-xl glass-morphism border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <ArrowUpRight className="h-5 w-5 text-intelligence" />
                    Top Articles, Cases &amp; Blogs
                </h3>
                {contentPages.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-xs text-gray-500 uppercase tracking-wider border-b border-gray-800">
                                    <th className="text-left py-3 pr-4 w-10">#</th>
                                    <th className="text-left py-3 pr-4">Content</th>
                                    <th className="text-right py-3 pr-4">Views</th>
                                    <th className="text-right py-3 pr-4">Scroll Depth</th>
                                    <th className="text-right py-3 pr-4">Avg Engagement</th>
                                    <th className="text-right py-3">Exit Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contentPages.map((page, idx) => (
                                    <tr
                                        key={page.path}
                                        className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                                    >
                                        <td className="py-3 pr-4 text-gray-500 font-medium">{idx + 1}</td>
                                        <td className="py-3 pr-4">
                                            <div className="text-white font-medium truncate max-w-xs">
                                                {page.title || page.path}
                                            </div>
                                            <div className="text-xs text-gray-500 truncate max-w-xs">
                                                {page.path}
                                            </div>
                                        </td>
                                        <td className="py-3 pr-4 text-right text-white font-medium">
                                            {page.views.toLocaleString()}
                                        </td>
                                        <td className="py-3 pr-4 text-right text-gray-300">
                                            {Math.round(page.avgScrollDepth)}%
                                        </td>
                                        <td className="py-3 pr-4 text-right text-gray-300">
                                            {formatEngagement(page.avgEngagement)}
                                        </td>
                                        <td className="py-3 text-right text-gray-300">
                                            {Math.round(page.exitRate)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No content page data available.</p>
                )}
            </div>

            {/* Most Shared Content (placeholder) */}
            <div className="p-6 rounded-xl glass-morphism border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-intelligence" />
                    Most Shared Content
                </h3>
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                    <Share2 className="h-10 w-10 mb-3 text-gray-600" />
                    <p className="font-medium text-gray-400">Share tracking coming soon</p>
                    <p className="text-sm mt-1">
                        We&apos;re building share analytics to track how your content spreads.
                    </p>
                </div>
            </div>

            {/* Traffic Sources */}
            <div className="p-6 rounded-xl glass-morphism border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-intelligence" />
                    Traffic Sources
                </h3>
                {sortedSources.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <ResponsiveContainer width="100%" height={sortedSources.length * 44 + 20}>
                                <BarChart
                                    data={sortedSources.map(([name, count]) => ({ name, count }))}
                                    layout="vertical"
                                    margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                                    <XAxis type="number" stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        stroke="#6B7280"
                                        tick={{ fill: '#D1D5DB', fontSize: 12 }}
                                        width={120}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#111827',
                                            border: '1px solid #374151',
                                            borderRadius: '8px',
                                        }}
                                        labelStyle={{ color: '#9CA3AF' }}
                                        itemStyle={{ color: '#FFFFFF' }}
                                    />
                                    <Bar dataKey="count" fill={GOLD} radius={[0, 4, 4, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-2">
                            {sortedSources.map(([name, count]) => {
                                const pct = totalSources > 0 ? (count / totalSources) * 100 : 0
                                return (
                                    <div key={name} className="flex items-center gap-3">
                                        <div className="w-28 text-sm text-gray-300 truncate">{name}</div>
                                        <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-intelligence transition-all"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <div className="w-20 text-right text-sm">
                                            <span className="text-white font-medium">{count}</span>
                                            <span className="text-gray-500 ml-1">
                                                ({pct.toFixed(1)}%)
                                            </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 text-center py-8">No source data available.</p>
                )}
            </div>
        </div>
    )
}
