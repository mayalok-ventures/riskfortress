// Client-side content storage using localStorage
// This is suitable for static export deployments
// SECURITY: Authentication is handled via /api/auth endpoint
// Never store passwords or API keys in source code

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

const STORAGE_KEY = 'rf-admin-content'
const AUTH_KEY = 'rf-admin-auth'
const AUTH_API_URL = '/api/auth'

// =============================================================================
// CONTENT MANAGEMENT (localStorage based)
// =============================================================================

export function getAllContent(): ContentItem[] {
    if (typeof window === 'undefined') return []

    try {
        const data = localStorage.getItem(STORAGE_KEY)
        return data ? JSON.parse(data) : []
    } catch {
        return []
    }
}

export function getPublishedContent(type?: ContentItem['type']): ContentItem[] {
    const items = getAllContent().filter(item => item.status === 'published')

    if (type) {
        return items.filter(item => item.type === type)
    }

    return items.sort((a, b) =>
        new Date(b.publishedAt || b.createdAt).getTime() -
        new Date(a.publishedAt || a.createdAt).getTime()
    )
}

export function getContentById(id: string): ContentItem | null {
    return getAllContent().find(item => item.id === id) || null
}

export function saveContent(items: ContentItem[]): void {
    if (typeof window === 'undefined') return

    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function createContent(item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): ContentItem {
    const items = getAllContent()

    const newItem: ContentItem = {
        ...item,
        id: `rf-${item.type}-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: item.status === 'published' ? new Date().toISOString() : undefined
    }

    items.push(newItem)
    saveContent(items)

    return newItem
}

export function updateContent(id: string, updates: Partial<ContentItem>): ContentItem | null {
    const items = getAllContent()
    const index = items.findIndex(item => item.id === id)

    if (index === -1) return null

    const existingItem = items[index]
    const wasPublished = existingItem.status === 'published'
    const isNowPublished = updates.status === 'published'

    items[index] = {
        ...existingItem,
        ...updates,
        id: existingItem.id,
        createdAt: existingItem.createdAt,
        updatedAt: new Date().toISOString(),
        publishedAt: isNowPublished && !wasPublished
            ? new Date().toISOString()
            : existingItem.publishedAt
    }

    saveContent(items)

    return items[index]
}

export function deleteContent(id: string): boolean {
    const items = getAllContent()
    const index = items.findIndex(item => item.id === id)

    if (index === -1) return false

    items.splice(index, 1)
    saveContent(items)

    return true
}

// =============================================================================
// SECURE AUTHENTICATION VIA API
// Password and API keys are stored in Cloudflare KV (encrypted)
// =============================================================================

// OTP Generation via server-side API
let currentOTPState: { expiresAt: number; attempts: number } | null = null

export async function generateOTP(): Promise<{ phone: string; success: boolean; error?: string }> {
    try {
        const response = await fetch(AUTH_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'generate-otp' })
        })
        
        const data = await response.json()
        
        if (data.success) {
            currentOTPState = {
                expiresAt: Date.now() + 5 * 60 * 1000,
                attempts: 0
            }
        }
        
        return {
            phone: data.phone || '****',
            success: data.success,
            error: data.error
        }
    } catch (error) {
        console.error('OTP generation failed:', error)
        return { phone: '****', success: false, error: 'Failed to generate OTP' }
    }
}

export async function verifyOTPAsync(inputOtp: string): Promise<{ success: boolean; error?: string }> {
    try {
        const response = await fetch(AUTH_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'verify-otp', otp: inputOtp })
        })
        
        const data = await response.json()
        return { success: data.success, error: data.error }
    } catch (error) {
        console.error('OTP verification failed:', error)
        return { success: false, error: 'Verification failed' }
    }
}

// Legacy OTP verification (for backwards compatibility)
export function verifyOTP(inputOtp: string): { success: boolean; error?: string } {
    console.warn('DEPRECATED: verifyOTP() is deprecated. Use verifyOTPAsync() instead.')
    return { success: false, error: 'Use verifyOTPAsync instead' }
}

// Secure password verification via API
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
        console.error('Auth error:', error)
        return { success: false, error: 'Connection failed' }
    }
}

// DEPRECATED: Use verifyPasswordAsync instead
export function verifyPassword(_password: string): boolean {
    console.warn('SECURITY: verifyPassword() is deprecated. Use verifyPasswordAsync() instead.')
    return false
}

// =============================================================================
// SESSION MANAGEMENT
// =============================================================================

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
        expiresAt: Date.now() + 10 * 60 * 60 * 1000 // 10 hours
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
