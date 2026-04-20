'use client'

import { useState, useEffect } from 'react'
import { Shield, X, Cookie, ChevronDown, ChevronUp } from 'lucide-react'

const COOKIE_CONSENT_KEY = 'rf-cookie-consent'
const COOKIE_CONSENT_VERSION = 'v1'

export type CookiePreferences = {
    necessary: boolean
    analytics: boolean
    marketing: boolean
}

export function getCookieConsent(): CookiePreferences | null {
    if (typeof window === 'undefined') return null
    try {
        const raw = localStorage.getItem(COOKIE_CONSENT_KEY)
        if (!raw) return null
        const parsed = JSON.parse(raw)
        if (parsed.version !== COOKIE_CONSENT_VERSION) return null
        return parsed.preferences as CookiePreferences
    } catch {
        return null
    }
}

export function hasAnalyticsConsent(): boolean {
    const prefs = getCookieConsent()
    return prefs?.analytics === true
}

export default function CookieConsent() {
    const [visible, setVisible] = useState(false)
    const [expanded, setExpanded] = useState(false)
    const [prefs, setPrefs] = useState<CookiePreferences>({
        necessary: true,
        analytics: true,
        marketing: false,
    })

    useEffect(() => {
        // Check if consent already given
        const existing = getCookieConsent()
        if (!existing) {
            // Delay slightly so page loads first
            const timer = setTimeout(() => setVisible(true), 1500)
            return () => clearTimeout(timer)
        }
    }, [])

    const saveConsent = (preferences: CookiePreferences) => {
        localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
            version: COOKIE_CONSENT_VERSION,
            preferences,
            acceptedAt: new Date().toISOString(),
        }))
        setVisible(false)
    }

    const acceptAll = () => {
        const all = { necessary: true, analytics: true, marketing: true }
        setPrefs(all)
        saveConsent(all)
    }

    const acceptNecessary = () => {
        const min = { necessary: true, analytics: false, marketing: false }
        setPrefs(min)
        saveConsent(min)
    }

    const saveCustom = () => {
        saveConsent({ ...prefs, necessary: true })
    }

    if (!visible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-[9999] p-4 sm:p-6 pointer-events-none">
            <div
                className="max-w-4xl mx-auto pointer-events-auto"
                style={{
                    animation: 'slideUpCookie 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                }}
            >
                <div className="rounded-2xl border border-gray-700/80 bg-gray-900/95 backdrop-blur-xl shadow-2xl shadow-black/50 overflow-hidden">
                    {/* Top accent line */}
                    <div className="h-0.5 w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

                    <div className="p-5 sm:p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                                    <Cookie className="h-5 w-5 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-base">Privacy & Cookie Preferences</h3>
                                    <p className="text-gray-400 text-xs mt-0.5">RiskFortress Intelligence Platform</p>
                                </div>
                            </div>
                            <button
                                onClick={acceptNecessary}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors flex-shrink-0"
                                title="Decline all optional cookies"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 text-sm leading-relaxed mb-4">
                            We use cookies to ensure platform security and improve your experience. Analytics cookies help us understand how our intelligence reports are accessed — all data is anonymised and never sold.{' '}
                            <a href="/privacy" className="text-cyan-400 hover:text-cyan-300 underline underline-offset-2 transition-colors">
                                Privacy Policy
                            </a>
                        </p>

                        {/* Expandable Preferences */}
                        <div className="mb-4">
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                            >
                                {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                                {expanded ? 'Hide' : 'Customise'} preferences
                            </button>

                            {expanded && (
                                <div className="mt-3 space-y-3 p-4 rounded-xl bg-gray-800/50 border border-gray-700/50">
                                    {/* Necessary */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-white">Strictly Necessary</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Session security, authentication, basic functionality</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-gray-500 italic">Always on</span>
                                            <div className="w-10 h-5 rounded-full bg-cyan-500/30 border border-cyan-500/50 flex items-center justify-end pr-0.5">
                                                <div className="w-4 h-4 rounded-full bg-cyan-400" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Analytics */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-white">Analytics</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Page views, engagement, traffic sources (anonymised)</p>
                                        </div>
                                        <button
                                            onClick={() => setPrefs(p => ({ ...p, analytics: !p.analytics }))}
                                            className={`w-10 h-5 rounded-full border transition-all duration-200 flex items-center ${
                                                prefs.analytics
                                                    ? 'bg-cyan-500/30 border-cyan-500/50 justify-end pr-0.5'
                                                    : 'bg-gray-700 border-gray-600 justify-start pl-0.5'
                                            }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full transition-colors ${prefs.analytics ? 'bg-cyan-400' : 'bg-gray-500'}`} />
                                        </button>
                                    </div>

                                    {/* Marketing */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-white">Marketing</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Personalised content recommendations</p>
                                        </div>
                                        <button
                                            onClick={() => setPrefs(p => ({ ...p, marketing: !p.marketing }))}
                                            className={`w-10 h-5 rounded-full border transition-all duration-200 flex items-center ${
                                                prefs.marketing
                                                    ? 'bg-cyan-500/30 border-cyan-500/50 justify-end pr-0.5'
                                                    : 'bg-gray-700 border-gray-600 justify-start pl-0.5'
                                            }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full transition-colors ${prefs.marketing ? 'bg-cyan-400' : 'bg-gray-500'}`} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-2.5">
                            {expanded ? (
                                <button
                                    onClick={saveCustom}
                                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-semibold text-sm transition-colors"
                                >
                                    Save My Preferences
                                </button>
                            ) : (
                                <button
                                    onClick={acceptAll}
                                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-semibold text-sm transition-colors"
                                >
                                    Accept All Cookies
                                </button>
                            )}
                            <button
                                onClick={acceptNecessary}
                                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 font-medium text-sm transition-colors"
                            >
                                Necessary Only
                            </button>
                            <div className="flex items-center gap-1.5 sm:ml-auto">
                                <Shield className="h-3.5 w-3.5 text-gray-600" />
                                <span className="text-xs text-gray-600">GDPR Compliant · Data never sold</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes slideUpCookie {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}
