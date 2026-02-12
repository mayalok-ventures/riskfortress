import { db } from '../firebase'
import { doc, getDoc, deleteDoc } from 'firebase/firestore'

export interface AuthResult {
    ok: boolean
    status: number
    error?: string
    token?: string
}

export async function requireAdminSession(request: Request): Promise<AuthResult> {
    const auth = request.headers.get('authorization') || ''
    const match = auth.match(/^Bearer\s+(.+)$/i)
    const token = match?.[1]

    if (!token) {
        return { ok: false, status: 401, error: 'Authentication required' }
    }

    try {
        const snap = await getDoc(doc(db, 'sessions', token))
        if (!snap.exists()) {
            return { ok: false, status: 401, error: 'Invalid session' }
        }

        const session = snap.data() as { expiresAt: number; createdAt: number }

        if (Date.now() > session.expiresAt) {
            await deleteDoc(doc(db, 'sessions', token))
            return { ok: false, status: 401, error: 'Session expired' }
        }

        return { ok: true, status: 200, token }
    } catch {
        return { ok: false, status: 500, error: 'Session validation failed' }
    }
}
