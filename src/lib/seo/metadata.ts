import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://riskfortress.com'

// Default metadata for all pages
export const defaultMetadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: 'RiskFortress | Enterprise Risk Management & Corporate Intelligence India',
        template: '%s | RiskFortress Intelligence'
    },
    description: 'Advanced Predictive Risk Analytics for Heavy Industries and Family Offices. We specialize in Land Due Diligence, TSCM, and Strategic Security Consulting.',
    keywords: [
        // Tier 1: Money Keywords
        'Enterprise Risk Management India',
        'Corporate Intelligence Agency',
        'Predictive Risk Analytics',
        'Strategic Security Consulting',
        'Industrial Espionage Countermeasures',
        // Tier 2: Capability Keywords
        'Land Due Diligence India',
        'TSCM Services India',
        'Family Office Risk Management',
        'HNI Executive Protection India',
        // Tier 3: Future Keywords
        'AI-Driven Risk Modeling',
        'Future Threat Forecasting',
        'Predictive Intelligence Engine',
    ],
    authors: [{ name: 'RiskFortress Intelligence', url: baseUrl }],
    creator: 'RiskFortress Intelligence Engine',
    publisher: 'RiskFortress Holdings',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: baseUrl,
        siteName: 'RiskFortress',
        title: 'RiskFortress | Enterprise Intelligence & Risk Platform',
        description: 'Predictive Intelligence for safeguarding India\'s most critical industrial assets and private legacies.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'RiskFortress Intelligence Platform',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'RiskFortress Intelligence',
        description: 'Enterprise-grade risk intelligence platform for HNIs and Corporations',
        images: ['/og-image.png'],
        creator: '@riskfortress',
    },
    verification: {
        google: 'google-site-verification-code',
    },
    category: 'Security Services',
    classification: 'Corporate Intelligence',
    formatDetection: {
        email: false,
        address: false,
        telephone: true,
    },
}

// Page-specific metadata generators
export function generatePageMetadata(
    title: string,
    description: string,
    path: string = '/',
    image?: string
): Metadata {
    return {
        title,
        description,
        openGraph: {
            ...defaultMetadata.openGraph,
            title,
            description,
            url: `${baseUrl}${path}`,
            images: image ? [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                }
            ] : defaultMetadata.openGraph?.images,
        },
        twitter: {
            ...defaultMetadata.twitter,
            title,
            description,
        },
        alternates: {
            canonical: path,
        },
    }
}

// Schema.org JSON-LD generators
export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'RiskFortress Intelligence',
        url: baseUrl,
        logo: `${baseUrl}/logo.png`,
        description: defaultMetadata.description,
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Mumbai',
            addressRegion: 'Maharashtra',
            addressCountry: 'IN',
            postalCode: '400021',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Intelligence Inquiry',
            telephone: '+91-22-XXXX-XXXX',
            email: 'intelligence@riskfortress.com',
            availableLanguage: ['English', 'Hindi'],
        },
        sameAs: [
            `${baseUrl}/linkedin`,
            `${baseUrl}/twitter`,
        ],
    }
}

export function generateServiceSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: [
            'Enterprise Risk Management',
            'Corporate Intelligence',
            'Land Due Diligence',
            'TSCM Services',
            'Family Office Security',
            'Predictive Risk Analytics',
        ],
        provider: {
            '@type': 'Organization',
            name: 'RiskFortress Intelligence',
        },
        areaServed: {
            '@type': 'Country',
            name: 'India',
        },
    }
}

// Breadcrumb schema
export function generateBreadcrumbSchema(paths: Array<{ name: string, url: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: paths.map((path, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: path.name,
            item: `${baseUrl}${path.url}`,
        })),
    }
}

// FAQ schema generator
export function generateFAQSchema(questions: Array<{ question: string, answer: string }>) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: questions.map(q => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: q.answer,
            },
        })),
    }
}