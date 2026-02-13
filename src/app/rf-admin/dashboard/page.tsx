'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    LayoutDashboard, FileText, BookOpen, Newspaper, Phone, Search, Share2,
    LogOut, Menu, X, Plus, Edit3, Trash2, Eye, EyeOff, Shield, Loader2,
    Save, ExternalLink, Globe, Mail, MapPin
} from 'lucide-react'
import ContentEditor from '@/components/Admin/ContentEditor'

interface ContentItem {
    id: string; type: string; title: string; slug: string; status: string
    createdAt: string; updatedAt: string; publishedAt?: string
    summary?: string; thumbnail?: string; author?: string; keywords?: string[]
    sector?: string; threatLevel?: string; confidence?: number
    caseStatus?: string; location?: string; accessToken?: string
}

interface SiteSettings {
    contact?: { email?: string; phone?: string; address?: string; mapEmbed?: string }
    seo?: { metaTitle?: string; metaDescription?: string; metaKeywords?: string; ogImage?: string; canonicalUrl?: string; googleVerification?: string; bingVerification?: string }
    social?: { twitter?: string; linkedin?: string; facebook?: string; instagram?: string; youtube?: string; github?: string }
    general?: { siteName?: string; tagline?: string; maintenanceMode?: boolean }
}

type Section = 'dashboard' | 'cases' | 'articles' | 'blogs' | 'contact' | 'seo' | 'social'

const NAV_ITEMS: { id: Section; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cases', label: 'Cases', icon: FileText },
    { id: 'articles', label: 'Articles', icon: BookOpen },
    { id: 'blogs', label: 'Blogs', icon: Newspaper },
    { id: 'contact', label: 'Contact Settings', icon: Phone },
    { id: 'seo', label: 'SEO Settings', icon: Search },
    { id: 'social', label: 'Social Links', icon: Share2 },
]

