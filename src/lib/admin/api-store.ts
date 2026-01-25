// API-based content storage that works across all devices
// Uses Cloudflare D1 via API endpoints
// Supports chunked uploads for large content (cases/reports with images)

export interface ContentItem {
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

interface ChunkUploadProgress {
    current: number
    total: number
    message: string
}

const API_URL = '/api/content'

// Chunk size for client-side chunking (150KB - safe margin under Cloudflare limits)
const CHUNK_SIZE = 150 * 1024
// Threshold for using chunked upload (500KB - content larger than this uses chunking)
const CHUNKED_UPLOAD_THRESHOLD = 500 * 1024

export async function getAllContent(): Promise<ContentItem[]> {
    try {
        const response = await fetch(API_URL)
        if (!response.ok) throw new Error('Failed to fetch')
        return await response.json()
    } catch (error) {
        console.error('Failed to fetch content:', error)
        return []
    }
}

export async function getPublishedContent(): Promise<ContentItem[]> {
    try {
        const response = await fetch(`${API_URL}?published=true`)
        if (!response.ok) throw new Error('Failed to fetch')
        const items: ContentItem[] = await response.json()
        return items.sort((a, b) =>
            new Date(b.publishedAt || b.createdAt).getTime() -
            new Date(a.publishedAt || a.createdAt).getTime()
        )
    } catch (error) {
        console.error('Failed to fetch published content:', error)
        return []
    }
}

// Check if content needs chunked upload
function needsChunkedUpload(content: string): boolean {
    const contentSize = new TextEncoder().encode(content).length
    return contentSize > CHUNKED_UPLOAD_THRESHOLD
}

// Split content into chunks (UTF-8 safe using streaming decoder)
function splitIntoChunks(content: string): string[] {
    const encoder = new TextEncoder()
    const bytes = encoder.encode(content)
    
    // Use a single streaming decoder to handle multi-byte character boundaries correctly
    const decoder = new TextDecoder()
    const chunks: string[] = []
    
    for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
        const slice = bytes.subarray(i, i + CHUNK_SIZE)
        // stream: true keeps partial bytes buffered for next decode
        chunks.push(decoder.decode(slice, { stream: true }))
    }
    
    // Flush any remaining buffered bytes (incomplete characters)
    const tail = decoder.decode()
    if (tail) {
        if (chunks.length === 0) {
            chunks.push(tail)
        } else {
            chunks[chunks.length - 1] += tail
        }
    }
    
    return chunks
}

// Upload a single chunk with retry and better error handling
async function uploadChunk(
    id: string, 
    chunkIndex: number, 
    totalChunks: number, 
    data: string,
    retries = 5
): Promise<boolean> {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            // Validate data before sending
            if (!data || typeof data !== 'string') {
                console.error(`Invalid chunk data for ${chunkIndex}/${totalChunks}`)
                throw new Error('Invalid chunk data')
            }
            
            const controller = new AbortController()
            // 30 second timeout per chunk
            const timeoutId = setTimeout(() => controller.abort(), 30000)
            
            const response = await fetch(`${API_URL}?action=chunk`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, chunkIndex, totalChunks, data }),
                signal: controller.signal
            })
            
            clearTimeout(timeoutId)
            
            if (response.ok) {
                return true
            }
            
            const errorData = await response.json().catch(() => ({}))
            console.warn(`Chunk ${chunkIndex + 1}/${totalChunks} attempt ${attempt + 1} failed:`, {
                status: response.status,
                error: errorData
            })
            
            // Don't retry on 4xx errors (client errors) except 408/429
            if (response.status >= 400 && response.status < 500 && 
                response.status !== 408 && response.status !== 429) {
                throw new Error(errorData.error || `Chunk upload failed with status ${response.status}`)
            }
        } catch (error) {
            const isAbort = error instanceof Error && error.name === 'AbortError'
            const isNetworkError = error instanceof TypeError && error.message.includes('fetch')
            
            console.warn(`Chunk ${chunkIndex + 1}/${totalChunks} attempt ${attempt + 1} error:`, {
                name: error instanceof Error ? error.name : 'Unknown',
                message: error instanceof Error ? error.message : String(error),
                isAbort,
                isNetworkError
            })
            
            if (attempt === retries - 1) {
                throw new Error(`Failed to upload chunk ${chunkIndex + 1}/${totalChunks} after ${retries} attempts`)
            }
            // Exponential backoff with jitter
            const delay = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 500, 10000)
            await new Promise(resolve => setTimeout(resolve, delay))
        }
    }
    return false
}

// Commit chunked upload
async function commitChunks(id: string, totalChunks: number, contentPreview: string): Promise<ContentItem | null> {
    const response = await fetch(`${API_URL}?action=commit`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, totalChunks, contentPreview }),
    })
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || errorData.error || 'Failed to commit chunks')
    }
    
    const result = await response.json()
    return result.item || result
}

// Progress callback type
type ProgressCallback = (progress: ChunkUploadProgress) => void

