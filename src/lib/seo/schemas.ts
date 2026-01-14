// Structured data for SEO
export const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'RiskFortress Intelligence',
    'url': 'https://riskfortress.com',
    'logo': 'https://riskfortress.com/logo.png',
    'description': 'Enterprise intelligence and risk management platform',
    'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Nariman Point',
        'addressLocality': 'Mumbai',
        'addressRegion': 'Maharashtra',
        'postalCode': '400021',
        'addressCountry': 'IN'
    },
    'contactPoint': {
        '@type': 'ContactPoint',
        'contactType': 'Intelligence Inquiry',
        'availableLanguage': ['English', 'Hindi']
    }
}

export const serviceSchemas = [
    {
        '@type': 'Service',
        'serviceType': 'Enterprise Risk Management',
        'provider': {
            '@type': 'Organization',
            'name': 'RiskFortress Intelligence'
        },
        'description': 'Comprehensive risk assessment and mitigation strategies for Fortune 500 companies',
        'areaServed': {
            '@type': 'Country',
            'name': 'India'
        }
    },
    {
        '@type': 'Service',
        'serviceType': 'Land Due Diligence',
        'provider': {
            '@type': 'Organization',
            'name': 'RiskFortress Intelligence'
        },
        'description': 'End-to-end land verification and encroachment prevention for industrial projects',
        'areaServed': {
            '@type': 'Country',
            'name': 'India'
        }
    },
    {
        '@type': 'Service',
        'serviceType': 'TSCM Services',
        'provider': {
            '@type': 'Organization',
            'name': 'RiskFortress Intelligence'
        },
        'description': 'Technical Surveillance Counter-Measures for corporate espionage prevention',
        'areaServed': {
            '@type': 'Country',
            'name': 'India'
        }
    }
]

export const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
        {
            '@type': 'Question',
            'name': 'What is Enterprise Risk Management?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Enterprise Risk Management (ERM) in India involves identifying, assessing, and mitigating risks across an organization\'s entire portfolio, including operational, strategic, financial, and compliance risks. Unlike traditional security agencies, RiskFortress provides predictive intelligence and strategic consulting for Fortune 500 companies and HNIs.'
            }
        },
        {
            '@type': 'Question',
            'name': 'How does RiskFortress differ from traditional security agencies?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'RiskFortress focuses on predictive intelligence and strategic risk management rather than physical security. We serve corporate clients and HNIs with services like Land Due Diligence, TSCM, Labor Unrest Prediction, and Digital Espionage Defense, avoiding security guard and bouncer services completely.'
            }
        },
        {
            '@type': 'Question',
            'name': 'What industries does RiskFortress serve?',
            'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'We specialize in Heavy Industries (Land Due Diligence, Supply Chain Security), Family Offices (HNI Protection, Legacy Security), and Technical Threats (TSCM Services, Insider Threat Detection). Our focus is exclusively on premium corporate and HNI clients.'
            }
        }
    ]
}