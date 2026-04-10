import type { Metadata } from 'next'

import ShortLinkClient from './ShortLinkClient'

export const metadata: Metadata = {
    title: 'Secure Redirect | RiskFortress',
    description: 'Secure short-link redirection endpoint.',
    robots: {
        index: false,
        follow: false,
        googleBot: {
            index: false,
            follow: false,
            'max-image-preview': 'none',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
    },
}

export function generateStaticParams() {
    return [{ token: '_placeholder' }]
}

export default async function ShortLinkPage({ params }: { params: Promise<{ token: string }> }) {
    const { token } = await params
    return <ShortLinkClient token={token} />
}
