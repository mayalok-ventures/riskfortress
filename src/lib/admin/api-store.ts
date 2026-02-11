import { db } from '@/lib/firebase'
import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
} from 'firebase/firestore'

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

const contentCollection = collection(db, 'content')
const secretsCollection = collection(db, 'secrets')

async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function getAllContent(): Promise<ContentItem[]> {
    try {
        const q = query(contentCollection, orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)
        return snapshot.docs.map(d => d.data() as ContentItem)
    } catch (error) {
        console.error('Failed to fetch content:', error)
        return []
    }
}

export async function getPublishedContent(): Promise<ContentItem[]> {
    try {
        const q = query(
            contentCollection,
            where('status', '==', 'published'),
            orderBy('publishedAt', 'desc')
        )
        const snapshot = await getDocs(q)
        return snapshot.docs.map(d => d.data() as ContentItem)
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

        const now = new Date().toISOString()
        const timestamp = Date.now()
        const random = Math.random().toString(36).substring(2, 8)
        const id = `rf-${item.type}-${timestamp}-${random}`

        let slug = generateSlug(item.title)
        const slugQuery = query(contentCollection, where('slug', '==', slug))
        const slugSnapshot = await getDocs(slugQuery)
        if (!slugSnapshot.empty) {
            slug = `${slug}-${random}`
        }

        const newItem: ContentItem = {
            ...item,
            id,
            slug,
            createdAt: now,
            updatedAt: now,
            publishedAt: item.status === 'published' ? now : undefined,
        }

        const docData = Object.fromEntries(
            Object.entries(newItem).filter(([, v]) => v !== undefined)
        )
        await setDoc(doc(db, 'content', id), docData)

        onProgress?.({ current: 1, total: 1, message: 'Saved!' })
        return newItem
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

        const docRef = doc(db, 'content', id)
        const existing = await getDoc(docRef)
        if (!existing.exists()) {
            throw new Error('Content not found')
        }

        const existingData = existing.data() as ContentItem
        const now = new Date().toISOString()

        const mergedUpdates: Partial<ContentItem> = {
            ...updates,
            updatedAt: now,
        }

        if (
            updates.status === 'published' &&
            existingData.status !== 'published' &&
            !existingData.publishedAt
        ) {
            mergedUpdates.publishedAt = now
        }

        await updateDoc(docRef, mergedUpdates)

        onProgress?.({ current: 1, total: 1, message: 'Saved!' })
        return { ...existingData, ...mergedUpdates } as ContentItem
    } catch (error) {
        console.error('Failed to update content:', error)
        throw error
    }
}

export async function deleteContent(id: string): Promise<boolean> {
    try {
        await deleteDoc(doc(db, 'content', id))
        return true
    } catch (error) {
        console.error('Failed to delete content:', error)
        return false
    }
}

export async function getContentById(id: string): Promise<ContentItem | null> {
    try {
        const docSnap = await getDoc(doc(db, 'content', id))
        if (!docSnap.exists()) return null
        return docSnap.data() as ContentItem
    } catch (error) {
        console.error('Failed to fetch content by id:', error)
        return null
    }
}

export async function getContentBySlug(slug: string): Promise<ContentItem | null> {
    try {
        const q = query(
            contentCollection,
            where('slug', '==', slug),
            where('status', '==', 'published')
        )
        const snapshot = await getDocs(q)
        if (snapshot.empty) return null
        return snapshot.docs[0].data() as ContentItem
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
