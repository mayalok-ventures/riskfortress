import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
    title: 'Case Scenarios | Corporate Fraud Investigation Services | RiskFortress India',
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
        title: 'Case Scenarios | Corporate Fraud Investigation Services | RiskFortress India',
        description: 'Intelligence case studies from Private Intelligence Firm India. Preventing the next corporate collapse through Predictive Risk Intelligence.',
    },
}

export default function DossiersLayout({ children }: { children: ReactNode }) {
    return children
}
