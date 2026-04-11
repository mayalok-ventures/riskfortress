import { Metadata } from 'next'

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://riskfortress.in'
const verificationMetadata: Metadata['verification'] = {}

if (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) {
    verificationMetadata.google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
}

if (process.env.NEXT_PUBLIC_YANDEX_VERIFICATION) {
    verificationMetadata.yandex = process.env.NEXT_PUBLIC_YANDEX_VERIFICATION
}

if (process.env.NEXT_PUBLIC_YAHOO_VERIFICATION) {
    verificationMetadata.yahoo = process.env.NEXT_PUBLIC_YAHOO_VERIFICATION
}

// Default metadata for all pages
export const defaultMetadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: {
        default: 'RiskFortress India | Private Intelligence & HNI Asset Protection',
        template: '%s | RiskFortress India'
    },
    description: 'RiskFortress India delivers predictive risk intelligence for Ultra-HNWIs with ₹100Cr+ assets. We predict the crisis you don\'t see coming.',
    keywords: [
        // Phase 1: Identity Keywords (To kill Global Confusion)
        'RiskFortress India',
        'RiskFortress Security Division',
        'RiskFortress Asset Protection',
        'Mayalok Ventures Risk Management',
        'Private Intelligence Firm India',
        // Phase 2: HNI & Family Office Keywords (Targeting Wealth)
        'HNI Asset Protection Services India',
        'Family Office Risk Advisory',
        'Personal Threat Assessment for Executives',
        'High Net Worth Security Audit',
        'Kidnap and Ransom Prevention India',
        'K&R Prevention India',
        // Phase 3: Corporate & Startup Keywords (Targeting Businesses)
        'Corporate Espionage Countermeasures India',
        'TSCM Services Delhi',
        'TSCM Services India',
        'Insider Threat Detection Services',
        'Due Diligence for Angel Investors',
        'Startup Intellectual Property Protection',
        // Phase 4: Emergency/Pain Keywords (High Intent)
        'Hire Private Intelligence Agency India',
        'Corporate Fraud Investigation Services',
        'Executive Reputation Management Crisis',
        'Secure Transport for Valuables India',
        'Leak Investigation for Companies',
        // Primary Premium Keywords
        'Predictive Risk Intelligence',
        'Strategic Foresight for UHNWIs',
        'Asset Protection Intelligence',
        'Statutory Forensics',
        'High-Stakes Advisory Mandate',
    ],
    authors: [{ name: 'RiskFortress India - A Mayalok Ventures Entity', url: baseUrl }],
    creator: 'RiskFortress Strategic Foresight Entity',
    publisher: 'Mayalok Ventures',
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
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: baseUrl,
        siteName: 'RiskFortress India',
        title: 'RiskFortress India | Private Intelligence & HNI Asset Protection',
        description: 'RiskFortress India delivers predictive risk intelligence for Ultra-HNWIs with ₹100Cr+ assets. We predict the crisis you don\'t see coming.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'RiskFortress India - Private Intelligence & Asset Protection',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'RiskFortress India | Private Intelligence & HNI Asset Protection',
        description: 'RiskFortress India delivers predictive risk intelligence for Ultra-HNWIs with ₹100Cr+ assets. We predict the crisis you don\'t see coming.',
        images: ['/og-image.png'],
        creator: '@riskfortress',
    },
    verification: Object.keys(verificationMetadata).length > 0 ? verificationMetadata : undefined,
    category: 'Private Intelligence Services',
    classification: 'Asset Protection Intelligence',
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
        name: 'RiskFortress India - A Mayalok Ventures Entity',
        alternateName: ['RiskFortress Security Division', 'RiskFortress Asset Protection', 'Private Intelligence Firm India'],
        url: baseUrl,
        logo: `${baseUrl}/logos/logo.png`,
        description: 'RiskFortress is the specialized Risk Intelligence arm of Mayalok Ventures. Private Intelligence Firm India providing Predictive Risk Intelligence, HNI Asset Protection Services, and Corporate Espionage Countermeasures for Ultra-HNWIs with ₹100Cr+ assets.',
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Greater Noida',
            addressRegion: 'Uttar Pradesh',
            addressCountry: 'IN',
            postalCode: '201310',
        },
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Discrete Consultation',
            telephone: '',
            email: 'kunal@riskfortress.in',
            availableLanguage: ['English', 'Hindi'],
        },
        parentOrganization: {
            '@type': 'Organization',
            name: 'Mayalok Ventures',
        },
        sameAs: [
            'https://www.linkedin.com/company/riskfortress',
        ],
        knowsAbout: [
            'Predictive Risk Intelligence',
            'HNI Asset Protection Services India',
            'Corporate Espionage Countermeasures India',
            'TSCM Services India',
            'Kidnap and Ransom Prevention India',
            'Statutory Forensics',
            'Family Office Risk Advisory',
        ],
    }
}

export function generateServiceSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Service',
        serviceType: [
            'Predictive Risk Intelligence',
            'HNI Asset Protection Services India',
            'Corporate Espionage Countermeasures India',
            'TSCM Services Delhi',
            'Family Office Risk Advisory',
            'Statutory Forensics',
            'Kidnap and Ransom Prevention India',
            'Corporate Fraud Investigation Services',
            'Insider Threat Detection Services',
            'Executive Reputation Management Crisis',
        ],
        provider: {
            '@type': 'Organization',
            name: 'RiskFortress India - A Mayalok Ventures Entity',
        },
        areaServed: {
            '@type': 'Country',
            name: 'India',
        },
        audience: {
            '@type': 'Audience',
            audienceType: 'Ultra-High-Net-Worth Individuals with ₹100Cr+ assets',
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
