'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    FileText, Plus, Edit3, Trash2, Eye, Search, X,
    BookOpen, Newspaper, Shield, ChevronLeft, Save, Send
} from 'lucide-react'
import {
    getAllContent, createContent, updateContent, deleteContent,
    generateSlug, type ContentItem
} from '@/lib/admin/client-store'
import dynamic from 'next/dynamic'
import SaveProgressBar from './SaveProgressBar'

const RichTextEditor = dynamic(() => import('./RichTextEditor'), { ssr: false })

type ContentType = 'case' | 'article' | 'blog'
type ViewMode = 'list' | 'editor'

const SECTORS = ['Corporate', 'Government', 'HNI', 'Technical', 'Industrial', 'Financial', 'Legal']
const THREAT_LEVELS: ContentItem['threatLevel'][] = ['Low', 'Medium', 'High', 'Critical']
const CASE_STATUSES: ContentItem['caseStatus'][] = ['Active', 'Monitoring', 'Neutralized', 'Resolved', 'Ongoing']

const emptyCase: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'> = {
    type: 'case', title: '', slug: '', content: '', summary: '', author: 'RiskFortress Intelligence Team',
    keywords: [], status: 'draft', sector: 'Corporate', threatLevel: 'Medium', confidence: 75,
    location: '', caseStatus: 'Active', thumbnail: '',
}
const emptyArticle: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'> = {
    type: 'article', title: '', slug: '', content: '', summary: '', author: 'RiskFortress Intelligence Team',
    keywords: [], status: 'draft', thumbnail: '',
}
const emptyBlog: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'> = {
    type: 'blog', title: '', slug: '', content: '', summary: '', author: 'RiskFortress Intelligence Team',
    keywords: [], status: 'draft', thumbnail: '',
}

function getEmptyItem(type: ContentType) {
    if (type === 'case') return { ...emptyCase }
    if (type === 'article') return { ...emptyArticle }
    return { ...emptyBlog }
}

