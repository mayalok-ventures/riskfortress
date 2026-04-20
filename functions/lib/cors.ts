const ALLOWED_ORIGINS = [
    'https://riskfortress.in',
    'https://www.riskfortress.in',
]

export function getCorsOrigin(request: Request): string {
    const origin = request.headers.get('Origin') || ''
    if (ALLOWED_ORIGINS.includes(origin)) return origin
    // Allow Cloudflare Pages preview deployments
    if (origin.endsWith('.pages.dev')) return origin
    return ALLOWED_ORIGINS[0]
}

export function buildCorsHeaders(request: Request, methods = 'GET, POST, OPTIONS') {
    return {
        'Access-Control-Allow-Origin': getCorsOrigin(request),
        'Access-Control-Allow-Methods': methods,
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Case-Grant',
    }
}
