import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://riskfortress.com'

    const routes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/capabilities`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/dossiers`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/council`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/secure-intake`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        },
    ]

    // Generate sitemap entries for dynamic content
    const services = [
        'enterprise-risk-management',
        'land-due-diligence',
        'tscm-services',
        'family-office-security',
        'predictive-intelligence',
        'industrial-security',
    ]

    services.forEach(service => {
        routes.push({
            url: `${baseUrl}/services/${service}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        })
    })

    // Add blog/case studies if applicable
    const caseStudies = [
        'industrial-land-dispute-resolution',
        'corporate-espionage-prevention',
        'family-office-digital-security',
    ]

    caseStudies.forEach(caseStudy => {
        routes.push({
            url: `${baseUrl}/case-studies/${caseStudy}`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })
    })

    return routes
}