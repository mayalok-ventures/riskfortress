// Cloudflare Pages Function for content storage using D1 Database
// Optimized for D1's constraints with small chunk sizes

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
    is_chunked: number
    total_chunks: number | null
}

interface ChunkUploadRequest {
    id: string
    chunkIndex: number
    totalChunks: number
    data: string
}

interface ChunkCommitRequest {
    id: string
    totalChunks: number
    contentPreview?: string
}

// CORS headers for all responses
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

// Helper for consistent JSON responses with CORS
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

// Memoize DB initialization
let dbInitialized = false

async function ensureDB(db: D1Database): Promise<void> {
    if (dbInitialized) return
    
    try {
        // Main content table
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS content (
                id TEXT PRIMARY KEY,
                type TEXT NOT NULL,
                title TEXT NOT NULL,
                slug TEXT NOT NULL UNIQUE,
                content TEXT NOT NULL DEFAULT '',
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
                case_status TEXT,
                is_chunked INTEGER DEFAULT 0,
                total_chunks INTEGER DEFAULT 0
            )
        `).run()
        
        // Chunks table for large content
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS content_chunks (
                id TEXT PRIMARY KEY,
                content_id TEXT NOT NULL,
                chunk_index INTEGER NOT NULL,
                chunk_data TEXT NOT NULL,
                UNIQUE(content_id, chunk_index)
            )
        `).run()
        
        // Index for faster chunk retrieval
        await db.prepare(`
            CREATE INDEX IF NOT EXISTS idx_chunks_content ON content_chunks(content_id, chunk_index)
        `).run()
        
        dbInitialized = true
    } catch (e) {
        console.log('DB init:', e)
        dbInitialized = true // Don't retry on failure
    }
}

// Get full content including assembled chunks
async function getFullContent(db: D1Database, row: DBRow): Promise<ContentItem> {
    let content = row.content
    
    if (row.is_chunked && row.total_chunks && row.total_chunks > 0) {
        try {
            const chunks = await db.prepare(
                'SELECT chunk_data FROM content_chunks WHERE content_id = ? ORDER BY chunk_index'
            ).bind(row.id).all<{ chunk_data: string }>()
            
            if (chunks.results && chunks.results.length > 0) {
                content = chunks.results.map(c => c.chunk_data).join('')
            }
        } catch (e) {
            console.error('Error fetching chunks:', e)
        }
    }
    
    return { ...dbRowToContentItem(row), content }
}

// Handle single chunk upload
async function handleChunkUpload(db: D1Database, body: ChunkUploadRequest): Promise<Response> {
    const { id, chunkIndex, totalChunks, data } = body
    
    if (!id || chunkIndex === undefined || !totalChunks || !data) {
        return jsonResponse({ error: 'Missing required fields' }, 400)
    }
    
    if (chunkIndex < 0 || chunkIndex >= totalChunks) {
        return jsonResponse({ error: 'Invalid chunk index' }, 400)
    }
    
    try {
        // Verify content exists
        const existing = await db.prepare('SELECT id FROM content WHERE id = ?').bind(id).first()
        if (!existing) {
            return jsonResponse({ error: 'Content not found' }, 404)
        }
        
        // Insert or replace chunk
        const chunkId = `${id}-${chunkIndex}`
        await db.prepare(
            'INSERT OR REPLACE INTO content_chunks (id, content_id, chunk_index, chunk_data) VALUES (?, ?, ?, ?)'
        ).bind(chunkId, id, chunkIndex, data).run()
        
        // Update chunk count
        await db.prepare(
            'UPDATE content SET is_chunked = 1, total_chunks = ?, updated_at = ? WHERE id = ?'
        ).bind(totalChunks, new Date().toISOString(), id).run()
        
        return jsonResponse({ 
            success: true, 
            chunk: chunkIndex + 1,
            total: totalChunks
        })
    } catch (error) {
        console.error('Chunk upload error:', error)
        return jsonResponse({ 
            error: 'Failed to save chunk',
            details: error instanceof Error ? error.message : String(error)
        }, 500)
    }
}

