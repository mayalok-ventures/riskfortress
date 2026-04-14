import { getDoc, setDoc, updateDoc, deleteDoc, queryDocs } from '../lib/firestore'
import { requireAdminSession } from '../lib/admin-auth'

interface Env {}

interface ContentItem {
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
}

const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://riskfortress.in',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Case-Grant',
}

function jsonResponse(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
}

function generateSlug(title: string): string {
    return (
        title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim() || 'untitled'
    )
}

function generateAccessToken(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    const array = new Uint8Array(8)
    crypto.getRandomValues(array)
    return Array.from(array)
        .map((b) => chars[b % chars.length])
        .join('')
}

function stripSensitiveFields(item: Record<string, unknown>, isAdmin: boolean): Record<string, unknown> {
    const result = { ...item }
    if (!isAdmin) {
        delete result.accessToken
    }
    return result
}

function stripContentForListing(item: Record<string, unknown>): Record<string, unknown> {
    const result = { ...item }
    if ((result.type as string) === 'case') {
        delete result.content
        delete result.images
    }
    delete result.accessToken
    return result
}

async function validateCaseGrant(request: Request, contentId: string): Promise<boolean> {
    const grantToken = request.headers.get('x-case-grant')
    if (!grantToken) return false

    try {
        const snap = await getDoc('case_grants', grantToken)
        if (!snap.exists) return false

        const grant = snap.data() as { contentId: string; expiresAt: number }
        if (Date.now() > grant.expiresAt) {
            await deleteDoc('case_grants', grantToken)
            return false
        }
        return grant.contentId === contentId
    } catch {
        return false
    }
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        const url = new URL(context.request.url)
        const publishedOnly = url.searchParams.get('published') === 'true'
        const id = url.searchParams.get('id')
        const slug = url.searchParams.get('slug')

        if (id) {
            const auth = await requireAdminSession(context.request)
            if (!auth.ok) {
                return jsonResponse({ error: auth.error }, auth.status)
            }

            const snap = await getDoc('content', id)
            if (!snap.exists) return jsonResponse({ error: 'Not found' }, 404)
            return jsonResponse({ id: snap.id, ...snap.data() } as ContentItem)
        }

        if (slug) {
            const snap = await queryDocs('content', [
                { field: 'slug', op: '==', value: slug },
                { field: 'status', op: '==', value: 'published' },
            ])
            if (snap.empty) return jsonResponse({ error: 'Not found' }, 404)

            const d = snap.docs[0]
            const item = { id: d.id, ...d.data() } as ContentItem

            if (item.type === 'case') {
                const accessToken = url.searchParams.get('accessToken')
                let authorized = false

                if (accessToken && accessToken === item.accessToken) {
                    authorized = true
                } else {
                    authorized = await validateCaseGrant(context.request, item.id)
                }

                if (!authorized) {
                    return jsonResponse({ error: 'Not found' }, 404)
                }
            }

            return jsonResponse(stripSensitiveFields(item as unknown as Record<string, unknown>, false))
        }

        let items: ContentItem[] = []
        const isAdmin = (await requireAdminSession(context.request)).ok

        try {
            let snap
            if (publishedOnly) {
                snap = await queryDocs(
                    'content',
                    [{ field: 'status', op: '==', value: 'published' }],
                    'createdAt',
                    'desc'
                )
            } else {
                if (!isAdmin) {
                    return jsonResponse({ error: 'Authentication required' }, 401)
                }
                snap = await queryDocs('content', [], 'createdAt', 'desc')
            }
            items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ContentItem)
        } catch (queryError) {
            console.warn('Ordered query failed, falling back:', queryError)
            if (!publishedOnly && !isAdmin) {
                return jsonResponse({ error: 'Authentication required' }, 401)
            }
            const snap = await queryDocs('content', [])
            items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ContentItem)
            items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            if (publishedOnly) {
                items = items.filter((item) => item.status === 'published')
            }
        }

        if (isAdmin) {
            return jsonResponse(items)
        }

        return jsonResponse(
            items.map((item) => stripContentForListing(item as unknown as Record<string, unknown>))
        )
    } catch (error) {
        console.error('GET error:', error)
        return jsonResponse({ error: 'Failed to fetch' }, 500)
    }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const auth = await requireAdminSession(context.request)
    if (!auth.ok) {
        return jsonResponse({ error: auth.error }, auth.status)
    }

    try {
        const body = (await context.request.json()) as Partial<ContentItem>

        const baseSlug = generateSlug(body.title || 'untitled')
        let slug = baseSlug
        let counter = 1

        while (true) {
            const existing = await queryDocs('content', [{ field: 'slug', op: '==', value: slug }])
            if (existing.empty) break
            slug = `${baseSlug}-${counter}`
            counter++
        }

        let accessToken = generateAccessToken()
        let tokenUnique = false
        for (let i = 0; i < 10; i++) {
            const existing = await queryDocs('content', [{ field: 'accessToken', op: '==', value: accessToken }])
            if (existing.empty) {
                tokenUnique = true
                break
            }
            accessToken = generateAccessToken()
        }
        if (!tokenUnique) {
            return jsonResponse({ error: 'Failed to generate unique access token. Try again.' }, 500)
        }

        const now = new Date().toISOString()
        const id = `rf-${body.type || 'article'}-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`

        const data: ContentItem = {
            id,
            type: (body.type as ContentItem['type']) || 'article',
            title: body.title || '',
            slug,
            content: body.content || '',
            htmlContent: body.htmlContent,
            summary: body.summary || '',
            thumbnail: body.thumbnail,
            images: body.images,
            author: body.author || 'RiskFortress Intelligence Team',
            keywords: body.keywords || [],
            status: (body.status as ContentItem['status']) || 'draft',
            createdAt: now,
            updatedAt: now,
            publishedAt: body.status === 'published' ? now : undefined,
            sector: body.sector,
            threatLevel: body.threatLevel,
            confidence: body.confidence,
            location: body.location,
            caseStatus: body.caseStatus,
            accessToken,
        }

        const docData = Object.fromEntries(
            Object.entries(data).filter(([, v]) => v !== undefined)
        )
        await setDoc('content', id, docData)

        return jsonResponse(data)
    } catch (error) {
        console.error('POST error:', error)
        return jsonResponse({ error: 'Failed to create' }, 500)
    }
}

