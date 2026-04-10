'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, AlertTriangle, Loader2 } from 'lucide-react'
import Link from 'next/link'
import ProfessionalEmailModal from '@/components/ProfessionalEmailModal'

interface ResolveResult {
    type: string
    slug: string
    title: string
    grantToken?: string
    error?: string
}

export default function ShortLinkClient({ token }: { token: string }) {
    const router = useRouter()
    const [error, setError] = useState<string | null>(null)
    const [resolving, setResolving] = useState(true)
    const [showEmailModal, setShowEmailModal] = useState(false)
    const [pendingRedirect, setPendingRedirect] = useState<{slug: string, title: string} | null>(null)

    useEffect(() => {
        async function resolve() {
            try {
                const res = await fetch(`/api/short?token=${encodeURIComponent(token)}`)
                if (!res.ok) {
                    setError('This link is invalid or has expired.')
                    setResolving(false)
                    return
                }

                const data: ResolveResult = await res.json()

                if (data.type === 'case') {
                    if (data.grantToken) {
                        sessionStorage.setItem('rf-case-grant', data.grantToken)
                        sessionStorage.setItem('rf-case-grant-created-at', String(Date.now()))
                    }
                    const verified = sessionStorage.getItem('rf-email-verified')
                    if (!verified) {
                        setPendingRedirect({ slug: data.slug, title: data.title })
                        setShowEmailModal(true)
                        setResolving(false)
                        return
                    }
                }

                router.replace(`/dossiers/${data.slug}/`)
            } catch {
                setError('Failed to resolve link. Please try again.')
                setResolving(false)
            }
        }

        resolve()
    }, [token, router])

    if (showEmailModal && pendingRedirect) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
                <ProfessionalEmailModal
                    isOpen={showEmailModal}
                    onClose={() => {
                        setShowEmailModal(false)
                        setError('Professional email verification is required to view this case.')
                    }}
                    caseTitle={pendingRedirect.title}
                    caseSlug={pendingRedirect.slug}
                    onSuccess={() => {
                        sessionStorage.setItem('rf-email-verified', 'true')
                        setShowEmailModal(false)
                        router.replace(`/dossiers/${pendingRedirect.slug}/`)
                    }}
                />
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
                <div className="max-w-md p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-6">
                        <AlertTriangle className="h-8 w-8 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-4">Link Not Found</h1>
                    <p className="text-gray-400 mb-8">{error}</p>
                    <Link
                        href="/"
                        className="px-6 py-3 bg-intelligence text-white rounded-lg font-semibold hover:bg-intelligence/90 transition-colors"
                    >
                        Go to Homepage
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-intelligence/10 border border-intelligence/20 mb-6">
                    <Shield className="h-8 w-8 text-intelligence" />
                </div>
                <div className="flex items-center justify-center gap-3 mb-4">
                    <Loader2 className="h-5 w-5 text-intelligence animate-spin" />
                    <p className="text-gray-400">Verifying access...</p>
                </div>
            </div>
        </div>
    )
}