// Commit chunks and finalize content
async function handleChunkCommit(db: D1Database, body: ChunkCommitRequest): Promise<Response> {
    const { id, totalChunks, contentPreview } = body
    
    if (!id || !totalChunks) {
        return jsonResponse({ error: 'Missing id or totalChunks' }, 400)
    }
    
    try {
        // Verify all chunks exist
        const result = await db.prepare(
            'SELECT COUNT(*) as count FROM content_chunks WHERE content_id = ?'
        ).bind(id).first<{ count: number }>()
        
        const receivedChunks = result?.count || 0
        
        if (receivedChunks !== totalChunks) {
            return jsonResponse({ 
                error: 'Incomplete upload',
                expected: totalChunks,
                received: receivedChunks
            }, 409)
        }
        
        // Update content record
        const preview = contentPreview || '[Chunked content]'
        await db.prepare(
            'UPDATE content SET content = ?, is_chunked = 1, total_chunks = ?, updated_at = ? WHERE id = ?'
        ).bind(preview, totalChunks, new Date().toISOString(), id).run()
        
        // Fetch and return the complete item
        const updated = await db.prepare('SELECT * FROM content WHERE id = ?').bind(id).first<DBRow>()
        if (!updated) {
            return jsonResponse({ error: 'Content not found' }, 404)
        }
        
        const fullItem = await getFullContent(db, updated)
        
        return jsonResponse({ 
            success: true,
            item: fullItem
        })
    } catch (error) {
        console.error('Commit error:', error)
        return jsonResponse({ 
            error: 'Failed to finalize',
            details: error instanceof Error ? error.message : String(error)
        }, 500)
    }
}

// GET handler
export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        const db = context.env.RF_DB
        await ensureDB(db)
        
        const url = new URL(context.request.url)
        const publishedOnly = url.searchParams.get('published') === 'true'
        const id = url.searchParams.get('id')
        const slug = url.searchParams.get('slug')
        
        // Single item by ID
        if (id) {
            const row = await db.prepare('SELECT * FROM content WHERE id = ?').bind(id).first<DBRow>()
            if (!row) {
                return jsonResponse({ error: 'Not found' }, 404)
            }
            return jsonResponse(await getFullContent(db, row))
        }
        
        // Single item by slug
        if (slug) {
            const row = await db.prepare(
                'SELECT * FROM content WHERE slug = ? AND status = ?'
            ).bind(slug, 'published').first<DBRow>()
            if (!row) {
                return jsonResponse({ error: 'Not found' }, 404)
            }
            return jsonResponse(await getFullContent(db, row))
        }
        
        // List all items
        let query = 'SELECT * FROM content'
        if (publishedOnly) {
            query += " WHERE status = 'published'"
        }
        query += ' ORDER BY COALESCE(published_at, created_at) DESC'
        
        const { results } = await db.prepare(query).all<DBRow>()
        
        const items: ContentItem[] = []
        for (const row of results || []) {
            items.push(row.is_chunked ? await getFullContent(db, row) : dbRowToContentItem(row))
        }
        
        return jsonResponse(items)
    } catch (error) {
        console.error('GET error:', error)
        return jsonResponse({ error: 'Failed to fetch' }, 500)
    }
}

