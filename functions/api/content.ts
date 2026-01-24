// Cloudflare Pages Function for content storage using D1 Database

interface Env {
    RF_DB: D1Database
}

interface ContentItem {
    id: string
    type: 'case' | 'article' | 'blog'
    title: string
    slug: string
    content: string
    summary: string
    thumbnail?: string
    images?: string[]
    author: string
    keywords: string[]
    status: 'draft' | 'published' | 'archived'
    createdAt: string
    updatedAt: string
    publishedAt?: string
    sector?: string
    threatLevel?: 'Low' | 'Medium' | 'High' | 'Critical'
    confidence?: number
    location?: string
    caseStatus?: 'Active' | 'Monitoring' | 'Neutralized' | 'Resolved' | 'Ongoing'
}

interface DBRow {
    id: string
    type: string
    title: string
    slug: string
    content: string
    summary: string
    thumbnail: string | null
    images: string | null
    author: string
    keywords: string | null
    status: string
    created_at: string
    updated_at: string
    published_at: string | null
    sector: string | null
    threat_level: string | null
    confidence: number | null
    location: string | null
    case_status: string | null
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
}

function dbRowToContentItem(row: DBRow): ContentItem {
    return {
        id: row.id,
        type: row.type as ContentItem['type'],
        title: row.title,
        slug: row.slug,
        content: row.content,
        summary: row.summary,
        thumbnail: row.thumbnail || undefined,
        images: row.images ? JSON.parse(row.images) : undefined,
        author: row.author,
        keywords: row.keywords ? JSON.parse(row.keywords) : [],
        status: row.status as ContentItem['status'],
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        publishedAt: row.published_at || undefined,
        sector: row.sector || undefined,
        threatLevel: row.threat_level as ContentItem['threatLevel'] || undefined,
        confidence: row.confidence || undefined,
        location: row.location || undefined,
        caseStatus: row.case_status as ContentItem['caseStatus'] || undefined,
    }
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

// Initialize database table if not exists
async function initDB(db: D1Database) {
    await db.exec(`
        CREATE TABLE IF NOT EXISTS content (
            id TEXT PRIMARY KEY,
            type TEXT NOT NULL CHECK(type IN ('case', 'article', 'blog')),
            title TEXT NOT NULL,
            slug TEXT NOT NULL UNIQUE,
            content TEXT NOT NULL DEFAULT '',
            summary TEXT NOT NULL DEFAULT '',
            thumbnail TEXT,
            images TEXT,
            author TEXT NOT NULL DEFAULT 'RiskFortress Intelligence Team',
            keywords TEXT,
            status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published', 'archived')),
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            published_at TEXT,
            sector TEXT,
            threat_level TEXT,
            confidence INTEGER,
            location TEXT,
            case_status TEXT
        )
    `)
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        const db = context.env.RF_DB
        await initDB(db)
        
        const url = new URL(context.request.url)
        const publishedOnly = url.searchParams.get('published') === 'true'
        const id = url.searchParams.get('id')
        const slug = url.searchParams.get('slug')
        
        // Return single item by ID
        if (id) {
            const result = await db.prepare('SELECT * FROM content WHERE id = ?').bind(id).first<DBRow>()
            if (!result) {
                return new Response(JSON.stringify({ error: 'Content not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                })
            }
            return new Response(JSON.stringify(dbRowToContentItem(result)), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            })
        }
        
        // Return single item by slug (published only)
        if (slug) {
            const result = await db.prepare('SELECT * FROM content WHERE slug = ? AND status = ?')
                .bind(slug, 'published')
                .first<DBRow>()
            if (!result) {
                return new Response(JSON.stringify({ error: 'Content not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                })
            }
            return new Response(JSON.stringify(dbRowToContentItem(result)), {
                headers: { 
                    'Content-Type': 'application/json', 
                    'Cache-Control': 'public, max-age=60, s-maxage=300',
                    ...corsHeaders,
                },
            })
        }
        
        // Return all items
        let query = 'SELECT * FROM content'
        if (publishedOnly) {
            query += ' WHERE status = \'published\''
        }
        query += ' ORDER BY COALESCE(published_at, created_at) DESC'
        
        const { results } = await db.prepare(query).all<DBRow>()
        const items = (results || []).map(dbRowToContentItem)
        
        return new Response(JSON.stringify(items), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': publishedOnly ? 'public, max-age=60, s-maxage=300' : 'no-cache',
                ...corsHeaders,
            },
        })
    } catch (error) {
        console.error('GET error:', error)
        return new Response(JSON.stringify({ error: 'Failed to fetch content', details: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
    }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const db = context.env.RF_DB
        await initDB(db)
        
        const body = await context.request.json() as Partial<ContentItem>
        
        // Generate unique slug
        const baseSlug = generateSlug(body.title || 'untitled')
        let slug = baseSlug
        let counter = 1
        
        while (true) {
            const existing = await db.prepare('SELECT id FROM content WHERE slug = ?').bind(slug).first()
            if (!existing) break
            slug = `${baseSlug}-${counter}`
            counter++
        }
        
        const now = new Date().toISOString()
        const id = `rf-${body.type}-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`
        
        const newItem: ContentItem = {
            id,
            type: body.type || 'article',
            title: body.title || '',
            slug,
            content: body.content || '',
            summary: body.summary || '',
            thumbnail: body.thumbnail,
            images: body.images,
            author: body.author || 'RiskFortress Intelligence Team',
            keywords: body.keywords || [],
            status: body.status || 'draft',
            createdAt: now,
            updatedAt: now,
            publishedAt: body.status === 'published' ? now : undefined,
            sector: body.sector,
            threatLevel: body.threatLevel,
            confidence: body.confidence,
            location: body.location,
            caseStatus: body.caseStatus,
        }
        
        await db.prepare(`
            INSERT INTO content (
                id, type, title, slug, content, summary, thumbnail, images, author, keywords,
                status, created_at, updated_at, published_at, sector, threat_level, confidence, location, case_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            newItem.id,
            newItem.type,
            newItem.title,
            newItem.slug,
            newItem.content,
            newItem.summary,
            newItem.thumbnail || null,
            newItem.images ? JSON.stringify(newItem.images) : null,
            newItem.author,
            JSON.stringify(newItem.keywords),
            newItem.status,
            newItem.createdAt,
            newItem.updatedAt,
            newItem.publishedAt || null,
            newItem.sector || null,
            newItem.threatLevel || null,
            newItem.confidence || null,
            newItem.location || null,
            newItem.caseStatus || null
        ).run()
        
        return new Response(JSON.stringify(newItem), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
    } catch (error) {
        console.error('POST error:', error)
        return new Response(JSON.stringify({ error: 'Failed to create content', details: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
    }
}

export const onRequestPut: PagesFunction<Env> = async (context) => {
    try {
        const db = context.env.RF_DB
        await initDB(db)
        
        const body = await context.request.json() as { id: string } & Partial<ContentItem>
        
        // Get existing item
        const existing = await db.prepare('SELECT * FROM content WHERE id = ?').bind(body.id).first<DBRow>()
        if (!existing) {
            return new Response(JSON.stringify({ error: 'Content not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            })
        }
        
        const now = new Date().toISOString()
        const wasPublished = existing.status === 'published'
        const isNowPublished = body.status === 'published'
        const publishedAt = isNowPublished && !wasPublished ? now : existing.published_at
        
        await db.prepare(`
            UPDATE content SET
                title = ?, content = ?, summary = ?, thumbnail = ?, images = ?, author = ?, keywords = ?,
                status = ?, updated_at = ?, published_at = ?, sector = ?, threat_level = ?, 
                confidence = ?, location = ?, case_status = ?
            WHERE id = ?
        `).bind(
            body.title ?? existing.title,
            body.content ?? existing.content,
            body.summary ?? existing.summary,
            body.thumbnail ?? existing.thumbnail,
            body.images ? JSON.stringify(body.images) : existing.images,
            body.author ?? existing.author,
            body.keywords ? JSON.stringify(body.keywords) : existing.keywords,
            body.status ?? existing.status,
            now,
            publishedAt,
            body.sector ?? existing.sector,
            body.threatLevel ?? existing.threat_level,
            body.confidence ?? existing.confidence,
            body.location ?? existing.location,
            body.caseStatus ?? existing.case_status,
            body.id
        ).run()
        
        // Fetch and return updated item
        const updated = await db.prepare('SELECT * FROM content WHERE id = ?').bind(body.id).first<DBRow>()
        
        return new Response(JSON.stringify(dbRowToContentItem(updated!)), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
    } catch (error) {
        console.error('PUT error:', error)
        return new Response(JSON.stringify({ error: 'Failed to update content', details: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
    }
}

export const onRequestDelete: PagesFunction<Env> = async (context) => {
    try {
        const db = context.env.RF_DB
        
        const url = new URL(context.request.url)
        const id = url.searchParams.get('id')
        
        if (!id) {
            return new Response(JSON.stringify({ error: 'ID required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            })
        }
        
        await db.prepare('DELETE FROM content WHERE id = ?').bind(id).run()
        
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
    } catch (error) {
        console.error('DELETE error:', error)
        return new Response(JSON.stringify({ error: 'Failed to delete content', details: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
    }
}

export const onRequestOptions: PagesFunction = async () => {
    return new Response(null, {
        headers: corsHeaders,
    })
}
