// Cloudflare Pages Function for analytics tracking
// Stores events in KV for dashboard retrieval

interface Env {
    RF_CONTENT: KVNamespace
}

interface AnalyticsEvent {
    type: 'pageview' | 'scroll' | 'engagement' | 'exit' | 'heartbeat'
    visitorId: string
    sessionId: string
    path: string
    timestamp: string
    [key: string]: unknown
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

function jsonResponse(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
}

// Get today's date key
function getDateKey(date?: Date): string {
    const d = date || new Date()
    return d.toISOString().split('T')[0]
}

// POST - Record analytics event
export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const kv = context.env.RF_CONTENT
        const event = await context.request.json() as AnalyticsEvent
        
        if (!event.type || !event.visitorId) {
            return jsonResponse({ error: 'Invalid event' }, 400)
        }
        
        const dateKey = getDateKey()
        const eventId = `${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
        
        // Store individual event
        await kv.put(
            `analytics:${dateKey}:${event.type}:${eventId}`,
            JSON.stringify(event),
            { expirationTtl: 60 * 60 * 24 * 30 } // 30 days
        )
        
        // Update aggregated stats for the day
        const statsKey = `analytics:stats:${dateKey}`
        const existingStats = await kv.get(statsKey)
        const stats = existingStats ? JSON.parse(existingStats) : {
            date: dateKey,
            totalPageviews: 0,
            uniqueVisitors: new Set<string>(),
            uniqueSessions: new Set<string>(),
            newVisitors: 0,
            returningVisitors: 0,
            sources: {} as Record<string, number>,
            pages: {} as Record<string, { views: number; title: string; avgScrollDepth: number; scrollCount: number; totalEngagement: number; engagementCount: number; exits: number }>,
            contentTypeExits: {} as Record<string, number>,
            activeUsers: {} as Record<string, string>, // visitorId -> lastSeen
        }
        
        // Convert sets from arrays if loaded from KV
        if (Array.isArray(stats.uniqueVisitors)) {
            stats.uniqueVisitors = new Set(stats.uniqueVisitors)
        }
        if (Array.isArray(stats.uniqueSessions)) {
            stats.uniqueSessions = new Set(stats.uniqueSessions)
        }
        
        // Update stats based on event type
        switch (event.type) {
            case 'pageview':
                stats.totalPageviews++
                const wasNew = !stats.uniqueVisitors.has(event.visitorId)
                stats.uniqueVisitors.add(event.visitorId)
                stats.uniqueSessions.add(event.sessionId)
                
                if (event.isNewVisitor) {
                    stats.newVisitors++
                } else if (wasNew) {
                    stats.returningVisitors++
                }
                
                // Track source
                const source = (event.source as string) || 'Direct'
                stats.sources[source] = (stats.sources[source] || 0) + 1
                
                // Track page
                const path = event.path as string
                if (!stats.pages[path]) {
                    stats.pages[path] = { 
                        views: 0, 
                        title: (event.title as string) || path,
                        avgScrollDepth: 0,
                        scrollCount: 0,
                        totalEngagement: 0,
                        engagementCount: 0,
                        exits: 0
                    }
                }
                stats.pages[path].views++
                break
                
            case 'scroll':
                const scrollPath = event.path as string
                const scrollDepth = event.scrollDepth as number
                if (stats.pages[scrollPath]) {
                    const page = stats.pages[scrollPath]
                    page.avgScrollDepth = ((page.avgScrollDepth * page.scrollCount) + scrollDepth) / (page.scrollCount + 1)
                    page.scrollCount++
                }
                break
                
            case 'engagement':
                const engPath = event.path as string
                const engTime = event.engagementTimeMs as number
                if (stats.pages[engPath]) {
                    const page = stats.pages[engPath]
                    page.totalEngagement += engTime
                    page.engagementCount++
                }
                break
                
            case 'exit':
                const exitPath = event.path as string
                const contentType = (event.contentType as string) || 'page'
                if (stats.pages[exitPath]) {
                    stats.pages[exitPath].exits++
                }
                stats.contentTypeExits[contentType] = (stats.contentTypeExits[contentType] || 0) + 1
                break
                
            case 'heartbeat':
                // Track active users (within last 2 minutes)
                stats.activeUsers[event.visitorId] = event.timestamp
                break
        }
        
        // Convert sets to arrays for storage
        const statsToStore = {
            ...stats,
            uniqueVisitors: Array.from(stats.uniqueVisitors),
            uniqueSessions: Array.from(stats.uniqueSessions),
        }
        
        await kv.put(statsKey, JSON.stringify(statsToStore), { expirationTtl: 60 * 60 * 24 * 90 }) // 90 days
        
        return jsonResponse({ success: true })
    } catch (error) {
        console.error('Analytics POST error:', error)
        return jsonResponse({ error: 'Failed to record event' }, 500)
    }
}

// GET - Retrieve analytics data
export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        const kv = context.env.RF_CONTENT
        const url = new URL(context.request.url)
        const days = parseInt(url.searchParams.get('days') || '7')
        const role = url.searchParams.get('role') || 'analyst' // executive or analyst
        
        const stats: {
            dates: string[]
            totalPageviews: number
            uniqueVisitors: number
            uniqueSessions: number
            newVisitors: number
            returningVisitors: number
            sources: Record<string, number>
            topPages: Array<{ path: string; title: string; views: number; avgScrollDepth: number; avgEngagement: number; exitRate: number }>
            contentTypeExits: Record<string, number>
            activeUsers: number
            dailyStats: Array<{ date: string; pageviews: number; visitors: number; sessions: number }>
        } = {
            dates: [],
            totalPageviews: 0,
            uniqueVisitors: 0,
            uniqueSessions: 0,
            newVisitors: 0,
            returningVisitors: 0,
            sources: {},
            topPages: [],
            contentTypeExits: {},
            activeUsers: 0,
            dailyStats: [],
        }
        
        const allVisitors = new Set<string>()
        const allSessions = new Set<string>()
        const pageAggregates: Record<string, { views: number; title: string; totalScrollDepth: number; scrollCount: number; totalEngagement: number; engagementCount: number; exits: number }> = {}
        
        // Fetch stats for each day
        for (let i = 0; i < days; i++) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            const dateKey = getDateKey(date)
            stats.dates.push(dateKey)
            
            const dayStats = await kv.get(`analytics:stats:${dateKey}`)
            if (dayStats) {
                const parsed = JSON.parse(dayStats)
                
                stats.totalPageviews += parsed.totalPageviews || 0
                stats.newVisitors += parsed.newVisitors || 0
                stats.returningVisitors += parsed.returningVisitors || 0
                
                // Merge unique visitors
                (parsed.uniqueVisitors || []).forEach((v: string) => allVisitors.add(v))
                (parsed.uniqueSessions || []).forEach((s: string) => allSessions.add(s))
                
                // Merge sources
                for (const [source, count] of Object.entries(parsed.sources || {})) {
                    stats.sources[source] = (stats.sources[source] || 0) + (count as number)
                }
                
                // Merge pages
                for (const [path, data] of Object.entries(parsed.pages || {})) {
                    const pageData = data as { views: number; title: string; avgScrollDepth: number; scrollCount: number; totalEngagement: number; engagementCount: number; exits: number }
                    if (!pageAggregates[path]) {
                        pageAggregates[path] = { views: 0, title: pageData.title, totalScrollDepth: 0, scrollCount: 0, totalEngagement: 0, engagementCount: 0, exits: 0 }
                    }
                    pageAggregates[path].views += pageData.views
                    pageAggregates[path].totalScrollDepth += pageData.avgScrollDepth * pageData.scrollCount
                    pageAggregates[path].scrollCount += pageData.scrollCount
                    pageAggregates[path].totalEngagement += pageData.totalEngagement
                    pageAggregates[path].engagementCount += pageData.engagementCount
                    pageAggregates[path].exits += pageData.exits
                }
                
                // Merge content type exits
                for (const [type, count] of Object.entries(parsed.contentTypeExits || {})) {
                    stats.contentTypeExits[type] = (stats.contentTypeExits[type] || 0) + (count as number)
                }
                
                // Count active users (heartbeat within last 2 minutes)
                if (i === 0) { // Only for today
                    const now = Date.now()
                    for (const timestamp of Object.values(parsed.activeUsers || {})) {
                        const lastSeen = new Date(timestamp as string).getTime()
                        if (now - lastSeen < 2 * 60 * 1000) {
                            stats.activeUsers++
                        }
                    }
                }
                
                // Daily stats
                stats.dailyStats.push({
                    date: dateKey,
                    pageviews: parsed.totalPageviews || 0,
                    visitors: (parsed.uniqueVisitors || []).length,
                    sessions: (parsed.uniqueSessions || []).length,
                })
            } else {
                stats.dailyStats.push({
                    date: dateKey,
                    pageviews: 0,
                    visitors: 0,
                    sessions: 0,
                })
            }
        }
        
        stats.uniqueVisitors = allVisitors.size
        stats.uniqueSessions = allSessions.size
        
        // Build top pages with calculated metrics
        stats.topPages = Object.entries(pageAggregates)
            .map(([path, data]) => ({
                path,
                title: data.title,
                views: data.views,
                avgScrollDepth: data.scrollCount > 0 ? Math.round(data.totalScrollDepth / data.scrollCount) : 0,
                avgEngagement: data.engagementCount > 0 ? Math.round(data.totalEngagement / data.engagementCount / 1000) : 0, // in seconds
                exitRate: data.views > 0 ? Math.round((data.exits / data.views) * 100) : 0,
            }))
            .sort((a, b) => b.views - a.views)
            .slice(0, role === 'executive' ? 5 : 20) // Executive sees top 5, analyst sees top 20
        
        // Reverse daily stats for chronological order
        stats.dailyStats.reverse()
        
        return jsonResponse(stats)
    } catch (error) {
        console.error('Analytics GET error:', error)
        return jsonResponse({ error: 'Failed to fetch analytics' }, 500)
    }
}

// OPTIONS - CORS preflight
export const onRequestOptions: PagesFunction = async () => {
    return new Response(null, { headers: corsHeaders })
}
