'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, Shield, AlertTriangle, Loader2 } from 'lucide-react'

export default function AdminLoginPage() {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [attempts, setAttempts] = useState(0)

    useEffect(() => {
        const el = document.querySelector('header')
        const ft = document.querySelector('footer')
        if (el) el.style.display = 'none'
        if (ft) ft.style.display = 'none'
        return () => {
            if (el) el.style.display = ''
            if (ft) ft.style.display = ''
        }
    }, [])

    useEffect(() => {
        const token = sessionStorage.getItem('rf-admin-token')
        if (token) router.replace('/rf-admin/dashboard/')
    }, [router])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!password.trim() || loading) return

        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password, action: 'verify' }),
            })

            const data = await res.json()

            if (data.success && data.token) {
                sessionStorage.setItem('rf-admin-token', data.token)
                sessionStorage.setItem('rf-admin-expiry', String(data.expiresAt))
                router.replace('/rf-admin/dashboard/')
            } else {
                setAttempts(prev => prev + 1)
                setError(data.error || 'Authentication failed')
                setPassword('')
            }
        } catch {
            setError('Network error. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-grid-pattern" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-intelligence/10 border border-intelligence/20 mb-4">
                        <Shield className="h-8 w-8 text-intelligence" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">RiskFortress</h1>
                    <p className="text-sm text-gray-500 mt-1">Administrative Access</p>
                </div>

                <form onSubmit={handleLogin} className="p-8 rounded-2xl bg-gray-900/80 backdrop-blur-sm border border-gray-800">
                    <div className="flex items-center space-x-2 mb-6">
                        <Lock className="h-5 w-5 text-intelligence" />
                        <h2 className="text-lg font-semibold text-white">Secure Login</h2>
                    </div>

                    {error && (
                        <div className="flex items-start space-x-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 mb-6">
                            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm text-red-400">{error}</p>
                                {attempts >= 3 && (
                                    <p className="text-xs text-red-400/70 mt-1">
                                        Multiple failed attempts detected. Access may be temporarily restricted.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="mb-6">
                        <label className="block text-sm text-gray-400 mb-2">Master Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 pr-12 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-intelligence focus:outline-none focus:ring-1 focus:ring-intelligence transition-all"
                                placeholder="Enter administrative password"
                                autoComplete="off"
                                autoFocus
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !password.trim()}
                        className="w-full py-3 bg-intelligence text-obsidian font-semibold rounded-xl hover:bg-intelligence-light transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>Authenticating...</span>
                            </>
                        ) : (
                            <>
                                <Lock className="h-4 w-4" />
                                <span>Access Control Panel</span>
                            </>
                        )}
                    </button>

                    <div className="mt-6 pt-4 border-t border-gray-800">
                        <p className="text-xs text-gray-600 text-center">
                            AES-256 encrypted session • Auto-expires in 10 hours
                        </p>
                        <p className="text-xs text-gray-600 text-center mt-1">
                            IP rate-limited • Max 5 attempts per 15 minutes
                        </p>
                    </div>
                </form>

                <p className="text-xs text-gray-700 text-center mt-6">
                    © {new Date().getFullYear()} RiskFortress Intelligence
                </p>
            </div>
        </div>
    )
}