export default function ContentManager() {
    const [activeType, setActiveType] = useState<ContentType>('case')
    const [viewMode, setViewMode] = useState<ViewMode>('list')
    const [items, setItems] = useState<ContentItem[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [search, setSearch] = useState('')
    const [editingItem, setEditingItem] = useState<Partial<ContentItem> | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [keywordInput, setKeywordInput] = useState('')
    const [error, setError] = useState('')

    const loadContent = useCallback(async () => {
        setLoading(true)
        try {
            const all = await getAllContent()
            setItems(all)
        } catch {
            setError('Failed to load content')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { loadContent() }, [loadContent])

    const filteredItems = items
        .filter(i => i.type === activeType)
        .filter(i => {
            if (!search) return true
            const s = search.toLowerCase()
            return i.title.toLowerCase().includes(s) || i.summary?.toLowerCase().includes(s) ||
                i.keywords?.some(k => k.toLowerCase().includes(s))
        })
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    const startNew = () => {
        setEditingItem(getEmptyItem(activeType))
        setEditingId(null)
        setViewMode('editor')
        setError('')
    }

    const startEdit = (item: ContentItem) => {
        setEditingItem({ ...item })
        setEditingId(item.id)
        setViewMode('editor')
        setError('')
    }

    const handleSave = async (status: 'draft' | 'published') => {
        if (!editingItem?.title) { setError('Title is required'); return }
        setSaving(true)
        setError('')
        try {
            const data = {
                ...editingItem,
                status,
                slug: editingItem.slug || generateSlug(editingItem.title),
            }
            if (editingId) {
                await updateContent(editingId, data)
            } else {
                await createContent(data as Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>)
            }
            await loadContent()
            setViewMode('list')
            setEditingItem(null)
            setEditingId(null)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this content?')) return
        try {
            await deleteContent(id)
            await loadContent()
        } catch {
            setError('Failed to delete')
        }
    }

    const addKeyword = () => {
        if (!keywordInput.trim() || !editingItem) return
        const kw = keywordInput.trim()
        if (!editingItem.keywords?.includes(kw)) {
            setEditingItem({ ...editingItem, keywords: [...(editingItem.keywords || []), kw] })
        }
        setKeywordInput('')
    }

    const removeKeyword = (kw: string) => {
        if (!editingItem) return
        setEditingItem({ ...editingItem, keywords: editingItem.keywords?.filter(k => k !== kw) })
    }

    const updateField = <K extends keyof ContentItem>(key: K, value: ContentItem[K]) => {
        if (!editingItem) return
        const updates: Partial<ContentItem> = { [key]: value }
        if (key === 'title' && !editingId) {
            updates.slug = generateSlug(value as string)
        }
        setEditingItem({ ...editingItem, ...updates })
    }

    const tabIcons: Record<ContentType, React.ReactNode> = {
        case: <Shield className="h-4 w-4" />,
        article: <BookOpen className="h-4 w-4" />,
        blog: <Newspaper className="h-4 w-4" />,
    }

    if (viewMode === 'editor' && editingItem) {
        return (
            <div className="space-y-6">
                <SaveProgressBar saving={saving} />

                {/* Editor Header */}
                <div className="flex items-center justify-between">
                    <button onClick={() => { setViewMode('list'); setEditingItem(null); setEditingId(null) }}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                        <ChevronLeft className="h-5 w-5" />
                        <span>Back to list</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            editingItem.status === 'published' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                            'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}>
                            {editingItem.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                        <button onClick={() => handleSave('draft')} disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50">
                            <Save className="h-4 w-4" />
                            Save Draft
                        </button>
                        <button onClick={() => handleSave('published')} disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-intelligence to-industrial text-white rounded-lg font-semibold hover:shadow-intelligence transition-all disabled:opacity-50">
                            <Send className="h-4 w-4" />
                            Publish
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
                )}

                {/* Meta Fields */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                            <input type="text" value={editingItem.title || ''}
                                onChange={e => updateField('title', e.target.value)}
                                placeholder="Enter title..."
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white text-lg focus:border-intelligence focus:outline-none" />
                        </div>

                        {/* Slug */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Slug (URL)</label>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500 text-sm">/dossiers/</span>
                                <input type="text" value={editingItem.slug || ''}
                                    onChange={e => updateField('slug', e.target.value)}
                                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm focus:border-intelligence focus:outline-none" />
                            </div>
                        </div>

                        {/* Summary */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Summary</label>
                            <textarea value={editingItem.summary || ''}
                                onChange={e => updateField('summary', e.target.value)}
                                placeholder="Brief summary..."
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 focus:border-intelligence focus:outline-none resize-none" />
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Thumbnail */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Thumbnail URL</label>
                            <input type="text" value={editingItem.thumbnail || ''}
                                onChange={e => updateField('thumbnail', e.target.value)}
                                placeholder="https://..."
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm focus:border-intelligence focus:outline-none" />
                            {editingItem.thumbnail && (
                                <div className="mt-2 rounded-lg overflow-hidden border border-gray-700">
                                    <img src={editingItem.thumbnail} alt="Thumbnail preview" className="w-full h-32 object-cover"
                                        onError={e => (e.target as HTMLImageElement).style.display = 'none'} />
                                </div>
                            )}
                        </div>

                        {/* Author */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Author</label>
                            <input type="text" value={editingItem.author || ''}
                                onChange={e => updateField('author', e.target.value)}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm focus:border-intelligence focus:outline-none" />
                        </div>

                        {/* Case-specific fields */}
                        {activeType === 'case' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Sector</label>
                                    <select value={editingItem.sector || ''}
                                        onChange={e => updateField('sector', e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm focus:border-intelligence focus:outline-none">
                                        {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Threat Level</label>
                                    <select value={editingItem.threatLevel || ''}
                                        onChange={e => updateField('threatLevel', e.target.value as ContentItem['threatLevel'])}
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm focus:border-intelligence focus:outline-none">
                                        {THREAT_LEVELS.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Confidence (%)</label>
                                    <input type="number" min={0} max={100} value={editingItem.confidence ?? 75}
                                        onChange={e => updateField('confidence', parseInt(e.target.value) || 0)}
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm focus:border-intelligence focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Case Status</label>
                                    <select value={editingItem.caseStatus || ''}
                                        onChange={e => updateField('caseStatus', e.target.value as ContentItem['caseStatus'])}
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm focus:border-intelligence focus:outline-none">
                                        {CASE_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                                    <input type="text" value={editingItem.location || ''}
                                        onChange={e => updateField('location', e.target.value)}
                                        placeholder="e.g., Mumbai, India"
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm focus:border-intelligence focus:outline-none" />
                                </div>
                            </>
                        )}

                        {/* Keywords */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Keywords</label>
                            <div className="flex gap-2">
                                <input type="text" value={keywordInput}
                                    onChange={e => setKeywordInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                                    placeholder="Add keyword..."
                                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-300 text-sm focus:border-intelligence focus:outline-none" />
                                <button type="button" onClick={addKeyword}
                                    className="px-3 py-2 bg-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-600">
                                    Add
                                </button>
                            </div>
                            {editingItem.keywords && editingItem.keywords.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2">
                                    {editingItem.keywords.map(kw => (
                                        <span key={kw} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded-full border border-gray-700">
                                            {kw}
                                            <button type="button" onClick={() => removeKeyword(kw)} className="hover:text-red-400">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Rich Text Editor */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Detailed Content</label>
                    <RichTextEditor
                        content={editingItem.content || ''}
                        onChange={html => setEditingItem(prev => prev ? { ...prev, content: html } : null)}
                        placeholder={`Start writing your ${activeType}...`}
                    />
                </div>

                {/* Bottom Save */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                    <button onClick={() => { setViewMode('list'); setEditingItem(null); setEditingId(null) }}
                        className="px-6 py-2.5 text-gray-400 hover:text-white transition-colors">
                        Cancel
                    </button>
                    <button onClick={() => handleSave('draft')} disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50">
                        <Save className="h-4 w-4" /> Save as Draft
                    </button>
                    <button onClick={() => handleSave('published')} disabled={saving}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-intelligence to-industrial text-white rounded-lg font-semibold hover:shadow-intelligence transition-all disabled:opacity-50">
                        <Send className="h-4 w-4" /> Publish
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Type Tabs */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    {(['case', 'article', 'blog'] as ContentType[]).map(type => (
                        <button key={type} onClick={() => setActiveType(type)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                activeType === type ? 'bg-intelligence text-white' : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}>
                            {tabIcons[type]}
                            {type === 'case' ? 'Cases' : type === 'article' ? 'Articles' : 'Blogs'}
                            <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-gray-700/50">
                                {items.filter(i => i.type === type).length}
                            </span>
                        </button>
                    ))}
                </div>
                <button onClick={startNew}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-intelligence to-industrial text-white rounded-lg font-semibold hover:shadow-intelligence transition-all">
                    <Plus className="h-4 w-4" />
                    New {activeType === 'case' ? 'Case' : activeType === 'article' ? 'Article' : 'Blog'}
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                    placeholder={`Search ${activeType}s...`}
                    className="w-full pl-12 pr-10 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none" />
                {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
            )}

            {/* Content List */}
            {loading ? (
                <div className="text-center py-16">
                    <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-intelligence" />
                    <p className="text-gray-400 mt-3">Loading content...</p>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="text-center py-16">
                    <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">
                        {search ? 'No results found' : `No ${activeType}s yet`}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                        {search ? `No ${activeType}s match "${search}"` : `Create your first ${activeType} to get started.`}
                    </p>
                    {!search && (
                        <button onClick={startNew} className="px-4 py-2 bg-intelligence text-gray-950 rounded-lg text-sm font-medium">
                            Create {activeType === 'case' ? 'Case' : activeType === 'article' ? 'Article' : 'Blog'}
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredItems.map(item => (
                        <div key={item.id} className="p-4 rounded-xl bg-gray-800/50 border border-gray-800 hover:border-gray-700 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-white truncate">{item.title}</h3>
                                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                            item.status === 'published' ? 'bg-green-500/10 text-green-400' :
                                            item.status === 'archived' ? 'bg-gray-500/10 text-gray-400' :
                                            'bg-yellow-500/10 text-yellow-400'
                                        }`}>
                                            {item.status}
                                        </span>
                                        {item.type === 'case' && item.threatLevel && (
                                            <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                                                item.threatLevel === 'Critical' ? 'bg-red-500/10 text-red-400' :
                                                item.threatLevel === 'High' ? 'bg-orange-500/10 text-orange-400' :
                                                item.threatLevel === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                                'bg-green-500/10 text-green-400'
                                            }`}>
                                                {item.threatLevel}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-400 truncate">{item.summary}</p>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                        <span>Updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
                                        {item.author && <span>• {item.author}</span>}
                                        {item.sector && <span>• {item.sector}</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {item.status === 'published' && (
                                        <a href={`/dossiers/${item.slug}/`} target="_blank" rel="noopener noreferrer"
                                            className="p-2 text-gray-400 hover:text-intelligence transition-colors" title="View">
                                            <Eye className="h-4 w-4" />
                                        </a>
                                    )}
                                    <button onClick={() => startEdit(item)}
                                        className="p-2 text-gray-400 hover:text-white transition-colors" title="Edit">
                                        <Edit3 className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)}
                                        className="p-2 text-gray-400 hover:text-red-400 transition-colors" title="Delete">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
