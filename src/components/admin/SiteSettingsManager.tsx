'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    Phone, Mail, MapPin, Globe, Search as SearchIcon, Share2,
    Save, Loader2, CheckCircle, Settings, Link2, Clock
} from 'lucide-react'
import {
    getSiteSettings, updateContactSettings, updateSEOSettings, updateSocialLinks,
    type ContactSettings, type SEOSettings, type SocialLinks
} from '@/lib/admin/client-store'
import SaveProgressBar from './SaveProgressBar'

type SettingsTab = 'contact' | 'seo' | 'social'

export default function SiteSettingsManager() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('contact')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)
    const [error, setError] = useState('')

    const [contact, setContact] = useState<ContactSettings>({
        email: '', phone: '', address: '', mapUrl: '', officeHours: '', whatsapp: ''
    })
    const [seo, setSeo] = useState<SEOSettings>({
        metaTitle: '', metaDescription: '', keywords: [], ogImage: '',
        canonicalUrl: '', robotsTxt: '', googleVerification: '', bingVerification: '', structuredData: ''
    })
    const [social, setSocial] = useState<SocialLinks>({
        linkedin: '', twitter: '', instagram: '', facebook: '', youtube: '', github: '', telegram: '', whatsapp: ''
    })
    const [seoKeywordInput, setSeoKeywordInput] = useState('')

    const loadSettings = useCallback(async (retries = 3) => {
        setLoading(true)
        setError('')
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const settings = await getSiteSettings()
                if (settings) {
                    if (settings.contact) setContact(prev => ({ ...prev, ...settings.contact }))
                    if (settings.seo) setSeo(prev => ({ ...prev, ...settings.seo, keywords: settings.seo?.keywords || [] }))
                    if (settings.social) setSocial(prev => ({ ...prev, ...settings.social }))
                }
                setLoading(false)
                return
            } catch (err) {
                console.error(`Settings load attempt ${attempt + 1} failed:`, err)
                if (attempt < retries - 1) {
                    await new Promise(r => setTimeout(r, 1000 * (attempt + 1)))
                } else {
                    setError(err instanceof Error ? err.message : 'Failed to load settings')
                }
            }
        }
        setLoading(false)
    }, [])

    useEffect(() => { loadSettings() }, [loadSettings])

    const saveContact = async () => {
        setSaving(true); setError('')
        try { await updateContactSettings(contact); setSaved(true); setTimeout(() => setSaved(false), 2000) }
        catch (err) { console.error('Save contact error:', err); setError(err instanceof Error ? err.message : 'Failed to save contact settings') }
        finally { setSaving(false) }
    }

    const saveSeo = async () => {
        setSaving(true); setError('')
        try { await updateSEOSettings(seo); setSaved(true); setTimeout(() => setSaved(false), 2000) }
        catch (err) { console.error('Save SEO error:', err); setError(err instanceof Error ? err.message : 'Failed to save SEO settings') }
        finally { setSaving(false) }
    }

    const saveSocial = async () => {
        setSaving(true); setError('')
        try { await updateSocialLinks(social); setSaved(true); setTimeout(() => setSaved(false), 2000) }
        catch (err) { console.error('Save social error:', err); setError(err instanceof Error ? err.message : 'Failed to save social links') }
        finally { setSaving(false) }
    }

    const addSeoKeyword = () => {
        if (!seoKeywordInput.trim()) return
        if (!seo.keywords.includes(seoKeywordInput.trim())) {
            setSeo({ ...seo, keywords: [...seo.keywords, seoKeywordInput.trim()] })
        }
        setSeoKeywordInput('')
    }

    if (loading) {
        return (
            <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-intelligence" />
                <p className="text-gray-400 mt-3">Loading settings...</p>
            </div>
        )
    }

    const tabConfig: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
        { key: 'contact', label: 'Contact Info', icon: <Phone className="h-4 w-4" /> },
        { key: 'seo', label: 'SEO Settings', icon: <SearchIcon className="h-4 w-4" /> },
        { key: 'social', label: 'Social Links', icon: <Share2 className="h-4 w-4" /> },
    ]

    return (
        <div className="space-y-6">
            <SaveProgressBar saving={saving} />

            <div className="flex items-center gap-3 mb-2">
                <Settings className="h-5 w-5 text-intelligence" />
                <h2 className="text-xl font-bold text-white">Site Settings</h2>
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
                {tabConfig.map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            activeTab === tab.key ? 'bg-intelligence text-white' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                        }`}>
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
            )}

            {/* Contact Section */}
            {activeTab === 'contact' && (
                <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-800 space-y-5">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Mail className="h-5 w-5 text-intelligence" /> Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                            <input type="email" value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })}
                                placeholder="contact@example.com"
                                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                            <input type="text" value={contact.phone} onChange={e => setContact({ ...contact, phone: e.target.value })}
                                placeholder="+91 XXXX XXXXXX"
                                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">WhatsApp</label>
                            <input type="text" value={contact.whatsapp || ''} onChange={e => setContact({ ...contact, whatsapp: e.target.value })}
                                placeholder="+91 XXXX XXXXXX"
                                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Office Hours</label>
                            <input type="text" value={contact.officeHours || ''} onChange={e => setContact({ ...contact, officeHours: e.target.value })}
                                placeholder="Mon - Fri, 9:00 AM - 6:00 PM IST"
                                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Address</label>
                        <textarea value={contact.address} onChange={e => setContact({ ...contact, address: e.target.value })}
                            placeholder="Full office address" rows={2}
                            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none resize-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Google Maps Embed URL</label>
                        <input type="text" value={contact.mapUrl || ''} onChange={e => setContact({ ...contact, mapUrl: e.target.value })}
                            placeholder="https://www.google.com/maps/embed?..."
                            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none" />
                    </div>
                    <div className="flex justify-end pt-2">
                        <button onClick={saveContact} disabled={saving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-intelligence to-industrial text-white rounded-lg font-semibold hover:shadow-intelligence transition-all disabled:opacity-50">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                            {saved ? 'Saved' : 'Save Contact'}
                        </button>
                    </div>
                </div>
            )}

            {/* SEO Section */}
            {activeTab === 'seo' && (
                <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-800 space-y-5">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Globe className="h-5 w-5 text-intelligence" /> SEO Settings
                    </h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Meta Title</label>
                        <input type="text" value={seo.metaTitle} onChange={e => setSeo({ ...seo, metaTitle: e.target.value })}
                            placeholder="Site title for search engines"
                            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none" />
                        <p className="text-xs text-gray-500 mt-1">{seo.metaTitle.length}/60 characters</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Meta Description</label>
                        <textarea value={seo.metaDescription} onChange={e => setSeo({ ...seo, metaDescription: e.target.value })}
                            placeholder="Description shown in search results" rows={3}
                            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none resize-none" />
                        <p className="text-xs text-gray-500 mt-1">{seo.metaDescription.length}/160 characters</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">SEO Keywords</label>
                        <div className="flex gap-2">
                            <input type="text" value={seoKeywordInput} onChange={e => setSeoKeywordInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSeoKeyword())}
                                placeholder="Add keyword..."
                                className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-gray-300 text-sm focus:border-intelligence focus:outline-none" />
                            <button type="button" onClick={addSeoKeyword}
                                className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600">Add</button>
                        </div>
                        {seo.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {seo.keywords.map(kw => (
                                    <span key={kw} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-900 text-gray-400 text-xs rounded-full border border-gray-700">
                                        {kw}
                                        <button onClick={() => setSeo({ ...seo, keywords: seo.keywords.filter(k => k !== kw) })}
                                            className="hover:text-red-400 ml-0.5">&times;</button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">OG Image URL</label>
                            <input type="text" value={seo.ogImage || ''} onChange={e => setSeo({ ...seo, ogImage: e.target.value })}
                                placeholder="https://..."
                                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Canonical URL</label>
                            <input type="text" value={seo.canonicalUrl || ''} onChange={e => setSeo({ ...seo, canonicalUrl: e.target.value })}
                                placeholder="https://riskfortress.in"
                                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Google Verification</label>
                            <input type="text" value={seo.googleVerification || ''} onChange={e => setSeo({ ...seo, googleVerification: e.target.value })}
                                placeholder="Verification code"
                                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Bing Verification</label>
                            <input type="text" value={seo.bingVerification || ''} onChange={e => setSeo({ ...seo, bingVerification: e.target.value })}
                                placeholder="Verification code"
                                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Structured Data (JSON-LD)</label>
                        <textarea value={seo.structuredData || ''} onChange={e => setSeo({ ...seo, structuredData: e.target.value })}
                            placeholder='{"@context":"https://schema.org",...}' rows={4}
                            className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white font-mono text-sm focus:border-intelligence focus:outline-none resize-none" />
                    </div>
                    <div className="flex justify-end pt-2">
                        <button onClick={saveSeo} disabled={saving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-intelligence to-industrial text-white rounded-lg font-semibold hover:shadow-intelligence transition-all disabled:opacity-50">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                            {saved ? 'Saved' : 'Save SEO'}
                        </button>
                    </div>
                </div>
            )}

            {/* Social Links Section */}
            {activeTab === 'social' && (
                <div className="p-6 rounded-xl bg-gray-800/50 border border-gray-800 space-y-5">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Link2 className="h-5 w-5 text-intelligence" /> Social Media Links
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {([
                            { key: 'linkedin' as const, label: 'LinkedIn', ph: 'https://linkedin.com/company/...' },
                            { key: 'twitter' as const, label: 'Twitter / X', ph: 'https://twitter.com/...' },
                            { key: 'instagram' as const, label: 'Instagram', ph: 'https://instagram.com/...' },
                            { key: 'facebook' as const, label: 'Facebook', ph: 'https://facebook.com/...' },
                            { key: 'youtube' as const, label: 'YouTube', ph: 'https://youtube.com/...' },
                            { key: 'github' as const, label: 'GitHub', ph: 'https://github.com/...' },
                            { key: 'telegram' as const, label: 'Telegram', ph: 'https://t.me/...' },
                            { key: 'whatsapp' as const, label: 'WhatsApp', ph: 'https://wa.me/...' },
                        ]).map(s => (
                            <div key={s.key}>
                                <label className="block text-sm font-medium text-gray-400 mb-1">{s.label}</label>
                                <input type="text" value={social[s.key] || ''}
                                    onChange={e => setSocial({ ...social, [s.key]: e.target.value })}
                                    placeholder={s.ph}
                                    className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none" />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end pt-2">
                        <button onClick={saveSocial} disabled={saving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-intelligence to-industrial text-white rounded-lg font-semibold hover:shadow-intelligence transition-all disabled:opacity-50">
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <CheckCircle className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                            {saved ? 'Saved' : 'Save Social Links'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
