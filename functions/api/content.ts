// Cloudflare Pages Function for content storage using D1 Database
// Supports chunked uploads for large content (multi-MB cases/reports)

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

interface ContentChunk {
    id: string
    content_id: string
    chunk_index: number
    chunk_data: string
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

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Chunk-Upload',
}

// Maximum size for inline content (200KB - safe margin under request limits)
const MAX_INLINE_CONTENT_SIZE = 200 * 1024
// Chunk size for large content (150KB - leaves room for JSON overhead)
const CHUNK_SIZE = 150 * 1024
// Maximum request body size (Cloudflare limit is ~1MB, we use 900KB for safety)
const MAX_REQUEST_SIZE = 900 * 1024

// Initialize database tables
async function initDB(db: D1Database) {
    try {
        // Main content table with chunking support
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
        
        // Chunks table for large content with unique constraint for upserts
        await db.prepare(`
            CREATE TABLE IF NOT EXISTS content_chunks (
                id TEXT PRIMARY KEY,
                content_id TEXT NOT NULL,
                chunk_index INTEGER NOT NULL,
                chunk_data TEXT NOT NULL,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(content_id, chunk_index),
                FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
            )
        `).run()
        
        // Create index for faster chunk retrieval
        await db.prepare(`
            CREATE INDEX IF NOT EXISTS idx_chunks_content_id ON content_chunks(content_id, chunk_index)
        `).run()
        
        // Add total_chunks column if missing (migration for existing DBs)
        try {
            await db.prepare(`ALTER TABLE content ADD COLUMN total_chunks INTEGER DEFAULT 0`).run()
        } catch { /* Column already exists */ }
    } catch (e) {
        console.log('initDB:', e)
    }
}

// Get full content including chunks
async function getFullContent(db: D1Database, row: DBRow): Promise<ContentItem> {
    let content = row.content
    
    if (row.is_chunked && row.total_chunks && row.total_chunks > 0) {
        const chunks = await db.prepare(
            'SELECT chunk_data FROM content_chunks WHERE content_id = ? ORDER BY chunk_index'
        ).bind(row.id).all<{ chunk_data: string }>()
        
        if (chunks.results && chunks.results.length > 0) {
            content = chunks.results.map(c => c.chunk_data).join('')
        }
    }
    
    return {
        ...dbRowToContentItem(row),
        content
    }
}

// Save content with chunking for large content (used for inline small-medium content)
async function saveContentWithChunks(
    db: D1Database, 
    id: string, 
    content: string, 
    isUpdate: boolean
): Promise<{ mainContent: string; isChunked: boolean; totalChunks: number }> {
    // If content is small enough, no chunking needed
    if (content.length <= MAX_INLINE_CONTENT_SIZE) {
        if (isUpdate) {
            await db.prepare('DELETE FROM content_chunks WHERE content_id = ?').bind(id).run()
        }
        return { mainContent: content, isChunked: false, totalChunks: 0 }
    }
    
    // Content is medium-sized, use server-side chunking
    const chunks: string[] = []
    for (let i = 0; i < content.length; i += CHUNK_SIZE) {
        chunks.push(content.slice(i, i + CHUNK_SIZE))
    }
    
    // Delete existing chunks if updating
    if (isUpdate) {
        await db.prepare('DELETE FROM content_chunks WHERE content_id = ?').bind(id).run()
    }
    
    // Use batch insert for efficiency and to avoid timeouts
    const statements = chunks.map((chunkData, i) => {
        const chunkId = `${id}-chunk-${i}`
        return db.prepare(
            'INSERT OR REPLACE INTO content_chunks (id, content_id, chunk_index, chunk_data) VALUES (?, ?, ?, ?)'
        ).bind(chunkId, id, i, chunkData)
    })
    
    // Execute all inserts in a single batch
    await db.batch(statements)
    
    // Store preview in main content field
    const preview = content.slice(0, 500).replace(/<[^>]*>/g, '').slice(0, 200)
    return { 
        mainContent: preview + '... [Full content in chunks]', 
        isChunked: true,
        totalChunks: chunks.length
    }
}

