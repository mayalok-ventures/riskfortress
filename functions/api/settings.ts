import { getDoc, setDoc } from '../lib/firestore'
import { requireAdminSession } from '../lib/admin-auth'
import { buildCorsHeaders } from '../lib/cors'

interface Env {}

interface SiteSettings {
    contact: {
        email: string
        phone: string
        address: string
        mapEmbed: string
    }
    seo: {
        metaTitle: string
        metaDescription: string
        metaKeywords: string
        ogImage: string
        canonicalUrl: string
        googleVerification: string
        bingVerification: string
    }
    social: {
        twitter: string
        linkedin: string
        facebook: string
        instagram: string
        youtube: string
        github: string
    }
    general: {
        siteName: string
        tagline: string
        logo: string
        favicon: string
        maintenanceMode: boolean
    }
    updatedAt: string
}

function jsonResponse(data: unknown, status = 200, corsHeaders?: Record<string, string>): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...(corsHeaders || {}) },
    })
}

const COLLECTION = 'site_settings'
const DOC_ID = 'riskfortress'

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const cors = buildCorsHeaders(context.request, 'GET, PUT, OPTIONS')
    try {
        const url = new URL(context.request.url)
        const publicOnly = url.searchParams.get('public') === 'true'

        if (publicOnly) {
            // Public endpoint: no auth required, returns only public-safe fields
            const snap = await getDoc(COLLECTION, DOC_ID)
            if (!snap.exists) {
                return jsonResponse({}, 200, cors)
            }
            const data = snap.data() as Record<string, unknown>
            // Only return public-safe fields
            return jsonResponse({
                contact: data.contact || {},
                social: data.social || {},
                seo: data.seo || {},
                general: data.general || {},
            }, 200, cors)
        }

        // Admin endpoint: requires auth, returns everything
        const auth = await requireAdminSession(context.request)
        if (!auth.ok) {
            return jsonResponse({ error: auth.error }, auth.status, cors)
        }

        const snap = await getDoc(COLLECTION, DOC_ID)
        if (!snap.exists) {
            return jsonResponse({}, 200, cors)
        }
        return jsonResponse(snap.data(), 200, cors)
    } catch (error) {
        console.error('GET settings error:', error)
        return jsonResponse({ error: 'Failed to fetch settings' }, 500, cors)
    }
}

export const onRequestPut: PagesFunction<Env> = async (context) => {
    const cors = buildCorsHeaders(context.request, 'GET, PUT, OPTIONS')
    const auth = await requireAdminSession(context.request)
    if (!auth.ok) {
        return jsonResponse({ error: auth.error }, auth.status, cors)
    }

    try {
        const body = (await context.request.json()) as Partial<SiteSettings>
        const now = new Date().toISOString()

        // Read existing settings
        const snap = await getDoc(COLLECTION, DOC_ID)
        const existing = snap.exists ? (snap.data() as Record<string, unknown>) : {}

        // Deep merge: for each top-level key in body, merge nested objects
        const merged: Record<string, unknown> = { ...existing }
        for (const [key, value] of Object.entries(body)) {
            if (value && typeof value === 'object' && !Array.isArray(value) && existing[key] && typeof existing[key] === 'object') {
                // Merge nested objects (e.g., social, contact, seo)
                const existingNested = existing[key] as Record<string, unknown>
                const newNested = value as Record<string, unknown>
                // Strip undefined values and merge
                const mergedNested: Record<string, unknown> = { ...existingNested }
                for (const [nk, nv] of Object.entries(newNested)) {
                    if (nv !== undefined) {
                        mergedNested[nk] = nv
                    }
                }
                merged[key] = mergedNested
            } else if (value !== undefined) {
                merged[key] = value
            }
        }
        merged.updatedAt = now

        // Write the fully merged document
        await setDoc(COLLECTION, DOC_ID, merged)

        return jsonResponse(merged, 200, cors)
    } catch (error) {
        console.error('PUT settings error:', error)
        return jsonResponse({ error: 'Failed to update settings' }, 500, cors)
    }
}

export const onRequestOptions: PagesFunction = async (context) => {
    return new Response(null, { headers: buildCorsHeaders(context.request, 'GET, PUT, OPTIONS') })
}
