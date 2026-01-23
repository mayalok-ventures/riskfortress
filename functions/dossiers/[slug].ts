// Cloudflare Pages Function to handle dynamic dossier routes
// This serves the static HTML page for any /dossiers/:slug route

export const onRequest: PagesFunction = async (context) => {
    const url = new URL(context.request.url)
    
    // Rewrite to serve the placeholder page HTML but keep the original URL
    const placeholderUrl = new URL('/dossiers/_placeholder/index.html', url.origin)
    
    // Fetch the placeholder page
    const response = await context.env.ASSETS.fetch(placeholderUrl)
    
    // Return the response with the original URL preserved
    return new Response(response.body, {
        status: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'public, max-age=0, must-revalidate',
        },
    })
}
