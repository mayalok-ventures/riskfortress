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

const GA_MEASUREMENT_ID = 'G-0NB75DBBJP'

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

export const metadata: Metadata = {
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
    metadataBase: new URL('https://riskfortress.in'),
    alternates: {
        canonical: '/',
        languages: {
            'en-IN': '/',
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: 'https://riskfortress.in',
        title: 'RiskFortress | Enterprise Intelligence & Risk Platform',
        description: 'Predictive Intelligence for safeguarding India\'s most critical industrial assets and private legacies.',
        siteName: 'RiskFortress',
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
        title: 'RiskFortress Intelligence',
        description: 'Enterprise-grade risk intelligence platform for HNIs and Corporations',
        images: ['/og-image.png'],
        creator: '@riskfortress',
        site: '@riskfortress',
    },
    verification: {
        google: 'your-google-verification-code',
        yandex: 'your-yandex-verification',
        yahoo: 'your-yahoo-verification',
        me: 'your-website-verification',
    },
    category: 'Security Services',
    classification: 'Corporate Intelligence',
    abstract: 'RiskFortress provides predictive intelligence and enterprise risk management solutions for Fortune 500 companies and High Net Worth Individuals across India.',
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
            </head>
            <body className="bg-gray-950 text-gray-100 antialiased selection:bg-intelligence/30">
                <ThemeProvider>
                    <div className="min-h-screen flex flex-col overflow-x-hidden">
                        <Header />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </div>
                    <AnalyticsTracker />
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
