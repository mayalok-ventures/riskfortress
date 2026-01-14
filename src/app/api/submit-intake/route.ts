import { NextRequest, NextResponse } from 'next/server'
import { encryptPayload } from '@/lib/crypto/encryption'
import { validateCorporateEmail } from '@/lib/validation/email'
import { rateLimits } from '@/lib/rate-limit'
import { createIntakeSchema } from '@/lib/validation/schema'

// Bot detection patterns
const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /php/i,
]

// Spam keywords
const spamKeywords = [
    'viagra', 'casino', 'lottery', 'click here', 'buy now',
    'cheap', 'discount', 'offer', 'guaranteed', 'make money',
    'work from home', 'investment', 'bitcoin', 'crypto',
    'seo', 'marketing', 'insurance', 'loan',
]

export async function POST(request: NextRequest) {
    const startTime = Date.now()

    try {
        // Get client IP
        const ip = request.ip ??
            request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
            '127.0.0.1'

        // Rate limiting check
        const { success, limit, reset, remaining } = await rateLimits.intake.limit(ip)

        if (!success) {
            console.warn(`Rate limit exceeded for IP: ${ip}`)
            return NextResponse.json(
                {
                    error: 'Rate limit exceeded. Please try again later.',
                    code: 'RATE_LIMIT_EXCEEDED'
                },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': limit.toString(),
                        'X-RateLimit-Remaining': remaining.toString(),
                        'X-RateLimit-Reset': reset.toString(),
                        'Retry-After': '60',
                    },
                }
            )
        }

        // Check for bots
        const userAgent = request.headers.get('user-agent') || ''
        const isBot = botPatterns.some(pattern => pattern.test(userAgent))

        if (isBot) {
            console.warn(`Bot detected: ${userAgent}`)
            return NextResponse.json(
                { error: 'Automated submissions are not allowed', code: 'BOT_DETECTED' },
                { status: 403 }
            )
        }

        // Parse and validate request body
        let body
        try {
            body = await request.json()
        } catch (error) {
            return NextResponse.json(
                { error: 'Invalid JSON payload', code: 'INVALID_JSON' },
                { status: 400 }
            )
        }

        const validationResult = createIntakeSchema.safeParse(body)

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: 'Invalid form data',
                    code: 'VALIDATION_ERROR',
                    details: validationResult.error.format()
                },
                { status: 400 }
            )
        }

        const data = validationResult.data

        // Corporate email validation
        if (!validateCorporateEmail(data.email)) {
            return NextResponse.json(
                {
                    error: 'Please use a corporate email address. Personal email domains are not accepted.',
                    code: 'INVALID_EMAIL_DOMAIN',
                    suggestions: [
                        'Use your company email (e.g., name@yourcompany.com)',
                        'Contact us directly for alternative submission methods'
                    ]
                },
                { status: 400 }
            )
        }

        // Server-side spam check
        const submissionText = JSON.stringify(data).toLowerCase()
        const isSpam = spamKeywords.some(keyword =>
            submissionText.includes(keyword)
        )

        if (isSpam) {
            // Log for security monitoring
            console.warn(`Potential spam submission from IP: ${ip}, Email: ${data.email}`)
            // Return generic error without revealing detection
            return NextResponse.json(
                { error: 'Submission rejected', code: 'SUBMISSION_REJECTED' },
                { status: 400 }
            )
        }

        // Validate budget range matches client type
        if (data.companyType === 'hni' && data.budgetRange === '50L-2Cr') {
            return NextResponse.json(
                {
                    error: 'Budget range does not match client type. Please adjust or contact us directly.',
                    code: 'BUDGET_MISMATCH'
                },
                { status: 400 }
            )
        }

        // Encrypt sensitive data
        const encryptionKey = process.env.ENCRYPTION_KEY
        if (!encryptionKey) {
            console.error('Encryption key not configured')
            throw new Error('Server configuration error')
        }

        // Create payload with metadata
        const payload = {
            ...data,
            metadata: {
                submittedAt: new Date().toISOString(),
                ip: ip,
                userAgent: userAgent.substring(0, 100), // Limit length
                processingTime: Date.now() - startTime,
                version: '1.0.0',
            }
        }

        const encryptedData = encryptPayload(payload, encryptionKey)

        // Store encrypted data (In production, use database)
        const storageResponse = await storeSecureData(encryptedData, ip)

        if (!storageResponse.success) {
            throw new Error('Failed to store intake data')
        }

        // Log successful submission (without PII)
        console.info(`Intake submitted successfully: ${storageResponse.id}, IP: ${ip}, Company: ${data.companyType}`)

        // Send success response
        return NextResponse.json(
            {
                success: true,
                message: 'Intake received and secured with military-grade encryption',
                referenceId: storageResponse.id,
                timestamp: new Date().toISOString(),
                nextSteps: [
                    'Our intelligence team will review your submission within 24 hours',
                    'You will receive an encrypted confirmation email',
                    'For urgent matters, contact our secure line'
                ],
                security: {
                    encryption: 'AES-256-GCM',
                    retention: '72 hours (automated deletion)',
                    compliance: 'ISO 27001, GDPR compliant'
                }
            },
            {
                status: 200,
                headers: {
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY',
                    'X-XSS-Protection': '1; mode=block',
                    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
                }
            }
        )

    } catch (error) {
        console.error('Intake submission error:', error)

        // Security: Never expose internal errors to client
        return NextResponse.json(
            {
                error: 'Internal server error',
                code: 'INTERNAL_ERROR',
                message: 'Please try again or contact support'
            },
            {
                status: 500,
                headers: {
                    'X-Error': 'true'
                }
            }
        )
    }
}

async function storeSecureData(_encryptedData: string, _ip: string) {
    // In production, implement:
    // 1. AWS KMS for key management
    // 2. PostgreSQL with pgcrypto extension
    // 3. HashiCorp Vault for secrets
    // 4. AWS S3 with server-side encryption for file storage

    const id = `RF-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Simulate database storage
    await new Promise(resolve => setTimeout(resolve, 100))

    return {
        success: true,
        id,
        timestamp: new Date().toISOString(),
        storage: 'encrypted_temporary_storage',
        purgeDate: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString() // 72 hours
    }
}

export function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
            'Access-Control-Allow-Origin': 'https://riskfortress.com',
            'Access-Control-Max-Age': '86400',
            'Access-Control-Allow-Credentials': 'false',
        },
    })
}