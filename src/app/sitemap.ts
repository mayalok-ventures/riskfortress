import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const SITE_URL = 'https://riskfortress.in'

// Static pages with priorities
const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/capabilities/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/council/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/mandate/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/dossiers/`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/secure-intake/`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
]

async function getDynamicRoutes(): Promise<MetadataRoute.Sitemap> {
    try {
        const response = await fetch(`${SITE_URL}/api/content?published=true`, {
            next: { revalidate: 3600 },
        })
        if (!response.ok) return []
        const posts = await response.json()
        return posts.map((post: { slug: string; updatedAt?: string; type: string }) => ({
            url: `${SITE_URL}/dossiers/${post.slug}/`,
            lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: post.type === 'case' ? 0.7 : 0.6,
        }))
    } catch {
        return []
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const dynamicRoutes = await getDynamicRoutes()
    return [...staticRoutes, ...dynamicRoutes]
}
