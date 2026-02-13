import { setDoc, queryDocs } from '../lib/firestore'

interface Env {}

const BLOCKED_DOMAINS = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'hotmail.com',
    'aol.com',
    'icloud.com',
    'protonmail.com',
    'ymail.com',
    'mail.com',
    'zoho.com',
    'live.com',
    'msn.com',
]

const corsHeaders = {
    'Access-Control-Allow-Origin': 'https://riskfortress.in',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

function jsonResponse(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
}

function generateGrantToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
}

function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const body = (await context.request.json()) as {
            email: string
            slug: string
            caseTitle: string
        }

        const { email, slug, caseTitle } = body

        if (!email || !slug || !caseTitle) {
            return jsonResponse({ error: 'Missing required fields' }, 400)
        }

        if (!isValidEmail(email)) {
            return jsonResponse({ error: 'Invalid email format' }, 400)
        }

        const domain = email.split('@')[1].toLowerCase()
        if (BLOCKED_DOMAINS.includes(domain)) {
            return jsonResponse({ error: 'Please use a professional email address' }, 400)
        }

        const snap = await queryDocs('content', [
            { field: 'slug', op: '==', value: slug },
            { field: 'status', op: '==', value: 'published' },
            { field: 'type', op: '==', value: 'case' },
        ])

        if (snap.empty) {
            return jsonResponse({ error: 'Case study not found' }, 404)
        }

        const d = snap.docs[0]
        const contentId = d.id

        const ip = context.request.headers.get('cf-connecting-ip') || 'unknown'
        const leadId = `lead-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`

        await setDoc('email_leads', leadId, {
            email,
            caseTitle,
            slug,
            contentId,
            createdAt: Date.now(),
            ip,
        })

        fetch('https://formspree.io/f/mlggebdr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, caseTitle }),
        }).catch(() => {})

        const grantToken = generateGrantToken()

        await setDoc('case_grants', grantToken, {
            contentId,
            slug,
            expiresAt: Date.now() + 30 * 60 * 1000,
            createdAt: Date.now(),
            email,
        })

        return jsonResponse({ success: true, grantToken })
    } catch (error) {
        console.error('Email gate POST error:', error)
        return jsonResponse({ error: 'Failed to process request' }, 500)
    }
}

export const onRequestOptions: PagesFunction = async () => {
    return new Response(null, { headers: corsHeaders })
}
