import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/api/',
                '/admin/',
                '/private/',
                '/dashboard/',
                '/secure-intake/submit/',
            ],
        },
        sitemap: 'https://riskfortress.com/sitemap.xml',
        host: 'https://riskfortress.com',
    }
}