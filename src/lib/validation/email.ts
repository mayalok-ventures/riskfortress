const corporateEmailPatterns = [
    // Indian Corporate Patterns
    /@[a-zA-Z0-9-]+\.(co\.in|in|com|org|net)$/i,
    // Global Corporate Patterns
    /@[a-zA-Z0-9-]+\.(com|org|net|io|ai|co|uk|de|fr|jp)$/i,
    // Specific corporate domains (can be extended)
    /@(?!gmail|yahoo|outlook|hotmail|aol|icloud|protonmail|zoho|rediff|indiatimes)\.[a-z]{2,}$/i,
]

const rejectedDomains = [
    'gmail.com',
    'yahoo.com',
    'outlook.com',
    'hotmail.com',
    'aol.com',
    'icloud.com',
    'protonmail.com',
    'zoho.com',
    'rediffmail.com',
    'indiatimes.com',
    'mail.com',
    'gmx.com',
    'yandex.com',
    'qq.com',
    '163.com',
    '126.com',
]

export function validateCorporateEmail(email: string): boolean {
    if (!email) return false

    const emailLower = email.toLowerCase()

    // Check if email contains rejected domains
    const hasRejectedDomain = rejectedDomains.some(domain =>
        emailLower.endsWith(`@${domain}`)
    )

    if (hasRejectedDomain) {
        return false
    }

    // Check if email matches corporate patterns
    const hasCorporatePattern = corporateEmailPatterns.some(pattern =>
        pattern.test(emailLower)
    )

    if (!hasCorporatePattern) {
        return false
    }

    // Additional validation: Must not be generic sounding
    const genericPatterns = [
        /^info@/,
        /^contact@/,
        /^support@/,
        /^admin@/,
        /^hello@/,
        /^test@/,
    ]

    const hasGenericPrefix = genericPatterns.some(pattern =>
        pattern.test(emailLower)
    )

    if (hasGenericPrefix) {
        // Could still be valid if domain is clearly corporate
        // Check domain name for corporate indicators
        const domain = emailLower.split('@')[1]
        const corporateIndicators = [
            'corp',
            'inc',
            'llc',
            'ltd',
            'pvt',
            'private',
            'limited',
            'industries',
            'group',
            'holdings',
            'enterprise',
            'security',
            'intelligence',
        ]

        const hasCorporateIndicator = corporateIndicators.some(indicator =>
            domain.includes(indicator)
        )

        if (!hasCorporateIndicator) {
            return false
        }
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(emailLower)) {
        return false
    }

    return true
}

export function extractDomain(email: string): string {
    return email.split('@')[1] || ''
}

export function getEmailCategory(email: string): 'corporate' | 'personal' | 'unknown' {
    if (validateCorporateEmail(email)) {
        return 'corporate'
    }

    const emailLower = email.toLowerCase()
    const isPersonal = rejectedDomains.some(domain =>
        emailLower.endsWith(`@${domain}`)
    )

    return isPersonal ? 'personal' : 'unknown'
}

export function suggestCorporateEmail(currentEmail: string): string[] {
    const domain = extractDomain(currentEmail)
    const username = currentEmail.split('@')[0]

    if (!domain || !username) return []

    const suggestions: string[] = []

    // Remove personal domain indicators
    const cleanUsername = username
        .replace(/\.(gmail|yahoo|outlook)$/, '')

    // Suggest common corporate email formats
    suggestions.push(`${cleanUsername}@yourcompany.com`)
    suggestions.push(`${cleanUsername}@yourcompany.co.in`)
    suggestions.push(`${cleanUsername}@${cleanUsername.toLowerCase()}.com`)

    return suggestions
}