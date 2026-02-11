import { db } from '../firebase'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'

interface Env {}

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
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function verifyPassword(inputPassword: string, storedHash: string): Promise<boolean> {
  const inputHash = await hashPassword(inputPassword)
  return inputHash === storedHash
}

function generateSessionToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  try {
    const body = (await context.request.json()) as AuthRequest
    const { action = 'verify', password, otp } = body

    if (action === 'verify' && password) {
      const configSnap = await getDoc(doc(db, 'secrets', 'admin_config'))
      const config = configSnap.exists() ? configSnap.data() : null
      const storedHash = config?.ADMIN_PASSWORD_HASH as string | undefined

      if (!storedHash) {
        console.error('ADMIN_PASSWORD_HASH not configured')
        return jsonResponse(
          {
            success: false,
            error:
              'Authentication not configured. Please set ADMIN_PASSWORD_HASH in Firestore secrets/admin_config.',
          },
          500
        )
      }

      const isValid = await verifyPassword(password, storedHash)

      if (isValid) {
        const token = generateSessionToken()
        const expiry = Date.now() + 10 * 60 * 60 * 1000

        await setDoc(doc(db, 'sessions', token), {
          createdAt: Date.now(),
          expiresAt: expiry,
        })

        return jsonResponse({
          success: true,
          token,
          expiresAt: expiry,
        })
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
      return jsonResponse({ success: false, error: 'Invalid credentials' }, 401)
    }

    if (action === 'generate-otp') {
      const configSnap = await getDoc(doc(db, 'secrets', 'admin_config'))
      const config = configSnap.exists() ? configSnap.data() : null

      const adminPhone = config?.ADMIN_PHONE as string | undefined
      const apiKey = config?.MTALKZ_API_KEY as string | undefined
      const senderId = config?.MTALKZ_SENDER_ID as string | undefined

      if (!adminPhone || !apiKey || !senderId) {
        return jsonResponse({ success: false, error: 'OTP service not configured' }, 500)
      }

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
      const otpExpiry = Date.now() + 5 * 60 * 1000

      await setDoc(doc(db, 'secrets', 'current_otp'), {
        code: otpCode,
        expiresAt: otpExpiry,
        attempts: 0,
      })

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
            format: 'json',
          }),
        })

        const smsData = (await smsResponse.json()) as Record<string, unknown>
        const success =
          smsData.status === 'OK' ||
          smsData.status === 'success' ||
          smsData.status === 'submitted'

        return jsonResponse({
          success,
          phone: adminPhone.slice(0, 4) + '****' + adminPhone.slice(-2),
        })
      } catch {
        return jsonResponse({ success: false, error: 'Failed to send OTP' }, 500)
      }
    }

    if (action === 'verify-otp' && otp) {
      const otpSnap = await getDoc(doc(db, 'secrets', 'current_otp'))

      if (!otpSnap.exists()) {
        return jsonResponse(
          { success: false, error: 'No OTP requested. Please request a new one.' },
          400
        )
      }

      const stored = otpSnap.data() as {
        code: string
        expiresAt: number
        attempts: number
      }

      if (Date.now() > stored.expiresAt) {
        await deleteDoc(doc(db, 'secrets', 'current_otp'))
        return jsonResponse(
          { success: false, error: 'OTP expired. Please request a new one.' },
          400
        )
      }

      stored.attempts++

      if (stored.attempts > 3) {
        await deleteDoc(doc(db, 'secrets', 'current_otp'))
        return jsonResponse(
          { success: false, error: 'Too many attempts. Please request a new OTP.' },
          400
        )
      }

      await setDoc(doc(db, 'secrets', 'current_otp'), stored)

      if (otp !== stored.code) {
        return jsonResponse({ success: false, error: 'Invalid OTP. Please try again.' }, 401)
      }

      await deleteDoc(doc(db, 'secrets', 'current_otp'))
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
