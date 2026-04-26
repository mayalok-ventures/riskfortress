// Cloudflare Pages Function: dynamic XML sitemap
// Serves at /sitemap.xml and overrides the static public/sitemap.xml
import { queryDocs } from './lib/firestore'

interface Env {}

const BASE_URL = 'https://riskfortress.in'

const STATIC_PAGES: Array<{ loc: string; priority: string; changefreq: string }> = [
  { loc: '/', priority: '1.0', changefreq: 'weekly' },
  { loc: '/capabilities/', priority: '0.9', changefreq: 'monthly' },
  { loc: '/council/', priority: '0.8', changefreq: 'monthly' },
  { loc: '/mandate/', priority: '0.8', changefreq: 'monthly' },
  { loc: '/dossiers/', priority: '0.8', changefreq: 'daily' },
  { loc: '/secure-intake/', priority: '0.6', changefreq: 'monthly' },
  { loc: '/privacy/', priority: '0.4', changefreq: 'yearly' },
  { loc: '/terms/', priority: '0.4', changefreq: 'yearly' },
]

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return new Date().toISOString().split('T')[0]
  try {
    return new Date(dateStr).toISOString().split('T')[0]
  } catch {
    return new Date().toISOString().split('T')[0]
  }
}

export const onRequest: PagesFunction<Env> = async () => {
  try {
    // Fetch all published articles and blogs (NOT cases — they are email-gated)
    const snap = await queryDocs(
      'content',
      [
        { field: 'status', op: '==', value: 'published' },
      ],
      'publishedAt',
      'desc'
    )

    const dynamicUrls: string[] = []

    for (const doc of snap.docs) {
      const data = doc.data() as Record<string, unknown>
      const type = data.type as string
      const slug = data.slug as string

      // Only expose articles and blogs — cases are behind email gate
      if ((type === 'article' || type === 'blog') && slug && slug !== '_placeholder') {
        const publishedAt = formatDate(data.publishedAt as string | undefined)
        const updatedAt = formatDate(data.updatedAt as string | undefined)
        const lastmod = updatedAt > publishedAt ? updatedAt : publishedAt
        const priority = type === 'article' ? '0.85' : '0.75'

        dynamicUrls.push(`  <url>
    <loc>${BASE_URL}/dossiers/${escapeXml(slug)}/</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`)
      }
    }

    // Build static URL entries
    const staticEntries = STATIC_PAGES.map(
      (page) =>
        `  <url>
    <loc>${BASE_URL}${page.loc}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticEntries.join('\n')}
${dynamicUrls.join('\n')}
</urlset>`

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
        'X-Robots-Tag': 'noindex', // The sitemap itself shouldn't be indexed
      },
    })
  } catch (error) {
    console.error('Sitemap generation error:', error)

    // Fallback to a minimal static sitemap on error
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${BASE_URL}/</loc><priority>1.0</priority></url>
  <url><loc>${BASE_URL}/capabilities/</loc><priority>0.9</priority></url>
  <url><loc>${BASE_URL}/dossiers/</loc><priority>0.8</priority></url>
  <url><loc>${BASE_URL}/mandate/</loc><priority>0.8</priority></url>
  <url><loc>${BASE_URL}/council/</loc><priority>0.7</priority></url>
</urlset>`

    return new Response(fallback, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    })
  }
}