export default function AdminDashboard() {
    const router = useRouter()
    const [token, setToken] = useState<string | null>(null)
    const [section, setSection] = useState<Section>('dashboard')
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [content, setContent] = useState<ContentItem[]>([])
    const [settings, setSettings] = useState<SiteSettings>({})
    const [loading, setLoading] = useState(true)
    const [settingsLoading, setSettingsLoading] = useState(false)
    const [settingsSaving, setSettingsSaving] = useState(false)
    const [settingsSaved, setSettingsSaved] = useState(false)
    const [editorMode, setEditorMode] = useState<{ type: 'case'|'article'|'blog'; editId?: string } | null>(null)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    useEffect(() => {
        const el = document.querySelector('header')
        const ft = document.querySelector('footer')
        if (el) el.style.display = 'none'
        if (ft) ft.style.display = 'none'
        return () => { if (el) el.style.display = ''; if (ft) ft.style.display = '' }
    }, [])

    useEffect(() => {
        const t = sessionStorage.getItem('rf-admin-token')
        if (!t) { router.replace('/rf-admin/'); return }
        setToken(t)
    }, [router])

    useEffect(() => {
        if (token) loadContent()
    }, [token])

    useEffect(() => {
        if (token && ['contact', 'seo', 'social'].includes(section)) loadSettings()
    }, [token, section])

    const loadContent = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/content', { headers: { Authorization: `Bearer ${token}` } })
            if (res.status === 401) { sessionStorage.removeItem('rf-admin-token'); router.replace('/rf-admin/'); return }
            if (res.ok) setContent(await res.json())
        } catch { /* ignore */ }
        finally { setLoading(false) }
    }

    const loadSettings = async () => {
        setSettingsLoading(true)
        try {
            const res = await fetch('/api/settings', { headers: { Authorization: `Bearer ${token}` } })
            if (res.ok) { const d = await res.json(); setSettings(d) }
        } catch { /* ignore */ }
        finally { setSettingsLoading(false) }
    }

    const saveSettings = async (data: Partial<SiteSettings>) => {
        setSettingsSaving(true); setSettingsSaved(false)
        try {
            const res = await fetch('/api/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(data),
            })
            if (res.ok) {
                const d = await res.json()
                setSettings(d)
                setSettingsSaved(true)
                setTimeout(() => setSettingsSaved(false), 3000)
            }
        } catch { /* ignore */ }
        finally { setSettingsSaving(false) }
    }

    const deleteContent = async (id: string) => {
        try {
            await fetch(`/api/content?id=${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            })
            setContent(content.filter(c => c.id !== id))
            setDeleteConfirm(null)
        } catch { /* ignore */ }
    }

    const logout = async () => {
        try {
            await fetch('/api/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'logout', token }),
            })
        } catch { /* ignore */ }
        sessionStorage.removeItem('rf-admin-token')
        sessionStorage.removeItem('rf-admin-expiry')
        router.replace('/rf-admin/')
    }

    const cases = content.filter(c => c.type === 'case')
    const articles = content.filter(c => c.type === 'article')
    const blogs = content.filter(c => c.type === 'blog')
    const published = content.filter(c => c.status === 'published').length
    const drafts = content.filter(c => c.status === 'draft').length

    if (!token) return null

    if (editorMode) {
        return (
            <div className="min-h-screen bg-gray-950 p-6">
                <div className="max-w-7xl mx-auto">
                    <ContentEditor
                        type={editorMode.type}
                        editId={editorMode.editId}
                        onSave={() => { setEditorMode(null); loadContent() }}
                        onCancel={() => setEditorMode(null)}
                    />
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-950 flex">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-0 lg:w-16'} flex-shrink-0 bg-gray-900 border-r border-gray-800 transition-all duration-300 overflow-hidden`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    {sidebarOpen && (
                        <div className="flex items-center space-x-2">
                            <Shield className="h-6 w-6 text-intelligence" />
                            <span className="font-bold text-white">RF Admin</span>
                        </div>
                    )}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-400">
                        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>
                <nav className="p-2 space-y-1">
                    {NAV_ITEMS.map(item => (
                        <button
                            key={item.id}
                            onClick={() => setSection(item.id)}
                            className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                                section === item.id
                                    ? 'bg-intelligence/10 text-intelligence border border-intelligence/20'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                        >
                            <item.icon className="h-5 w-5 flex-shrink-0" />
                            {sidebarOpen && <span>{item.label}</span>}
                        </button>
                    ))}
                    <div className="pt-4 border-t border-gray-800 mt-4">
                        <button
                            onClick={logout}
                            className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                            <LogOut className="h-5 w-5 flex-shrink-0" />
                            {sidebarOpen && <span>Logout</span>}
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    {/* Mobile sidebar toggle */}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden mb-4 p-2 rounded-lg bg-gray-800 text-gray-400">
                        <Menu className="h-5 w-5" />
                    </button>

                    {section === 'dashboard' && (
                        <DashboardView
                            cases={cases.length} articles={articles.length} blogs={blogs.length}
                            published={published} drafts={drafts} loading={loading}
                        />
                    )}

                    {(section === 'cases' || section === 'articles' || section === 'blogs') && (
                        <ContentListView
                            type={section === 'cases' ? 'case' : section === 'articles' ? 'article' : 'blog'}
                            items={section === 'cases' ? cases : section === 'articles' ? articles : blogs}
                            loading={loading}
                            onNew={(type) => setEditorMode({ type })}
                            onEdit={(type, id) => setEditorMode({ type, editId: id })}
                            onDelete={(id) => setDeleteConfirm(id)}
                            deleteConfirm={deleteConfirm}
                            onConfirmDelete={deleteContent}
                            onCancelDelete={() => setDeleteConfirm(null)}
                        />
                    )}

                    {section === 'contact' && (
                        <ContactSettingsView
                            settings={settings}
                            loading={settingsLoading}
                            saving={settingsSaving}
                            saved={settingsSaved}
                            onSave={(data) => saveSettings({ contact: data })}
                        />
                    )}

                    {section === 'seo' && (
                        <SEOSettingsView
                            settings={settings}
                            loading={settingsLoading}
                            saving={settingsSaving}
                            saved={settingsSaved}
                            onSave={(data) => saveSettings({ seo: data })}
                        />
                    )}

                    {section === 'social' && (
                        <SocialSettingsView
                            settings={settings}
                            loading={settingsLoading}
                            saving={settingsSaving}
                            saved={settingsSaved}
                            onSave={(data) => saveSettings({ social: data })}
                        />
                    )}
                </div>
            </main>
        </div>
    )
}

/* ========== Dashboard Overview ========== */
function DashboardView({ cases, articles, blogs, published, drafts, loading }: {
    cases: number; articles: number; blogs: number; published: number; drafts: number; loading: boolean
}) {
    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-intelligence" /></div>

    const stats = [
        { label: 'Total Cases', value: cases, icon: FileText, color: 'text-blue-400 bg-blue-400/10' },
        { label: 'Total Articles', value: articles, icon: BookOpen, color: 'text-green-400 bg-green-400/10' },
        { label: 'Total Blogs', value: blogs, icon: Newspaper, color: 'text-purple-400 bg-purple-400/10' },
        { label: 'Published', value: published, icon: Eye, color: 'text-intelligence bg-intelligence/10' },
        { label: 'Drafts', value: drafts, icon: EyeOff, color: 'text-gray-400 bg-gray-400/10' },
    ]

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {stats.map(s => (
                    <div key={s.label} className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
                        <div className={`inline-flex p-3 rounded-xl ${s.color} mb-3`}>
                            <s.icon className="h-6 w-6" />
                        </div>
                        <p className="text-3xl font-bold text-white">{s.value}</p>
                        <p className="text-sm text-gray-400 mt-1">{s.label}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ========== Content List ========== */
function ContentListView({ type, items, loading, onNew, onEdit, onDelete, deleteConfirm, onConfirmDelete, onCancelDelete }: {
    type: 'case' | 'article' | 'blog'; items: ContentItem[]; loading: boolean
    onNew: (t: 'case'|'article'|'blog') => void; onEdit: (t: 'case'|'article'|'blog', id: string) => void
    onDelete: (id: string) => void; deleteConfirm: string | null
    onConfirmDelete: (id: string) => void; onCancelDelete: () => void
}) {
    const label = type === 'case' ? 'Cases' : type === 'article' ? 'Articles' : 'Blogs'

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-intelligence" /></div>

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">{label}</h1>
                <button
                    onClick={() => onNew(type)}
                    className="flex items-center space-x-2 px-4 py-2.5 bg-intelligence text-obsidian rounded-xl font-semibold hover:bg-intelligence-light transition-colors"
                >
                    <Plus className="h-5 w-5" />
                    <span>Create New</span>
                </button>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-20 rounded-2xl bg-gray-900 border border-gray-800">
                    <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No {label} Yet</h3>
                    <p className="text-gray-400 mb-6">Create your first {type} to get started.</p>
                    <button onClick={() => onNew(type)} className="px-6 py-2.5 bg-intelligence text-obsidian rounded-lg font-semibold">
                        Create {type === 'case' ? 'Case' : type === 'article' ? 'Article' : 'Blog'}
                    </button>
                </div>
            ) : (
                <div className="rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-800">
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Title</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                                    {type === 'case' && <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Threat</th>}
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(item => (
                                    <tr key={item.id} className="border-b border-gray-800/50 hover:bg-gray-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-white font-medium">{item.title || 'Untitled'}</p>
                                                <p className="text-xs text-gray-500 font-mono mt-0.5">{item.slug}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                item.status === 'published'
                                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                                    : 'bg-gray-700 text-gray-400 border border-gray-600'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        {type === 'case' && (
                                            <td className="px-6 py-4">
                                                {item.threatLevel && (
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                        item.threatLevel === 'Critical' ? 'bg-red-500/10 text-red-400' :
                                                        item.threatLevel === 'High' ? 'bg-orange-500/10 text-orange-400' :
                                                        item.threatLevel === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                                        'bg-green-500/10 text-green-400'
                                                    }`}>
                                                        {item.threatLevel}
                                                    </span>
                                                )}
                                            </td>
                                        )}
                                        <td className="px-6 py-4 text-sm text-gray-400">
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                {item.status === 'published' && (
                                                    <a
                                                        href={`/dossiers/${item.slug}/`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-white transition-colors"
                                                        title="View"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => onEdit(type, item.id)}
                                                    className="p-2 rounded-lg hover:bg-gray-700 text-gray-400 hover:text-intelligence transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit3 className="h-4 w-4" />
                                                </button>
                                                {deleteConfirm === item.id ? (
                                                    <div className="flex items-center space-x-1">
                                                        <button
                                                            onClick={() => onConfirmDelete(item.id)}
                                                            className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                                                        >
                                                            Confirm
                                                        </button>
                                                        <button
                                                            onClick={onCancelDelete}
                                                            className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => onDelete(item.id)}
                                                        className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

/* ========== Settings Components ========== */
function SettingsWrapper({ title, saving, saved, onSubmit, children }: {
    title: string; saving: boolean; saved: boolean; onSubmit: (e: React.FormEvent) => void; children: React.ReactNode
}) {
    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">{title}</h1>
            <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
                <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800 space-y-5">
                    {children}
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center space-x-2 px-6 py-2.5 bg-intelligence text-obsidian rounded-xl font-semibold hover:bg-intelligence-light transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                    </button>
                    {saved && <span className="text-green-400 text-sm flex items-center space-x-1"><Eye className="h-4 w-4" /><span>Saved!</span></span>}
                </div>
            </form>
        </div>
    )
}

function SettingsInput({ label, value, onChange, placeholder, type = 'text', icon }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; icon?: React.ReactNode
}) {
    return (
        <div>
            <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
            <div className="relative">
                {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{icon}</div>}
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={`w-full ${icon ? 'pl-10' : 'px-4'} pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-intelligence focus:outline-none text-sm`}
                    placeholder={placeholder}
                />
            </div>
        </div>
    )
}

function ContactSettingsView({ settings, loading, saving, saved, onSave }: {
    settings: SiteSettings; loading: boolean; saving: boolean; saved: boolean; onSave: (d: NonNullable<SiteSettings['contact']>) => void
}) {
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [address, setAddress] = useState('')
    const [mapEmbed, setMapEmbed] = useState('')

    useEffect(() => {
        if (settings.contact) {
            setEmail(settings.contact.email || '')
            setPhone(settings.contact.phone || '')
            setAddress(settings.contact.address || '')
            setMapEmbed(settings.contact.mapEmbed || '')
        }
    }, [settings])

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-intelligence" /></div>

    return (
        <SettingsWrapper title="Contact Settings" saving={saving} saved={saved} onSubmit={(e) => { e.preventDefault(); onSave({ email, phone, address, mapEmbed }) }}>
            <SettingsInput label="Email Address" value={email} onChange={setEmail} placeholder="contact@riskfortress.in" icon={<Mail className="h-4 w-4" />} />
            <SettingsInput label="Phone Number" value={phone} onChange={setPhone} placeholder="+91 XXXXX XXXXX" icon={<Phone className="h-4 w-4" />} />
            <SettingsInput label="Address" value={address} onChange={setAddress} placeholder="Office address..." icon={<MapPin className="h-4 w-4" />} />
            <div>
                <label className="block text-sm text-gray-400 mb-1.5">Map Embed Code</label>
                <textarea
                    value={mapEmbed}
                    onChange={(e) => setMapEmbed(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-intelligence focus:outline-none text-sm resize-none font-mono"
                    placeholder="<iframe src='...'></iframe>"
                />
            </div>
        </SettingsWrapper>
    )
}

function SEOSettingsView({ settings, loading, saving, saved, onSave }: {
    settings: SiteSettings; loading: boolean; saving: boolean; saved: boolean; onSave: (d: NonNullable<SiteSettings['seo']>) => void
}) {
    const [metaTitle, setMetaTitle] = useState('')
    const [metaDescription, setMetaDescription] = useState('')
    const [metaKeywords, setMetaKeywords] = useState('')
    const [ogImage, setOgImage] = useState('')
    const [canonicalUrl, setCanonicalUrl] = useState('')
    const [googleVerification, setGoogleVerification] = useState('')
    const [bingVerification, setBingVerification] = useState('')

    useEffect(() => {
        if (settings.seo) {
            setMetaTitle(settings.seo.metaTitle || '')
            setMetaDescription(settings.seo.metaDescription || '')
            setMetaKeywords(settings.seo.metaKeywords || '')
            setOgImage(settings.seo.ogImage || '')
            setCanonicalUrl(settings.seo.canonicalUrl || '')
            setGoogleVerification(settings.seo.googleVerification || '')
            setBingVerification(settings.seo.bingVerification || '')
        }
    }, [settings])

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-intelligence" /></div>

    return (
        <SettingsWrapper title="SEO Settings" saving={saving} saved={saved} onSubmit={(e) => { e.preventDefault(); onSave({ metaTitle, metaDescription, metaKeywords, ogImage, canonicalUrl, googleVerification, bingVerification }) }}>
            <SettingsInput label="Meta Title" value={metaTitle} onChange={setMetaTitle} placeholder="RiskFortress | Enterprise Risk Management" icon={<Globe className="h-4 w-4" />} />
            <div>
                <label className="block text-sm text-gray-400 mb-1.5">Meta Description</label>
                <textarea
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-intelligence focus:outline-none text-sm resize-none"
                    placeholder="SEO description..."
                />
            </div>
            <SettingsInput label="Meta Keywords (comma separated)" value={metaKeywords} onChange={setMetaKeywords} placeholder="risk management, corporate intelligence, ..." />
            <SettingsInput label="OG Image URL" value={ogImage} onChange={setOgImage} placeholder="https://riskfortress.in/og-image.png" />
            <SettingsInput label="Canonical URL" value={canonicalUrl} onChange={setCanonicalUrl} placeholder="https://riskfortress.in" />
            <SettingsInput label="Google Verification" value={googleVerification} onChange={setGoogleVerification} placeholder="Verification code..." />
            <SettingsInput label="Bing Verification" value={bingVerification} onChange={setBingVerification} placeholder="Verification code..." />
        </SettingsWrapper>
    )
}

function SocialSettingsView({ settings, loading, saving, saved, onSave }: {
    settings: SiteSettings; loading: boolean; saving: boolean; saved: boolean; onSave: (d: NonNullable<SiteSettings['social']>) => void
}) {
    const [twitter, setTwitter] = useState('')
    const [linkedin, setLinkedin] = useState('')
    const [facebook, setFacebook] = useState('')
    const [instagram, setInstagram] = useState('')
    const [youtube, setYoutube] = useState('')
    const [github, setGithub] = useState('')

    useEffect(() => {
        if (settings.social) {
            setTwitter(settings.social.twitter || '')
            setLinkedin(settings.social.linkedin || '')
            setFacebook(settings.social.facebook || '')
            setInstagram(settings.social.instagram || '')
            setYoutube(settings.social.youtube || '')
            setGithub(settings.social.github || '')
        }
    }, [settings])

    if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-intelligence" /></div>

    return (
        <SettingsWrapper title="Social Links" saving={saving} saved={saved} onSubmit={(e) => { e.preventDefault(); onSave({ twitter, linkedin, facebook, instagram, youtube, github }) }}>
            <SettingsInput label="Twitter / X" value={twitter} onChange={setTwitter} placeholder="https://x.com/riskfortress" icon={<Share2 className="h-4 w-4" />} />
            <SettingsInput label="LinkedIn" value={linkedin} onChange={setLinkedin} placeholder="https://linkedin.com/company/..." icon={<Share2 className="h-4 w-4" />} />
            <SettingsInput label="Facebook" value={facebook} onChange={setFacebook} placeholder="https://facebook.com/..." icon={<Share2 className="h-4 w-4" />} />
            <SettingsInput label="Instagram" value={instagram} onChange={setInstagram} placeholder="https://instagram.com/..." icon={<Share2 className="h-4 w-4" />} />
            <SettingsInput label="YouTube" value={youtube} onChange={setYoutube} placeholder="https://youtube.com/..." icon={<Share2 className="h-4 w-4" />} />
            <SettingsInput label="GitHub" value={github} onChange={setGithub} placeholder="https://github.com/..." icon={<Share2 className="h-4 w-4" />} />
        </SettingsWrapper>
    )
}
