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
    accessToken?: string
}

export async function loginAdmin(password: string): Promise<{ success: boolean; error?: string }> {
    try {
        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'verify', password }),
        })
        const data = await res.json()

        if (!res.ok || !data.success) {
            return { success: false, error: data.error || 'Login failed' }
        }

        if (typeof window !== 'undefined') {
            sessionStorage.setItem('rf-admin-auth', JSON.stringify({
                authenticated: true,
                token: data.token,
                expiresAt: data.expiresAt,
                createdAt: Date.now(),
            }))
        }

        return { success: true }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Login failed' }
    }
}

export function validateSession(): boolean {
    if (typeof window === 'undefined') return false
    try {
        const data = sessionStorage.getItem('rf-admin-auth')
        if (!data) return false
        const session = JSON.parse(data)
        if (Date.now() > session.expiresAt) {
            sessionStorage.removeItem('rf-admin-auth')
            return false
        }
        return session.authenticated === true
    } catch {
        return false
    }
}

export async function clearSession(): Promise<void> {
    if (typeof window === 'undefined') return
    try {
        const data = sessionStorage.getItem('rf-admin-auth')
        if (data) {
            const session = JSON.parse(data)
            if (session.token) {
                fetch('/api/auth', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'logout', token: session.token }),
                }).catch(() => {})
            }
        }
    } catch {}
    sessionStorage.removeItem('rf-admin-auth')
}

export function getSessionToken(): string | null {
    if (typeof window === 'undefined') return null
    try {
        const data = sessionStorage.getItem('rf-admin-auth')
        if (!data) return null
        const session = JSON.parse(data)
        return session.token || null
    } catch {
        return null
    }
}

export async function getPublishedContent(): Promise<ContentItem[]> {
    try {
        const response = await fetch('/api/content?published=true')
        if (!response.ok) return []
        return await response.json()
    } catch {
        return []
    }
}

export async function getContentBySlug(slug: string): Promise<ContentItem | null> {
    try {
        const headers: Record<string, string> = {}
        if (typeof window !== 'undefined') {
            const grant = sessionStorage.getItem('rf-case-grant')
            if (grant) headers['X-Case-Grant'] = grant
        }
        const response = await fetch(`/api/content?slug=${encodeURIComponent(slug)}`, { headers })
        if (!response.ok) return null
        return await response.json()
    } catch {
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
