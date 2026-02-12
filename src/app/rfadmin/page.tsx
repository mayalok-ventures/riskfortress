'use client'

import { useState, useEffect } from 'react'
import { Shield, Lock, Eye, EyeOff, Key, LogOut, BarChart3, FileText, Settings } from 'lucide-react'
import AdminDashboard from '@/components/AdminDashboard'
import ContentManager from '@/components/admin/ContentManager'
import SiteSettingsManager from '@/components/admin/SiteSettingsManager'
import { loginAdmin, validateSession, clearSession } from '@/lib/admin/api-store'

type AuthStep = 'access' | 'password' | 'authenticated'
type AdminTab = 'dashboard' | 'content' | 'settings'

export default function AdminPage() {
    const [authStep, setAuthStep] = useState<AuthStep>('access')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')

    useEffect(() => {
        if (validateSession()) {
            setAuthStep('authenticated')
        }
    }, [])

    const handlePasswordSubmit = async () => {
        if (!password) {
            setError('Please enter password')
            return
        }

        setLoading(true)
        setError('')

        try {
            const result = await loginAdmin(password)
            if (result.success) {
                setAuthStep('authenticated')
            } else {
                setError(result.error || 'Invalid password')
            }
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Authentication failed')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        await clearSession()
        setAuthStep('access')
        setPassword('')
        setActiveTab('dashboard')
    }

    if (authStep !== 'authenticated') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
                <div className="w-full max-w-md p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-intelligence/10 border border-intelligence/20 mb-4">
                            <Shield className="h-8 w-8 text-intelligence" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">RiskFortress Admin</h1>
                        <p className="text-gray-400 text-sm mt-2">Secure Administrative Access</p>
                    </div>

                    <div className="p-6 rounded-2xl glass-morphism border border-gray-800">
                        {authStep === 'access' && (
                            <div className="text-center">
                                <Lock className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                                <p className="text-gray-400 mb-6">Click to access admin panel</p>
                                <button
                                    onClick={() => setAuthStep('password')}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-intelligence to-industrial text-white rounded-lg font-semibold hover:shadow-intelligence transition-all"
                                >
                                    Access Admin
                                </button>
                            </div>
                        )}
                        {authStep === 'password' && (
                            <div>
                                <div className="flex items-center justify-center mb-4">
                                    <Key className="h-8 w-8 text-intelligence" />
                                </div>
                                <p className="text-gray-400 text-center text-sm mb-4">
                                    Enter your security password
                                </p>
                                <div className="relative mb-4">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none pr-12"
                                        autoFocus
                                        onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                                <button
                                    onClick={handlePasswordSubmit}
                                    disabled={loading || !password}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-intelligence to-industrial text-white rounded-lg font-semibold hover:shadow-intelligence transition-all disabled:opacity-50"
                                >
                                    {loading ? 'Authenticating...' : 'Login'}
                                </button>
                            </div>
                        )}

                        {error && (
                            <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                                <p className="text-red-400 text-sm text-center">{error}</p>
                            </div>
                        )}
                    </div>

                    <p className="text-center text-gray-500 text-xs mt-4">
                        Protected by RiskFortress Security
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-950">
            <nav className="sticky top-0 z-50 glass-morphism border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-intelligence" />
                            <span className="text-white font-semibold">RiskFortress Admin</span>
                        </div>

                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setActiveTab('dashboard')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === 'dashboard'
                                        ? 'bg-intelligence text-white'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <BarChart3 className="h-4 w-4" />
                                    Dashboard
                                </span>
                            </button>
                            <button
                                onClick={() => setActiveTab('content')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === 'content'
                                        ? 'bg-intelligence text-white'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Content
                                </span>
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    activeTab === 'settings'
                                        ? 'bg-intelligence text-white'
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    <Settings className="h-4 w-4" />
                                    Settings
                                </span>
                            </button>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-red-400 transition-colors text-sm"
                        >
                            <LogOut className="h-4 w-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <main>
                {activeTab === 'dashboard' && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <AdminDashboard />
                    </div>
                )}
                {activeTab === 'content' && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <ContentManager />
                    </div>
                )}
                {activeTab === 'settings' && (
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <SiteSettingsManager />
                    </div>
                )}
            </main>
        </div>
    )
}
