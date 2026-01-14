import { Metadata } from 'next'

import CTASection from '@/components/CTA/CTASection'
import RiskFortressEdge from '@/components/Edge/RiskFortressEdge'
import Hero from '@/components/Hero/HeroContent'
import IntelligenceMetrics from '@/components/Metrics/IntelligenceMetrics'
import RadarScroll from '@/components/Radar/RadarScroll'
import RealityCheck from '@/components/RealityCheck/RealityCheck'
import SectorFocus from '@/components/Sector/SectorFocus'
import Testimonials from '@/components/Testimonials/Testimonials'


export const metadata: Metadata = {
    title: 'Deciphering Uncertainty. Protecting Sovereignty. | RiskFortress',
    description: 'Beyond surveillance. Beyond response. RiskFortress provides the Predictive Intelligence required to safeguard India\'s most critical industrial assets and private legacies.',
    openGraph: {
        title: 'Deciphering Uncertainty. Protecting Sovereignty. | RiskFortress',
        description: 'Enterprise Risk Management India - Predictive Intelligence for Fortune 500 Companies and HNIs',
    },
}

export default function Home() {
    return (
        <>
            <Hero />
            <IntelligenceMetrics />
            <RadarScroll />
            <SectorFocus />
            <RiskFortressEdge />
            <Testimonials />
            <CTASection />

            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ProfessionalService",
                        "name": "RiskFortress Intelligence",
                        "url": "https://riskfortress.com",
                        "logo": "https://riskfortress.com/logo.svg",
                        "description": "Enterprise intelligence and risk management platform specializing in predictive analytics for industrial assets and private legacies",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "Nariman Point",
                            "addressLocality": "Mumbai",
                            "addressRegion": "Maharashtra",
                            "postalCode": "400021",
                            "addressCountry": "IN"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": "18.9260",
                            "longitude": "72.8246"
                        },
                        "contactPoint": {
                            "@type": "ContactPoint",
                            "contactType": "Intelligence Inquiry",
                            "telephone": "+91-22-XXXX-XXXX",
                            "availableLanguage": ["English", "Hindi"],
                            "email": "intelligence@riskfortress.com"
                        },
                        "serviceType": [
                            "Enterprise Risk Management",
                            "Corporate Intelligence",
                            "Land Due Diligence",
                            "Family Office Security",
                            "TSCM Services",
                            "Predictive Risk Analytics"
                        ],
                        "areaServed": {
                            "@type": "Country",
                            "name": "India"
                        },
                        "openingHours": "Mo-Fr 09:00-18:00",
                        "priceRange": "$$$$",
                        "sameAs": [
                            "https://linkedin.com/company/riskfortress",
                            "https://twitter.com/riskfortress"
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
                                "name": "What is Enterprise Risk Management?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Enterprise Risk Management (ERM) in India involves identifying, assessing, and mitigating risks across an organization's entire portfolio, including operational, strategic, financial, and compliance risks. Unlike traditional security agencies, RiskFortress provides predictive intelligence and strategic consulting for Fortune 500 companies and HNIs."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How does RiskFortress differ from traditional security agencies?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "RiskFortress focuses on predictive intelligence and strategic risk management rather than physical security. We serve corporate clients and HNIs with services like Land Due Diligence, TSCM, Labor Unrest Prediction, and Digital Espionage Defense, avoiding security guard and bouncer services completely."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What industries does RiskFortress serve?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "We specialize in Heavy Industries (Land Due Diligence, Supply Chain Security), Family Offices (HNI Protection, Legacy Security), and Technical Threats (TSCM Services, Insider Threat Detection). Our focus is exclusively on premium corporate and HNI clients."
                                }
                            }
                        ]
                    })
                }}
            />
        </>
    )
}