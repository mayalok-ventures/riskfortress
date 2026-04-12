import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Request a Discrete Consultation | RiskFortress India',
    description: 'Encrypted intake for Ultra-HNWIs with ₹1 Crore+ asset exposure. All submissions reviewed within 48 hours. Absolute confidentiality guaranteed.',
    alternates: { canonical: 'https://riskfortress.in/secure-intake/' },
    robots: { index: false, follow: false },
    openGraph: {
        title: 'Discrete Consultation | RiskFortress India',
        description: 'Encrypted intake. Reviewed within 48 hours. Minimum ₹1 Crore asset exposure.',
        url: 'https://riskfortress.in/secure-intake/',
        images: [{ url: 'https://riskfortress.in/logos/logo.png' }],
        type: 'website',
    },
}

export default function SecureIntakeLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
