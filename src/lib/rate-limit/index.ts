// Fallback in-memory rate limiter for development/build
const inMemoryStore = new Map<string, { count: number; resetAt: number }>()

interface RateLimitResult {
    success: boolean
    limit: number
    remaining: number
    reset: number
}

const createInMemoryLimiter = (requests: number, windowMs: number) => ({
    async limit(identifier: string): Promise<RateLimitResult> {
        const now = Date.now()
        const record = inMemoryStore.get(identifier)
        
        if (!record || now > record.resetAt) {
            inMemoryStore.set(identifier, { count: 1, resetAt: now + windowMs })
            return { success: true, limit: requests, remaining: requests - 1, reset: now + windowMs }
        }
        
        if (record.count >= requests) {
            return { success: false, limit: requests, remaining: 0, reset: record.resetAt }
        }
        
        record.count++
        return { success: true, limit: requests, remaining: requests - record.count, reset: record.resetAt }
    }
})

// Rate limit configuration - using in-memory for builds
export const rateLimit = createInMemoryLimiter(10, 60000)

// API endpoint rate limits
export const rateLimits = {
    intake: createInMemoryLimiter(5, 60000),
    contact: createInMemoryLimiter(10, 300000),
    api: createInMemoryLimiter(100, 60000),
}

// Rate limiting middleware
export async function checkRateLimit(
    identifier: string,
    limitType: keyof typeof rateLimits = 'intake'
) {
    const result = await rateLimits[limitType].limit(identifier)

    return {
        success: result.success,
        limit: result.limit,
        reset: result.reset,
        remaining: result.remaining,
        headers: {
            'X-RateLimit-Limit': result.limit.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.reset.toString(),
        }
    }
}

// Utility to extract IP from request
export function getClientIP(request: Request): string {
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded
        ? forwarded.split(',')[0].trim()
        : request.headers.get('x-real-ip')
        || '127.0.0.1'

    return ip
}