export const onRequestPut: PagesFunction<Env> = async (context) => {
    const auth = await requireAdminSession(context.request)
    if (!auth.ok) {
        return jsonResponse({ error: auth.error }, auth.status)
    }

    try {
        const body = (await context.request.json()) as { id: string } & Partial<ContentItem>

        const snap = await getDoc('content', body.id)
        if (!snap.exists) return jsonResponse({ error: 'Not found' }, 404)

        const existing = snap.data() as unknown as ContentItem
        const now = new Date().toISOString()
        const wasPublished = existing.status === 'published'
        const isNowPublished = body.status === 'published'
        const publishedAt = isNowPublished && !wasPublished ? now : existing.publishedAt

        const updates: Record<string, unknown> = {
            title: body.title ?? existing.title,
            summary: body.summary ?? existing.summary,
            thumbnail: body.thumbnail ?? existing.thumbnail,
            images: body.images ?? existing.images,
            author: body.author ?? existing.author,
            keywords: body.keywords ?? existing.keywords,
            status: body.status ?? existing.status,
            updatedAt: now,
            publishedAt,
            sector: body.sector ?? existing.sector,
            threatLevel: body.threatLevel ?? existing.threatLevel,
            confidence: body.confidence ?? existing.confidence,
            location: body.location ?? existing.location,
            caseStatus: body.caseStatus ?? existing.caseStatus,
        }

        if (body.content !== undefined) {
            updates.content = body.content
        }

        if (body.htmlContent !== undefined) {
            updates.htmlContent = body.htmlContent
        }

        if (!existing.accessToken) {
            updates.accessToken = generateAccessToken()
        }

        await updateDoc('content', body.id, updates)

        const updated = await getDoc('content', body.id)
        return jsonResponse({ id: updated.id, ...updated.data() } as ContentItem)
    } catch (error) {
        console.error('PUT error:', error)
        return jsonResponse({ error: 'Failed to update' }, 500)
    }
}

export const onRequestDelete: PagesFunction<Env> = async (context) => {
    const auth = await requireAdminSession(context.request)
    if (!auth.ok) {
        return jsonResponse({ error: auth.error }, auth.status)
    }

    try {
        const url = new URL(context.request.url)
        const id = url.searchParams.get('id')

        if (!id) return jsonResponse({ error: 'ID required' }, 400)

        await deleteDoc('content', id)

        return jsonResponse({ success: true })
    } catch (error) {
        console.error('DELETE error:', error)
        return jsonResponse({ error: 'Failed to delete' }, 500)
    }
}

export const onRequestOptions: PagesFunction = async () => {
    return new Response(null, { headers: corsHeaders })
}
