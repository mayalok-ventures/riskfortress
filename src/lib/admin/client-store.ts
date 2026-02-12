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
}

function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined))
}

function estimateDocSize(data: Record<string, unknown>): number {
    return new Blob([JSON.stringify(data)]).size
}

const MAX_DOC_SIZE = 900_000 // ~900KB, leaving margin under Firestore's 1MB limit

export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
}

const AUTH_KEY = 'rf-admin-auth'

async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function getAllContent(): Promise<ContentItem[]> {
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
    const snap = await getDoc(doc(db, 'content', id))
    if (!snap.exists()) return null
    return snap.data() as ContentItem
}

export async function createContent(item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentItem> {
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
    const existing = await getContentById(id)
    if (!existing) return false
    await deleteDoc(doc(db, 'content', id))
    return true
}

export async function generateOTP(): Promise<{ phone: string; success: boolean; error?: string }> {
    try {
        const configSnap = await getDoc(doc(db, 'secrets', 'admin_config'))
        if (!configSnap.exists()) {
            return { phone: '****', success: false, error: 'Admin config not found' }
        }

        const config = configSnap.data()
        const phone = config.ADMIN_PHONE as string
        const apiKey = config.MTALKZ_API_KEY as string
        const senderId = config.MTALKZ_SENDER_ID as string

        if (!phone || !apiKey || !senderId) {
            return { phone: '****', success: false, error: 'Missing SMS configuration' }
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString()

        await setDoc(doc(db, 'secrets', 'current_otp'), {
            code: otp,
            expiresAt: Date.now() + 5 * 60 * 1000,
            attempts: 0,
            createdAt: Date.now()
        })

        const maskedPhone = '****' + phone.slice(-4)

        const smsResponse = await fetch(
            `https://msgn.mtalkz.com/api?apikey=${encodeURIComponent(apiKey)}&senderid=${encodeURIComponent(senderId)}&number=${encodeURIComponent(phone)}&message=${encodeURIComponent(`Your RiskFortress admin OTP is: ${otp}. Valid for 5 minutes.`)}&format=json`
        )

        if (!smsResponse.ok) {
            return { phone: maskedPhone, success: false, error: 'Failed to send SMS' }
        }

        return { phone: maskedPhone, success: true }
    } catch (error) {
        console.error('OTP generation failed:', error)
        return { phone: '****', success: false, error: 'Failed to generate OTP' }
    }
}

export async function verifyOTPAsync(inputOtp: string): Promise<{ success: boolean; error?: string }> {
    try {
        const otpRef = doc(db, 'secrets', 'current_otp')
        const otpSnap = await getDoc(otpRef)

        if (!otpSnap.exists()) {
            return { success: false, error: 'No OTP found. Please generate a new one.' }
        }

        const otpData = otpSnap.data()

        if (Date.now() > otpData.expiresAt) {
            await deleteDoc(otpRef)
            return { success: false, error: 'OTP has expired. Please generate a new one.' }
        }

        if (otpData.attempts >= 3) {
            await deleteDoc(otpRef)
            return { success: false, error: 'Too many attempts. Please generate a new OTP.' }
        }

        if (otpData.code !== inputOtp) {
            await updateDoc(otpRef, { attempts: otpData.attempts + 1 })
            return { success: false, error: `Invalid OTP. ${2 - otpData.attempts} attempts remaining.` }
        }

        await deleteDoc(otpRef)
        return { success: true }
    } catch (error) {
        console.error('OTP verification failed:', error)
        return { success: false, error: 'Verification failed' }
    }
}

export function verifyOTP(inputOtp: string): { success: boolean; error?: string } {
    console.warn('DEPRECATED: verifyOTP() is deprecated. Use verifyOTPAsync() instead.')
    return { success: false, error: 'Use verifyOTPAsync instead' }
}

export async function verifyPasswordAsync(inputPassword: string): Promise<{ success: boolean; error?: string }> {
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
        return { success: false, error: 'Authentication failed' }
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
