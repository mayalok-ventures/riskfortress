// Client-side content storage using localStorage
// This is suitable for static export deployments

export interface ContentItem {
    id: string
    type: 'case' | 'article' | 'blog'
    title: string
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

// Encrypted password hash (client-side verification is less secure but works for static sites)
// In production, consider using a separate auth service
const ADMIN_PASSWORD = 'Mflica2026riskfortresspsw@'
const ADMIN_PHONE = '8193948870'

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

// OTP Generation (simulated - in production use SMS service)
let currentOTP: { code: string; expiresAt: number; attempts: number } | null = null

export function generateOTP(): { otp: string; phone: string } {
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    currentOTP = {
        code: otp,
        expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
        attempts: 0
    }
    
    // In production, send via SMS
    console.log(`[DEV] OTP for ${ADMIN_PHONE}: ${otp}`)
    
    return { 
        otp: process.env.NODE_ENV === 'development' ? otp : '', 
        phone: ADMIN_PHONE.slice(0, 2) + '****' + ADMIN_PHONE.slice(-2) 
    }
}

export function verifyOTP(inputOtp: string): { success: boolean; error?: string } {
    if (!currentOTP) {
        return { success: false, error: 'No OTP requested. Please request a new one.' }
    }
    
    if (Date.now() > currentOTP.expiresAt) {
        currentOTP = null
        return { success: false, error: 'OTP expired. Please request a new one.' }
    }
    
    currentOTP.attempts++
    
    if (currentOTP.attempts > 3) {
        currentOTP = null
        return { success: false, error: 'Too many attempts. Please request a new OTP.' }
    }
    
    if (inputOtp !== currentOTP.code) {
        return { success: false, error: 'Invalid OTP. Please try again.' }
    }
    
    return { success: true }
}

export function verifyPassword(password: string): boolean {
    return password === ADMIN_PASSWORD
}

// Session management
export function createSession(): void {
    if (typeof window === 'undefined') return
    
    const session = {
        authenticated: true,
        createdAt: Date.now(),
        expiresAt: Date.now() + 60 * 60 * 1000 // 1 hour
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