// Handle chunk upload (for client-side chunked uploads of very large content)
async function handleChunkUpload(db: D1Database, body: ChunkUploadRequest): Promise<Response> {
    const { id, chunkIndex, totalChunks, data } = body
    
    // Validate request
    if (!id || chunkIndex === undefined || !totalChunks || !data) {
        return new Response(JSON.stringify({ 
            error: 'Invalid chunk upload request',
            required: ['id', 'chunkIndex', 'totalChunks', 'data']
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
    }
    
    if (chunkIndex < 0 || chunkIndex >= totalChunks) {
        return new Response(JSON.stringify({ 
            error: 'Invalid chunk index',
            chunkIndex,
            totalChunks
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
    }
    
    // Verify content exists
    const existing = await db.prepare('SELECT id FROM content WHERE id = ?').bind(id).first()
    if (!existing) {
        return new Response(JSON.stringify({ error: 'Content not found. Create content first.' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
    }
    
    // Insert or replace chunk (idempotent for retries)
    const chunkId = `${id}-chunk-${chunkIndex}`
    await db.prepare(
        'INSERT OR REPLACE INTO content_chunks (id, content_id, chunk_index, chunk_data) VALUES (?, ?, ?, ?)'
    ).bind(chunkId, id, chunkIndex, data).run()
    
    // Update total_chunks in content table
    await db.prepare(
        'UPDATE content SET is_chunked = 1, total_chunks = ?, updated_at = ? WHERE id = ?'
    ).bind(totalChunks, new Date().toISOString(), id).run()
    
    return new Response(JSON.stringify({ 
        success: true, 
        chunkIndex,
        totalChunks,
        message: `Chunk ${chunkIndex + 1}/${totalChunks} saved`
    }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
}

// Commit chunks and finalize content
async function handleChunkCommit(db: D1Database, body: ChunkCommitRequest): Promise<Response> {
    const { id, totalChunks, contentPreview } = body
    
    if (!id || !totalChunks) {
        return new Response(JSON.stringify({ error: 'Missing id or totalChunks' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
    }
    
    // Verify all chunks exist
    const chunkCount = await db.prepare(
        'SELECT COUNT(*) as count FROM content_chunks WHERE content_id = ?'
    ).bind(id).first<{ count: number }>()
    
    if (!chunkCount || chunkCount.count !== totalChunks) {
        return new Response(JSON.stringify({ 
            error: 'Incomplete upload',
            expected: totalChunks,
            received: chunkCount?.count || 0,
            message: 'Some chunks are missing. Please retry the upload.'
        }), {
            status: 409,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
    }
    
    // Update content record with preview and mark as complete
    const preview = contentPreview || '[Chunked content]'
    await db.prepare(
        'UPDATE content SET content = ?, is_chunked = 1, total_chunks = ?, updated_at = ? WHERE id = ?'
    ).bind(preview, totalChunks, new Date().toISOString(), id).run()
    
    // Fetch and return the complete item
    const updated = await db.prepare('SELECT * FROM content WHERE id = ?').bind(id).first<DBRow>()
    if (!updated) {
        return new Response(JSON.stringify({ error: 'Content not found after commit' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
    }
    
    const fullItem = await getFullContent(db, updated)
    
    return new Response(JSON.stringify({ 
        success: true,
        item: fullItem,
        message: `Content saved with ${totalChunks} chunks`
    }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
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
            const result = await db.prepare('SELECT * FROM content WHERE id = ?').bind(id).first<DBRow & { is_chunked: number }>()
            if (!result) {
                return new Response(JSON.stringify({ error: 'Content not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                })
            }
            const fullItem = await getFullContent(db, result)
            return new Response(JSON.stringify(fullItem), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            })
        }
        
        // Return single item by slug (published only)
        if (slug) {
            const result = await db.prepare('SELECT * FROM content WHERE slug = ? AND status = ?')
                .bind(slug, 'published')
                .first<DBRow & { is_chunked: number }>()
            if (!result) {
                return new Response(JSON.stringify({ error: 'Content not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                })
            }
            const fullItem = await getFullContent(db, result)
            return new Response(JSON.stringify(fullItem), {
                headers: { 
                    'Content-Type': 'application/json', 
                    'Cache-Control': 'public, max-age=60, s-maxage=300',
                    ...corsHeaders,
                },
            })
        }
        
        // Return all items (without full chunked content for performance)
        let query = 'SELECT * FROM content'
        if (publishedOnly) {
            query += ' WHERE status = \'published\''
        }
        query += ' ORDER BY COALESCE(published_at, created_at) DESC'
        
        const { results } = await db.prepare(query).all<DBRow & { is_chunked: number }>()
        
        // For list view, get full content for chunked items
        const items: ContentItem[] = []
        for (const row of results || []) {
            if (row.is_chunked) {
                items.push(await getFullContent(db, row))
            } else {
                items.push(dbRowToContentItem(row))
            }
        }
        
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
        
        // Check content-length header for early rejection of oversized requests
        const contentLength = context.request.headers.get('content-length')
        if (contentLength && parseInt(contentLength) > MAX_REQUEST_SIZE) {
            return new Response(JSON.stringify({ 
                error: 'Request too large',
                details: 'Content exceeds maximum size. Use chunked upload for large content.',
                maxSize: MAX_REQUEST_SIZE,
                receivedSize: parseInt(contentLength),
                useChunkedUpload: true
            }), {
                status: 413,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            })
        }
        
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
        
        // If this is a chunked upload request, just create the metadata (no content yet)
        const isChunkedUpload = body.chunkedUpload === true
        let mainContent = ''
        let isChunked = false
        let totalChunks = 0
        
        if (isChunkedUpload) {
            // Create placeholder for chunked content
            mainContent = '[Content uploading...]'
            isChunked = true
        } else if (body.content) {
            // Check if content is too large for inline storage
            const contentSize = new TextEncoder().encode(body.content).length
            if (contentSize > MAX_REQUEST_SIZE * 0.8) {
                return new Response(JSON.stringify({ 
                    error: 'Content too large for single request',
                    details: 'Use chunked upload for content larger than 700KB.',
                    contentSize,
                    maxInlineSize: MAX_REQUEST_SIZE * 0.8,
                    useChunkedUpload: true
                }), {
                    status: 413,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                })
            }
            
            // Handle content with chunking if needed
            const result = await saveContentWithChunks(db, id, body.content, false)
            mainContent = result.mainContent
            isChunked = result.isChunked
            totalChunks = result.totalChunks
        }
        
        const newItem: ContentItem = {
            id,
            type: body.type || 'article',
            title: body.title || '',
            slug,
            content: isChunkedUpload ? '' : (body.content || ''),
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
                status, created_at, updated_at, published_at, sector, threat_level, confidence, location, case_status, is_chunked, total_chunks
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(
            newItem.id,
            newItem.type,
            newItem.title,
            newItem.slug,
            mainContent,
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
            newItem.caseStatus || null,
            isChunked ? 1 : 0,
            totalChunks
        ).run()
        
        return new Response(JSON.stringify({
            ...newItem,
            chunkedUpload: isChunkedUpload
        }), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
    } catch (error) {
        console.error('POST error:', error)
        const errorMessage = error instanceof Error ? error.message : String(error)
        
        // Check for size-related errors
        if (errorMessage.includes('too large') || errorMessage.includes('SQLITE_TOOBIG') || 
            errorMessage.includes('Body exceeded') || errorMessage.includes('payload')) {
            return new Response(JSON.stringify({ 
                error: 'Content too large', 
                details: 'The content is too large to save in a single request. Use chunked upload.',
                useChunkedUpload: true,
                originalError: errorMessage
            }), {
                status: 413,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            })
        }
        
        return new Response(JSON.stringify({ error: 'Failed to create content', details: errorMessage }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
    }
}

// PATCH handler for chunk uploads
export const onRequestPatch: PagesFunction<Env> = async (context) => {
    try {
        const db = context.env.RF_DB
        await initDB(db)
        
        const url = new URL(context.request.url)
        const action = url.searchParams.get('action')
        
        const body = await context.request.json()
        
        if (action === 'chunk') {
            return await handleChunkUpload(db, body as ChunkUploadRequest)
        } else if (action === 'commit') {
            return await handleChunkCommit(db, body as ChunkCommitRequest)
        }
        
        return new Response(JSON.stringify({ 
            error: 'Invalid action',
            validActions: ['chunk', 'commit']
        }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
    } catch (error) {
        console.error('PATCH error:', error)
        return new Response(JSON.stringify({ error: 'Chunk upload failed', details: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
    }
}

export const onRequestPut: PagesFunction<Env> = async (context) => {
    try {
        const db = context.env.RF_DB
        await initDB(db)
        
        // Check content-length header for early rejection
        const contentLength = context.request.headers.get('content-length')
        if (contentLength && parseInt(contentLength) > MAX_REQUEST_SIZE) {
            return new Response(JSON.stringify({ 
                error: 'Request too large',
                details: 'Content exceeds maximum size. Use chunked upload for large content.',
                maxSize: MAX_REQUEST_SIZE,
                receivedSize: parseInt(contentLength),
                useChunkedUpload: true
            }), {
                status: 413,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            })
        }
        
        const body = await context.request.json() as { id: string; chunkedUpload?: boolean } & Partial<ContentItem>
        
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
        
        // If this is a chunked upload request, just update metadata (content will come via PATCH)
        const isChunkedUpload = body.chunkedUpload === true
        let mainContent = existing.content
        let isChunked = existing.is_chunked === 1
        let totalChunks = existing.total_chunks || 0
        
        if (isChunkedUpload) {
            // Clear existing chunks for fresh upload
            await db.prepare('DELETE FROM content_chunks WHERE content_id = ?').bind(body.id).run()
            mainContent = '[Content uploading...]'
            isChunked = true
            totalChunks = 0
        } else if (body.content !== undefined) {
            // Check if content is too large for inline storage
            const contentSize = new TextEncoder().encode(body.content).length
            if (contentSize > MAX_REQUEST_SIZE * 0.8) {
                return new Response(JSON.stringify({ 
                    error: 'Content too large for single request',
                    details: 'Use chunked upload for content larger than 700KB.',
                    contentSize,
                    maxInlineSize: MAX_REQUEST_SIZE * 0.8,
                    useChunkedUpload: true
                }), {
                    status: 413,
                    headers: { 'Content-Type': 'application/json', ...corsHeaders },
                })
            }
            
            const result = await saveContentWithChunks(db, body.id, body.content, true)
            mainContent = result.mainContent
            isChunked = result.isChunked
            totalChunks = result.totalChunks
        }
        
        await db.prepare(`
            UPDATE content SET
                title = ?, content = ?, summary = ?, thumbnail = ?, images = ?, author = ?, keywords = ?,
                status = ?, updated_at = ?, published_at = ?, sector = ?, threat_level = ?, 
                confidence = ?, location = ?, case_status = ?, is_chunked = ?, total_chunks = ?
            WHERE id = ?
        `).bind(
            body.title ?? existing.title,
            mainContent,
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
            isChunked ? 1 : 0,
            totalChunks,
            body.id
        ).run()
        
        // For chunked upload, return minimal response (content comes later)
        if (isChunkedUpload) {
            return new Response(JSON.stringify({ 
                id: body.id,
                chunkedUpload: true,
                message: 'Metadata updated. Upload content chunks now.'
            }), {
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            })
        }
        
        // Fetch and return updated item
        const updated = await db.prepare('SELECT * FROM content WHERE id = ?').bind(body.id).first<DBRow>()
        const fullItem = await getFullContent(db, updated!)
        
        return new Response(JSON.stringify(fullItem), {
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
        })
    } catch (error) {
        console.error('PUT error:', error)
        const errorMessage = error instanceof Error ? error.message : String(error)
        
        if (errorMessage.includes('too large') || errorMessage.includes('SQLITE_TOOBIG') ||
            errorMessage.includes('Body exceeded') || errorMessage.includes('payload')) {
            return new Response(JSON.stringify({ 
                error: 'Content too large', 
                details: 'The content is too large to save in a single request. Use chunked upload.',
                useChunkedUpload: true,
                originalError: errorMessage
            }), {
                status: 413,
                headers: { 'Content-Type': 'application/json', ...corsHeaders },
            })
        }
        
        return new Response(JSON.stringify({ error: 'Failed to update content', details: errorMessage }), {
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
        
        // Delete chunks first
        await db.prepare('DELETE FROM content_chunks WHERE content_id = ?').bind(id).run()
        // Delete main content
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
