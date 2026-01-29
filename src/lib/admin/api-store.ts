// API-based content storage
// Uses Cloudflare KV for content (up to 25MB) + D1 for metadata
// SECURITY: Authentication handled via /api/auth endpoint with encrypted password hash

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

interface UploadProgress {
    current: number
    total: number
    message: string
}

const API_URL = '/api/content'
const AUTH_API_URL = '/api/auth'

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

type ProgressCallback = (progress: UploadProgress) => void

export async function createContent(
    item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>,
    onProgress?: ProgressCallback
): Promise<ContentItem | null> {
    try {
        onProgress?.({ current: 0, total: 1, message: 'Saving content...' })
        
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        })
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.details || errorData.error || 'Failed to create')
        }
        
        onProgress?.({ current: 1, total: 1, message: 'Saved!' })
        return await response.json()
    } catch (error) {
        console.error('Failed to create content:', error)
        throw error
    }
}

export async function updateContent(
    id: string, 
    updates: Partial<ContentItem>,
    onProgress?: ProgressCallback
): Promise<ContentItem | null> {
    try {
        onProgress?.({ current: 0, total: 1, message: 'Saving changes...' })
        
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...updates }),
        })
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.details || errorData.error || 'Failed to update')
        }
        
        onProgress?.({ current: 1, total: 1, message: 'Saved!' })
        return await response.json()
    } catch (error) {
        console.error('Failed to update content:', error)
        throw error
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
        return await response.json()
    } catch (error) {
        console.error('Failed to fetch content by id:', error)
        return null
    }
}

export async function getContentBySlug(slug: string): Promise<ContentItem | null> {
    try {
        const response = await fetch(`${API_URL}?slug=${slug}`)
        if (!response.ok) throw new Error('Failed to fetch')
        return await response.json()
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

// =============================================================================
// SECURE AUTHENTICATION
// Password is stored as encrypted hash in Cloudflare environment variables
// Never stored in source code
// =============================================================================

const AUTH_KEY = 'rf-admin-auth'

// Secure async password verification via server-side API
export async function verifyPasswordAsync(inputPassword: string): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch(AUTH_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'verify', password: inputPassword })
        })
        
        const data = await response.json()
        
        if (data.success && data.token) {
            createSessionWithToken(data.token, data.expiresAt)
            return { success: true }
        }
        
        return { success: false, error: data.error || 'Authentication failed' }
    } catch (error) {
        console.error('Auth API error:', error)
        return { success: false, error: 'Connection failed. Please try again.' }
    }
}

// DEPRECATED: Use verifyPasswordAsync instead
// This function now always returns false for security - forces use of async API
export function verifyPassword(_password: string): boolean {
    console.warn('SECURITY: verifyPassword() is deprecated. Use verifyPasswordAsync() instead.')
    return false
}

function createSessionWithToken(token: string, expiresAt: number): void {
    if (typeof window === 'undefined') return
    const session = {
        authenticated: true,
        token,
        createdAt: Date.now(),
        expiresAt
    }
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(session))
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

export function getSessionToken(): string | null {
    if (typeof window === 'undefined') return null
    try {
        const data = sessionStorage.getItem(AUTH_KEY)
        if (!data) return null
        const session = JSON.parse(data)
        return session.token || null
    } catch {
        return null
    }
}

export function clearSession(): void {
    if (typeof window === 'undefined') return
    sessionStorage.removeItem(AUTH_KEY)
}
