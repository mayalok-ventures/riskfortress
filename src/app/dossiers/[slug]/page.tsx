import { Metadata } from 'next'
import DossierDetailClient from './DossierDetailClient'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://riskfortress.in'

interface ContentItem {
    id: string
    type: 'case' | 'article' | 'blog'
    title: string
    slug: string
    summary: string
    thumbnail?: string
    author: string
    keywords: string[]
    status: string
    createdAt: string
    publishedAt?: string
}

async function getContentBySlug(slug: string): Promise<ContentItem | null> {
    try {
        const response = await fetch(`${API_URL}/api/content?slug=${slug}`, {
            next: { revalidate: 60 }
        })
        if (!response.ok) return null
        return await response.json()
    } catch {
        return null
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    
    if (slug === '_placeholder') {
        return {
            title: 'Intelligence Dossier',
            description: 'RiskFortress Intelligence Dossier'
        }
    }
    
    const content = await getContentBySlug(slug)
    
    if (!content) {
        return {
            title: 'Dossier Not Found | RiskFortress',
            description: 'The requested dossier could not be found.'
        }
    }
    
    const typeLabel = content.type === 'case' ? 'Intelligence Dossier' : 
                      content.type === 'article' ? 'Intelligence Article' : 'Expert Insights'
    
    const ogImage = content.thumbnail || '/og-image.png'
    const pageUrl = `https://riskfortress.in/dossiers/${slug}`
    
    return {
        title: `${content.title} | ${typeLabel}`,
        description: content.summary || `Read this ${typeLabel.toLowerCase()} from RiskFortress Intelligence.`,
        keywords: content.keywords || [],
        authors: [{ name: content.author || 'RiskFortress Intelligence Team' }],
        openGraph: {
            type: 'article',
            locale: 'en_IN',
            url: pageUrl,
            title: content.title,
            description: content.summary || `Read this ${typeLabel.toLowerCase()} from RiskFortress Intelligence.`,
            siteName: 'RiskFortress Intelligence',
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: content.title,
                }
            ],
            publishedTime: content.publishedAt || content.createdAt,
            authors: [content.author || 'RiskFortress Intelligence Team'],
        },
        twitter: {
            card: 'summary_large_image',
            title: content.title,
            description: content.summary || `Read this ${typeLabel.toLowerCase()} from RiskFortress Intelligence.`,
            images: [ogImage],
            creator: '@riskfortress',
            site: '@riskfortress',
        },
        alternates: {
            canonical: pageUrl,
        },
    }
}

export function generateStaticParams() {
    return [{ slug: '_placeholder' }]
}

export default async function DossierDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    return <DossierDetailClient slug={slug} />
}
