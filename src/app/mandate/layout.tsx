import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
    title: 'The 1% Fee Model | High-Stakes Advisory Mandate | RiskFortress India',
    description: 'The 1% Fee Model for HNI Asset Protection Services India. High-Stakes Advisory Mandate charging 1% of protected asset value. Strategic Foresight for UHNWIs with ₹100Cr+ assets. Predictive Risk Intelligence preventing the next corporate collapse.',
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
        title: 'The 1% Fee Model | High-Stakes Advisory Mandate | RiskFortress India',
        description: 'Value-based pricing for Predictive Risk Intelligence. 1% of protected asset value. Strategic Foresight for UHNWIs preventing catastrophic wealth loss.',
    },
}

export default function MandateLayout({ children }: { children: ReactNode }) {
    return children
}
