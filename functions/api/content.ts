// Cloudflare Pages Function for content storage using KV

interface Env {
    RF_CONTENT: KVNamespace
}

interface ContentItem {
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

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
}

const CONTENT_KEY = 'rf-content-items'

export const onRequestGet: PagesFunction<Env> = async (context) => {
    try {
        const data = await context.env.RF_CONTENT.get(CONTENT_KEY)
        let items: ContentItem[] = data ? JSON.parse(data) : []
        
        // Auto-migrate: assign slugs to items that don't have one
        let needsSave = false
        const usedSlugs = new Set(items.filter(i => i.slug).map(i => i.slug))
        
        for (const item of items) {
            if (!item.slug) {
                let baseSlug = generateSlug(item.title || 'untitled')
                let slug = baseSlug
                let counter = 1
                while (usedSlugs.has(slug)) {
                    slug = `${baseSlug}-${counter}`
                    counter++
                }
                item.slug = slug
                usedSlugs.add(slug)
                needsSave = true
            }
        }
        
        if (needsSave) {
            await context.env.RF_CONTENT.put(CONTENT_KEY, JSON.stringify(items))
        }
        
        const url = new URL(context.request.url)
        const publishedOnly = url.searchParams.get('published') === 'true'
        const id = url.searchParams.get('id')
        const slug = url.searchParams.get('slug')
        
        // Return single item by ID
        if (id) {
            const item = items.find(i => i.id === id)
            if (!item) {
                return new Response(JSON.stringify({ error: 'Content not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                })
            }
            return new Response(JSON.stringify(item), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            })
        }
        
        // Return single item by slug
        if (slug) {
            const item = items.find(i => i.slug === slug && i.status === 'published')
            if (!item) {
                return new Response(JSON.stringify({ error: 'Content not found' }), {
                    status: 404,
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                })
            }
            return new Response(JSON.stringify(item), {
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            })
        }
        
        let result = items
        if (publishedOnly) {
            result = items.filter(item => item.status === 'published')
        }
        
        return new Response(JSON.stringify(result), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch content' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const body = await context.request.json() as Partial<ContentItem>
        const data = await context.env.RF_CONTENT.get(CONTENT_KEY)
        const items: ContentItem[] = data ? JSON.parse(data) : []
        
        const baseSlug = generateSlug(body.title || 'untitled')
        let slug = baseSlug
        let counter = 1
        while (items.some(i => i.slug === slug)) {
            slug = `${baseSlug}-${counter}`
            counter++
        }
        
        const newItem: ContentItem = {
            ...body as ContentItem,
            id: `rf-${body.type}-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
            slug,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publishedAt: body.status === 'published' ? new Date().toISOString() : undefined,
        }
        
        items.push(newItem)
        await context.env.RF_CONTENT.put(CONTENT_KEY, JSON.stringify(items))
        
        return new Response(JSON.stringify(newItem), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to create content' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}

export const onRequestPut: PagesFunction<Env> = async (context) => {
    try {
        const body = await context.request.json() as { id: string } & Partial<ContentItem>
        const data = await context.env.RF_CONTENT.get(CONTENT_KEY)
        const items: ContentItem[] = data ? JSON.parse(data) : []
        
        const index = items.findIndex(item => item.id === body.id)
        if (index === -1) {
            return new Response(JSON.stringify({ error: 'Content not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            })
        }
        
        const existingItem = items[index]
        const wasPublished = existingItem.status === 'published'
        const isNowPublished = body.status === 'published'
        
        items[index] = {
            ...existingItem,
            ...body,
            id: existingItem.id,
            createdAt: existingItem.createdAt,
            updatedAt: new Date().toISOString(),
            publishedAt: isNowPublished && !wasPublished
                ? new Date().toISOString()
                : existingItem.publishedAt,
        }
        
        await context.env.RF_CONTENT.put(CONTENT_KEY, JSON.stringify(items))
        
        return new Response(JSON.stringify(items[index]), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to update content' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}

export const onRequestDelete: PagesFunction<Env> = async (context) => {
    try {
        const url = new URL(context.request.url)
        const id = url.searchParams.get('id')
        
        if (!id) {
            return new Response(JSON.stringify({ error: 'ID required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            })
        }
        
        const data = await context.env.RF_CONTENT.get(CONTENT_KEY)
        const items: ContentItem[] = data ? JSON.parse(data) : []
        
        const filteredItems = items.filter(item => item.id !== id)
        await context.env.RF_CONTENT.put(CONTENT_KEY, JSON.stringify(filteredItems))
        
        return new Response(JSON.stringify({ success: true }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to delete content' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        })
    }
}

export const onRequestOptions: PagesFunction = async () => {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    })
}
