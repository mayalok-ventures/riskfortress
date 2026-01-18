import type { Metadata } from 'next'
import { Inter, Playfair_Display, JetBrains_Mono } from 'next/font/google'

import '@/styles/globals.css'
import { Toaster } from 'sonner'

import Footer from '@/components/Layout/Footer'
import Header from '@/components/Layout/Header'
import { ThemeProvider } from '@/components/Layout/ThemeProvider'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

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
    preload: true,
})

const jetbrainsMono = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
    display: 'swap',
    preload: true,
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
    authors: [{ name: 'RiskFortress Intelligence', url: 'https://riskfortress.com' }],
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
    metadataBase: new URL('https://riskfortress.com'),
    alternates: {
        canonical: '/',
        languages: {
            'en-IN': '/',
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: 'https://riskfortress.com',
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
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="icon" href="/icon.svg" type="image/svg+xml" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
            </head>
            <body className="bg-gray-950 text-gray-100 antialiased selection:bg-intelligence/30">
                <ThemeProvider>
                    <div className="min-h-screen flex flex-col overflow-x-hidden">
                        <Header />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </div>
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