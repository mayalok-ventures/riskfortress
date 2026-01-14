import { z } from 'zod'

// Corporate email validation
export const emailSchema = z.string()
    .email('Invalid email address')
    .refine((email) => {
        const domain = email.split('@')[1]
        const personalDomains = [
            'gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com',
            'aol.com', 'icloud.com', 'protonmail.com', 'zoho.com'
        ]
        return !personalDomains.includes(domain?.toLowerCase())
    }, 'Please use a corporate email address')

// Phone number validation for India
export const phoneSchema = z.string()
    .regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number')
    .or(z.string().regex(/^\+91[6-9]\d{9}$/, 'Invalid Indian phone number'))

// Intake form schema
export const createIntakeSchema = z.object({
    // Personal Information
    firstName: z.string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must be less than 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'First name can only contain letters'),

    lastName: z.string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must be less than 50 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Last name can only contain letters'),

    // Company Information
    company: z.string()
        .min(2, 'Company name is required')
        .max(100, 'Company name must be less than 100 characters'),

    jobTitle: z.string()
        .min(2, 'Job title is required')
        .max(100, 'Job title must be less than 100 characters'),

    // Contact Information
    email: emailSchema,

    phone: phoneSchema,

    // Client Type & Budget
    companyType: z.enum([
        'fortune500',
        'industrial',
        'familyOffice',
        'hni',
        'government',
        'other'
    ], {
        errorMap: () => ({ message: 'Invalid company type' })
    }),

    budgetRange: z.enum([
        '50L-2Cr',
        '2Cr-10Cr',
        '10Cr-50Cr',
        '50Cr+',
        'custom'
    ], {
        errorMap: () => ({ message: 'Invalid budget range' })
    }),

    // Security Concerns
    primaryConcern: z.enum([
        'landDueDiligence',
        'tscmServices',
        'familySecurity',
        'riskManagement',
        'intelligence',
        'executiveProtection',
        'industrialSecurity',
        'other'
    ], {
        errorMap: () => ({ message: 'Invalid concern selection' })
    }),

    // Additional Information
    message: z.string()
        .min(20, 'Please provide more details (minimum 20 characters)')
        .max(2000, 'Message must be less than 2000 characters')
        .optional()
        .or(z.literal('')),

    // Terms Agreement
    agreeToTerms: z.literal(true, {
        errorMap: () => ({ message: 'You must agree to the terms' })
    }),

    // Spam prevention
    honeypot: z.string().max(0, 'Spam detected').optional(),
})

// Partial schema for multi-step forms
export const partialIntakeSchema = createIntakeSchema.partial()

// Contact form schema (simplified)
export const contactSchema = z.object({
    name: z.string().min(2).max(100),
    email: emailSchema,
    company: z.string().min(2).max(100),
    subject: z.string().min(5).max(200),
    message: z.string().min(20).max(2000),
})

// Newsletter subscription
export const newsletterSchema = z.object({
    email: emailSchema,
    consent: z.literal(true),
    interests: z.array(z.string()).optional(),
})

// File upload validation
export const fileSchema = z.object({
    name: z.string(),
    type: z.string().regex(/^application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$/),
    size: z.number().max(10 * 1024 * 1024), // 10MB max
})

// Export types
export type IntakeFormData = z.infer<typeof createIntakeSchema>
export type ContactFormData = z.infer<typeof contactSchema>
export type NewsletterData = z.infer<typeof newsletterSchema>

// Validation utility functions
export function validateIntakeData(data: unknown) {
    return createIntakeSchema.safeParse(data)
}

export function validateContactData(data: unknown) {
    return contactSchema.safeParse(data)
}

export function sanitizeInput(input: string): string {
    return input
        .replace(/[<>]/g, '') // Remove HTML tags
        .trim()
        .slice(0, 2000) // Limit length
}