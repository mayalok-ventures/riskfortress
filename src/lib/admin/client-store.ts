import { db } from '@/lib/firebase'
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore'

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

function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined))
}

function estimateDocSize(data: Record<string, unknown>): number {
    return new Blob([JSON.stringify(data)]).size
}

const MAX_DOC_SIZE = 900_000

export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
}

function getAdminToken(): string | null {
    if (typeof window === 'undefined') return null
    try {
        const data = sessionStorage.getItem('rf-admin-auth')
        if (!data) return null
        const session = JSON.parse(data)
        if (Date.now() > session.expiresAt) {
            sessionStorage.removeItem('rf-admin-auth')
            return null
        }
        return session.token || null
    } catch {
        return null
    }
}

export function adminHeaders(): Record<string, string> {
    const token = getAdminToken()
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (token) headers['Authorization'] = `Bearer ${token}`
    return headers
}

export async function getAllContent(): Promise<ContentItem[]> {
    const _headers = adminHeaders()
    const snapshot = await getDocs(collection(db, 'content'))
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ContentItem))
}

export async function getPublishedContent(type?: ContentItem['type']): Promise<ContentItem[]> {
    let q
    if (type) {
        q = query(
            collection(db, 'content'),
            where('status', '==', 'published'),
            where('type', '==', type),
            orderBy('createdAt', 'desc')
        )
    } else {
        q = query(
            collection(db, 'content'),
            where('status', '==', 'published'),
            orderBy('createdAt', 'desc')
        )
    }
    const snapshot = await getDocs(q)
    const items = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as ContentItem))
    return items.sort((a, b) =>
        new Date(b.publishedAt || b.createdAt).getTime() -
        new Date(a.publishedAt || a.createdAt).getTime()
    )
}

export async function getContentById(id: string): Promise<ContentItem | null> {
    const _headers = adminHeaders()
    const snap = await getDoc(doc(db, 'content', id))
    if (!snap.exists()) return null
    return snap.data() as ContentItem
}

export async function createContent(item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentItem> {
    const _headers = adminHeaders()
    const newItem: ContentItem = {
        ...item,
        id: `rf-${item.type}-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        publishedAt: item.status === 'published' ? new Date().toISOString() : undefined
    }

    const docData = stripUndefined(newItem as unknown as Record<string, unknown>)
    const size = estimateDocSize(docData)
    if (size > MAX_DOC_SIZE) {
        throw new Error(`Content too large (${Math.round(size / 1024)}KB). Remove some images or reduce image sizes to save.`)
    }
    await setDoc(doc(db, 'content', newItem.id), docData)
    return newItem
}

export async function updateContent(id: string, updates: Partial<ContentItem>): Promise<ContentItem | null> {
    const _headers = adminHeaders()
    const existing = await getContentById(id)
    if (!existing) return null

    const wasPublished = existing.status === 'published'
    const isNowPublished = updates.status === 'published'

    const merged: ContentItem = {
        ...existing,
        ...updates,
        id: existing.id,
        createdAt: existing.createdAt,
        updatedAt: new Date().toISOString(),
        publishedAt: isNowPublished && !wasPublished
            ? new Date().toISOString()
            : existing.publishedAt
    }

    const docData = stripUndefined(merged as unknown as Record<string, unknown>)
    const size = estimateDocSize(docData)
    if (size > MAX_DOC_SIZE) {
        throw new Error(`Content too large (${Math.round(size / 1024)}KB). Remove some images or reduce image sizes to save.`)
    }
    await updateDoc(doc(db, 'content', id), docData as Record<string, never>)
    return merged
}

export async function deleteContent(id: string): Promise<boolean> {
    const _headers = adminHeaders()
    const existing = await getContentById(id)
    if (!existing) return false
    await deleteDoc(doc(db, 'content', id))
    return true
}

export interface ContactSettings {
    email: string
    phone: string
    address: string
    mapUrl?: string
    officeHours?: string
    whatsapp?: string
}

export interface SEOSettings {
    metaTitle: string
    metaDescription: string
    keywords: string[]
    ogImage?: string
    canonicalUrl?: string
    robotsTxt?: string
    googleVerification?: string
    bingVerification?: string
    structuredData?: string
}

export interface SocialLinks {
    linkedin?: string
    twitter?: string
    instagram?: string
    facebook?: string
    youtube?: string
    github?: string
    telegram?: string
    whatsapp?: string
}

export interface SiteSettings {
    contact: ContactSettings
    seo: SEOSettings
    social: SocialLinks
    updatedAt: string
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
    const snap = await getDoc(doc(db, 'settings', 'site'))
    if (!snap.exists()) return null
    return snap.data() as SiteSettings
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
    const existing = await getSiteSettings()
    const merged: SiteSettings = {
        contact: { ...existing?.contact, ...settings.contact } as ContactSettings,
        seo: { ...existing?.seo, ...settings.seo } as SEOSettings,
        social: { ...existing?.social, ...settings.social } as SocialLinks,
        updatedAt: new Date().toISOString()
    }
    const docData = stripUndefined(merged as unknown as Record<string, unknown>)
    await setDoc(doc(db, 'settings', 'site'), docData)
    return merged
}

export async function updateContactSettings(contact: Partial<ContactSettings>): Promise<void> {
    const existing = await getSiteSettings()
    const updatedContact = { ...existing?.contact, ...contact } as ContactSettings
    const docData = stripUndefined({ contact: updatedContact, updatedAt: new Date().toISOString() } as unknown as Record<string, unknown>)
    if (existing) {
        await updateDoc(doc(db, 'settings', 'site'), docData as Record<string, never>)
    } else {
        await setDoc(doc(db, 'settings', 'site'), { ...docData, seo: {}, social: {} })
    }
}

export async function updateSEOSettings(seo: Partial<SEOSettings>): Promise<void> {
    const existing = await getSiteSettings()
    const updatedSeo = { ...existing?.seo, ...seo } as SEOSettings
    const docData = stripUndefined({ seo: updatedSeo, updatedAt: new Date().toISOString() } as unknown as Record<string, unknown>)
    if (existing) {
        await updateDoc(doc(db, 'settings', 'site'), docData as Record<string, never>)
    } else {
        await setDoc(doc(db, 'settings', 'site'), { ...docData, contact: {}, social: {} })
    }
}

export async function updateSocialLinks(social: Partial<SocialLinks>): Promise<void> {
    const existing = await getSiteSettings()
    const updatedSocial = { ...existing?.social, ...social } as SocialLinks
    const docData = stripUndefined({ social: updatedSocial, updatedAt: new Date().toISOString() } as unknown as Record<string, unknown>)
    if (existing) {
        await updateDoc(doc(db, 'settings', 'site'), docData as Record<string, never>)
    } else {
        await setDoc(doc(db, 'settings', 'site'), { ...docData, contact: {}, seo: {} })
    }
}