export async function createContent(
    item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>,
    onProgress?: ProgressCallback
): Promise<ContentItem | null> {
    try {
        const content = item.content || ''
        
        // Check if we need chunked upload
        if (needsChunkedUpload(content)) {
            // Step 1: Create content record without full content
            const { content: _, ...metadata } = item
            const createResponse = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...metadata, content: '', chunkedUpload: true }),
            })
            
            if (!createResponse.ok) {
                const errorData = await createResponse.json().catch(() => ({}))
                throw new Error(errorData.details || errorData.error || 'Failed to create content')
            }
            
            const created = await createResponse.json()
            const id = created.id
            
            // Step 2: Upload content in chunks
            const chunks = splitIntoChunks(content)
            const totalChunks = chunks.length
            
            onProgress?.({ current: 0, total: totalChunks, message: 'Starting upload...' })
            
            for (let i = 0; i < chunks.length; i++) {
                await uploadChunk(id, i, totalChunks, chunks[i])
                onProgress?.({ 
                    current: i + 1, 
                    total: totalChunks, 
                    message: `Uploading ${i + 1}/${totalChunks}...` 
                })
            }
            
            // Step 3: Commit and get final result
            const contentPreview = content.slice(0, 500).replace(/<[^>]*>/g, '').slice(0, 200)
            const result = await commitChunks(id, totalChunks, contentPreview)
            
            onProgress?.({ current: totalChunks, total: totalChunks, message: 'Saved!' })
            
            // Return with full content for client
            if (result) {
                return { ...result, content }
            }
            return result
        }
        
        // Regular upload for small content
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        })
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('Create failed:', response.status, errorData)
            
            // If server suggests chunked upload, retry with chunking
            if (errorData.useChunkedUpload) {
                return createContent(item, onProgress)
            }
            
            throw new Error(errorData.details || errorData.error || 'Failed to create')
        }
        return await response.json()
    } catch (error) {
        console.error('Failed to create content:', error)
        throw error // Re-throw to show error in UI
    }
}

export async function updateContent(
    id: string, 
    updates: Partial<ContentItem>,
    onProgress?: ProgressCallback
): Promise<ContentItem | null> {
    try {
        const content = updates.content
        
        // Check if we need chunked upload
        if (content && needsChunkedUpload(content)) {
            // Step 1: Update metadata and signal chunked upload
            const { content: _, ...metadata } = updates
            const updateResponse = await fetch(API_URL, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, ...metadata, chunkedUpload: true }),
            })
            
            if (!updateResponse.ok) {
                const errorData = await updateResponse.json().catch(() => ({}))
                throw new Error(errorData.details || errorData.error || 'Failed to update content')
            }
            
            // Step 2: Upload content in chunks
            const chunks = splitIntoChunks(content)
            const totalChunks = chunks.length
            
            onProgress?.({ current: 0, total: totalChunks, message: 'Starting upload...' })
            
            for (let i = 0; i < chunks.length; i++) {
                await uploadChunk(id, i, totalChunks, chunks[i])
                onProgress?.({ 
                    current: i + 1, 
                    total: totalChunks, 
                    message: `Uploading ${i + 1}/${totalChunks}...` 
                })
            }
            
            // Step 3: Commit and get final result
            const contentPreview = content.slice(0, 500).replace(/<[^>]*>/g, '').slice(0, 200)
            const result = await commitChunks(id, totalChunks, contentPreview)
            
            onProgress?.({ current: totalChunks, total: totalChunks, message: 'Saved!' })
            
            // Return with full content for client
            if (result) {
                return { ...result, content }
            }
            return result
        }
        
        // Regular update for small content
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...updates }),
        })
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            console.error('Update failed:', response.status, errorData)
            
            // If server suggests chunked upload, retry with chunking
            if (errorData.useChunkedUpload && content) {
                return updateContent(id, updates, onProgress)
            }
            
            throw new Error(errorData.details || errorData.error || 'Failed to update')
        }
        return await response.json()
    } catch (error) {
        console.error('Failed to update content:', error)
        throw error // Re-throw to show error in UI
    }
}

export async function deleteContent(id: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_URL}?id=${id}`, {
            method: 'DELETE',
        })
        return response.ok
    } catch (error) {
        console.error('Failed to delete content:', error)
        return false
    }
}

export async function getContentById(id: string): Promise<ContentItem | null> {
    try {
        const response = await fetch(`${API_URL}?id=${id}`)
        if (!response.ok) throw new Error('Failed to fetch')
        const item = await response.json()
        return item || null
    } catch (error) {
        console.error('Failed to fetch content by id:', error)
        return null
    }
}

export async function getContentBySlug(slug: string): Promise<ContentItem | null> {
    try {
        const response = await fetch(`${API_URL}?slug=${slug}`)
        if (!response.ok) throw new Error('Failed to fetch')
        const item = await response.json()
        return item || null
    } catch (error) {
        console.error('Failed to fetch content by slug:', error)
        return null
    }
}

export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
}

// Auth functions remain client-side (session-based)
const AUTH_KEY = 'rf-admin-auth'
const ADMIN_PASSWORD = 'Mflica2026riskfortresspsw@'

export function verifyPassword(password: string): boolean {
    return password === ADMIN_PASSWORD
}

export function createSession(): void {
    if (typeof window === 'undefined') return

    const session = {
        authenticated: true,
        createdAt: Date.now(),
        expiresAt: Date.now() + 10 * 60 * 60 * 1000
    }

    sessionStorage.setItem(AUTH_KEY, JSON.stringify(session))
}

export function validateSession(): boolean {
    if (typeof window === 'undefined') return false

    try {
        const data = sessionStorage.getItem(AUTH_KEY)
        if (!data) return false

        const session = JSON.parse(data)

        if (Date.now() > session.expiresAt) {
            sessionStorage.removeItem(AUTH_KEY)
            return false
        }

        return session.authenticated
    } catch {
        return false
    }
}

export function clearSession(): void {
    if (typeof window === 'undefined') return
    sessionStorage.removeItem(AUTH_KEY)
}
