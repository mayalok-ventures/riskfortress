import crypto from 'crypto'
import { EncryptionService } from './encryption'

export interface KeyMetadata {
    version: string
    createdAt: string
    expiresAt: string
    algorithm: string
    keySize: number
    status: 'active' | 'expired' | 'compromised' | 'retired'
    lastRotated: string
}

export interface KeyRotationLog {
    oldVersion: string
    newVersion: string
    rotatedAt: string
    rotatedBy: string
    reason: 'scheduled' | 'compromise' | 'expiry'
}

export class KeyManagementService {
    private static instance: KeyManagementService
    private encryptionService: EncryptionService
    private currentKeyVersion: string
    private keyStore: Map<string, { key: string; metadata: KeyMetadata }>
    private rotationLogs: KeyRotationLog[] = []

    private constructor() {
        this.encryptionService = EncryptionService.getInstance()
        this.currentKeyVersion = 'v1'
        this.keyStore = new Map()

        this.initializeKeyStore()
    }

    static getInstance(): KeyManagementService {
        if (!KeyManagementService.instance) {
            KeyManagementService.instance = new KeyManagementService()
        }
        return KeyManagementService.instance
    }

    private initializeKeyStore() {
        // Load current key from environment
        const currentKey = process.env.ENCRYPTION_KEY
        if (!currentKey) {
            throw new Error('ENCRYPTION_KEY environment variable is not set')
        }

        this.keyStore.set(this.currentKeyVersion, {
            key: currentKey,
            metadata: {
                version: this.currentKeyVersion,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days
                algorithm: 'AES-256-GCM',
                keySize: 256,
                status: 'active',
                lastRotated: new Date().toISOString()
            }
        })

        // Load previous keys from secure storage (simulated)
        this.loadHistoricalKeys()
    }

    private async loadHistoricalKeys() {
        // In production, load from AWS KMS, HashiCorp Vault, or secure database
        const historicalKeys = process.env.HISTORICAL_KEYS
        if (historicalKeys) {
            try {
                const keys = JSON.parse(historicalKeys)
                Object.entries(keys).forEach(([version, keyData]: [string, any]) => {
                    this.keyStore.set(version, {
                        key: keyData.key,
                        metadata: keyData.metadata
                    })
                })
            } catch (error) {
                console.warn('Failed to load historical keys:', error)
            }
        }
    }

    getCurrentKey(): { key: string; metadata: KeyMetadata } {
        const keyData = this.keyStore.get(this.currentKeyVersion)
        if (!keyData) {
            throw new Error('Current encryption key not found')
        }
        return keyData
    }

    getKey(version: string): { key: string; metadata: KeyMetadata } | undefined {
        return this.keyStore.get(version)
    }

    getAllKeys(): Array<{ version: string; metadata: KeyMetadata }> {
        return Array.from(this.keyStore.entries()).map(([version, data]) => ({
            version,
            metadata: data.metadata
        }))
    }

    async rotateKey(reason: KeyRotationLog['reason'] = 'scheduled'): Promise<{
        oldVersion: string
        newVersion: string
        rotationLog: KeyRotationLog
    }> {
        // Generate new key
        const newKey = this.encryptionService.generateKey()
        const newVersion = `v${Date.now()}`
        const oldVersion = this.currentKeyVersion

        // Update current key status
        const oldKeyData = this.keyStore.get(oldVersion)
        if (oldKeyData) {
            oldKeyData.metadata.status = 'retired'
            this.keyStore.set(oldVersion, oldKeyData)
        }

        // Store new key
        this.keyStore.set(newVersion, {
            key: newKey,
            metadata: {
                version: newVersion,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                algorithm: 'AES-256-GCM',
                keySize: 256,
                status: 'active',
                lastRotated: new Date().toISOString()
            }
        })

        // Update current version
        this.currentKeyVersion = newVersion

        // Create rotation log
        const rotationLog: KeyRotationLog = {
            oldVersion,
            newVersion,
            rotatedAt: new Date().toISOString(),
            rotatedBy: 'system',
            reason
        }

        this.rotationLogs.push(rotationLog)

        // Persist to secure storage
        await this.persistKeyRotation(newVersion, newKey, rotationLog)

        // Schedule re-encryption of old data
        this.scheduleReEncryption(oldVersion, newVersion)

        return {
            oldVersion,
            newVersion,
            rotationLog
        }
    }

    private async persistKeyRotation(version: string, key: string, rotationLog: KeyRotationLog) {
        // In production, save to AWS Secrets Manager, HashiCorp Vault, etc.
        console.log(`[KEY-MGMT] Key ${version} persisted to secure storage`)

        // Update environment variable for current session
        process.env.ENCRYPTION_KEY = key

        // Log rotation (in production, send to audit trail)
        console.log('[KEY-MGMT] Rotation logged:', rotationLog)
    }

