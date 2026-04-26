// GET /api/content/related?slug=<current-slug>&limit=5
// Returns top N related published content items ranked by:
//   1. Keyword overlap with current article (primary)
//   2. 30-day view count from analytics (secondary)
//   3. Recency (tertiary)

import { queryDocs, getDoc } from '../../lib/firestore'

interface Env {}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  })
}

function getDateKey(daysAgo: number): string {
  const d = new Date()
  d.setDate(d.getDate() - daysAgo)
  return d.toISOString().split('T')[0]
}

// Fetch aggregated view counts for dossier paths from recent analytics
async function getViewCounts(): Promise<Record<string, number>> {
  const views: Record<string, number> = {}
  // Look back 30 days — iterate last 30 date keys
  const fetches = Array.from({ length: 30 }, (_, i) => getDateKey(i)).map(async (dateKey) => {
    try {
      const snap = await getDoc('analytics_stats', dateKey)
      if (!snap.exists) return
      const data = snap.data() as Record<string, unknown>
      const pages = (data.pages || {}) as Record<string, { views: number }>
      for (const [path, pageData] of Object.entries(pages)) {
        if (path.startsWith('/dossiers/')) {
          const slug = path.replace('/dossiers/', '').replace(/\/$/, '')
          views[slug] = (views[slug] || 0) + (pageData.views || 0)
        }
      }
    } catch { /* ignore individual day errors */ }
  })
  await Promise.all(fetches)
  return views
}

function keywordOverlap(a: string[], b: string[]): number {
  if (!a?.length || !b?.length) return 0
  const setA = new Set(a.map((k) => k.toLowerCase().trim()))
  return b.filter((k) => setA.has(k.toLowerCase().trim())).length
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  const slug = url.searchParams.get('slug')
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '5'), 10)

  if (!slug) return json({ error: 'slug is required' }, 400)

  try {
    // Fetch the current article to get its keywords, type, sector
    const currentSnap = await queryDocs('content', [
      { field: 'slug', op: '==', value: slug },
      { field: 'status', op: '==', value: 'published' },
    ])
    if (currentSnap.empty) return json({ error: 'Not found' }, 404)

    const currentDoc = currentSnap.docs[0]
    const current = currentDoc.data() as Record<string, unknown>
    const currentKeywords = (current.keywords as string[]) || []
    const currentSector = (current.sector as string) || ''

    // Fetch all published content
    const allSnap = await queryDocs(
      'content',
      [{ field: 'status', op: '==', value: 'published' }],
      'publishedAt',
      'desc'
    )

    // Fetch view counts from analytics in parallel
    const viewCounts = await getViewCounts()

    // Max views across all slugs for normalisation
    const maxViews = Math.max(1, ...Object.values(viewCounts))

    const now = Date.now()
    // Max age: oldest possible date for normalisation (2 years)
    const MAX_AGE_MS = 2 * 365 * 24 * 60 * 60 * 1000

    const scored = allSnap.docs
      .filter((d) => d.id !== currentDoc.id) // exclude self
      .map((d) => {
        const item = d.data() as Record<string, unknown>
        const itemSlug = item.slug as string
        const keywords = (item.keywords as string[]) || []

        // 1. Keyword overlap (0–10, weight 50%)
        const overlap = keywordOverlap(currentKeywords, keywords)
        const maxPossibleOverlap = Math.max(currentKeywords.length, 1)
        const keywordScore = Math.min(overlap / maxPossibleOverlap, 1) * 10

        // 2. Same sector bonus (+2 points)
        const sectorBonus = currentSector && item.sector === currentSector ? 2 : 0

        // 3. Popularity — normalised view count (0–5, weight 25%)
        const views = viewCounts[itemSlug] || 0
        const popularityScore = (views / maxViews) * 5

        // 4. Recency — articles published more recently score higher (0–3, weight 15%)
        const publishedAt = new Date(
          (item.publishedAt as string) || (item.createdAt as string)
        ).getTime()
        const ageMs = Math.max(0, now - publishedAt)
        const recencyScore = Math.max(0, (1 - ageMs / MAX_AGE_MS)) * 3

        const totalScore = keywordScore + sectorBonus + popularityScore + recencyScore

        return {
          id: d.id,
          slug: itemSlug,
          type: item.type as string,
          title: item.title as string,
          summary: item.summary as string,
          thumbnail: item.thumbnail as string | undefined,
          author: item.author as string,
          publishedAt: (item.publishedAt as string) || (item.createdAt as string),
          sector: item.sector as string | undefined,
          threatLevel: item.threatLevel as string | undefined,
          keywords,
          views,
          _score: totalScore,
        }
      })
      .sort((a, b) => b._score - a._score)
      .slice(0, limit)
      .map(({ _score: _, views: __, ...item }) => item) // strip internal scoring fields

    return json(scored)
  } catch (error) {
    console.error('Related content error:', error)
    return json({ error: 'Failed to fetch related content' }, 500)
  }
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { headers: corsHeaders })
}
