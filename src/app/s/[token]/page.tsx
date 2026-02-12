import ShortLinkClient from './ShortLinkClient'

export function generateStaticParams() {
    return [{ token: '_placeholder' }]
}

export default async function ShortLinkPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params
    return <ShortLinkClient token={token} />
}
