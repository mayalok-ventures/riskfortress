import { setDoc, queryDocs } from '../lib/firestore'
import { buildCorsHeaders } from '../lib/cors'

interface Env {}

function jsonResponse(data: unknown, status = 200, corsHeaders?: Record<string, string>): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...(corsHeaders || {}) },
    })
}

function generateGrantToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const cors = buildCorsHeaders(context.request, 'GET, OPTIONS')
    try {
        const url = new URL(context.request.url)
        const token = url.searchParams.get('token')

        if (!token || token.length < 6) {
            return jsonResponse({ error: 'Invalid token' }, 400, cors)
        }

        const snap = await queryDocs('content', [
            { field: 'accessToken', op: '==', value: token },
            { field: 'status', op: '==', value: 'published' },
        ])

        if (snap.empty) {
            return jsonResponse({ error: 'Not found' }, 404, cors)
        }

        const d = snap.docs[0]
        const data = d.data() as { type: string; slug: string; title: string; id?: string }

        if (data.type === 'case') {
            const grantToken = generateGrantToken()

            await setDoc('case_grants', grantToken, {
                contentId: d.id,
                slug: data.slug,
                expiresAt: Date.now() + 30 * 60 * 1000,
                createdAt: Date.now(),
            })

            return jsonResponse({
                type: 'case',
                slug: data.slug,
                title: data.title,
                grantToken,
            }, 200, cors)
        }

        return jsonResponse({
            type: data.type,
            slug: data.slug,
            title: data.title,
        }, 200, cors)
    } catch (error) {
        console.error('Short link error:', error)
        return jsonResponse({ error: 'Failed to resolve link' }, 500, cors)
    }
}

export const onRequestOptions: PagesFunction = async (context) => {
    return new Response(null, { headers: buildCorsHeaders(context.request, 'GET, OPTIONS') })
}
