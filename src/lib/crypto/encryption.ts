import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12 // 96 bits for GCM
const SALT_LENGTH = 32
const TAG_LENGTH = 16
const KEY_LENGTH = 32
const ITERATIONS = 100000
const DIGEST = 'sha512'

export interface EncryptionResult {
    encrypted: string
    iv: string
    salt: string
    tag: string
    version: string
    timestamp: string
}

export interface DecryptionResult {
    decrypted: any
    verified: boolean
    timestamp: string
}

export class EncryptionService {
    private static instance: EncryptionService

    private constructor() { }

    static getInstance(): EncryptionService {
        if (!EncryptionService.instance) {
            EncryptionService.instance = new EncryptionService()
        }
        return EncryptionService.instance
    }

    private deriveKey(password: string, salt: Buffer): Buffer {
        return crypto.pbkdf2Sync(
            password,
            salt,
            ITERATIONS,
            KEY_LENGTH,
            DIGEST
        )
    }

    encrypt(data: any, secret: string): EncryptionResult {
        try {
            // Generate salt
            const salt = crypto.randomBytes(SALT_LENGTH)

            // Derive key
            const key = this.deriveKey(secret, salt)

            // Generate IV
            const iv = crypto.randomBytes(IV_LENGTH)

            // Create cipher
            const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
                authTagLength: TAG_LENGTH
            })

            // Convert data to JSON and encrypt
            const jsonData = JSON.stringify(data)
            const encrypted = Buffer.concat([
                cipher.update(jsonData, 'utf8'),
                cipher.final()
            ])

            // Get authentication tag
            const tag = cipher.getAuthTag()

            // Create result object
            const result: EncryptionResult = {
                encrypted: encrypted.toString('base64'),
                iv: iv.toString('base64'),
                salt: salt.toString('base64'),
                tag: tag.toString('base64'),
                version: '1.0.0',
                timestamp: new Date().toISOString()
            }

            return result
        } catch (error) {
            throw new Error(`Encryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    decrypt(encryptedData: EncryptionResult, secret: string): DecryptionResult {
        try {
            // Decode components
            const salt = Buffer.from(encryptedData.salt, 'base64')
            const iv = Buffer.from(encryptedData.iv, 'base64')
            const tag = Buffer.from(encryptedData.tag, 'base64')
            const encrypted = Buffer.from(encryptedData.encrypted, 'base64')

            // Derive key
            const key = this.deriveKey(secret, salt)

            // Create decipher
            const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
                authTagLength: TAG_LENGTH
            })

            // Set auth tag
            decipher.setAuthTag(tag)

            // Decrypt data
            let decrypted = decipher.update(encrypted)
            decrypted = Buffer.concat([decrypted, decipher.final()])

            // Parse JSON
            const data = JSON.parse(decrypted.toString('utf8'))

            // Verify integrity
            const verified = this.verifyIntegrity(data, encryptedData)

            return {
                decrypted: data,
                verified,
                timestamp: encryptedData.timestamp
            }
        } catch (error) {
            throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    private verifyIntegrity(data: any, encryptedData: EncryptionResult): boolean {
        try {
            // Check timestamp (prevent replay attacks)
            const timestamp = new Date(encryptedData.timestamp)
            const now = new Date()
            const maxAge = 24 * 60 * 60 * 1000 // 24 hours

            if (now.getTime() - timestamp.getTime() > maxAge) {
                return false
            }

            // Verify version
            if (encryptedData.version !== '1.0.0') {
                return false
            }

            // Additional integrity checks can be added here
            return true
        } catch {
            return false
        }
    }

    // Key rotation utility
    async rotateKey(oldSecret: string, newSecret: string, encryptedData: EncryptionResult): Promise<EncryptionResult> {
        try {
            const decrypted = this.decrypt(encryptedData, oldSecret)

            if (!decrypted.verified) {
                throw new Error('Data integrity verification failed')
            }

            return this.encrypt(decrypted.decrypted, newSecret)
        } catch (error) {
            throw new Error(`Key rotation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    // Generate encryption key
    generateKey(): string {
        return crypto.randomBytes(KEY_LENGTH).toString('base64')
    }

    // Hash data (for verification without decryption)
    hashData(data: any): string {
        const jsonString = JSON.stringify(data)
        return crypto
            .createHash('sha256')
            .update(jsonString)
            .digest('hex')
    }
}

// Convenience functions
export function encryptPayload(data: any, secret: string): string {
    const service = EncryptionService.getInstance()
    const result = service.encrypt(data, secret)
    return JSON.stringify(result)
}

export function decryptPayload(encryptedData: string, secret: string): any {
    const service = EncryptionService.getInstance()
    const data = JSON.parse(encryptedData)
    const result = service.decrypt(data, secret)

    if (!result.verified) {
        throw new Error('Data integrity verification failed')
    }

    return result.decrypted
}

// Utility functions for secure string operations
export function secureStringCompare(a: string, b: string): boolean {
    try {
        return crypto.timingSafeEqual(
            Buffer.from(a),
            Buffer.from(b)
        )
    } catch {
        return false
    }
}

export function generateNonce(length: number = 32): string {
    return crypto.randomBytes(length).toString('base64')
}

export function hashWithSalt(data: string, salt: string): string {
    return crypto
        .pbkdf2Sync(data, salt, 10000, 64, 'sha512')
        .toString('hex')
}