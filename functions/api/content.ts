// Cloudflare Pages Function for content storage
// Uses D1 for metadata + KV for large content (up to 25MB)

interface Env {
    RF_DB: D1Database
    RF_CONTENT: KVNamespace
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

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

function jsonResponse(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
}

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim() || 'untitled'
}

// Initialize DB schema
let dbInitialized = false
async function ensureDB(db: D1Database): Promise<void> {
    if (dbInitialized) return
    
    try {
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS content (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                title TEXT NOT NULL,
                slug TEXT NOT NULL UNIQUE,
                summary TEXT NOT NULL DEFAULT '',
                thumbnail TEXT,
                images TEXT,
                author TEXT NOT NULL DEFAULT 'RiskFortress Intelligence Team',
                keywords TEXT,
                status TEXT NOT NULL DEFAULT 'draft',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                published_at TEXT,
                sector TEXT,
                threat_level TEXT,
                confidence INTEGER,
                location TEXT,
                case_status TEXT
            )
        `).run()
        dbInitialized = true
    } catch (e) {
        console.log('DB init:', e)
        dbInitialized = true
    }
}

// Convert DB row to ContentItem (content fetched from KV separately)
function dbRowToItem(row: DBRow, content: string): ContentItem {
    return {
        id: row.id,
        type: row.type as ContentItem['type'],
        title: row.title,
        slug: row.slug,
        content,
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

// GET - Fetch content
export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        const db = context.env.RF_DB
        const kv = context.env.RF_CONTENT
        await ensureDB(db)
        
        const url = new URL(context.request.url)
        const publishedOnly = url.searchParams.get('published') === 'true'
        const id = url.searchParams.get('id')
        const slug = url.searchParams.get('slug')
        
        // Single item by ID
        if (id) {
            const row = await db.prepare('SELECT * FROM content WHERE id = ?').bind(id).first<DBRow>()
            if (!row) return jsonResponse({ error: 'Not found' }, 404)
            
            const content = await kv.get(`content:${id}`) || ''
            return jsonResponse(dbRowToItem(row, content))
        }
        
        // Single item by slug
        if (slug) {
            const row = await db.prepare(
                'SELECT * FROM content WHERE slug = ? AND status = ?'
            ).bind(slug, 'published').first<DBRow>()
            if (!row) return jsonResponse({ error: 'Not found' }, 404)
            
            const content = await kv.get(`content:${row.id}`) || ''
            return jsonResponse(dbRowToItem(row, content))
        }
        
        // List all items
        let query = 'SELECT * FROM content'
        if (publishedOnly) query += " WHERE status = 'published'"
        query += ' ORDER BY COALESCE(published_at, created_at) DESC'
        
        const { results } = await db.prepare(query).all<DBRow>()
        
        // Fetch content from KV for each item
        const items: ContentItem[] = []
        for (const row of results || []) {
            const content = await kv.get(`content:${row.id}`) || ''
            items.push(dbRowToItem(row, content))
        }
        
        return jsonResponse(items)
    } catch (error) {
        console.error('GET error:', error)
        return jsonResponse({ error: 'Failed to fetch', details: String(error) }, 500)
    }
}

// POST - Create new content
export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const db = context.env.RF_DB
        const kv = context.env.RF_CONTENT
        await ensureDB(db)
        
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
        const id = `rf-${body.type || 'article'}-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`
        
        // Store content in KV (handles up to 25MB)
        const content = body.content || ''
        await kv.put(`content:${id}`, content)
        
        // Store metadata in D1
        await db.prepare(`
            INSERT INTO content (
                id, type, title, slug, summary, thumbnail, images, author, keywords,
                status, created_at, updated_at, published_at, sector, threat_level, 
                confidence, location, case_status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            id,
            body.type || 'article',
            body.title || '',
            slug,
            body.summary || '',
            body.thumbnail || null,
            body.images ? JSON.stringify(body.images) : null,
            body.author || 'RiskFortress Intelligence Team',
            JSON.stringify(body.keywords || []),
            body.status || 'draft',
            now,
            now,
            body.status === 'published' ? now : null,
            body.sector || null,
            body.threatLevel || null,
            body.confidence || null,
            body.location || null,
            body.caseStatus || null
        ).run()
        
        return jsonResponse({
            id,
            type: body.type || 'article',
            title: body.title || '',
            slug,
            content,
            summary: body.summary || '',
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
            thumbnail: body.thumbnail,
            images: body.images
        })
    } catch (error) {
        console.error('POST error:', error)
        return jsonResponse({ error: 'Failed to create', details: String(error) }, 500)
    }
}

// PUT - Update content
export const onRequestPut: PagesFunction<Env> = async (context) => {
    try {
        const db = context.env.RF_DB
        const kv = context.env.RF_CONTENT
        await ensureDB(db)
        
        const body = await context.request.json() as { id: string } & Partial<ContentItem>
        
        const existing = await db.prepare('SELECT * FROM content WHERE id = ?').bind(body.id).first<DBRow>()
        if (!existing) return jsonResponse({ error: 'Not found' }, 404)
        
        const now = new Date().toISOString()
        const wasPublished = existing.status === 'published'
        const isNowPublished = body.status === 'published'
        const publishedAt = isNowPublished && !wasPublished ? now : existing.published_at
        
        // Update content in KV if provided
        if (body.content !== undefined) {
            await kv.put(`content:${body.id}`, body.content)
        }
        
        // Update metadata in D1
        await db.prepare(`
            UPDATE content SET
                title = ?, summary = ?, thumbnail = ?, images = ?, 
                author = ?, keywords = ?, status = ?, updated_at = ?, published_at = ?,
                sector = ?, threat_level = ?, confidence = ?, location = ?, case_status = ?
            WHERE id = ?
        `).bind(
            body.title ?? existing.title,
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
        const content = await kv.get(`content:${body.id}`) || ''
        
        return jsonResponse(dbRowToItem(updated!, content))
    } catch (error) {
        console.error('PUT error:', error)
        return jsonResponse({ error: 'Failed to update', details: String(error) }, 500)
    }
}

// DELETE - Remove content
export const onRequestDelete: PagesFunction<Env> = async (context) => {
    try {
        const db = context.env.RF_DB
        const kv = context.env.RF_CONTENT
        
        const url = new URL(context.request.url)
        const id = url.searchParams.get('id')
        
        if (!id) return jsonResponse({ error: 'ID required' }, 400)
        
        // Delete from KV
        await kv.delete(`content:${id}`)
        
        // Delete from D1
        await db.prepare('DELETE FROM content WHERE id = ?').bind(id).run()
        
        return jsonResponse({ success: true })
    } catch (error) {
        console.error('DELETE error:', error)
        return jsonResponse({ error: 'Failed to delete' }, 500)
    }
}

// OPTIONS - CORS preflight
export const onRequestOptions: PagesFunction = async () => {
    return new Response(null, { headers: corsHeaders })
}
