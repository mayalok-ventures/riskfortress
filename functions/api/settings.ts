import { getDoc, setDoc, updateDoc } from '../lib/firestore'
import { requireAdminSession } from '../lib/admin-auth'

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

const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://riskfortress.in',
    'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

function jsonResponse(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
}

const COLLECTION = 'site_settings'
const DOC_ID = 'riskfortress'

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const auth = await requireAdminSession(context.request)
    if (!auth.ok) {
        return jsonResponse({ error: auth.error }, auth.status)
    }

    try {
        const snap = await getDoc(COLLECTION, DOC_ID)
        if (!snap.exists) {
            return jsonResponse({})
        }
        return jsonResponse(snap.data())
    } catch (error) {
        console.error('GET settings error:', error)
        return jsonResponse({ error: 'Failed to fetch settings' }, 500)
    }
}

export const onRequestPut: PagesFunction<Env> = async (context) => {
    const auth = await requireAdminSession(context.request)
    if (!auth.ok) {
        return jsonResponse({ error: auth.error }, auth.status)
    }

    try {
        const body = (await context.request.json()) as Partial<SiteSettings>
        const now = new Date().toISOString()

        const snap = await getDoc(COLLECTION, DOC_ID)

        if (!snap.exists) {
            const data = { ...body, updatedAt: now }
            await setDoc(COLLECTION, DOC_ID, data as Record<string, unknown>)
            return jsonResponse(data)
        }

        const updates: Record<string, unknown> = { ...body, updatedAt: now }
        await updateDoc(COLLECTION, DOC_ID, updates)

        const updated = await getDoc(COLLECTION, DOC_ID)
        return jsonResponse(updated.data())
    } catch (error) {
        console.error('PUT settings error:', error)
        return jsonResponse({ error: 'Failed to update settings' }, 500)
    }
}

export const onRequestOptions: PagesFunction = async () => {
    return new Response(null, { headers: corsHeaders })
}