// POST handler - create new content
export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const db = context.env.RF_DB
        await ensureDB(db)
        
        const body = await context.request.json() as Partial<ContentItem> & { chunkedUpload?: boolean }
        
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
        
        const isChunkedUpload = body.chunkedUpload === true
        
        await db.prepare(`
            INSERT INTO content (
                id, type, title, slug, content, summary, thumbnail, images, author, keywords,
                status, created_at, updated_at, published_at, sector, threat_level, 
                confidence, location, case_status, is_chunked, total_chunks
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            id,
            body.type || 'article',
            body.title || '',
            slug,
            isChunkedUpload ? '' : (body.content || ''),
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
            body.caseStatus || null,
            isChunkedUpload ? 1 : 0,
            0
        ).run()
        
        return jsonResponse({
            id,
            type: body.type || 'article',
            title: body.title || '',
            slug,
            status: body.status || 'draft',
            chunkedUpload: isChunkedUpload
        })
    } catch (error) {
        console.error('POST error:', error)
        return jsonResponse({ 
            error: 'Failed to create',
            details: error instanceof Error ? error.message : String(error)
        }, 500)
    }
}

// PATCH handler - chunk uploads
export const onRequestPatch: PagesFunction<Env> = async (context) => {
    try {
        const db = context.env.RF_DB
        await ensureDB(db)
        
        const url = new URL(context.request.url)
        const action = url.searchParams.get('action')
        const body = await context.request.json()
        
        if (action === 'chunk') {
            return await handleChunkUpload(db, body as ChunkUploadRequest)
        } else if (action === 'commit') {
            return await handleChunkCommit(db, body as ChunkCommitRequest)
        }
        
        return jsonResponse({ error: 'Invalid action' }, 400)
    } catch (error) {
        console.error('PATCH error:', error)
        return jsonResponse({ 
            error: 'Request failed',
            details: error instanceof Error ? error.message : String(error)
        }, 500)
    }
}

// PUT handler - update content
export const onRequestPut: PagesFunction<Env> = async (context) => {
    try {
        const db = context.env.RF_DB
        await ensureDB(db)
        
        const body = await context.request.json() as { id: string; chunkedUpload?: boolean } & Partial<ContentItem>
        
        const existing = await db.prepare('SELECT * FROM content WHERE id = ?').bind(body.id).first<DBRow>()
        if (!existing) {
            return jsonResponse({ error: 'Not found' }, 404)
        }
        
        const now = new Date().toISOString()
        const wasPublished = existing.status === 'published'
        const isNowPublished = body.status === 'published'
        const publishedAt = isNowPublished && !wasPublished ? now : existing.published_at
        
        const isChunkedUpload = body.chunkedUpload === true
        
        if (isChunkedUpload) {
            // Clear old chunks for fresh upload
            await db.prepare('DELETE FROM content_chunks WHERE content_id = ?').bind(body.id).run()
        }
        
        await db.prepare(`
            UPDATE content SET
                title = ?, content = ?, summary = ?, thumbnail = ?, images = ?, 
                author = ?, keywords = ?, status = ?, updated_at = ?, published_at = ?,
                sector = ?, threat_level = ?, confidence = ?, location = ?, case_status = ?,
                is_chunked = ?, total_chunks = ?
            WHERE id = ?
        `).bind(
            body.title ?? existing.title,
            isChunkedUpload ? '' : (body.content ?? existing.content),
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
            isChunkedUpload ? 1 : (existing.is_chunked || 0),
            isChunkedUpload ? 0 : (existing.total_chunks || 0),
            body.id
        ).run()
        
        if (isChunkedUpload) {
            return jsonResponse({ id: body.id, chunkedUpload: true })
        }
        
        const updated = await db.prepare('SELECT * FROM content WHERE id = ?').bind(body.id).first<DBRow>()
        return jsonResponse(await getFullContent(db, updated!))
    } catch (error) {
        console.error('PUT error:', error)
        return jsonResponse({ 
            error: 'Failed to update',
            details: error instanceof Error ? error.message : String(error)
        }, 500)
    }
}

// DELETE handler
export const onRequestDelete: PagesFunction<Env> = async (context) => {
    try {
        const db = context.env.RF_DB
        await ensureDB(db)
        
        const url = new URL(context.request.url)
        const id = url.searchParams.get('id')
        
        if (!id) {
            return jsonResponse({ error: 'ID required' }, 400)
        }
        
        // Delete chunks first
        await db.prepare('DELETE FROM content_chunks WHERE content_id = ?').bind(id).run()
        // Delete main content
        await db.prepare('DELETE FROM content WHERE id = ?').bind(id).run()
        
        return jsonResponse({ success: true })
    } catch (error) {
        console.error('DELETE error:', error)
        return jsonResponse({ error: 'Failed to delete' }, 500)
    }
}

// OPTIONS handler for CORS
export const onRequestOptions: PagesFunction = async () => {
    return new Response(null, { headers: corsHeaders })
}
