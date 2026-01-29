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
    title: 'We Predict The Crisis You Don\'t See Coming | RiskFortress',
    description: 'Strategic Risk Intelligence for assets worth ₹100Cr+. RiskFortress is the specialized Risk Intelligence arm of Mayalok Ventures, dedicated to preserving wealth through advanced predictive forensics.',
    openGraph: {
        title: 'We Predict The Crisis You Don\'t See Coming | RiskFortress',
        description: 'Strategic Risk Intelligence for Ultra-HNWIs. Moving beyond compliance into the realm of absolute foresight. A Mayalok Ventures Entity.',
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
                        "name": "RiskFortress - A Mayalok Ventures Entity",
                        "url": "https://riskfortress.in",
                        "logo": "https://riskfortress.in/logo.svg",
                        "description": "RiskFortress is the specialized Risk Intelligence arm of Mayalok Ventures, dedicated to preserving wealth through advanced predictive forensics for Ultra-HNWIs with assets worth ₹100Cr+.",
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
                            "Macro-Financial Forensics",
                            "Statutory & Structural Intelligence",
                            "Geo-Environmental Risk Analysis",
                            "Family Office Forensics",
                            "Counter-Intelligence & TSCM",
                            "Predictive Risk Intelligence"
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
                                "name": "What is the 1% Mandate?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "The 1% Mandate is RiskFortress's engagement model. We only accept risks valued at ₹1Cr+ and charge 1% of the protected asset value. This ensures our interests are perfectly aligned with our clients—we only succeed when we prevent catastrophic loss."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "How does RiskFortress differ from traditional consulting firms?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "RiskFortress is a Strategic Foresight Entity, not a consulting firm. We predict crises before they happen through forensic intelligence. Our focus is on Ultra-HNWIs with ₹100Cr+ assets—large developers, industrial dynasties, and enterprise founders who cannot afford to learn from their mistakes."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What are RiskFortress's Intelligence Verticals?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "We operate across three core verticals: Macro-Financial Forensics (predicting business model collapses), Statutory & Structural Intelligence (predicting legal and zoning risks for real estate), and Geo-Environmental Risk (long-term climate impact analysis for multi-generational assets)."
                                }
                            },
                            {
                                "@type": "Question",
                                "name": "What is Mayalok Ventures?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "RiskFortress is the specialized Risk Intelligence arm of Mayalok Ventures, dedicated to preserving wealth through advanced predictive forensics."
                                }
                            }
                        ]
                    })
                }}
            />
        </>
    )
}
