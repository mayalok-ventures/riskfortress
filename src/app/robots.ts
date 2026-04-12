import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: [
                    '/',
                    '/capabilities/',
                    '/council/',
                    '/mandate/',
                    '/dossiers/',
                ],
                disallow: [
                    '/rf-admin/',
                    '/api/',
                    '/secure-intake/',
                    '/_next/',
                ],
            },
            {
                userAgent: 'GPTBot',
                disallow: ['/'],
            },
            {
                userAgent: 'CCBot',
                disallow: ['/'],
            },
        ],
        sitemap: 'https://riskfortress.in/sitemap.xml',
        host: 'https://riskfortress.in',
    }
}
