// Cloudflare Pages Function to handle dynamic dossier routes

interface Env {
    ASSETS: Fetcher
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const url = new URL(context.request.url)
    
    // Serve the placeholder page for all dossier slug routes
    const placeholderUrl = new URL('/dossiers/_placeholder/', url.origin)
    
    try {
        const response = await context.env.ASSETS.fetch(placeholderUrl)
        
        return new Response(response.body, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'public, max-age=60, s-maxage=300',
            },
        })
    } catch {
        // Return 404 if placeholder not found
        return new Response('Not Found', { status: 404 })
    }
}
