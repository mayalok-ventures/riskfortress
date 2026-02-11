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

type ProgressCallback = (progress: UploadProgress) => void

async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function getAllContent(): Promise<ContentItem[]> {
    try {
        const response = await fetch('/api/content')
        if (!response.ok) return []
        return await response.json()
    } catch (error) {
        console.error('Failed to fetch content:', error)
        return []
    }
}

export async function getPublishedContent(): Promise<ContentItem[]> {
    try {
        const response = await fetch('/api/content?published=true')
        if (!response.ok) return []
        return await response.json()
    } catch (error) {
        console.error('Failed to fetch published content:', error)
        return []
    }
}

export async function createContent(
    item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>,
    onProgress?: ProgressCallback
): Promise<ContentItem | null> {
    try {
        onProgress?.({ current: 0, total: 1, message: 'Saving content...' })

        const response = await fetch('/api/content', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
        })

        if (!response.ok) {
            const err = await response.json()
            throw new Error(err.error || 'Failed to create content')
        }

        const result = await response.json()
        onProgress?.({ current: 1, total: 1, message: 'Saved!' })
        return result
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

        const response = await fetch('/api/content', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...updates }),
        })

        if (!response.ok) {
            const err = await response.json()
            throw new Error(err.error || 'Failed to update content')
        }

        const result = await response.json()
        onProgress?.({ current: 1, total: 1, message: 'Saved!' })
        return result
    } catch (error) {
        console.error('Failed to update content:', error)
        throw error
    }
}

export async function deleteContent(id: string): Promise<boolean> {
    try {
        const response = await fetch(`/api/content?id=${encodeURIComponent(id)}`, {
            method: 'DELETE',
        })
        if (!response.ok) return false
        return true
    } catch (error) {
        console.error('Failed to delete content:', error)
        return false
    }
}

export async function getContentById(id: string): Promise<ContentItem | null> {
    try {
        const response = await fetch(`/api/content?id=${encodeURIComponent(id)}`)
        if (!response.ok) return null
        return await response.json()
    } catch (error) {
        console.error('Failed to fetch content by id:', error)
        return null
    }
}

export async function getContentBySlug(slug: string): Promise<ContentItem | null> {
    try {
        const response = await fetch(`/api/content?slug=${encodeURIComponent(slug)}`)
        if (!response.ok) return null
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

const AUTH_KEY = 'rf-admin-auth'

export async function verifyPasswordAsync(
    inputPassword: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const inputHash = await hashPassword(inputPassword)
        const storedHash = '6a25abd98d287e92f08557c31f21d7b87be956d7052aa48d32e1afc753e227dc'

        if (inputHash !== storedHash) {
            return { success: false, error: 'Invalid password' }
        }

        const token = crypto.randomUUID()
        const expiresAt = Date.now() + 10 * 60 * 60 * 1000
        createSessionWithToken(token, expiresAt)
        return { success: true }
    } catch (error) {
        console.error('Auth error:', error)
        return { success: false, error: 'Authentication failed. Please try again.' }
    }
}

function createSessionWithToken(token: string, expiresAt: number): void {
    if (typeof window === 'undefined') return
    const session = {
        authenticated: true,
        token,
        createdAt: Date.now(),
        expiresAt,
    }
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(session))
}

export function createSession(): void {
    if (typeof window === 'undefined') return
    const session = {
        authenticated: true,
        createdAt: Date.now(),
        expiresAt: Date.now() + 10 * 60 * 60 * 1000,
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
