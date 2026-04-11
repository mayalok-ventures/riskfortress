import { Metadata } from 'next'
import { ReactNode } from 'react'

export const metadata: Metadata = {
    title: 'Case Scenarios | Intelligence Dossiers | RiskFortress India',
    description: 'Confidential risk intelligence briefs, case scenarios, forensic analyses, and investigative articles published by RiskFortress India.',
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
        description: 'Confidential risk intelligence briefs, case scenarios, forensic analyses, and investigative articles published by RiskFortress India.',
    },
    alternates: {
        canonical: 'https://riskfortress.in/dossiers/',
    },
}

export default function DossiersLayout({ children }: { children: ReactNode }) {
    return children
}
