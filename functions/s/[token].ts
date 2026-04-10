interface Env {
    ASSETS: Fetcher
}

export const onRequest: PagesFunction<Env> = async (context) => {
    const url = new URL(context.request.url)
    const placeholderUrl = new URL('/s/_placeholder/', url.origin)

    try {
        const response = await context.env.ASSETS.fetch(placeholderUrl)

        return new Response(response.body, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        })
    } catch {
        return new Response('Not Found', { status: 404 })
    }
}
