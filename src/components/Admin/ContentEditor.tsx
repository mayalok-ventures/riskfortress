'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Save, Send, X, Plus, Loader2, CheckCircle2, Image as ImageIcon, Upload, Code2 } from 'lucide-react'
import RichTextEditor from './RichTextEditor'

interface ContentEditorProps {
    type: 'case' | 'article' | 'blog'
    editId?: string
    onSave: () => void
    onCancel: () => void
}

const SECTORS = ['Corporate', 'HNI', 'Government', 'Technical', 'Financial', 'Industrial']
const THREAT_LEVELS = ['Low', 'Medium', 'High', 'Critical']
const CASE_STATUSES = ['Active', 'Monitoring', 'Neutralized', 'Resolved', 'Ongoing']

export default function ContentEditor({ type, editId, onSave, onCancel }: ContentEditorProps) {
    const [title, setTitle] = useState('')
    const [summary, setSummary] = useState('')
    const [content, setContent] = useState('')
    const [htmlContent, setHtmlContent] = useState('')
    const [thumbnail, setThumbnail] = useState('')
    const [keywords, setKeywords] = useState<string[]>([])
    const [keywordInput, setKeywordInput] = useState('')
    const [author, setAuthor] = useState('RiskFortress Intelligence Team')
    const [sector, setSector] = useState('')
    const [threatLevel, setThreatLevel] = useState('')
    const [confidence, setConfidence] = useState(50)
    const [caseStatus, setCaseStatus] = useState('')
    const [location, setLocation] = useState('')
    const [saving, setSaving] = useState(false)
    const [saveProgress, setSaveProgress] = useState(0)
    const [saveSuccess, setSaveSuccess] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(!!editId)
    const [thumbnailUploading, setThumbnailUploading] = useState(false)

    const token = typeof window !== 'undefined' ? sessionStorage.getItem('rf-admin-token') : null

    useEffect(() => {
        if (editId && token) {
            loadContent()
        }
    }, [editId])

    const loadContent = async () => {
        try {
            const res = await fetch(`/api/content?id=${editId}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (!res.ok) throw new Error('Failed to load')
            const data = await res.json()
            setTitle(data.title || '')
            setSummary(data.summary || '')
            setContent(data.content || '')
            setHtmlContent(data.htmlContent || '')
            setThumbnail(data.thumbnail || '')
            setKeywords(data.keywords || [])
            setAuthor(data.author || 'RiskFortress Intelligence Team')
            setSector(data.sector || '')
            setThreatLevel(data.threatLevel || '')
            setConfidence(data.confidence ?? 50)
            setCaseStatus(data.caseStatus || '')
            setLocation(data.location || '')
        } catch {
            setError('Failed to load content for editing')
        } finally {
            setLoading(false)
        }
    }

    const addKeyword = () => {
        const kw = keywordInput.trim()
        if (kw && !keywords.includes(kw)) {
            setKeywords([...keywords, kw])
            setKeywordInput('')
        }
    }

    const removeKeyword = (kw: string) => {
        setKeywords(keywords.filter(k => k !== kw))
    }

    const handleSave = useCallback(async (status: 'draft' | 'published') => {
        if (!title.trim()) {
            setError('Title is required')
            return
        }

        setSaving(true)
        setSaveProgress(0)
        setError('')
        setSaveSuccess(false)

        const progressInterval = setInterval(() => {
            setSaveProgress(prev => {
                if (prev >= 85) { clearInterval(progressInterval); return prev }
                return prev + Math.random() * 15
            })
        }, 200)

        try {
            const payload: Record<string, unknown> = {
                type,
                title: title.trim(),
                summary: summary.trim(),
                content,
                htmlContent: htmlContent.trim() || undefined,
                thumbnail: thumbnail.trim() || undefined,
                keywords,
                author: author.trim(),
                status,
            }

            if (type === 'case') {
                payload.sector = sector || undefined
                payload.threatLevel = threatLevel || undefined
                payload.confidence = confidence
                payload.caseStatus = caseStatus || undefined
                payload.location = location.trim() || undefined
            }

            if (editId) payload.id = editId

            const res = await fetch('/api/content', {
                method: editId ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })

            clearInterval(progressInterval)

            if (!res.ok) {
                const d = await res.json()
                throw new Error(d.error || 'Failed to save')
            }

            setSaveProgress(100)
            setSaveSuccess(true)
            setTimeout(() => onSave(), 1500)
        } catch (err: unknown) {
            clearInterval(progressInterval)
            setSaveProgress(0)
            setError(err instanceof Error ? err.message : 'Failed to save')
        } finally {
            setSaving(false)
        }
    }, [title, summary, content, htmlContent, thumbnail, keywords, author, type, sector, threatLevel, confidence, caseStatus, location, editId, token, onSave])

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-intelligence" />
                <span className="ml-3 text-gray-400">Loading content...</span>
            </div>
        )
    }

    const typeLabel = type === 'case' ? 'Case Scenario' : type === 'article' ? 'Article' : 'Blog Post'

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button onClick={onCancel} className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h2 className="text-2xl font-bold text-white">
                        {editId ? 'Edit' : 'Create'} {typeLabel}
                    </h2>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => handleSave('draft')}
                        disabled={saving}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        <span>Save Draft</span>
                    </button>
                    <button
                        onClick={() => handleSave('published')}
                        disabled={saving}
                        className="flex items-center space-x-2 px-4 py-2 bg-intelligence text-obsidian rounded-lg hover:bg-intelligence-light transition-colors disabled:opacity-50 font-semibold"
                    >
                        <Send className="h-4 w-4" />
                        <span>Publish</span>
                    </button>
                </div>
            </div>

            {/* Save Progress */}
            {(saving || saveSuccess) && (
                <div className="rounded-xl overflow-hidden bg-gray-800 border border-gray-700">
                    <div className="relative h-10">
                        <div
                            className={`absolute inset-y-0 left-0 transition-all duration-300 ${saveSuccess ? 'bg-green-500' : 'bg-intelligence'}`}
                            style={{ width: `${saveProgress}%` }}
                        />
                        <div className="relative flex items-center justify-center h-full">
                            {saveSuccess ? (
                                <span className="flex items-center space-x-2 text-sm font-semibold text-white">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>Saved successfully!</span>
                                </span>
                            ) : (
                                <span className="flex items-center space-x-2 text-sm font-semibold text-white">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Saving... {Math.round(saveProgress)}%</span>
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            {/* Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Title *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-intelligence focus:outline-none focus:ring-1 focus:ring-intelligence text-lg"
                            placeholder={`Enter ${typeLabel.toLowerCase()} title...`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Summary</label>
                        <textarea
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-intelligence focus:outline-none focus:ring-1 focus:ring-intelligence resize-none"
                            placeholder="Brief summary..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Detailed Content</label>
                        <RichTextEditor content={content} onChange={setContent} placeholder={`Write your ${typeLabel.toLowerCase()} content here...`} />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2 flex items-center gap-2">
                            <Code2 className="h-4 w-4 text-green-400" />
                            HTML Content <span className="text-xs text-gray-600">(optional — paste custom HTML code here)</span>
                        </label>
                        <div className="rounded-xl border border-gray-700 overflow-hidden">
                            <div className="px-4 py-2 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
                                <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">HTML Source</span>
                                <span className="text-[10px] text-gray-500">This will appear under &quot;Structured View&quot; on the live page</span>
                            </div>
                            <textarea
                                value={htmlContent}
                                onChange={(e) => setHtmlContent(e.target.value)}
                                spellCheck={false}
                                rows={12}
                                className="w-full p-4 bg-[#1a1a2e] text-green-300 font-mono text-sm leading-relaxed focus:outline-none resize-y placeholder-gray-600"
                                placeholder={'<!-- Paste your HTML code here -->\n\n<h2>Custom Section</h2>\n<p>Your HTML content...</p>'}
                            />
                            {htmlContent.trim() && (
                                <div className="border-t border-gray-700">
                                    <div className="px-4 py-2 bg-intelligence/10 flex items-center justify-between">
                                        <span className="text-xs font-semibold text-intelligence uppercase tracking-wider">Live Preview</span>
                                    </div>
                                    <div
                                        className="bg-white p-6 prose prose-lg max-w-none"
                                        style={{ color: '#1a1a1a' }}
                                        dangerouslySetInnerHTML={{ __html: htmlContent }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Thumbnail */}
                    <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
                        <label className="block text-sm text-gray-400 mb-2">Thumbnail</label>
                        {/* Upload button */}
                        <label className="flex items-center justify-center space-x-2 px-3 py-3 mb-3 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-intelligence/50 transition-colors">
                            {thumbnailUploading ? (
                                <Loader2 className="h-4 w-4 animate-spin text-intelligence" />
                            ) : (
                                <Upload className="h-4 w-4 text-gray-500" />
                            )}
                            <span className="text-sm text-gray-400">{thumbnailUploading ? 'Uploading...' : 'Upload image'}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                setThumbnailUploading(true)
                                try {
                                    const formData = new FormData()
                                    formData.append('image', file)
                                    const res = await fetch('/api/upload', {
                                        method: 'POST',
                                        headers: { Authorization: `Bearer ${token}` },
                                        body: formData,
                                    })
                                    const data = await res.json()
                                    if (res.ok) setThumbnail(data.url)
                                    else setError(data.error || 'Upload failed')
                                } catch { setError('Upload failed') }
                                finally { setThumbnailUploading(false) }
                            }} />
                        </label>
                        {/* Or paste URL */}
                        <div className="flex items-center space-x-2">
                            <ImageIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
                            <input
                                type="text"
                                value={thumbnail}
                                onChange={(e) => setThumbnail(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:border-intelligence focus:outline-none"
                                placeholder="Or paste image URL..."
                            />
                        </div>
                        {thumbnail && (
                            <div className="mt-3 rounded-lg overflow-hidden border border-gray-700 relative group">
                                <img src={thumbnail} alt="Thumbnail preview" className="w-full h-32 object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }} />
                                <button type="button" onClick={() => setThumbnail('')}
                                    className="absolute top-2 right-2 p-1 rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Keywords */}
                    <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
                        <label className="block text-sm text-gray-400 mb-2">Keywords</label>
                        <div className="flex items-center space-x-2 mb-3">
                            <input
                                type="text"
                                value={keywordInput}
                                onChange={(e) => setKeywordInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKeyword() } }}
                                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:border-intelligence focus:outline-none"
                                placeholder="Add keyword..."
                            />
                            <button onClick={addKeyword} className="p-2 bg-intelligence/20 text-intelligence rounded-lg hover:bg-intelligence/30 transition-colors">
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {keywords.map((kw) => (
                                <span key={kw} className="inline-flex items-center space-x-1 px-2 py-1 bg-gray-800 text-gray-300 rounded-full text-xs">
                                    <span>{kw}</span>
                                    <button onClick={() => removeKeyword(kw)} className="text-gray-500 hover:text-red-400">
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Author */}
                    <div className="p-4 rounded-xl bg-gray-900 border border-gray-800">
                        <label className="block text-sm text-gray-400 mb-2">Author</label>
                        <input
                            type="text"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:border-intelligence focus:outline-none"
                        />
                    </div>

                    {/* Case-specific fields */}
                    {type === 'case' && (
                        <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 space-y-4">
                            <h3 className="text-sm font-semibold text-intelligence uppercase tracking-wider">Case Details</h3>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Sector</label>
                                <select
                                    value={sector}
                                    onChange={(e) => setSector(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-intelligence focus:outline-none"
                                >
                                    <option value="">Select sector...</option>
                                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Threat Level</label>
                                <select
                                    value={threatLevel}
                                    onChange={(e) => setThreatLevel(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-intelligence focus:outline-none"
                                >
                                    <option value="">Select level...</option>
                                    {THREAT_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Confidence: {confidence}%</label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={confidence}
                                    onChange={(e) => setConfidence(Number(e.target.value))}
                                    className="w-full accent-intelligence"
                                />
                                <div className="flex justify-between text-xs text-gray-500">
                                    <span>0%</span><span>50%</span><span>100%</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Case Status</label>
                                <select
                                    value={caseStatus}
                                    onChange={(e) => setCaseStatus(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-intelligence focus:outline-none"
                                >
                                    <option value="">Select status...</option>
                                    {CASE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-gray-400 mb-1">Location</label>
                                <input
                                    type="text"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:border-intelligence focus:outline-none"
                                    placeholder="e.g. Mumbai, Maharashtra"
                                />
                            </div>
                        </div>
                    )}

                    {/* Bottom Actions */}
                    <div className="p-4 rounded-xl bg-gray-900 border border-gray-800 space-y-3">
                        <button
                            onClick={() => handleSave('draft')}
                            disabled={saving}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                        >
                            <Save className="h-4 w-4" />
                            <span>Save as Draft</span>
                        </button>
                        <button
                            onClick={() => handleSave('published')}
                            disabled={saving}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-intelligence text-obsidian rounded-lg hover:bg-intelligence-light transition-colors disabled:opacity-50 font-semibold"
                        >
                            <Send className="h-4 w-4" />
                            <span>Publish</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
