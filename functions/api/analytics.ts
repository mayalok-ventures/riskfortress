import { getDoc, setDoc, addDoc } from '../lib/firestore'

interface Env {}

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

function getDateKey(date?: Date): string {
  const d = date || new Date()
  return d.toISOString().split('T')[0]
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const event = (await context.request.json()) as AnalyticsEvent

    if (!event.type || !event.visitorId) {
      return jsonResponse({ error: 'Invalid event' }, 400)
    }

    const dateKey = getDateKey()

    await addDoc('analytics_events', {
      ...event,
      dateKey,
      recordedAt: new Date().toISOString(),
    })

    const statsSnap = await getDoc('analytics_stats', dateKey)
    const stats = statsSnap.exists
      ? (statsSnap.data() as Record<string, unknown>)
      : {
          date: dateKey,
          totalPageviews: 0,
          uniqueVisitors: [] as string[],
          uniqueSessions: [] as string[],
          newVisitors: 0,
          returningVisitors: 0,
          sources: {} as Record<string, number>,
          pages: {} as Record<
            string,
            {
              views: number
              title: string
              avgScrollDepth: number
              scrollCount: number
              totalEngagement: number
              engagementCount: number
              exits: number
            }
          >,
          contentTypeExits: {} as Record<string, number>,
          activeUsers: {} as Record<string, string>,
        }

    const uniqueVisitors = stats.uniqueVisitors as string[]
    const uniqueSessions = stats.uniqueSessions as string[]
    const sources = (stats.sources || {}) as Record<string, number>
    const pages = (stats.pages || {}) as Record<
      string,
      {
        views: number
        title: string
        avgScrollDepth: number
        scrollCount: number
        totalEngagement: number
        engagementCount: number
        exits: number
      }
    >
    const contentTypeExits = (stats.contentTypeExits || {}) as Record<string, number>
    const activeUsers = (stats.activeUsers || {}) as Record<string, string>

    switch (event.type) {
      case 'pageview': {
        stats.totalPageviews = ((stats.totalPageviews as number) || 0) + 1
        const wasNew = !uniqueVisitors.includes(event.visitorId)
        if (wasNew) uniqueVisitors.push(event.visitorId)
        if (!uniqueSessions.includes(event.sessionId)) uniqueSessions.push(event.sessionId)

        if (event.isNewVisitor) {
          stats.newVisitors = ((stats.newVisitors as number) || 0) + 1
        } else if (wasNew) {
          stats.returningVisitors = ((stats.returningVisitors as number) || 0) + 1
        }

        const source = (event.source as string) || 'Direct'
        sources[source] = (sources[source] || 0) + 1

        const path = event.path as string
        if (!pages[path]) {
          pages[path] = {
            views: 0,
            title: (event.title as string) || path,
            avgScrollDepth: 0,
            scrollCount: 0,
            totalEngagement: 0,
            engagementCount: 0,
            exits: 0,
          }
        }
        pages[path].views++
        break
      }

      case 'scroll': {
        const scrollPath = event.path as string
        const scrollDepth = event.scrollDepth as number
        if (pages[scrollPath]) {
          const page = pages[scrollPath]
          page.avgScrollDepth =
            (page.avgScrollDepth * page.scrollCount + scrollDepth) / (page.scrollCount + 1)
          page.scrollCount++
        }
        break
      }

      case 'engagement': {
        const engPath = event.path as string
        const engTime = event.engagementTimeMs as number
        if (pages[engPath]) {
          const page = pages[engPath]
          page.totalEngagement += engTime
          page.engagementCount++
        }
        break
      }

      case 'exit': {
        const exitPath = event.path as string
        const contentType = (event.contentType as string) || 'page'
        if (pages[exitPath]) {
          pages[exitPath].exits++
        }
        contentTypeExits[contentType] = (contentTypeExits[contentType] || 0) + 1
        break
      }

      case 'heartbeat': {
        activeUsers[event.visitorId] = event.timestamp
        break
      }
    }

    stats.uniqueVisitors = uniqueVisitors
    stats.uniqueSessions = uniqueSessions
    stats.sources = sources
    stats.pages = pages
    stats.contentTypeExits = contentTypeExits
    stats.activeUsers = activeUsers

    await setDoc('analytics_stats', dateKey, stats)

    return jsonResponse({ success: true })
  } catch (error) {
    console.error('Analytics POST error:', error)
    return jsonResponse({ error: 'Failed to record event' }, 500)
  }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url)
    const days = parseInt(url.searchParams.get('days') || '7')
    const role = url.searchParams.get('role') || 'analyst'

    const stats: {
      dates: string[]
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
    const pageAggregates: Record<
      string,
      {
        views: number
        title: string
        totalScrollDepth: number
        scrollCount: number
        totalEngagement: number
        engagementCount: number
        exits: number
      }
    > = {}

    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateKey = getDateKey(date)
      stats.dates.push(dateKey)

      const daySnap = await getDoc('analytics_stats', dateKey)
      if (daySnap.exists) {
        const parsed = daySnap.data()!

        stats.totalPageviews += (parsed.totalPageviews as number) || 0
        stats.newVisitors += (parsed.newVisitors as number) || 0
        stats.returningVisitors += (parsed.returningVisitors as number) || 0

        ;((parsed.uniqueVisitors as string[]) || []).forEach((v: string) => allVisitors.add(v))
        ;((parsed.uniqueSessions as string[]) || []).forEach((s: string) => allSessions.add(s))

        for (const [source, count] of Object.entries(
          (parsed.sources as Record<string, number>) || {}
        )) {
          stats.sources[source] = (stats.sources[source] || 0) + (count as number)
        }

        for (const [path, data] of Object.entries(
          (parsed.pages as Record<string, Record<string, unknown>>) || {}
        )) {
          const pageData = data as {
            views: number
            title: string
            avgScrollDepth: number
            scrollCount: number
            totalEngagement: number
            engagementCount: number
            exits: number
          }
          if (!pageAggregates[path]) {
            pageAggregates[path] = {
              views: 0,
              title: pageData.title,
              totalScrollDepth: 0,
              scrollCount: 0,
              totalEngagement: 0,
              engagementCount: 0,
              exits: 0,
            }
          }
          pageAggregates[path].views += pageData.views
          pageAggregates[path].totalScrollDepth +=
            pageData.avgScrollDepth * pageData.scrollCount
          pageAggregates[path].scrollCount += pageData.scrollCount
          pageAggregates[path].totalEngagement += pageData.totalEngagement
          pageAggregates[path].engagementCount += pageData.engagementCount
          pageAggregates[path].exits += pageData.exits
        }

        for (const [type, count] of Object.entries(
          (parsed.contentTypeExits as Record<string, number>) || {}
        )) {
          stats.contentTypeExits[type] = (stats.contentTypeExits[type] || 0) + (count as number)
        }

        if (i === 0) {
          const now = Date.now()
          for (const timestamp of Object.values(
            (parsed.activeUsers as Record<string, string>) || {}
          )) {
            const lastSeen = new Date(timestamp as string).getTime()
            if (now - lastSeen < 2 * 60 * 1000) {
              stats.activeUsers++
            }
          }
        }

        stats.dailyStats.push({
          date: dateKey,
          pageviews: (parsed.totalPageviews as number) || 0,
          visitors: ((parsed.uniqueVisitors as string[]) || []).length,
          sessions: ((parsed.uniqueSessions as string[]) || []).length,
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

    stats.topPages = Object.entries(pageAggregates)
      .map(([path, data]) => ({
        path,
        title: data.title,
        views: data.views,
        avgScrollDepth:
          data.scrollCount > 0 ? Math.round(data.totalScrollDepth / data.scrollCount) : 0,
        avgEngagement:
          data.engagementCount > 0
            ? Math.round(data.totalEngagement / data.engagementCount / 1000)
            : 0,
        exitRate: data.views > 0 ? Math.round((data.exits / data.views) * 100) : 0,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, role === 'executive' ? 5 : 20)

    stats.dailyStats.reverse()

    return jsonResponse(stats)
  } catch (error) {
    console.error('Analytics GET error:', error)
    return jsonResponse({ error: 'Failed to fetch analytics' }, 500)
  }
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { headers: corsHeaders })
}
