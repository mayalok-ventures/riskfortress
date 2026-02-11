import { db } from '../firebase'
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

interface Env {}

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

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
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

const contentCollection = collection(db, 'content')

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url)
    const publishedOnly = url.searchParams.get('published') === 'true'
    const id = url.searchParams.get('id')
    const slug = url.searchParams.get('slug')

    if (id) {
      const snap = await getDoc(doc(db, 'content', id))
      if (!snap.exists()) return jsonResponse({ error: 'Not found' }, 404)
      return jsonResponse({ id: snap.id, ...snap.data() } as ContentItem)
    }

    if (slug) {
      const q = query(
        contentCollection,
        where('slug', '==', slug),
        where('status', '==', 'published')
      )
      const snap = await getDocs(q)
      if (snap.empty) return jsonResponse({ error: 'Not found' }, 404)
      const d = snap.docs[0]
      return jsonResponse({ id: d.id, ...d.data() } as ContentItem)
    }

    let items: ContentItem[] = []
    try {
      let q
      if (publishedOnly) {
        q = query(
          contentCollection,
          where('status', '==', 'published'),
          orderBy('createdAt', 'desc')
        )
      } else {
        q = query(contentCollection, orderBy('createdAt', 'desc'))
      }
      const snap = await getDocs(q)
      items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ContentItem)
    } catch (queryError) {
      console.warn('Ordered query failed, falling back to unordered:', queryError)
      const snap = await getDocs(contentCollection)
      items = snap.docs.map((d) => ({ id: d.id, ...d.data() }) as ContentItem)
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      if (publishedOnly) {
        items = items.filter((item) => item.status === 'published')
      }
    }

    return jsonResponse(items)
  } catch (error) {
    console.error('GET error:', error)
    return jsonResponse({ error: 'Failed to fetch', details: String(error) }, 500)
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as Partial<ContentItem>

    const baseSlug = generateSlug(body.title || 'untitled')
    let slug = baseSlug
    let counter = 1

    while (true) {
      const q = query(contentCollection, where('slug', '==', slug))
      const existing = await getDocs(q)
      if (existing.empty) break
      slug = `${baseSlug}-${counter}`
      counter++
    }

    const now = new Date().toISOString()
    const id = `rf-${body.type || 'article'}-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`

    const data: ContentItem = {
      id,
      type: (body.type as ContentItem['type']) || 'article',
      title: body.title || '',
      slug,
      content: body.content || '',
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
    }

    const docData = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    )
    await setDoc(doc(db, 'content', id), docData)

    return jsonResponse(data)
  } catch (error) {
    console.error('POST error:', error)
    return jsonResponse({ error: 'Failed to create', details: String(error) }, 500)
  }
}

export const onRequestPut: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as { id: string } & Partial<ContentItem>

    const ref = doc(db, 'content', body.id)
    const snap = await getDoc(ref)
    if (!snap.exists()) return jsonResponse({ error: 'Not found' }, 404)

    const existing = snap.data() as ContentItem
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

    await updateDoc(ref, updates)

    const updated = await getDoc(ref)
    return jsonResponse({ id: updated.id, ...updated.data() } as ContentItem)
  } catch (error) {
    console.error('PUT error:', error)
    return jsonResponse({ error: 'Failed to update', details: String(error) }, 500)
  }
}

export const onRequestDelete: PagesFunction<Env> = async (context) => {
  try {
    const url = new URL(context.request.url)
    const id = url.searchParams.get('id')

    if (!id) return jsonResponse({ error: 'ID required' }, 400)

    await deleteDoc(doc(db, 'content', id))

    return jsonResponse({ success: true })
  } catch (error) {
    console.error('DELETE error:', error)
    return jsonResponse({ error: 'Failed to delete' }, 500)
  }
}

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, { headers: corsHeaders })
}
