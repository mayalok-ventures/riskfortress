import type { Metadata } from 'next'
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'

import '@/styles/globals.css'
import { Toaster } from 'sonner'

import Footer from '@/components/Layout/Footer'
import Header from '@/components/Layout/Header'
import { ThemeProvider } from '@/components/Layout/ThemeProvider'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import CookieConsent from '@/components/CookieConsent'

const GA_MEASUREMENT_ID = 'G-0NB75DBBJP'
const SITE_URL = 'https://riskfortress.in'

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
    preload: true,
})

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
    preload: false,
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    display: 'swap',
    preload: false,
})

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

if (process.env.NEXT_PUBLIC_ME_VERIFICATION) {
    verificationMetadata.other = { me: process.env.NEXT_PUBLIC_ME_VERIFICATION }
}

export const metadata: Metadata = {
    title: 'RiskFortress India | Private Intelligence & HNI Asset Protection',
    description: 'RiskFortress India delivers predictive risk intelligence for Ultra-HNWIs with ₹100Cr+ assets. We predict the crisis you don\'t see coming.',
    keywords: [
        // Tier 1: Money Keywords
        'Enterprise Risk Management India',
        'Corporate Intelligence Agency',
        'Predictive Risk Analytics',
        'Strategic Security Consulting',
        'Industrial Espionage Countermeasures',
        'Forensic Risk Audit',
        'Geo-political Risk Intelligence',
        'Business Continuity Planning India',
        'Corporate Sovereignty Protection',
        'Chief Security Officer as a Service CSOaaS',
        // Tier 2: Capability Keywords
        'Land Due Diligence India',
        'Labor Unrest Prediction',
        'Supply Chain Security Audit',
        'Greenfield Project Risk Assessment',
        'Factory Encroachment Monitoring',
        'Asset Hardening Solutions',
        'Critical Infrastructure Protection',
        'Family Office Risk Management',
        'HNI Executive Protection India',
        'Legacy Succession Security',
        'Digital Footprint Sanitization',
        'Kidnap and Ransom K&R Consulting',
        'Private Client Security Architecture',
        'Reputation Management for HNIs',
        'TSCM Services India',
        'Insider Threat Detection',
        'Digital Espionage Defense',
        'Secure Communication Channels',
        'Cyber-Physical Threat Convergence',
        // Tier 3: Future Keywords
        'AI-Driven Risk Modeling',
        'Future Threat Forecasting',
        'Predictive Intelligence Engine',
        'Data-Backed Security Strategy',
        'Pre-emptive Threat Mitigation',
    ],
    authors: [{ name: 'RiskFortress Intelligence', url: 'https://riskfortress.in' }],
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
    metadataBase: new URL(SITE_URL),
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: SITE_URL,
        title: 'RiskFortress India | Private Intelligence & HNI Asset Protection',
        description: 'RiskFortress India delivers predictive risk intelligence for Ultra-HNWIs with ₹100Cr+ assets. We predict the crisis you don\'t see coming.',
        siteName: 'RiskFortress India',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'RiskFortress Intelligence Platform - Enterprise Risk Management India',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'RiskFortress India | Private Intelligence & HNI Asset Protection',
        description: 'RiskFortress India delivers predictive risk intelligence for Ultra-HNWIs with ₹100Cr+ assets. We predict the crisis you don\'t see coming.',
        images: ['/og-image.png'],
        creator: '@riskfortress',
        site: '@riskfortress',
    },
    verification: Object.keys(verificationMetadata).length > 0 ? verificationMetadata : undefined,
    category: 'Security Services',
    classification: 'Corporate Intelligence',
    formatDetection: {
        email: false,
        address: false,
        telephone: true,
    },
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/icon.svg', type: 'image/svg+xml' },
        ],
        apple: [
            { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
    },
    other: {
        'apple-mobile-web-app-capable': 'yes',
        'apple-mobile-web-app-status-bar-style': 'black-translucent',
        'apple-mobile-web-app-title': 'RiskFortress',
        'application-name': 'RiskFortress',
        'mobile-web-app-capable': 'yes',
        'msapplication-TileColor': '#0c0a09',
        'msapplication-config': '/browserconfig.xml',
        'theme-color': '#0c0a09'
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
            <head>
                {/* DNS Prefetch and Preconnect for external resources */}
                <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
                <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
                <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
                <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
                <link rel="dns-prefetch" href="https://formspree.io" />
                
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://www.googletagmanager.com" />
                
                <link rel="manifest" href="/manifest.json" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
                
                {/* Google Analytics - lazyOnload for better performance */}
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                    strategy="lazyOnload"
                />
                <Script id="google-analytics" strategy="lazyOnload">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_MEASUREMENT_ID}', {
                            page_path: window.location.pathname,
                        });
                    `}
                </Script>

                {/* Knowledge Panel: Organization + WebSite Schema */}
                <Script id="organization-schema" type="application/ld+json" strategy="afterInteractive">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@graph': [
                            {
                                '@type': ['Organization', 'ProfessionalService'],
                                '@id': 'https://riskfortress.in/#organization',
                                name: 'RiskFortress',
                                alternateName: 'RiskFortress India',
                                legalName: 'RiskFortress Intelligence',
                                url: 'https://riskfortress.in',
                                logo: {
                                    '@type': 'ImageObject',
                                    url: 'https://riskfortress.in/logos/logo.png',
                                    width: 400,
                                    height: 400,
                                },
                                image: 'https://riskfortress.in/logos/logo.png',
                                description:
                                    'Private risk intelligence and predictive forensics for Ultra-HNWIs with ₹100Cr+ assets. A Mayalok Ventures Entity, Greater Noida, Delhi NCR.',
                                foundingDate: '2024',
                                address: {
                                    '@type': 'PostalAddress',
                                    streetAddress: 'Greater Noida',
                                    addressLocality: 'Greater Noida',
                                    addressRegion: 'Uttar Pradesh',
                                    postalCode: '201310',
                                    addressCountry: 'IN',
                                },
                                areaServed: {
                                    '@type': 'Country',
                                    name: 'India',
                                },
                                serviceType: [
                                    'Risk Intelligence',
                                    'Forensic Analysis',
                                    'Asset Protection Due Diligence',
                                    'Corporate Governance Forensics',
                                    'Private Intelligence',
                                    'HNI Asset Protection',
                                ],
                                email: 'contact@riskfortress.in',
                                parentOrganization: {
                                    '@type': 'Organization',
                                    name: 'Mayalok Ventures',
                                    url: 'https://mayalokventures.com',
                                },
                                knowsAbout: [
                                    'Enterprise Risk Management',
                                    'Corporate Intelligence',
                                    'Forensic Risk Analysis',
                                    'HNI Asset Protection',
                                    'Geo-Political Risk',
                                ],
                                sameAs: [
                                    'https://www.linkedin.com/company/riskfortress',
                                ],
                            },
                            {
                                '@type': 'WebSite',
                                '@id': 'https://riskfortress.in/#website',
                                url: 'https://riskfortress.in',
                                name: 'RiskFortress',
                                description: 'Predictive risk intelligence for Ultra-HNWIs',
                                publisher: { '@id': 'https://riskfortress.in/#organization' },
                                potentialAction: {
                                    '@type': 'SearchAction',
                                    target: { '@type': 'EntryPoint', urlTemplate: 'https://riskfortress.in/dossiers/?q={search_term_string}' },
                                    'query-input': 'required name=search_term_string',
                                },
                            },
                        ],
                    })}
                </Script>
            </head>
            <body className="bg-gray-950 text-gray-100 antialiased selection:bg-intelligence/30">
                <ThemeProvider>
                    <div className="min-h-screen flex flex-col overflow-x-hidden">
                        <Header />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </div>
                    <AnalyticsTracker />
                    <CookieConsent />
                    <Analytics />
                    <SpeedInsights />
                    <Toaster
                        position="top-right"
                        toastOptions={{
                            className: 'glass-morphism',
                            duration: 4000,
                        }}
                    />
                </ThemeProvider>
            </body>
        </html>
    )
}
