import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
    title: 'Case Scenarios | Intelligence Dossiers | RiskFortress India',
    description: 'Predictive Risk Intelligence case studies. Corporate Fraud Investigation Services, Leak Investigation for Companies, and Insider Threat Detection Services. Private Intelligence Firm India preventing the next corporate collapse.',
    keywords: [
        'Corporate Fraud Investigation Services',
        'Leak Investigation for Companies',
        'Insider Threat Detection Services',
        'Private Intelligence Firm India',
        'RiskFortress India',
        'Case Studies',
        'Corporate Espionage Countermeasures India',
        'Predictive Risk Intelligence',
        'Due Diligence for Angel Investors',
    ],
    openGraph: {
        url: '/dossiers/',
        title: 'Case Scenarios | Intelligence Dossiers | RiskFortress India',
        description: 'Intelligence case studies from Private Intelligence Firm India. Preventing the next corporate collapse through Predictive Risk Intelligence.',
    },
    alternates: {
        canonical: '/dossiers/',
    },
}

export default function DossiersLayout({ children }: { children: ReactNode }) {
    return children
}
