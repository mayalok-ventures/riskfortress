import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
    title: 'The 1% Mandate | High-Stakes Advisory Model | RiskFortress India',
    description: 'Our 1% fee model ensures aligned incentives. We engage only where risks exceed ₹1 Crore — protecting generational wealth through forensic intelligence.',
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
        description: 'Our 1% fee model ensures aligned incentives. We engage only where risks exceed ₹1 Crore — protecting generational wealth through forensic intelligence.',
    },
    alternates: {
        canonical: '/mandate/',
    },
}

export default function MandateLayout({ children }: { children: ReactNode }) {
    return children
}
