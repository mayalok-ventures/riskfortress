interface Env {
    RF_CONTENT: KVNamespace
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
    const key = (context.params as { key: string }).key as string

    if (!key) {
        return new Response('Not found', { status: 404 })
    }

    try {
        const kvResult = await context.env.RF_CONTENT.getWithMetadata(key)

        if (!kvResult.value) {
            return new Response('Image not found', { status: 404 })
        }

        const dataUrl = kvResult.value as string

        // Parse data URL: data:image/png;base64,xxxxx
        const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/)
        if (!match) {
            return new Response('Invalid image data', { status: 500 })
        }

        const contentType = match[1]
        const base64Data = match[2]

        // Convert base64 to binary
        const binaryString = atob(base64Data)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
        }

        return new Response(bytes, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable',
                'Access-Control-Allow-Origin': '*',
            },
        })
    } catch (error) {
        console.error('Image serve error:', error)
        return new Response('Server error', { status: 500 })
    }
}
