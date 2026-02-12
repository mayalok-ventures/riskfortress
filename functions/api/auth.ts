import { db } from '../firebase'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'

interface Env {}

interface AuthRequest {
    password?: string
    action?: 'verify' | 'logout'
    token?: string
}

const ALLOWED_ORIGIN = 'https://riskfortress.in'

const corsHeaders = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

function jsonResponse(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
}

async function hashString(input: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

function getClientIP(request: Request): string {
    return (
        request.headers.get('cf-connecting-ip') ||
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        'unknown'
    )
}

function generateSessionToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
}

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000

async function checkRateLimit(ip: string): Promise<{ allowed: boolean; remaining: number }> {
    const ipHash = await hashString(ip)
    const ref = doc(db, 'rate_limits', ipHash)

    try {
        const snap = await getDoc(ref)
        if (!snap.exists()) return { allowed: true, remaining: MAX_ATTEMPTS }

        const data = snap.data() as { failedCount: number; windowStart: number; lockedUntil?: number }

        if (data.lockedUntil && Date.now() < data.lockedUntil) {
            return { allowed: false, remaining: 0 }
        }

        if (Date.now() - data.windowStart > WINDOW_MS) {
            await deleteDoc(ref)
            return { allowed: true, remaining: MAX_ATTEMPTS }
        }

        if (data.failedCount >= MAX_ATTEMPTS) {
            await setDoc(ref, { ...data, lockedUntil: Date.now() + WINDOW_MS })
            return { allowed: false, remaining: 0 }
        }

        return { allowed: true, remaining: MAX_ATTEMPTS - data.failedCount }
    } catch {
        return { allowed: true, remaining: MAX_ATTEMPTS }
    }
}

async function recordFailedAttempt(ip: string): Promise<void> {
    const ipHash = await hashString(ip)
    const ref = doc(db, 'rate_limits', ipHash)

    try {
        const snap = await getDoc(ref)
        if (!snap.exists()) {
            await setDoc(ref, { failedCount: 1, windowStart: Date.now() })
            return
        }

        const data = snap.data() as { failedCount: number; windowStart: number }

        if (Date.now() - data.windowStart > WINDOW_MS) {
            await setDoc(ref, { failedCount: 1, windowStart: Date.now() })
            return
        }

        const newCount = data.failedCount + 1
        const updates: Record<string, unknown> = {
            failedCount: newCount,
            windowStart: data.windowStart,
        }
        if (newCount >= MAX_ATTEMPTS) {
            updates.lockedUntil = Date.now() + WINDOW_MS
        }
        await setDoc(ref, updates)
    } catch {
        // silently fail
    }
}

async function clearRateLimit(ip: string): Promise<void> {
    const ipHash = await hashString(ip)
    try {
        await deleteDoc(doc(db, 'rate_limits', ipHash))
    } catch {
        // silently fail
    }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const body = (await context.request.json()) as AuthRequest
        const { action = 'verify', password, token } = body

        if (action === 'logout' && token) {
            try {
                await deleteDoc(doc(db, 'sessions', token))
            } catch {
                // session might already be gone
            }
            return jsonResponse({ success: true })
        }

        if (action === 'verify' && password) {
            const ip = getClientIP(context.request)
            const rateCheck = await checkRateLimit(ip)

            if (!rateCheck.allowed) {
                return jsonResponse(
                    { success: false, error: 'Too many failed attempts. Please try again later.' },
                    429
                )
            }

            const configSnap = await getDoc(doc(db, 'secrets', 'admin_config'))
            const config = configSnap.exists() ? configSnap.data() : null
            const storedHash = config?.ADMIN_PASSWORD_HASH as string | undefined

            if (!storedHash) {
                console.error('ADMIN_PASSWORD_HASH not configured')
                return jsonResponse(
                    { success: false, error: 'Authentication not configured.' },
                    500
                )
            }

            const inputHash = await hashString(password)
            const isValid = inputHash === storedHash

            if (isValid) {
                await clearRateLimit(ip)

                const sessionToken = generateSessionToken()
                const expiry = Date.now() + 10 * 60 * 60 * 1000

                await setDoc(doc(db, 'sessions', sessionToken), {
                    createdAt: Date.now(),
                    expiresAt: expiry,
                    ip,
                    userAgent: context.request.headers.get('user-agent') || '',
                    type: 'admin',
                })

                return jsonResponse({
                    success: true,
                    token: sessionToken,
                    expiresAt: expiry,
                })
            }

            await recordFailedAttempt(ip)
            await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))
            return jsonResponse({ success: false, error: 'Invalid credentials' }, 401)
        }

        return jsonResponse({ error: 'Invalid request' }, 400)
    } catch (error) {
        console.error('Auth error:', error)
        return jsonResponse({ error: 'Authentication failed' }, 500)
    }
}

export const onRequestOptions: PagesFunction = async () => {
    return new Response(null, { headers: corsHeaders })
}
