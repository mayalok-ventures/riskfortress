'use client'

import { X } from 'lucide-react'
import { useState } from 'react'

interface ProfessionalEmailModalProps {
    isOpen: boolean
    onClose: () => void
    caseTitle: string
    caseSlug: string
    onSuccess: () => void
}

export default function ProfessionalEmailModal({
    isOpen,
    onClose,
    caseTitle,
    caseSlug,
    onSuccess
}: ProfessionalEmailModalProps) {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const validateProfessionalEmail = (email: string) => {
        const blockedDomains = [
            'gmail.com',
            'yahoo.com',
            'outlook.com',
            'hotmail.com',
            'aol.com',
            'icloud.com',
            'protonmail.com',
            'ymail.com',
            'mail.com',
            'zoho.com',
            'live.com',
            'msn.com',
        ]
        const domain = email.split('@')[1]

        if (!domain) return false
        if (blockedDomains.includes(domain.toLowerCase())) {
            setError('Please use your professional company email (e.g., name@company.com).')
            return false
        }
        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!validateProfessionalEmail(email)) return
        if (!caseSlug) {
            setError('Unable to verify access for this case. Please refresh and try again.')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/email-gate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim(),
                    slug: caseSlug,
                    caseTitle,
                }),
            })

            const data = await response.json().catch(() => null)

            if (response.ok && data?.success && data?.grantToken) {
                // Store grant token per slug for API authorization
                const grantsRaw = localStorage.getItem('rf-case-grants')
                let grantsMap: Record<string, string> = {}
                try { grantsMap = grantsRaw ? JSON.parse(grantsRaw) : {} } catch { /* ignore */ }
                grantsMap[caseSlug] = data.grantToken
                localStorage.setItem('rf-case-grants', JSON.stringify(grantsMap))

                onSuccess()
                onClose()
                setEmail('')
                setError('')
            } else {
                setError(data?.error || 'Verification failed. Please try again.')
            }
        } catch {
            setError('Network error. Please check your connection.')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white text-lg font-semibold">Verify Professional Access</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <p className="text-gray-400 text-sm mb-6">
                    To view the full case study <strong>&quot;{caseTitle}&quot;</strong>, please verify your professional email address.
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="emailInput" className="block text-sm font-medium text-gray-400 mb-2">
                            Professional Email
                        </label>
                        <input
                            id="emailInput"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g., user@xyz.com"
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Personal email domains (Gmail, Yahoo, etc.) are not supported.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-gradient-to-r from-intelligence to-industrial text-white rounded-lg font-semibold hover:shadow-intelligence transition-all disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify & Access'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
