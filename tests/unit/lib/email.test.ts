import { validateCorporateEmail, extractDomain, getEmailCategory } from '@/lib/validation/email'

describe('Email Validation', () => {
    test('accepts corporate emails', () => {
        const validEmails = [
            'john@company.com',
            'jane@corporation.co.in',
            'contact@enterprise.org',
            'info@riskfortress.com',
        ]

        validEmails.forEach(email => {
            expect(validateCorporateEmail(email)).toBe(true)
        })
    })

    test('rejects personal emails', () => {
        const invalidEmails = [
            'john@gmail.com',
            'jane@yahoo.com',
            'contact@outlook.com',
            'info@hotmail.com',
        ]

        invalidEmails.forEach(email => {
            expect(validateCorporateEmail(email)).toBe(false)
        })
    })

    test('extracts domain correctly', () => {
        expect(extractDomain('john@company.com')).toBe('company.com')
        expect(extractDomain('invalid-email')).toBe('')
    })

    test('categorizes emails correctly', () => {
        expect(getEmailCategory('john@company.com')).toBe('corporate')
        expect(getEmailCategory('john@gmail.com')).toBe('personal')
        expect(getEmailCategory('john@unknown.com')).toBe('unknown')
    })
})