import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Intelligence Verticals | Forensic Risk Analysis | RiskFortress India',
    description: "Macro-Financial Forensics, Statutory & Structural Intelligence, and Geo-Environmental Risk — three forensic disciplines protecting India's highest-value asset holders from invisible threats.",
    alternates: { canonical: 'https://riskfortress.in/capabilities/' },
    openGraph: {
        title: 'Intelligence Verticals | RiskFortress India',
        description: "Three forensic disciplines protecting India's highest-value asset holders.",
        url: 'https://riskfortress.in/capabilities/',
        images: [{ url: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=1200' }],
        type: 'website',
    },
}

export default function CapabilitiesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