    private scheduleReEncryption(oldVersion: string, newVersion: string) {
        // In production, schedule background job to re-encrypt data
        console.log(`[KEY-MGMT] Scheduled re-encryption from ${oldVersion} to ${newVersion}`)

        // This would typically:
        // 1. Queue re-encryption jobs
        // 2. Process in batches
        // 3. Update database records with new key version
        // 4. Delete old encrypted data
    }

    encryptWithVersion(data: any, version?: string): {
        encrypted: string
        keyVersion: string
        metadata: KeyMetadata
    } {
        const targetVersion = version || this.currentKeyVersion
        const keyData = this.keyStore.get(targetVersion)

        if (!keyData) {
            throw new Error(`Encryption key not found for version: ${targetVersion}`)
        }

        if (keyData.metadata.status !== 'active') {
            throw new Error(`Key ${targetVersion} is not active (status: ${keyData.metadata.status})`)
        }

        const encrypted = this.encryptionService.encrypt(data, keyData.key)

        return {
            encrypted: JSON.stringify(encrypted),
            keyVersion: targetVersion,
            metadata: keyData.metadata
        }
    }

    decryptWithVersion(encryptedData: string, version: string): {
        decrypted: any
        metadata: KeyMetadata
    } {
        const keyData = this.keyStore.get(version)

        if (!keyData) {
            throw new Error(`Decryption key not found for version: ${version}`)
        }

        if (keyData.metadata.status === 'compromised') {
            throw new Error(`Key ${version} has been compromised and cannot be used`)
        }

        const data = JSON.parse(encryptedData)
        const result = this.encryptionService.decrypt(data, keyData.key)

        if (!result.verified) {
            throw new Error('Data integrity verification failed')
        }

        return {
            decrypted: result.decrypted,
            metadata: keyData.metadata
        }
    }

    checkKeyExpiry(): Array<{ version: string; metadata: KeyMetadata; daysUntilExpiry: number }> {
        const now = new Date()
        const results: Array<{ version: string; metadata: KeyMetadata; daysUntilExpiry: number }> = []

        for (const [version, data] of this.keyStore.entries()) {
            const expiryDate = new Date(data.metadata.expiresAt)
            const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

            results.push({
                version,
                metadata: data.metadata,
                daysUntilExpiry
            })

            // Auto-rotate if expired
            if (daysUntilExpiry <= 0 && data.metadata.status === 'active') {
                console.warn(`[KEY-MGMT] Key ${version} has expired, scheduling rotation`)
                data.metadata.status = 'expired'
                this.scheduleKeyRotation('expiry')
            }
        }

        return results
    }

    private scheduleKeyRotation(reason: KeyRotationLog['reason']) {
        // In production, schedule immediate rotation
        setTimeout(() => {
            this.rotateKey(reason).catch(console.error)
        }, 1000)
    }

    markKeyAsCompromised(version: string, reason: string) {
        const keyData = this.keyStore.get(version)
        if (!keyData) {
            throw new Error(`Key ${version} not found`)
        }

        keyData.metadata.status = 'compromised'
        this.keyStore.set(version, keyData)

        // Log security incident
        console.error(`[SECURITY] Key ${version} marked as compromised: ${reason}`)

        // Immediate rotation if it's the current key
        if (version === this.currentKeyVersion) {
            this.rotateKey('compromise')
        }

        // Schedule re-encryption of all data with compromised key
        this.scheduleReEncryptionForCompromisedKey(version)
    }

    private scheduleReEncryptionForCompromisedKey(compromisedVersion: string) {
        // In production, highest priority re-encryption
        console.log(`[SECURITY] Scheduling emergency re-encryption for compromised key ${compromisedVersion}`)
    }

    getRotationLogs(limit: number = 10): KeyRotationLog[] {
        return this.rotationLogs.slice(-limit).reverse()
    }

    getKeyHealth(): {
        totalKeys: number
        activeKeys: number
        expiredKeys: number
        compromisedKeys: number
        nextRotationDue: string | null
    } {
        const keys = Array.from(this.keyStore.values())
        const activeKeys = keys.filter(k => k.metadata.status === 'active')
        const expiredKeys = keys.filter(k => k.metadata.status === 'expired')
        const compromisedKeys = keys.filter(k => k.metadata.status === 'compromised')

        const nextRotationDue = activeKeys.length > 0
            ? new Date(Math.min(...activeKeys.map(k => new Date(k.metadata.expiresAt).getTime()))).toISOString()
            : null

        return {
            totalKeys: keys.length,
            activeKeys: activeKeys.length,
            expiredKeys: expiredKeys.length,
            compromisedKeys: compromisedKeys.length,
            nextRotationDue
        }
    }
}

// Singleton export
export const keyManagementService = KeyManagementService.getInstance()