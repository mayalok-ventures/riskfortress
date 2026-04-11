import { Metadata } from 'next'

import Hero from '@/components/Hero/HeroContent'
import IntelligenceMetrics from '@/components/Metrics/IntelligenceMetrics'
import SectorFocus from '@/components/Sector/SectorFocus'
import HomeClient from './HomeClient'


export const metadata: Metadata = {
    title: 'RiskFortress India | Private Intelligence & HNI Asset Protection',
    description: 'RiskFortress delivers predictive risk intelligence for Ultra-HNWIs and enterprises with assets worth ₹100Cr+. Forensic foresight across financial, statutory, and geo-environmental risk.',
    keywords: [
        'RiskFortress India',
        'RiskFortress Security Division',
        'Mayalok Ventures Risk Management',
        'Private Intelligence Firm India',
        'HNI Asset Protection Services India',
        'Predictive Risk Intelligence',
        'Strategic Foresight for UHNWIs',
        'Corporate Espionage Countermeasures India',
        'Statutory Forensics',
        'TSCM Services India',
        'Family Office Risk Advisory',
        'High Net Worth Security Audit',
        'Hire Private Intelligence Agency India',
    ],
    openGraph: {
        type: 'website',
        url: 'https://riskfortress.in/',
        title: 'RiskFortress India | Private Intelligence & HNI Asset Protection',
        description: 'RiskFortress delivers predictive risk intelligence for Ultra-HNWIs and enterprises with assets worth ₹100Cr+. Forensic foresight across financial, statutory, and geo-environmental risk.',
        siteName: 'RiskFortress India',
        images: [{ url: 'https://riskfortress.in/logos/og-image.png' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'RiskFortress India | Private Intelligence & HNI Asset Protection',
        description: 'RiskFortress delivers predictive risk intelligence for Ultra-HNWIs and enterprises with assets worth ₹100Cr+. Forensic foresight across financial, statutory, and geo-environmental risk.',
    },
    alternates: {
        canonical: 'https://riskfortress.in/',
    },
}

export default function Home() {
    return (
        <>
            <Hero />
            <IntelligenceMetrics />
            <SectorFocus />
            <HomeClient />

            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ProfessionalService",
                        "name": "RiskFortress",
                        "description": "Private risk intelligence and predictive forensics firm for Ultra-HNWIs with assets worth ₹100Cr+.",
                        "url": "https://riskfortress.in",
                        "logo": "https://riskfortress.in/logos/logo.png",
                        "parentOrganization": {
                            "@type": "Organization",
                            "name": "Mayalok Ventures"
                        },
                        "areaServed": "IN",
                        "serviceType": ["Risk Intelligence", "Forensic Analysis", "Asset Protection", "Due Diligence"],
                        "priceRange": "₹₹₹₹"
                    })
                }}
            />

            {/* FAQ Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": [
                            {
                                "@type": "Question",
                                "name": "What is HNI Asset Protection Services India?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "HNI Asset Protection Services India by RiskFortress provides Predictive Risk Intelligence for Ultra-High-Net-Worth Individuals with ₹100Cr+ assets. We prevent the next corporate collapse through Strategic Foresight, Statutory Forensics, and High-Stakes Advisory Mandate. Unlike traditional security, we focus on Asset Protection Intelligence."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How to hire a Private Intelligence Agency in India?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "RiskFortress India is the leading Private Intelligence Firm India under Mayalok Ventures. We offer Predictive Risk Intelligence, Corporate Espionage Countermeasures India, TSCM Services Delhi, and Corporate Fraud Investigation Services. Contact us for a Discrete Consultation for assets worth ₹100Cr+."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What is the 1% Fee Model for Asset Protection?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "RiskFortress's High-Stakes Advisory Mandate charges 1% of protected asset value for Predictive Risk Intelligence. We only accept risks valued at ₹1Cr+, ensuring Strategic Foresight for UHNWIs. This value-based pricing model attracts high-intent, wealthy clients who understand preventing the next corporate collapse."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What Corporate Espionage Countermeasures are available in India?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "RiskFortress India provides Corporate Espionage Countermeasures including TSCM Services (Bug Sweeping), Insider Threat Detection Services, Leak Investigation for Companies, and Startup Intellectual Property Protection. We serve as the RiskFortress Security Division of Mayalok Ventures."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What is Kidnap and Ransom (K&R) Prevention India?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "RiskFortress provides Kidnap and Ransom Prevention India services including Personal Threat Assessment for Executives, High Net Worth Security Audit, Secure Transport for Valuables India, and Family Office Risk Advisory. We specialize in HNI Asset Protection Services India."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What is RiskFortress India and Mayalok Ventures?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "RiskFortress India is the specialized Risk Intelligence arm of Mayalok Ventures (RiskFortress Security Division). We provide Predictive Risk Intelligence, Statutory Forensics, and Asset Protection Intelligence dedicated to preserving wealth through advanced predictive forensics for Ultra-HNWIs."
                                }
                            }
                        ]
                    })
                }}
            />
        </>
    )
}
