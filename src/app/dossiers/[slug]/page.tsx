import DossierDetailClient from './DossierDetailClient'

export function generateStaticParams() {
    return [{ slug: '_placeholder' }]
}

export default async function DossierDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    return <DossierDetailClient slug={slug} />
}
