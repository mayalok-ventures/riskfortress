import { addDoc } from '../lib/firestore'
import { requireAdminSession } from '../lib/admin-auth'

interface Env {
    RF_CONTENT: KVNamespace
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

function jsonResponse(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
}

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const auth = await requireAdminSession(context.request)
    if (!auth.ok) {
        return jsonResponse({ error: auth.error }, auth.status)
    }

    try {
        const formData = await context.request.formData()
        const file = formData.get('image') as File | null

        if (!file) {
            return jsonResponse({ error: 'No image file provided' }, 400)
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return jsonResponse({ error: `Invalid file type: ${file.type}. Allowed: PNG, JPG, GIF, WebP, SVG` }, 400)
        }

        if (file.size > MAX_SIZE) {
            return jsonResponse({ error: `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum: 5MB` }, 400)
        }

        // Convert to base64 data URL
        const arrayBuffer = await file.arrayBuffer()
        const base64 = btoa(
            new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
        const dataUrl = `data:${file.type};base64,${base64}`

        // Generate a unique key
        const key = `img-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`

        // Store in KV for fast access
        if (context.env.RF_CONTENT) {
            await context.env.RF_CONTENT.put(key, dataUrl, {
                metadata: {
                    filename: file.name,
                    type: file.type,
                    size: file.size,
                    uploadedAt: new Date().toISOString(),
                },
            })
        }

        // Also store metadata in Firestore for listing
        await addDoc('uploads', {
            key,
            filename: file.name,
            type: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString(),
        })

        return jsonResponse({
            success: true,
            url: `https://riskfortress.in/api/img/${key}`,
            key,
            filename: file.name,
            size: file.size,
        })
    } catch (error) {
        console.error('Upload error:', error)
        return jsonResponse({ error: 'Failed to upload image' }, 500)
    }
}

export const onRequestOptions: PagesFunction = async () => {
    return new Response(null, { headers: corsHeaders })
}
