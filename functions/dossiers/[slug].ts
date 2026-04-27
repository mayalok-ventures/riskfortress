// Cloudflare Pages Function: SSR for dossier slug routes
// - Articles & blogs: fully server-rendered with OG tags + JSON-LD schema
// - Cases (email-gated): serve _placeholder as before
// - Not found: 404

import { queryDocs } from '../lib/firestore'

interface Env {
  ASSETS: Fetcher
}

const SITE_URL = 'https://riskfortress.in'

function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeJson(str: string): string {
  return JSON.stringify(str)
}

function formatDateDisplay(dateStr: string | undefined): string {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function buildSSRPage(item: Record<string, unknown>, slug: string): string {
  const title = String(item.title || '')
  const summary = String(item.summary || '')
  const author = String(item.author || 'RiskFortress Intelligence Team')
  const thumbnail = item.thumbnail ? String(item.thumbnail) : `${SITE_URL}/og-image.png`
  const keywords = Array.isArray(item.keywords) ? (item.keywords as string[]) : []
  const publishedAt = String(item.publishedAt || item.createdAt || '')
  const updatedAt = String(item.updatedAt || publishedAt)
  // Two separate fields from the admin panel:
  //   - `content`     => rich-text "Text Article" body (always shown)
  //   - `htmlContent` => optional raw HTML "Structured View" (shown after the text)
  const textContent = String(item.content || '')
  const structuredHtml = String(item.htmlContent || '')
  const canonicalUrl = `${SITE_URL}/dossiers/${slug}/`
  const type = String(item.type || 'article')

  const schemaType = type === 'blog' ? 'BlogPosting' : 'Article'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    headline: title,
    description: summary,
    author: { '@type': 'Organization', name: author },
    publisher: {
      '@type': 'Organization',
      name: 'RiskFortress India',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/og-image.png` },
    },
    datePublished: publishedAt,
    dateModified: updatedAt,
    image: thumbnail,
    keywords: keywords.join(', '),
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    url: canonicalUrl,
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} | RiskFortress</title>
  <meta name="description" content="${escapeHtml(summary)}" />
  ${keywords.length ? `<meta name="keywords" content="${escapeHtml(keywords.join(', '))}" />` : ''}
  <link rel="canonical" href="${escapeHtml(canonicalUrl)}" />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(summary)}" />
  <meta property="og:url" content="${escapeHtml(canonicalUrl)}" />
  <meta property="og:image" content="${escapeHtml(thumbnail)}" />
  <meta property="og:site_name" content="RiskFortress India" />
  <meta property="og:locale" content="en_IN" />
  ${publishedAt ? `<meta property="article:published_time" content="${escapeHtml(publishedAt)}" />` : ''}
  ${updatedAt ? `<meta property="article:modified_time" content="${escapeHtml(updatedAt)}" />` : ''}
  ${keywords.map((k) => `<meta property="article:tag" content="${escapeHtml(k)}" />`).join('\n  ')}

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(summary)}" />
  <meta name="twitter:image" content="${escapeHtml(thumbnail)}" />

  <!-- JSON-LD Schema -->
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>

  <!-- Favicon -->
  <link rel="icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: #0a0b0f;
      color: #e2e8f0;
      line-height: 1.7;
      min-height: 100vh;
    }
    a { color: #c8a96e; text-decoration: none; }
    a:hover { text-decoration: underline; }

    .site-nav {
      background: rgba(10,11,15,0.95);
      border-bottom: 1px solid rgba(200,169,110,0.15);
      padding: 1rem 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(12px);
    }
    .site-nav .logo {
      font-size: 1.1rem;
      font-weight: 700;
      color: #c8a96e;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .site-nav .back-link {
      font-size: 0.85rem;
      color: #94a3b8;
    }
    .site-nav .back-link:hover { color: #c8a96e; }

    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 3rem 1.5rem 6rem;
    }

    .type-badge {
      display: inline-block;
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #c8a96e;
      border: 1px solid rgba(200,169,110,0.4);
      padding: 0.25rem 0.75rem;
      border-radius: 2px;
      margin-bottom: 1.25rem;
    }

    h1 {
      font-size: clamp(1.6rem, 4vw, 2.4rem);
      font-weight: 700;
      line-height: 1.25;
      color: #f1f5f9;
      margin-bottom: 1rem;
      letter-spacing: -0.01em;
    }

    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      font-size: 0.82rem;
      color: #64748b;
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .meta span { display: flex; align-items: center; gap: 0.35rem; }

    .summary-block {
      background: rgba(200,169,110,0.06);
      border-left: 3px solid #c8a96e;
      padding: 1.25rem 1.5rem;
      border-radius: 0 6px 6px 0;
      margin-bottom: 2.5rem;
      font-size: 1rem;
      color: #cbd5e1;
      font-style: italic;
      line-height: 1.6;
    }

    .article-body {
      font-size: 1rem;
      color: #cbd5e1;
    }
    .article-body h2 { font-size: 1.4rem; font-weight: 600; color: #f1f5f9; margin: 2.5rem 0 1rem; }
    .article-body h3 { font-size: 1.15rem; font-weight: 600; color: #e2e8f0; margin: 2rem 0 0.75rem; }
    .article-body p { margin-bottom: 1.25rem; }
    .article-body ul, .article-body ol { padding-left: 1.75rem; margin-bottom: 1.25rem; }
    .article-body li { margin-bottom: 0.4rem; }
    .article-body strong { color: #f1f5f9; font-weight: 600; }
    .article-body em { color: #94a3b8; }
    .article-body blockquote {
      border-left: 3px solid rgba(200,169,110,0.5);
      padding: 0.75rem 1.25rem;
      margin: 1.5rem 0;
      color: #94a3b8;
      background: rgba(255,255,255,0.02);
      border-radius: 0 4px 4px 0;
    }
    .article-body a { color: #c8a96e; }
    .article-body img { max-width: 100%; border-radius: 8px; margin: 1.5rem 0; }
    .article-body pre {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 6px;
      padding: 1.25rem;
      overflow-x: auto;
      font-size: 0.875rem;
      margin-bottom: 1.25rem;
    }
    .article-body code {
      background: rgba(200,169,110,0.1);
      padding: 0.15em 0.4em;
      border-radius: 3px;
      font-size: 0.875em;
      color: #c8a96e;
    }
    .article-body pre code { background: none; padding: 0; color: inherit; }

    .structured-view {
      margin-top: 3rem;
      padding-top: 2rem;
    }
    .structured-divider {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      margin-bottom: 1.5rem;
    }
    .structured-divider::before,
    .structured-divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: rgba(200,169,110,0.18);
    }
    .structured-label {
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #c8a96e;
    }
    .structured-body {
      background: rgba(200,169,110,0.04);
      border: 1px solid rgba(200,169,110,0.12);
      border-radius: 8px;
      padding: 1.75rem;
    }

    .keywords-section {
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.06);
    }
    .keywords-section h3 { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: #475569; margin-bottom: 0.75rem; }
    .keywords-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
    .keyword-tag {
      font-size: 0.75rem;
      padding: 0.25rem 0.6rem;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 3px;
      color: #64748b;
    }

    .cta-section {
      margin-top: 3rem;
      padding: 2rem;
      background: rgba(200,169,110,0.05);
      border: 1px solid rgba(200,169,110,0.15);
      border-radius: 8px;
      text-align: center;
    }
    .cta-section p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 1rem; }
    .cta-btn {
      display: inline-block;
      padding: 0.65rem 1.5rem;
      background: #c8a96e;
      color: #0a0b0f;
      font-weight: 600;
      font-size: 0.85rem;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border-radius: 4px;
      text-decoration: none;
    }
    .cta-btn:hover { background: #d4b87e; text-decoration: none; }

    @media (max-width: 640px) {
      .container { padding: 2rem 1rem 4rem; }
      .site-nav { padding: 0.75rem 1rem; }
    }
  </style>
</head>
<body>
  <nav class="site-nav">
    <a href="/" class="logo">RiskFortress</a>
    <a href="/dossiers/" class="back-link">← Intelligence Dossiers</a>
  </nav>

  <main class="container" id="main-content">
    <div class="type-badge">${escapeHtml(type === 'blog' ? 'Blog' : 'Intelligence Article')}</div>

    <h1>${escapeHtml(title)}</h1>

    <div class="meta">
      ${author ? `<span>By ${escapeHtml(author)}</span>` : ''}
      ${publishedAt ? `<span>Published ${escapeHtml(formatDateDisplay(publishedAt))}</span>` : ''}
    </div>

    ${summary ? `<div class="summary-block">${escapeHtml(summary)}</div>` : ''}

    ${textContent ? `<article class="article-body" id="text-article">
      ${textContent}
    </article>` : ''}

    ${structuredHtml ? `<section class="structured-view" id="structured-view" aria-label="Structured View">
      <div class="structured-divider">
        <span class="structured-label">Structured View</span>
      </div>
      <div class="article-body structured-body">
        ${structuredHtml}
      </div>
    </section>` : ''}

    ${keywords.length > 0 ? `
    <div class="keywords-section">
      <h3>Topics</h3>
      <div class="keywords-list">
        ${keywords.map((k) => `<span class="keyword-tag">${escapeHtml(k)}</span>`).join('')}
      </div>
    </div>` : ''}

    <div class="cta-section">
      <p>Access sensitive case intelligence and threat assessments through our secure intake process.</p>
      <a href="/secure-intake/" class="cta-btn">Request Secure Access</a>
    </div>
  </main>

  <!-- Client-side hydration will take over from here -->
  <script>
    // Signal to React that SSR content is available
    window.__RF_SSR__ = true;
    window.__RF_SLUG__ = ${escapeJson(slug)};
  </script>
</body>
</html>`
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  const slug = context.params.slug as string

  // Skip SSR for the placeholder route — serve asset directly
  if (!slug || slug === '_placeholder') {
    try {
      const placeholderUrl = new URL('/dossiers/_placeholder/', url.origin)
      const response = await context.env.ASSETS.fetch(placeholderUrl)
      return new Response(response.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=60, s-maxage=300',
        },
      })
    } catch {
      return new Response('Not Found', { status: 404 })
    }
  }

  try {
    // Look up the content from Firestore by slug + published status
    const snap = await queryDocs('content', [
      { field: 'slug', op: '==', value: slug },
      { field: 'status', op: '==', value: 'published' },
    ])

    if (snap.empty) {
      // No published content found for this slug — 404
      return new Response(
        `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>Not Found | RiskFortress</title></head><body style="background:#0a0b0f;color:#e2e8f0;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;flex-direction:column;gap:1rem"><h1 style="color:#c8a96e">404</h1><p>This dossier could not be found.</p><a href="/dossiers/" style="color:#c8a96e">← Back to Dossiers</a></body></html>`,
        {
          status: 404,
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        }
      )
    }

    const doc = snap.docs[0]
    const item = { id: doc.id, ...doc.data() } as Record<string, unknown>
    const type = String(item.type || '')

    // Cases are email-gated — serve the placeholder so client-side handles the gate
    if (type === 'case') {
      try {
        const placeholderUrl = new URL('/dossiers/_placeholder/', url.origin)
        const response = await context.env.ASSETS.fetch(placeholderUrl)
        return new Response(response.body, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=60, s-maxage=300',
          },
        })
      } catch {
        return new Response('Not Found', { status: 404 })
      }
    }

    // Articles and blogs: return a fully server-rendered page
    if (type === 'article' || type === 'blog') {
      // Remove sensitive fields before rendering
      delete item.accessToken

      const html = buildSSRPage(item, slug)

      return new Response(html, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400',
          'X-Robots-Tag': 'index, follow',
        },
      })
    }

    // Unknown type — fall back to placeholder
    try {
      const placeholderUrl = new URL('/dossiers/_placeholder/', url.origin)
      const response = await context.env.ASSETS.fetch(placeholderUrl)
      return new Response(response.body, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      })
    } catch {
      return new Response('Not Found', { status: 404 })
    }
  } catch (error) {
    console.error('Dossier SSR error:', error)
    // On Firestore error, fall back to placeholder so client-side can recover
    try {
      const placeholderUrl = new URL('/dossiers/_placeholder/', url.origin)
      const response = await context.env.ASSETS.fetch(placeholderUrl)
      return new Response(response.body, {
        status: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      })
    } catch {
      return new Response('Service Unavailable', { status: 503 })
    }
  }
}
