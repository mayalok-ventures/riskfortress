'use client'

import { useState, useEffect } from 'react'
import {
    BarChart3, Users, Eye, Clock, ArrowUpRight, ArrowDownRight,
    Globe, RefreshCw, TrendingUp, MousePointer, LogOut as ExitIcon,
    UserCheck, UserPlus, Activity, Layers
} from 'lucide-react'

interface AnalyticsData {
    totalPageviews: number
    uniqueVisitors: number
    uniqueSessions: number
    newVisitors: number
    returningVisitors: number
    sources: Record<string, number>
    topPages: Array<{
        path: string
        title: string
        views: number
        avgScrollDepth: number
        avgEngagement: number
        exitRate: number
    }>
    contentTypeExits: Record<string, number>
    activeUsers: number
    dailyStats: Array<{
        date: string
        pageviews: number
        visitors: number
        sessions: number
    }>
}

type Role = 'executive' | 'analyst'

export default function AdminDashboard() {
    const [role, setRole] = useState<Role>('executive')
    const [days, setDays] = useState(7)
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<AnalyticsData | null>(null)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

    const fetchAnalytics = async () => {
        setLoading(true)
        try {
            const response = await fetch(`/api/analytics?days=${days}&role=${role}`)
            if (response.ok) {
                const result = await response.json()
                setData(result)
                setLastUpdated(new Date())
            }
        } catch (error) {
            console.error('Failed to fetch analytics:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchAnalytics()
        // Auto-refresh every 60 seconds
        const interval = setInterval(fetchAnalytics, 60000)
        return () => clearInterval(interval)
    }, [days, role])

    const formatNumber = (num: number): string => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
        return num.toString()
    }

    const formatTime = (seconds: number): string => {
        if (seconds < 60) return `${seconds}s`
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}m ${secs}s`
    }

    const getSourceColor = (source: string): string => {
        const colors: Record<string, string> = {
            'Organic Search': 'bg-green-500',
            'Direct': 'bg-blue-500',
            'LinkedIn': 'bg-sky-500',
            'Twitter/X': 'bg-gray-500',
            'Facebook': 'bg-indigo-500',
            'Referral': 'bg-purple-500',
            'Internal': 'bg-gray-600',
        }
        return colors[source] || 'bg-gray-500'
    }

    const getScrollDepthColor = (depth: number): string => {
        if (depth >= 75) return 'text-green-400'
        if (depth >= 50) return 'text-yellow-400'
        if (depth >= 25) return 'text-orange-400'
        return 'text-red-400'
    }

    if (loading && !data) {
        return (
            <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-intelligence"></div>
                <p className="text-gray-400 mt-4">Loading analytics...</p>
            </div>
        )
    }

    const totalSources = Object.values(data?.sources || {}).reduce((a, b) => a + b, 0)
    const returningRate = data && data.uniqueVisitors > 0 
        ? Math.round((data.returningVisitors / data.uniqueVisitors) * 100) 
        : 0

    return (
        <div className="space-y-6">
            {/* Header with Role Toggle and Controls */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BarChart3 className="h-6 w-6 text-intelligence" />
                        Analytics Dashboard
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">
                        {lastUpdated && `Last updated: ${lastUpdated.toLocaleTimeString()}`}
                    </p>
                </div>
                
                <div className="flex items-center gap-4">
                    {/* Role Toggle */}
                    <div className="flex rounded-lg overflow-hidden border border-gray-700">
                        <button
                            onClick={() => setRole('executive')}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${
                                role === 'executive' 
                                    ? 'bg-intelligence text-white' 
                                    : 'bg-gray-800 text-gray-400 hover:text-white'
                            }`}
                        >
                            Executive View
                        </button>
                        <button
                            onClick={() => setRole('analyst')}
                            className={`px-4 py-2 text-sm font-medium transition-colors ${
                                role === 'analyst' 
                                    ? 'bg-intelligence text-white' 
                                    : 'bg-gray-800 text-gray-400 hover:text-white'
                            }`}
                        >
                            Analyst View
                        </button>
                    </div>
                    
                    {/* Time Range */}
                    <select
                        value={days}
                        onChange={(e) => setDays(parseInt(e.target.value))}
                        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
                    >
                        <option value={7}>Last 7 days</option>
                        <option value={14}>Last 14 days</option>
                        <option value={30}>Last 30 days</option>
                    </select>
                    
                    {/* Refresh Button */}
                    <button
                        onClick={fetchAnalytics}
                        disabled={loading}
                        className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Active Users Banner */}
            {data && data.activeUsers > 0 && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3">
                    <div className="relative">
                        <Activity className="h-6 w-6 text-green-400" />
                        <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full animate-pulse" />
                    </div>
                    <div>
                        <span className="text-green-400 font-semibold">{data.activeUsers} active user{data.activeUsers > 1 ? 's' : ''}</span>
                        <span className="text-gray-400 ml-2">right now</span>
                    </div>
                </div>
            )}

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Total Sessions */}
                <div className="p-6 rounded-xl glass-morphism border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <Eye className="h-5 w-5 text-intelligence" />
                        <span className="text-xs text-gray-500">Sessions</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{formatNumber(data?.uniqueSessions || 0)}</div>
                    <div className="text-sm text-gray-400 mt-1">{formatNumber(data?.totalPageviews || 0)} pageviews</div>
                </div>
                
                {/* Unique Visitors */}
                <div className="p-6 rounded-xl glass-morphism border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <Users className="h-5 w-5 text-green-400" />
                        <span className="text-xs text-gray-500">Visitors</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{formatNumber(data?.uniqueVisitors || 0)}</div>
                    <div className="text-sm text-gray-400 mt-1">unique visitors</div>
                </div>
                
                {/* New Visitors */}
                <div className="p-6 rounded-xl glass-morphism border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <UserPlus className="h-5 w-5 text-blue-400" />
                        <span className="text-xs text-gray-500">New</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{formatNumber(data?.newVisitors || 0)}</div>
                    <div className="text-sm text-gray-400 mt-1">new visitors</div>
                </div>
                
                {/* Returning Visitors */}
                <div className="p-6 rounded-xl glass-morphism border border-gray-800">
                    <div className="flex items-center justify-between mb-2">
                        <UserCheck className="h-5 w-5 text-purple-400" />
                        <span className="text-xs text-gray-500">Returning</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{returningRate}%</div>
                    <div className="text-sm text-gray-400 mt-1">{formatNumber(data?.returningVisitors || 0)} returning</div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Traffic Sources */}
                <div className="p-6 rounded-xl glass-morphism border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Globe className="h-5 w-5 text-intelligence" />
                        Traffic Sources
                    </h3>
                    <div className="space-y-3">
                        {Object.entries(data?.sources || {})
                            .sort(([, a], [, b]) => b - a)
                            .map(([source, count]) => {
                                const percentage = totalSources > 0 ? Math.round((count / totalSources) * 100) : 0
                                return (
                                    <div key={source}>
                                        <div className="flex items-center justify-between text-sm mb-1">
                                            <span className="text-gray-300">{source}</span>
                                            <span className="text-gray-400">{count} ({percentage}%)</span>
                                        </div>
                                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full ${getSourceColor(source)} transition-all duration-500`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        {Object.keys(data?.sources || {}).length === 0 && (
                            <p className="text-gray-500 text-center py-4">No traffic data yet</p>
                        )}
                    </div>
                </div>

                {/* Exit Rate by Content Type */}
                <div className="p-6 rounded-xl glass-morphism border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <ExitIcon className="h-5 w-5 text-red-400" />
                        Exit Rate by Content Type
                    </h3>
                    <div className="space-y-3">
                        {Object.entries(data?.contentTypeExits || {})
                            .sort(([, a], [, b]) => b - a)
                            .map(([type, count]) => (
                                <div key={type} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Layers className="h-4 w-4 text-gray-400" />
                                        <span className="text-gray-300 capitalize">{type}</span>
                                    </div>
                                    <span className="text-red-400 font-semibold">{count} exits</span>
                                </div>
                            ))}
                        {Object.keys(data?.contentTypeExits || {}).length === 0 && (
                            <p className="text-gray-500 text-center py-4">No exit data yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Top Landing Pages - Full Width */}
            <div className="p-6 rounded-xl glass-morphism border border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-intelligence" />
                    Top Landing Pages
                    <span className="text-xs text-gray-500 font-normal ml-2">
                        ({role === 'executive' ? 'Top 5' : 'Top 20'})
                    </span>
                </h3>
                
                {/* Table Header */}
                <div className="hidden md:grid grid-cols-12 gap-4 text-xs text-gray-500 uppercase tracking-wider pb-3 border-b border-gray-800">
                    <div className="col-span-5">Page</div>
                    <div className="col-span-2 text-center">Views</div>
                    <div className="col-span-2 text-center">Scroll Depth</div>
                    <div className="col-span-2 text-center">Avg. Time</div>
                    <div className="col-span-1 text-center">Exit %</div>
                </div>
                
                {/* Table Body */}
                <div className="space-y-2 mt-3">
                    {(data?.topPages || []).map((page, index) => (
                        <div 
                            key={page.path}
                            className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
                        >
                            <div className="col-span-5 flex items-center gap-3">
                                <span className="text-gray-500 text-sm w-6">{index + 1}.</span>
                                <div className="min-w-0">
                                    <div className="text-white font-medium truncate">{page.title}</div>
                                    <div className="text-xs text-gray-500 truncate">{page.path}</div>
                                </div>
                            </div>
                            <div className="col-span-2 flex items-center justify-center md:justify-center">
                                <span className="text-intelligence font-semibold">{formatNumber(page.views)}</span>
                                <span className="text-gray-500 text-xs ml-1 md:hidden">views</span>
                            </div>
                            <div className="col-span-2 flex items-center justify-center md:justify-center gap-1">
                                <MousePointer className="h-3 w-3 text-gray-500" />
                                <span className={`font-semibold ${getScrollDepthColor(page.avgScrollDepth)}`}>
                                    {page.avgScrollDepth}%
                                </span>
                            </div>
                            <div className="col-span-2 flex items-center justify-center md:justify-center gap-1">
                                <Clock className="h-3 w-3 text-gray-500" />
                                <span className="text-gray-300">{formatTime(page.avgEngagement)}</span>
                            </div>
                            <div className="col-span-1 flex items-center justify-center md:justify-center">
                                <span className={`font-semibold ${page.exitRate > 50 ? 'text-red-400' : 'text-gray-400'}`}>
                                    {page.exitRate}%
                                </span>
                            </div>
                        </div>
                    ))}
                    {(data?.topPages || []).length === 0 && (
                        <p className="text-gray-500 text-center py-8">No page data yet. Analytics will appear as visitors browse the site.</p>
                    )}
                </div>
            </div>

            {/* Daily Trend Chart - Analyst View Only */}
            {role === 'analyst' && (
                <div className="p-6 rounded-xl glass-morphism border border-gray-800">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-intelligence" />
                        Daily Trend
                    </h3>
                    <div className="h-64 flex items-end gap-1">
                        {(data?.dailyStats || []).map((day, index) => {
                            const maxPageviews = Math.max(...(data?.dailyStats || []).map(d => d.pageviews), 1)
                            const height = (day.pageviews / maxPageviews) * 100
                            return (
                                <div 
                                    key={day.date}
                                    className="flex-1 flex flex-col items-center gap-1 group"
                                >
                                    <div className="relative w-full">
                                        <div 
                                            className="w-full bg-intelligence/80 hover:bg-intelligence rounded-t transition-all cursor-pointer"
                                            style={{ height: `${Math.max(height, 2)}%`, minHeight: '4px' }}
                                        />
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 px-2 py-1 rounded text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                            {day.pageviews} views
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-500 transform -rotate-45 origin-top-left mt-2">
                                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
