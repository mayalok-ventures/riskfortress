// Secure Authentication API for RiskFortress Admin
// Uses environment variables for password hash (never store plaintext passwords)

interface Env {
    RF_SECRETS: KVNamespace
    ADMIN_PASSWORD_HASH?: string
    JWT_SECRET?: string
}

interface AuthRequest {
    password?: string
    action?: 'verify' | 'generate-otp' | 'verify-otp'
    otp?: string
}

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

function jsonResponse(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
    })
}

async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function verifyPassword(inputPassword: string, storedHash: string): Promise<boolean> {
    const inputHash = await hashPassword(inputPassword)
    return inputHash === storedHash
}

function generateSessionToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('')
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const body = await context.request.json() as AuthRequest
        const { action = 'verify', password, otp } = body

        if (action === 'verify' && password) {
            let storedHash = context.env.ADMIN_PASSWORD_HASH

            if (!storedHash) {
                storedHash = await context.env.RF_SECRETS?.get('ADMIN_PASSWORD_HASH')
            }

            if (!storedHash) {
                console.error('ADMIN_PASSWORD_HASH not configured')
                return jsonResponse({ 
                    success: false, 
                    error: 'Authentication not configured. Please set ADMIN_PASSWORD_HASH in environment variables or KV.' 
                }, 500)
            }

            const isValid = await verifyPassword(password, storedHash)

            if (isValid) {
                const token = generateSessionToken()
                const expiry = Date.now() + (10 * 60 * 60 * 1000)

                await context.env.RF_SECRETS?.put(`session:${token}`, JSON.stringify({
                    createdAt: Date.now(),
                    expiresAt: expiry
                }), { expirationTtl: 36000 })

                return jsonResponse({ 
                    success: true,
                    token,
                    expiresAt: expiry
                })
            }

            await new Promise(resolve => setTimeout(resolve, 1000))
            return jsonResponse({ success: false, error: 'Invalid credentials' }, 401)
        }

        if (action === 'generate-otp') {
            const adminPhone = await context.env.RF_SECRETS?.get('ADMIN_PHONE')
            const apiKey = await context.env.RF_SECRETS?.get('MTALKZ_API_KEY')
            const senderId = await context.env.RF_SECRETS?.get('MTALKZ_SENDER_ID')

            if (!adminPhone || !apiKey || !senderId) {
                return jsonResponse({ success: false, error: 'OTP service not configured' }, 500)
            }

            const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
            const otpExpiry = Date.now() + (5 * 60 * 1000)

            await context.env.RF_SECRETS?.put('current_otp', JSON.stringify({
                code: otpCode,
                expiresAt: otpExpiry,
                attempts: 0
            }), { expirationTtl: 300 })

            const message = `Your RiskFortress Admin OTP is: ${otpCode}. Valid for 5 minutes. Do not share.`
            
            try {
                const smsResponse = await fetch('https://msg.mtalkz.com/V2/http-api.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        apikey: apiKey,
                        senderid: senderId,
                        number: adminPhone,
                        message: message,
                        format: 'json'
                    })
                })

                const smsData = await smsResponse.json()
                const success = smsData.status === 'OK' || smsData.status === 'success' || smsData.status === 'submitted'

                return jsonResponse({ 
                    success,
                    phone: adminPhone.slice(0, 4) + '****' + adminPhone.slice(-2)
                })
            } catch {
                return jsonResponse({ success: false, error: 'Failed to send OTP' }, 500)
            }
        }

        if (action === 'verify-otp' && otp) {
            const otpData = await context.env.RF_SECRETS?.get('current_otp')
            
            if (!otpData) {
                return jsonResponse({ success: false, error: 'No OTP requested. Please request a new one.' }, 400)
            }

            const stored = JSON.parse(otpData)

            if (Date.now() > stored.expiresAt) {
                await context.env.RF_SECRETS?.delete('current_otp')
                return jsonResponse({ success: false, error: 'OTP expired. Please request a new one.' }, 400)
            }

            stored.attempts++

            if (stored.attempts > 3) {
                await context.env.RF_SECRETS?.delete('current_otp')
                return jsonResponse({ success: false, error: 'Too many attempts. Please request a new OTP.' }, 400)
            }

            await context.env.RF_SECRETS?.put('current_otp', JSON.stringify(stored), { expirationTtl: 300 })

            if (otp !== stored.code) {
                return jsonResponse({ success: false, error: 'Invalid OTP. Please try again.' }, 401)
            }

            await context.env.RF_SECRETS?.delete('current_otp')
            return jsonResponse({ success: true })
        }

        return jsonResponse({ error: 'Invalid action' }, 400)
    } catch (error) {
        console.error('Auth error:', error)
        return jsonResponse({ error: 'Authentication failed', details: String(error) }, 500)
    }
}

export const onRequestOptions: PagesFunction = async () => {
    return new Response(null, { headers: corsHeaders })
}
