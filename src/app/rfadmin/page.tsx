'use client'

import { useState, useEffect, useRef } from 'react'

import {
    Shield, Lock, Eye, EyeOff, Key, LogOut,
    FileText, BookOpen, Newspaper, Plus, Edit2, Trash2,
    Save, X, Image as ImageIcon, Bold, Italic, Underline,
    Strikethrough, List, ListOrdered, AlignLeft, AlignCenter,
    AlignRight, Link, Upload, Building, Undo, Redo,
    Heading1, Heading2, Heading3
} from 'lucide-react'

import {
    type ContentItem,
    getAllContent,
    createContent,
    updateContent,
    deleteContent,
    verifyPassword,
    createSession,
    validateSession,
    clearSession
} from '@/lib/admin/api-store'

type AuthStep = 'access' | 'password' | 'authenticated'

export default function AdminPage() {
    const [authStep, setAuthStep] = useState<AuthStep>('access')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [items, setItems] = useState<ContentItem[]>([])
    const [activeTab, setActiveTab] = useState<'case' | 'article' | 'blog'>('case')
    const [editingItem, setEditingItem] = useState<ContentItem | null>(null)
    const [isCreating, setIsCreating] = useState(false)

    useEffect(() => {
        if (validateSession()) {
            setAuthStep('authenticated')
            loadContent()
        }
    }, [])

    const loadContent = async () => {
        const content = await getAllContent()
        setItems(content)
    }

    const handleAccessClick = () => {
        setAuthStep('password')
    }

    const handlePasswordSubmit = async () => {
        if (!password) {
            setError('Please enter password')
            return
        }

        setLoading(true)
        setError('')

        try {
            if (verifyPassword(password)) {
                createSession()
                setAuthStep('authenticated')
                loadContent()
            } else {
                await new Promise(resolve => setTimeout(resolve, 1000))
                setError('Invalid password')
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Authentication failed'
            setError(message)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        clearSession()
        setAuthStep('access')
        setPassword('')
        setItems([])
    }

    const handleSaveContent = async (item: Partial<ContentItem>) => {
        setLoading(true)

        try {
            if (item.id) {
                await updateContent(item.id, item)
            } else {
                await createContent(item as Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>)
            }

            await loadContent()
            setEditingItem(null)
            setIsCreating(false)
        } catch (err) {
            setError('Failed to save content')
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteContent = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return

        await deleteContent(id)
        await loadContent()
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
                                <p className="text-gray-400 mb-6">
                                    Click to access admin panel
                                </p>
                                <button
                                    onClick={handleAccessClick}
                                    disabled={loading}
                                    className="w-full px-6 py-3 bg-gradient-to-r from-intelligence to-industrial text-white rounded-lg font-semibold hover:shadow-intelligence transition-all disabled:opacity-50"
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

    const filteredItems = items.filter(item => item.type === activeTab)
    const currentItem = editingItem || (isCreating ? {
        type: activeTab,
        title: '',
        content: '',
        summary: '',
        keywords: [],
        status: 'draft' as const,
        author: 'RiskFortress Intelligence Team',
        sector: 'Industrial',
        threatLevel: 'Medium' as const,
        confidence: 85,
        location: '',
        caseStatus: 'Active' as const
    } : null)

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
            <div className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Shield className="h-8 w-8 text-intelligence" />
                        <div>
                            <h1 className="text-xl font-bold text-white">RiskFortress Admin</h1>
                            <p className="text-xs text-gray-400">Content Management System</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex space-x-2">
                        {[
                            { type: 'case' as const, label: 'Cases', icon: Building },
                            { type: 'article' as const, label: 'Articles', icon: BookOpen },
                            { type: 'blog' as const, label: 'Blogs', icon: Newspaper }
                        ].map(({ type, label, icon: Icon }) => (
                            <button
                                key={type}
                                onClick={() => { setActiveTab(type); setEditingItem(null); setIsCreating(false) }}
                                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${activeTab === type
                                    ? 'bg-intelligence text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                    }`}
                            >
                                <Icon className="h-5 w-5" />
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => { setIsCreating(true); setEditingItem(null) }}
                        className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-lg font-semibold transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        <span>New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 space-y-4">
                        <h2 className="text-lg font-semibold text-white mb-4">
                            {activeTab === 'case' ? 'Cases' : activeTab === 'article' ? 'Articles' : 'Blogs'}
                            <span className="text-gray-500 ml-2">({filteredItems.length})</span>
                        </h2>

                        {filteredItems.length === 0 ? (
                            <div className="p-8 text-center rounded-xl glass-morphism border border-gray-800">
                                <FileText className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-400">No {activeTab}s yet</p>
                            </div>
                        ) : (
                            filteredItems.map(item => (
                                <button
                                    type="button"
                                    key={item.id}
                                    className={`w-full text-left p-4 rounded-xl glass-morphism border transition-all cursor-pointer ${editingItem?.id === item.id
                                        ? 'border-intelligence'
                                        : 'border-gray-800 hover:border-gray-700'
                                        }`}
                                    onClick={() => { setEditingItem(item); setIsCreating(false) }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-white truncate">{item.title}</h3>
                                            <p className="text-sm text-gray-400 truncate mt-1">{item.summary}</p>
                                            <div className="flex items-center space-x-2 mt-2">
                                                <span className={`px-2 py-0.5 text-xs rounded-full ${item.status === 'published'
                                                    ? 'bg-green-500/10 text-green-400'
                                                    : item.status === 'draft'
                                                        ? 'bg-yellow-500/10 text-yellow-400'
                                                        : 'bg-gray-500/10 text-gray-400'
                                                    }`}>
                                                    {item.status}
                                                </span>
                                                {item.type === 'case' && item.threatLevel && (
                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${item.threatLevel === 'Critical' ? 'bg-red-500/10 text-red-400' :
                                                        item.threatLevel === 'High' ? 'bg-orange-500/10 text-orange-400' :
                                                            item.threatLevel === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                                                'bg-green-500/10 text-green-400'
                                                        }`}>
                                                        {item.threatLevel}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteContent(item.id) }}
                                            className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    <div className="lg:col-span-2">
                        {currentItem ? (
                            <ContentEditor
                                item={currentItem as ContentItem}
                                onSave={handleSaveContent}
                                onCancel={() => { setEditingItem(null); setIsCreating(false) }}
                                loading={loading}
                            />
                        ) : (
                            <div className="p-12 text-center rounded-xl glass-morphism border border-gray-800">
                                <Edit2 className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-white mb-2">Select or Create Content</h3>
                                <p className="text-gray-400">
                                    Select an item from the list to edit, or click &quot;New&quot; to create
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function ContentEditor({
    item,
    onSave,
    onCancel,
    loading
}: {
    item: Partial<ContentItem>
    onSave: (item: Partial<ContentItem>) => void
    onCancel: () => void
    loading: boolean
}) {
    const [formData, setFormData] = useState(item)
    const [keywordInput, setKeywordInput] = useState('')
    const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null)
    const editorRef = useRef<HTMLDivElement>(null)
    const editorContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setFormData(item)
        if (editorRef.current) {
            editorRef.current.innerHTML = item.content || ''
        }
    }, [item])

    useEffect(() => {
        const handleImageClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (target.tagName === 'IMG' && editorRef.current?.contains(target)) {
                setSelectedImage(target as HTMLImageElement)
            } else if (!target.closest('.image-resize-controls')) {
                setSelectedImage(null)
            }
        }
        document.addEventListener('click', handleImageClick)
        return () => document.removeEventListener('click', handleImageClick)
    }, [])

    const updateField = (field: string, value: unknown) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const execCommand = (command: string, value?: string) => {
        const selection = window.getSelection()
        if (!selection || selection.rangeCount === 0) {
            editorRef.current?.focus()
        }
        
        if (command === 'formatBlock' && value) {
            document.execCommand(command, false, `<${value}>`)
        } else {
            document.execCommand(command, false, value)
        }
    }

    const insertImage = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
                const reader = new FileReader()
                reader.onload = () => {
                    const img = document.createElement('img')
                    img.src = reader.result as string
                    img.style.maxWidth = '100%'
                    img.style.height = 'auto'
                    img.style.cursor = 'pointer'
                    img.className = 'resizable-image'
                    
                    const selection = window.getSelection()
                    if (selection && selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0)
                        range.deleteContents()
                        range.insertNode(img)
                        range.setStartAfter(img)
                        range.collapse(true)
                        selection.removeAllRanges()
                        selection.addRange(range)
                    } else {
                        editorRef.current?.appendChild(img)
                    }
                }
                reader.readAsDataURL(file)
            }
        }
        input.click()
    }

    const resizeImage = (size: 'small' | 'medium' | 'large' | 'full') => {
        if (!selectedImage) return
        const sizes = { small: '25%', medium: '50%', large: '75%', full: '100%' }
        selectedImage.style.width = sizes[size]
        selectedImage.style.height = 'auto'
        setSelectedImage(null)
    }

    const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = () => {
                updateField('thumbnail', reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const addKeyword = () => {
        if (keywordInput.trim() && !formData.keywords?.includes(keywordInput.trim())) {
            updateField('keywords', [...(formData.keywords || []), keywordInput.trim()])
            setKeywordInput('')
        }
    }

    const removeKeyword = (keyword: string) => {
        updateField('keywords', formData.keywords?.filter(k => k !== keyword) || [])
    }

    const handleSave = () => {
        const content = editorRef.current?.innerHTML || ''
        onSave({ ...formData, content })
    }

    return (
        <div ref={editorContainerRef} className="rounded-xl glass-morphism border border-gray-800 overflow-hidden relative">
            {/* Sticky Toolbar */}
            <div className="sticky top-0 z-20 border-b border-gray-800 p-3 flex flex-wrap items-center gap-1 bg-gray-900/95 backdrop-blur-sm">
                <button onClick={() => execCommand('undo')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Undo">
                    <Undo className="h-4 w-4" />
                </button>
                <button onClick={() => execCommand('redo')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Redo">
                    <Redo className="h-4 w-4" />
                </button>
                <div className="w-px h-6 bg-gray-700 mx-1" />
                <button onClick={() => execCommand('formatBlock', 'h1')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Heading 1">
                    <Heading1 className="h-4 w-4" />
                </button>
                <button onClick={() => execCommand('formatBlock', 'h2')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Heading 2">
                    <Heading2 className="h-4 w-4" />
                </button>
                <button onClick={() => execCommand('formatBlock', 'h3')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Heading 3">
                    <Heading3 className="h-4 w-4" />
                </button>
                <button onClick={() => execCommand('formatBlock', 'p')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded text-xs font-bold" title="Paragraph">
                    P
                </button>
                <div className="w-px h-6 bg-gray-700 mx-1" />
                <button onClick={() => execCommand('bold')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Bold (Ctrl+B)">
                    <Bold className="h-4 w-4" />
                </button>
                <button onClick={() => execCommand('italic')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Italic (Ctrl+I)">
                    <Italic className="h-4 w-4" />
                </button>
                <button onClick={() => execCommand('underline')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Underline (Ctrl+U)">
                    <Underline className="h-4 w-4" />
                </button>
                <button onClick={() => execCommand('strikeThrough')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Strikethrough">
                    <Strikethrough className="h-4 w-4" />
                </button>
                <div className="w-px h-6 bg-gray-700 mx-1" />
                <button onClick={() => execCommand('insertUnorderedList')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Bullet List">
                    <List className="h-4 w-4" />
                </button>
                <button onClick={() => execCommand('insertOrderedList')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Numbered List">
                    <ListOrdered className="h-4 w-4" />
                </button>
                <div className="w-px h-6 bg-gray-700 mx-1" />
                <button onClick={() => execCommand('justifyLeft')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Align Left">
                    <AlignLeft className="h-4 w-4" />
                </button>
                <button onClick={() => execCommand('justifyCenter')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Align Center">
                    <AlignCenter className="h-4 w-4" />
                </button>
                <button onClick={() => execCommand('justifyRight')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Align Right">
                    <AlignRight className="h-4 w-4" />
                </button>
                <div className="w-px h-6 bg-gray-700 mx-1" />
                <button onClick={() => {
                    const url = prompt('Enter URL:')
                    if (url) execCommand('createLink', url)
                }} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Insert Link">
                    <Link className="h-4 w-4" />
                </button>
                <button onClick={insertImage} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Insert Image">
                    <ImageIcon className="h-4 w-4" />
                </button>
                <div className="w-px h-6 bg-gray-700 mx-1" />
                <select
                    onChange={(e) => { execCommand('fontName', e.target.value); e.target.value = '' }}
                    defaultValue=""
                    className="bg-gray-800 text-gray-300 rounded px-2 py-1 text-sm border border-gray-700"
                >
                    <option value="" disabled>Font</option>
                    <option value="Arial">Arial</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Courier New">Courier New</option>
                </select>
                <select
                    onChange={(e) => { execCommand('fontSize', e.target.value); e.target.value = '' }}
                    defaultValue=""
                    className="bg-gray-800 text-gray-300 rounded px-2 py-1 text-sm border border-gray-700"
                >
                    <option value="" disabled>Size</option>
                    <option value="1">Small</option>
                    <option value="3">Normal</option>
                    <option value="5">Large</option>
                    <option value="7">Huge</option>
                </select>
            </div>

            {/* Image Resize Controls */}
            {selectedImage && (
                <div className="image-resize-controls sticky top-14 z-30 flex items-center justify-center gap-2 p-2 bg-intelligence/90 text-white text-sm">
                    <span>Resize Image:</span>
                    <button onClick={() => resizeImage('small')} className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded">25%</button>
                    <button onClick={() => resizeImage('medium')} className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded">50%</button>
                    <button onClick={() => resizeImage('large')} className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded">75%</button>
                    <button onClick={() => resizeImage('full')} className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded">100%</button>
                    <button onClick={() => setSelectedImage(null)} className="px-3 py-1 bg-red-500/50 hover:bg-red-500/70 rounded ml-2">Cancel</button>
                </div>
            )}

            <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                        <input
                            type="text"
                            value={formData.title || ''}
                            onChange={(e) => updateField('title', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none"
                            placeholder="Enter title..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                        <select
                            value={formData.status || 'draft'}
                            onChange={(e) => updateField('status', e.target.value)}
                            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Summary</label>
                    <textarea
                        value={formData.summary || ''}
                        onChange={(e) => updateField('summary', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none resize-none"
                        placeholder="Brief summary..."
                    />
                </div>

                {formData.type === 'case' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Sector</label>
                            <select
                                value={formData.sector || 'Industrial'}
                                onChange={(e) => updateField('sector', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none"
                            >
                                <option value="Industrial">Industrial</option>
                                <option value="Technical">Technical</option>
                                <option value="HNI">HNI</option>
                                <option value="Government">Government</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Threat Level</label>
                            <select
                                value={formData.threatLevel || 'Medium'}
                                onChange={(e) => updateField('threatLevel', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none"
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                                <option value="Critical">Critical</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Confidence (%)</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.confidence || 85}
                                onChange={(e) => updateField('confidence', parseInt(e.target.value))}
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Case Status</label>
                            <select
                                value={formData.caseStatus || 'Active'}
                                onChange={(e) => updateField('caseStatus', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none"
                            >
                                <option value="Active">Active</option>
                                <option value="Monitoring">Monitoring</option>
                                <option value="Neutralized">Neutralized</option>
                                <option value="Resolved">Resolved</option>
                                <option value="Ongoing">Ongoing</option>
                            </select>
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                            <input
                                type="text"
                                value={formData.location || ''}
                                onChange={(e) => updateField('location', e.target.value)}
                                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none"
                                placeholder="e.g., Mumbai, Maharashtra"
                            />
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Thumbnail</label>
                    <div className="flex items-center space-x-4">
                        {formData.thumbnail && (
                            <img
                                src={formData.thumbnail}
                                alt="Thumbnail"
                                className="w-24 h-16 object-cover rounded-lg border border-gray-700"
                            />
                        )}
                        <label className="flex items-center space-x-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-400 hover:text-white cursor-pointer transition-colors">
                            <Upload className="h-4 w-4" />
                            <span>Upload Image</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleThumbnailUpload}
                            />
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Keywords</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                        {formData.keywords?.map(keyword => (
                            <span
                                key={keyword}
                                className="flex items-center space-x-1 px-3 py-1 bg-intelligence/10 text-intelligence rounded-full text-sm"
                            >
                                <span>{keyword}</span>
                                <button onClick={() => removeKeyword(keyword)} className="hover:text-white">
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                    </div>
                    <div className="flex space-x-2">
                        <input
                            type="text"
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none"
                            placeholder="Add keyword..."
                        />
                        <button
                            onClick={addKeyword}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                            Add
                        </button>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Content (Click on image to resize)</label>
                    <div
                        ref={editorRef}
                        contentEditable
                        suppressContentEditableWarning
                        className="w-full min-h-[400px] max-h-[600px] overflow-y-auto p-4 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none prose prose-invert max-w-none"
                        style={{ lineHeight: 1.8 }}
                    />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-800">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-intelligence to-industrial text-white rounded-lg font-semibold hover:shadow-intelligence transition-all disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        <span>{loading ? 'Saving...' : 'Save'}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
