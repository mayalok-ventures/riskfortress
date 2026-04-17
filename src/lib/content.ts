export interface ContentItem {
    id: string
    type: 'case' | 'article' | 'blog'
    title: string
    slug: string
    content: string
    htmlContent?: string
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
    accessRequired?: boolean
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
            const grantsRaw = localStorage.getItem('rf-case-grants')
            try {
                const grantsMap = grantsRaw ? JSON.parse(grantsRaw) : {}
                if (grantsMap[slug]) headers['X-Case-Grant'] = grantsMap[slug]
            } catch { /* ignore */ }
        }
        const response = await fetch(`/api/content?slug=${encodeURIComponent(slug)}`, { headers })
        if (!response.ok) return null
        return await response.json()
    } catch {
        return null
    }
}
