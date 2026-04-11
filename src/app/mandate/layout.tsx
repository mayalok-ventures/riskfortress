import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
    title: 'The 1% Mandate | High-Stakes Advisory Model | RiskFortress India',
    description: 'The 1% Mandate — RiskFortress only engages where stakes exceed ₹1 Crore. Value-based pricing aligned to protected asset value for Ultra-HNWIs across India.',
    keywords: [
        'High-Stakes Advisory Mandate',
        '1% Fee Model',
        'HNI Asset Protection Services India',
        'Strategic Foresight for UHNWIs',
        'Predictive Risk Intelligence',
        'RiskFortress India',
        'Private Intelligence Firm India',
        'Asset Protection Intelligence',
        'Mayalok Ventures Risk Management',
        'Corporate Fraud Investigation Services',
        'Preventing the next corporate collapse',
    ],
    openGraph: {
        url: '/mandate/',
        title: 'The 1% Mandate | High-Stakes Advisory Model | RiskFortress India',
        description: 'The 1% Mandate — RiskFortress only engages where stakes exceed ₹1 Crore. Value-based pricing aligned to protected asset value for Ultra-HNWIs across India.',
    },
    alternates: {
        canonical: 'https://riskfortress.in/mandate/',
    },
}

export default function MandateLayout({ children }: { children: ReactNode }) {
    return children
}
