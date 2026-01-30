import { Metadata } from 'next'

import Hero from '@/components/Hero/HeroContent'
import IntelligenceMetrics from '@/components/Metrics/IntelligenceMetrics'
import SectorFocus from '@/components/Sector/SectorFocus'
import HomeClient from './HomeClient'


export const metadata: Metadata = {
    title: 'RiskFortress India | Private Intelligence & HNI Asset Protection | A Mayalok Division',
    description: 'Predictive Risk Intelligence preventing the next corporate collapse. RiskFortress India is the Private Intelligence Firm specializing in HNI Asset Protection Services, Corporate Espionage Countermeasures, and Statutory Forensics. Strategic Foresight for UHNWIs with ₹100Cr+ assets. High-Stakes Advisory Mandate.',
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
        title: 'RiskFortress India | Private Intelligence & HNI Asset Protection',
        description: 'Predictive Risk Intelligence preventing the next corporate collapse. Private Intelligence Firm India. Strategic Foresight for UHNWIs. Asset Protection Intelligence for ₹100Cr+ assets.',
        siteName: 'RiskFortress India',
    },
    twitter: {
        title: 'RiskFortress India | Private Intelligence Firm',
        description: 'Predictive Risk Intelligence for HNI Asset Protection. Preventing the next corporate collapse. A Mayalok Ventures Division.',
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
                        "name": "RiskFortress India - A Mayalok Ventures Division",
                        "alternateName": ["RiskFortress Security Division", "RiskFortress Asset Protection", "Private Intelligence Firm India"],
                        "url": "https://riskfortress.in",
                        "logo": "https://riskfortress.in/logo.svg",
                        "description": "RiskFortress India is the Private Intelligence Firm specializing in Predictive Risk Intelligence, HNI Asset Protection Services, Corporate Espionage Countermeasures, and Statutory Forensics. Strategic Foresight for UHNWIs preventing the next corporate collapse.",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "Pari Chowk",
                            "addressLocality": "Greater Noida",
                            "addressRegion": "Uttar Pradesh",
                            "postalCode": "201310",
                            "addressCountry": "IN"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": "28.4744",
                            "longitude": "77.5040"
                        },
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "contactType": "Discrete Consultation",
                            "telephone": "+91-22-XXXX-XXXX",
                            "availableLanguage": ["English", "Hindi"],
                            "email": "kunal@riskfortress.in"
                        },
                        "serviceType": [
                            "Predictive Risk Intelligence",
                            "HNI Asset Protection Services India",
                            "Corporate Espionage Countermeasures India",
                            "TSCM Services Delhi",
                            "TSCM Services India",
                            "Family Office Risk Advisory",
                            "Statutory Forensics",
                            "Kidnap and Ransom Prevention India",
                            "Corporate Fraud Investigation Services",
                            "Insider Threat Detection Services",
                            "High Net Worth Security Audit",
                            "Due Diligence for Angel Investors"
                        ],
                        "areaServed": {
                            "@type": "Country",
                            "name": "India"
                        },
                        "openingHours": "Mo-Fr 09:00-18:00",
                        "priceRange": "$$$$",
                        "parentOrganization": {
                            "@type": "Organization",
                            "name": "Mayalok Ventures"
                        },
                        "knowsAbout": [
                            "Preventing the next corporate collapse",
                            "Statutory land intelligence",
                            "Strategic Foresight for UHNWIs",
                            "Asset Protection Intelligence",
                            "High-Stakes Advisory Mandate"
                        ],
                        "sameAs": [
                            "https://www.linkedin.com/company/riskfortress"
                        ]
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
