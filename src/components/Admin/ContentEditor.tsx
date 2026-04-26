'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, Save, Send, X, Plus, Loader2, CheckCircle2, Image as ImageIcon, Upload, Code2, Eye, EyeOff } from 'lucide-react'
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
    const [showPreview, setShowPreview] = useState(false)

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
                    <button
                        onClick={() => setShowPreview(!showPreview)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                            showPreview
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-700 text-white hover:bg-gray-600'
                        }`}
                    >
                        {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        <span>{showPreview ? 'Hide Preview' : 'Live Preview'}</span>
                    </button>
                </div>
            </div>

            {/* Live Preview Panel */}
            {showPreview && (() => {
                const isHtmlFullDoc = htmlContent.trim() && (/^\s*<!doctype\s+html[\s>]/i.test(htmlContent) || /^\s*<html[\s>]/i.test(htmlContent))
                const escHtml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                const escAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

                const previewSrc = isHtmlFullDoc
                    ? htmlContent
                    : `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#0a0a1a;color:#d1d5db;padding:0;-webkit-font-smoothing:antialiased;}
.page-header{background:linear-gradient(180deg,#0d0d20 0%,#0a0a1a 100%);border-bottom:1px solid rgba(212,175,55,0.15);padding:32px 0 24px;}
.container{max-width:820px;margin:0 auto;padding:0 24px;}
.badge{display:inline-flex;align-items:center;gap:8px;padding:6px 14px;border-radius:999px;background:rgba(212,175,55,0.1);border:1px solid rgba(212,175,55,0.25);margin-bottom:20px;font-size:11px;font-weight:700;color:#D4AF37;text-transform:uppercase;letter-spacing:0.05em;}
h1.title{font-size:2.25em;font-weight:800;color:#fff;margin-bottom:16px;line-height:1.2;letter-spacing:-0.02em;}
.meta{display:flex;flex-wrap:wrap;gap:16px;font-size:13px;color:#9ca3af;margin-bottom:0;}
.meta span{display:inline-flex;align-items:center;gap:4px;}
.divider{height:1px;background:linear-gradient(90deg,transparent,rgba(212,175,55,0.3),transparent);margin:0;}
.article-body{padding:40px 0 64px;}
.thumbnail{width:100%;border-radius:12px;margin-bottom:32px;max-height:420px;object-fit:cover;border:1px solid rgba(255,255,255,0.06);}
.summary-box{padding:20px 24px;border-radius:12px;background:rgba(212,175,55,0.04);border:1px solid rgba(212,175,55,0.15);margin-bottom:36px;}
.summary-box h2{font-size:0.8em;font-weight:700;color:#D4AF37;margin-bottom:8px;text-transform:uppercase;letter-spacing:0.06em;}
.summary-box p{color:#d1d5db;line-height:1.7;font-size:15px;}
.keywords{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:28px;}
.keyword{display:inline-block;padding:4px 12px;font-size:11px;border-radius:999px;background:rgba(255,255,255,0.06);color:#9ca3af;border:1px solid rgba(255,255,255,0.08);font-weight:500;}
.content{color:#d1d5db;line-height:1.8;font-size:16px;}
.content h1{font-size:1.8em;font-weight:700;color:#fff;margin:36px 0 16px;}
.content h2{font-size:1.5em;font-weight:700;color:#fff;margin:32px 0 14px;}
.content h3{font-size:1.25em;font-weight:600;color:#fff;margin:24px 0 12px;}
.content p{margin-bottom:16px;}
.content ul{list-style:disc;padding-left:1.5em;margin-bottom:16px;}
.content ol{list-style:decimal;padding-left:1.5em;margin-bottom:16px;}
.content li{margin-bottom:8px;}
.content blockquote{border-left:4px solid #D4AF37;padding:12px 20px;margin:20px 0;background:rgba(212,175,55,0.04);border-radius:0 8px 8px 0;color:#b0b0b0;font-style:italic;}
.content a{color:#D4AF37;text-decoration:none;border-bottom:1px solid rgba(212,175,55,0.3);transition:border-color 0.2s;}
.content a:hover{border-bottom-color:#D4AF37;}
.content code{background:rgba(255,255,255,0.08);padding:0.15em 0.4em;border-radius:4px;font-size:0.88em;font-family:'SF Mono',Menlo,monospace;}
.content pre{background:#111;padding:1em;border-radius:8px;overflow-x:auto;margin:1em 0;border:1px solid rgba(255,255,255,0.06);}
.content pre code{background:none;padding:0;}
.content img{max-width:100%;height:auto;border-radius:8px;margin:16px 0;}
.content table{width:100%;border-collapse:collapse;margin:1em 0;}
.content th,.content td{border:1px solid #2a2a3e;padding:10px 14px;text-align:left;}
.content th{background:#12122a;font-weight:600;color:#fff;font-size:0.9em;text-transform:uppercase;letter-spacing:0.03em;}
.content td{font-size:0.95em;}
.html-section{margin-top:40px;padding-top:40px;border-top:1px solid rgba(255,255,255,0.08);}
</style></head><body>
<div class="page-header"><div class="container">
<div class="badge">${type === 'case' ? '📋 Intelligence Dossier' : type === 'article' ? '📰 Intelligence Article' : '📝 Expert Insights'}</div>
<h1 class="title">${escHtml(title || 'Untitled')}</h1>
<div class="meta">
${author ? '<span>👤 ' + escHtml(author) + '</span>' : ''}
${sector ? '<span>🏢 ' + escHtml(sector) + '</span>' : ''}
${location ? '<span>📍 ' + escHtml(location) + '</span>' : ''}
<span>📅 ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
</div>
</div></div>
<div class="divider"></div>
<div class="article-body"><div class="container">
${thumbnail ? '<img class="thumbnail" src="' + escAttr(thumbnail) + '" alt="Thumbnail" />' : ''}
${summary ? '<div class="summary-box"><h2>Executive Summary</h2><p>' + escHtml(summary) + '</p></div>' : ''}
${keywords.length > 0 ? '<div class="keywords">' + keywords.map(k => '<span class="keyword">' + escHtml(k) + '</span>').join('') + '</div>' : ''}
${content ? '<div class="content">' + content + '</div>' : ''}
${htmlContent ? '<div class="content html-section">' + htmlContent + '</div>' : ''}
</div></div>
</body></html>`

                const resizeIframe = (iframe: HTMLIFrameElement) => {
                    try {
                        if (iframe.contentDocument?.body) {
                            const h = Math.max(600, iframe.contentDocument.documentElement.scrollHeight)
                            iframe.style.height = h + 'px'
                        }
                    } catch { /* cross-origin sandbox restriction */ }
                }

                return (
                <div className="rounded-xl border border-gray-700 overflow-hidden">
                    <div className="px-5 py-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Eye className="h-4 w-4 text-green-400" />
                            <span className="text-sm font-semibold text-green-400 uppercase tracking-wider">
                                {isHtmlFullDoc ? 'Full HTML Preview — rendering complete document' : 'Live Preview — How it will look when published'}
                            </span>
                        </div>
                        <button onClick={() => setShowPreview(false)} className="text-gray-400 hover:text-white">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <iframe
                        srcDoc={previewSrc}
                        className="w-full border-0"
                        style={{ minHeight: '600px', background: isHtmlFullDoc ? '#0a0c10' : '#0a0a1a' }}
                        sandbox="allow-same-origin allow-scripts allow-popups"
                        title="Content Preview"
                        onLoad={(e) => {
                            const iframe = e.target as HTMLIFrameElement
                            resizeIframe(iframe)
                            setTimeout(() => resizeIframe(iframe), 500)
                            setTimeout(() => resizeIframe(iframe), 1500)
                        }}
                    />
                </div>
                )
            })()}

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
                                    placeholder="e.g. Greater Noida, NCR"
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
