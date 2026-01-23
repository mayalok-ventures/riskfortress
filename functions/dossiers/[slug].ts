// Cloudflare Pages Function to handle dynamic dossier routes
// This serves the static HTML page for any /dossiers/:slug route

interface Env {
    ASSETS: Fetcher
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const url = new URL(context.request.url)
    const slug = context.params.slug
    
    // Skip if it's a static asset request
    if (typeof slug === 'string' && (slug.endsWith('.js') || slug.endsWith('.css') || slug.endsWith('.json'))) {
        return context.env.ASSETS.fetch(context.request)
    }
    
    // Rewrite to serve the placeholder page HTML but keep the original URL
    const placeholderUrl = new URL('/dossiers/_placeholder/index.html', url.origin)
    
    try {
        // Fetch the placeholder page from static assets
        const response = await context.env.ASSETS.fetch(placeholderUrl)
        
        if (!response.ok) {
            // Fallback: try without trailing path
            const fallbackUrl = new URL('/dossiers/_placeholder/', url.origin)
            const fallbackResponse = await context.env.ASSETS.fetch(fallbackUrl)
            
            return new Response(fallbackResponse.body, {
                status: 200,
                headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'public, max-age=0, must-revalidate',
                },
            })
        }
        
        // Return the response with the original URL preserved
        return new Response(response.body, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'public, max-age=0, must-revalidate',
            },
        })
    } catch (error) {
        return new Response('Page not found', { status: 404 })
    }
}
