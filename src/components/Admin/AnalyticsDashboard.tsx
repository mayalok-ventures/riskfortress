'use client'

import { useState, useEffect } from 'react'
import {
    Eye, Users, Calendar, TrendingUp, Share2, Globe,
    Loader2, RefreshCw, ArrowUpRight, Activity, Monitor, ExternalLink
} from 'lucide-react'
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from 'recharts'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AnalyticsData {
    totalPageviews: number
    uniqueVisitors: number
    uniqueSessions: number
    newVisitors: number
    returningVisitors: number
    sources: Record<string, number>
    platforms: Record<string, number>
    topPages: Array<{
        path: string; title: string; views: number
        avgScrollDepth: number; avgEngagement: number; exitRate: number
    }>
    topShared: Array<{
        path: string; title: string; contentType: string
        shares: number; platforms: Record<string, number>
    }>
    contentTypeExits: Record<string, number>
    activeUsers: number
    todayPageviews: number
    dailyStats: Array<{ date: string; pageviews: number; visitors: number; sessions: number }>
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const PLATFORM_COLORS: Record<string, string> = {
    LinkedIn: '#0A66C2', WhatsApp: '#25D366', Facebook: '#1877F2',
    'Twitter/X': '#1DA1F2', Instagram: '#E4405F', Google: '#4285F4',
    Bing: '#008373', YouTube: '#FF0000', Reddit: '#FF4500',
    Telegram: '#26A5E4', Email: '#EA4335', Direct: '#6B7280',
    Internal: '#8B5CF6', 'Organic Search': '#34D399', Referral: '#F59E0B',
    DuckDuckGo: '#DE5833', Yahoo: '#720E9E',
}

const RANGES = [
    { label: '7 days', days: 7 },
    { label: '15 days', days: 15 },
    { label: '1 month', days: 30 },
    { label: '6 months', days: 180 },
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function fmtDate(iso: string) {
    const d = new Date(iso + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function fmtEngagement(seconds: number) {
    if (seconds < 60) return `${seconds}s`
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}m ${s}s`
}

function topPlatform(platforms: Record<string, number>): string {
    let max = 0; let name = '-'
    for (const [p, c] of Object.entries(platforms)) { if (c > max) { max = c; name = p } }
    return name
}

function getContentTypeLabel(path: string): string {
    if (path.startsWith('/dossiers/')) return 'Dossier'
    if (path === '/') return 'Home'
    const seg = path.split('/').filter(Boolean)[0]
    if (seg) return seg.charAt(0).toUpperCase() + seg.slice(1)
    return 'Page'
}

/* ------------------------------------------------------------------ */
/*  Custom Recharts Tooltip                                            */
/* ------------------------------------------------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
            <p className="text-gray-400 text-xs mb-1">{label}</p>
            {payload.map((entry: { name: string; value: number; color: string }, i: number) => (
                <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>
                    {entry.name}: {entry.value.toLocaleString()}
                </p>
            ))}
        </div>
    )
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function StatCard({ label, value, icon: Icon, accent, extra }: {
    label: string; value: string | number; icon: React.ElementType; accent: string; extra?: React.ReactNode
}) {
    return (
        <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400">{label}</span>
                <div className={`p-2.5 rounded-xl ${accent}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
            <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-white">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                {extra}
            </div>
        </div>
    )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-lg font-semibold text-white mb-4">{children}</h2>
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

interface Props { token: string }

export default function AnalyticsDashboard({ token }: Props) {
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [range, setRange] = useState(7)
    const [refreshing, setRefreshing] = useState(false)

    const load = async (days: number) => {
        try {
            const res = await fetch(`/api/analytics?days=${days}`, { headers: { Authorization: `Bearer ${token}` } })
            if (res.ok) setData(await res.json())
        } catch { /* ignore */ }
    }

    useEffect(() => { setLoading(true); load(range).finally(() => setLoading(false)) }, [range])

    const refresh = async () => { setRefreshing(true); await load(range); setRefreshing(false) }

    /* ---------- Loading ---------- */
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="h-10 w-10 animate-spin text-intelligence mb-4" />
                <p className="text-gray-400">Loading analytics…</p>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="text-center py-32">
                <Monitor className="h-16 w-16 text-gray-700 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No Data Available</h3>
                <p className="text-gray-400">Analytics data will appear as visitors browse the site.</p>
            </div>
        )
    }

    /* ---------- Derived ---------- */
    const chartData = data.dailyStats.map(d => ({ ...d, label: fmtDate(d.date) }))

    const platformEntries = Object.entries(data.platforms || data.sources || {})
        .sort((a, b) => b[1] - a[1])

    const totalPlatformVisits = platformEntries.reduce((s, [, v]) => s + v, 0)

    const contentPages = data.topPages.filter(p => p.path.startsWith('/dossiers/') && p.path !== '/dossiers/')
    const sitePages = data.topPages.filter(p => !p.path.startsWith('/dossiers/') || p.path === '/dossiers/')

    /* ------------------------------------------------------------------ */
    /*  Render                                                             */
    /* ------------------------------------------------------------------ */
    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Analytics</h1>
                    <p className="text-gray-400 text-sm mt-1">Real-time website traffic &amp; engagement data</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button onClick={refresh} disabled={refreshing}
                        className="p-2.5 rounded-xl bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 transition-colors disabled:opacity-50">
                        <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                    <div className="flex rounded-xl bg-gray-800 border border-gray-700 p-1">
                        {RANGES.map(r => (
                            <button key={r.days} onClick={() => setRange(r.days)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${range === r.days ? 'bg-intelligence text-obsidian' : 'text-gray-400 hover:text-white'}`}>
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ===== Stat Cards ===== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                <StatCard label="Total Views" value={data.totalPageviews} icon={Eye}
                    accent="bg-intelligence/10 text-intelligence" />

                <StatCard label="Live Now" value={data.activeUsers} icon={Activity}
                    accent="bg-green-500/10 text-green-400"
                    extra={
                        <div className="flex items-center space-x-2">
                            <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                            </div>
                            <span className="text-xs text-green-400">active</span>
                        </div>
                    }
                />

                <StatCard label="Today's Views" value={data.todayPageviews} icon={Calendar}
                    accent="bg-blue-500/10 text-blue-400" />

                <StatCard label="Returning Visitors" value={data.returningVisitors} icon={Users}
                    accent="bg-purple-500/10 text-purple-400"
                    extra={
                        data.uniqueVisitors > 0 ? (
                            <span className="text-xs text-gray-500">
                                {Math.round((data.returningVisitors / data.uniqueVisitors) * 100)}% of visitors
                            </span>
                        ) : undefined
                    }
                />
            </div>

            {/* ===== Views Trend Chart ===== */}
            <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6 mb-8">
                <SectionTitle>Views Trend</SectionTitle>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
                            <defs>
                                <linearGradient id="gradViews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="gradVisitors" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#34d399" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                            <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="pageviews" name="Page Views" stroke="#22d3ee" fill="url(#gradViews)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#22d3ee' }} />
                            <Area type="monotone" dataKey="visitors" name="Visitors" stroke="#34d399" fill="url(#gradVisitors)" strokeWidth={2} dot={false} activeDot={{ r: 4, fill: '#34d399' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center space-x-6 mt-2">
                    <div className="flex items-center space-x-2"><div className="h-2.5 w-2.5 rounded-full bg-cyan-400" /><span className="text-xs text-gray-400">Page Views</span></div>
                    <div className="flex items-center space-x-2"><div className="h-2.5 w-2.5 rounded-full bg-green-400" /><span className="text-xs text-gray-400">Unique Visitors</span></div>
                </div>
            </div>

            {/* ===== Two-col: Platform Breakdown + Traffic Sources ===== */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Platform Bar Chart */}
                <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6">
                    <SectionTitle>Traffic by Platform</SectionTitle>
                    {platformEntries.length === 0 ? (
                        <p className="text-gray-500 text-sm py-10 text-center">No platform data yet</p>
                    ) : (
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={platformEntries.slice(0, 10).map(([name, value]) => ({ name, value }))}
                                    layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" horizontal={false} />
                                    <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} width={100} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="value" name="Visits" radius={[0, 6, 6, 0]} barSize={20}>
                                        {platformEntries.slice(0, 10).map(([name], i) => (
                                            <Cell key={i} fill={PLATFORM_COLORS[name] || '#6B7280'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Platform Breakdown Table */}
                <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6">
                    <SectionTitle>Platform Breakdown</SectionTitle>
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {platformEntries.length === 0 ? (
                            <p className="text-gray-500 text-sm py-10 text-center">No data yet</p>
                        ) : platformEntries.map(([platform, count]) => {
                            const pct = totalPlatformVisits > 0 ? Math.round((count / totalPlatformVisits) * 100) : 0
                            const color = PLATFORM_COLORS[platform] || '#6B7280'
                            return (
                                <div key={platform} className="flex items-center space-x-3">
                                    <div className="h-3 w-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                                    <span className="text-sm text-gray-300 flex-1 truncate">{platform}</span>
                                    <span className="text-sm font-semibold text-white">{count.toLocaleString()}</span>
                                    <span className="text-xs text-gray-500 w-10 text-right">{pct}%</span>
                                    <div className="w-24 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* ===== Most Viewed Pages ===== */}
            <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6 mb-8">
                <SectionTitle>Most Viewed Pages</SectionTitle>
                {sitePages.length === 0 ? (
                    <p className="text-gray-500 text-sm py-10 text-center">No page view data yet</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                                    <th className="text-left pb-3 pr-4">Page</th>
                                    <th className="text-right pb-3 px-4">Views</th>
                                    <th className="text-right pb-3 px-4 hidden md:table-cell">Avg Engagement</th>
                                    <th className="text-right pb-3 px-4 hidden md:table-cell">Scroll Depth</th>
                                    <th className="text-right pb-3 pl-4 hidden lg:table-cell">Exit Rate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sitePages.slice(0, 10).map((page, i) => (
                                    <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                                        <td className="py-3 pr-4">
                                            <p className="text-white font-medium truncate max-w-[280px]">{page.title || page.path}</p>
                                            <p className="text-xs text-gray-500">{page.path}</p>
                                        </td>
                                        <td className="text-right py-3 px-4 font-semibold text-intelligence">{page.views.toLocaleString()}</td>
                                        <td className="text-right py-3 px-4 text-gray-400 hidden md:table-cell">{fmtEngagement(page.avgEngagement)}</td>
                                        <td className="text-right py-3 px-4 hidden md:table-cell">
                                            <div className="flex items-center justify-end space-x-2">
                                                <div className="w-16 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                                                    <div className="h-full rounded-full bg-intelligence" style={{ width: `${page.avgScrollDepth}%` }} />
                                                </div>
                                                <span className="text-gray-400 text-xs w-8 text-right">{page.avgScrollDepth}%</span>
                                            </div>
                                        </td>
                                        <td className="text-right py-3 pl-4 text-gray-400 hidden lg:table-cell">{page.exitRate}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ===== Most Viewed Content (Cases / Articles / Blogs) ===== */}
            <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6 mb-8">
                <SectionTitle>Most Viewed Content (Cases · Articles · Blogs)</SectionTitle>
                {contentPages.length === 0 ? (
                    <p className="text-gray-500 text-sm py-10 text-center">No content views yet</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                                    <th className="text-left pb-3 pr-4">Content</th>
                                    <th className="text-left pb-3 px-4">Type</th>
                                    <th className="text-right pb-3 px-4">Views</th>
                                    <th className="text-right pb-3 px-4 hidden md:table-cell">Avg Engagement</th>
                                    <th className="text-right pb-3 pl-4 hidden md:table-cell">Scroll Depth</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contentPages.slice(0, 10).map((page, i) => (
                                    <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                                        <td className="py-3 pr-4">
                                            <div className="flex items-center space-x-2">
                                                <p className="text-white font-medium truncate max-w-[260px]">{page.title || page.path}</p>
                                                <a href={page.path} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-intelligence flex-shrink-0">
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </a>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-intelligence/10 text-intelligence border border-intelligence/20">
                                                {getContentTypeLabel(page.path)}
                                            </span>
                                        </td>
                                        <td className="text-right py-3 px-4 font-semibold text-intelligence">{page.views.toLocaleString()}</td>
                                        <td className="text-right py-3 px-4 text-gray-400 hidden md:table-cell">{fmtEngagement(page.avgEngagement)}</td>
                                        <td className="text-right py-3 pl-4 hidden md:table-cell">
                                            <div className="flex items-center justify-end space-x-2">
                                                <div className="w-16 h-1.5 rounded-full bg-gray-800 overflow-hidden">
                                                    <div className="h-full rounded-full bg-purple-500" style={{ width: `${page.avgScrollDepth}%` }} />
                                                </div>
                                                <span className="text-gray-400 text-xs w-8 text-right">{page.avgScrollDepth}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ===== Most Shared Content ===== */}
            <div className="rounded-2xl bg-gray-900 border border-gray-800 p-6 mb-8">
                <div className="flex items-center space-x-2 mb-4">
                    <Share2 className="h-5 w-5 text-intelligence" />
                    <SectionTitle>Most Shared Content</SectionTitle>
                </div>
                {(!data.topShared || data.topShared.length === 0) ? (
                    <p className="text-gray-500 text-sm py-10 text-center">No share data yet. Shares will be tracked when visitors use share buttons.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-800 text-gray-400 text-xs uppercase">
                                    <th className="text-left pb-3 pr-4">Content</th>
                                    <th className="text-left pb-3 px-4">Type</th>
                                    <th className="text-right pb-3 px-4">Total Shares</th>
                                    <th className="text-left pb-3 px-4">Top Platform</th>
                                    <th className="text-left pb-3 pl-4 hidden md:table-cell">Share Breakdown</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.topShared.slice(0, 10).map((item, i) => {
                                    const top = topPlatform(item.platforms)
                                    const topColor = PLATFORM_COLORS[top] || '#6B7280'
                                    return (
                                        <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                                            <td className="py-3 pr-4">
                                                <p className="text-white font-medium truncate max-w-[240px]">{item.title}</p>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                                                    item.contentType === 'case' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                                    item.contentType === 'article' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                                    item.contentType === 'blog' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                                                    'bg-gray-700 text-gray-400 border border-gray-600'
                                                }`}>
                                                    {item.contentType}
                                                </span>
                                            </td>
                                            <td className="text-right py-3 px-4 font-semibold text-white">{item.shares.toLocaleString()}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center space-x-2">
                                                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: topColor }} />
                                                    <span className="text-gray-300 text-sm">{top}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 pl-4 hidden md:table-cell">
                                                <div className="flex items-center space-x-1">
                                                    {Object.entries(item.platforms).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([p, c]) => (
                                                        <span key={p} className="px-2 py-0.5 rounded text-xs bg-gray-800 text-gray-400" title={`${p}: ${c}`}>
                                                            <span className="inline-block h-1.5 w-1.5 rounded-full mr-1" style={{ backgroundColor: PLATFORM_COLORS[p] || '#6B7280' }} />
                                                            {c}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ===== Summary Footer ===== */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <div className="rounded-xl bg-gray-900/50 border border-gray-800 p-4 text-center">
                    <p className="text-2xl font-bold text-white">{data.uniqueVisitors.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Unique Visitors</p>
                </div>
                <div className="rounded-xl bg-gray-900/50 border border-gray-800 p-4 text-center">
                    <p className="text-2xl font-bold text-white">{data.uniqueSessions.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Sessions</p>
                </div>
                <div className="rounded-xl bg-gray-900/50 border border-gray-800 p-4 text-center">
                    <p className="text-2xl font-bold text-white">{data.newVisitors.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">New Visitors</p>
                </div>
                <div className="rounded-xl bg-gray-900/50 border border-gray-800 p-4 text-center">
                    <p className="text-2xl font-bold text-white">{Object.keys(data.sources || {}).length}</p>
                    <p className="text-xs text-gray-500 mt-1">Traffic Sources</p>
                </div>
            </div>
        </div>
    )
}
