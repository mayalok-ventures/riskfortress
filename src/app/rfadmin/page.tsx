'use client'

import { useState, useEffect, useRef } from 'react'

import {
    Shield, Lock, Eye, EyeOff, Key, LogOut,
    FileText, BookOpen, Newspaper, Plus, Edit2, Trash2,
    Save, X, Image as ImageIcon, Bold, Italic, Underline,
    Strikethrough, List, ListOrdered, AlignLeft, AlignCenter,
    AlignRight, Link, Upload, Building, Undo, Redo,
    Heading1, Heading2, Heading3, Palette, Highlighter, Square, Circle,
    Table, GripVertical, XCircle, BarChart3, Code, Quote, Minus, 
    Subscript, Superscript, RemoveFormatting, LinkIcon, Type, Unlink
} from 'lucide-react'

import AdminDashboard from '@/components/AdminDashboard'

import {
    type ContentItem,
    getAllContent,
    createContent,
    updateContent,
    deleteContent,
    generateSlug,
} from '@/lib/admin/client-store'

import {
    verifyPasswordAsync,
    createSession,
    validateSession,
    clearSession
} from '@/lib/admin/api-store'

type AuthStep = 'access' | 'password' | 'authenticated'
type AdminView = 'dashboard' | 'content'

interface UploadProgress {
    current: number
    total: number
    message: string
}

export default function AdminPage() {
    const [authStep, setAuthStep] = useState<AuthStep>('access')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)

    const [adminView, setAdminView] = useState<AdminView>('dashboard')
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
        try {
            const content = await getAllContent()
            setItems(content)
        } catch (err) {
            console.error('Failed to load content:', err)
            setError(err instanceof Error ? err.message : 'Failed to load content from database')
        }
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
            const result = await verifyPasswordAsync(password)
            
            if (result.success) {
                setAuthStep('authenticated')
                loadContent()
            } else {
                setError(result.error || 'Invalid password')
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
        setError('')
        setUploadProgress(null)

        try {
            if (!item.title?.trim()) {
                setError('Title is required')
                setLoading(false)
                return
            }

            if (!item.slug) {
                item.slug = generateSlug(item.title)
            }

            let result
            if (item.id) {
                result = await updateContent(item.id, item)
            } else {
                result = await createContent(item as Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>)
            }

            if (!result) {
                setError('Failed to save content. Please check your connection and try again.')
                return
            }

            await loadContent()
            setEditingItem(null)
            setIsCreating(false)
            setUploadProgress(null)
        } catch (err) {
            console.error('Save error:', err)
            const errorMessage = err instanceof Error ? err.message : 'Unknown error'
            setError('Failed to save content: ' + errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteContent = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return
        try {
            await deleteContent(id)
            await loadContent()
        } catch (err) {
            console.error('Delete failed:', err)
            setError(err instanceof Error ? err.message : 'Failed to delete content')
        }
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
                            <p className="text-xs text-gray-400">
                                {adminView === 'dashboard' ? 'Analytics Dashboard' : 'Content Management System'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        {/* Main Navigation */}
                        <div className="flex rounded-lg overflow-hidden border border-gray-700">
                            <button
                                onClick={() => setAdminView('dashboard')}
                                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
                                    adminView === 'dashboard' 
                                        ? 'bg-intelligence text-white' 
                                        : 'bg-gray-800 text-gray-400 hover:text-white'
                                }`}
                            >
                                <BarChart3 className="h-4 w-4" />
                                <span>Dashboard</span>
                            </button>
                            <button
                                onClick={() => setAdminView('content')}
                                className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${
                                    adminView === 'content' 
                                        ? 'bg-intelligence text-white' 
                                        : 'bg-gray-800 text-gray-400 hover:text-white'
                                }`}
                            >
                                <FileText className="h-4 w-4" />
                                <span>Content</span>
                            </button>
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
            </div>

            <div className="container mx-auto px-6 py-8">
                {/* Dashboard View */}
                {adminView === 'dashboard' && (
                    <AdminDashboard />
                )}

                {/* Content Management View */}
                {adminView === 'content' && (
                    <>
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
                                        onCancel={() => { setEditingItem(null); setIsCreating(false); setError(''); setUploadProgress(null) }}
                                        loading={loading}
                                        uploadProgress={uploadProgress}
                                        error={error}
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
                    </>
                )}
            </div>
        </div>
    )
}

function ContentEditor({
    item,
    onSave,
    onCancel,
    loading,
    uploadProgress,
    error
}: {
    item: Partial<ContentItem>
    onSave: (item: Partial<ContentItem>) => void
    onCancel: () => void
    loading: boolean
    uploadProgress: UploadProgress | null
    error: string
}) {
    const [formData, setFormData] = useState(item)
    const [keywordInput, setKeywordInput] = useState('')
    const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null)
    const [showColorPicker, setShowColorPicker] = useState<'text' | 'bg' | null>(null)
    const [toolbarPosition, setToolbarPosition] = useState({ x: 100, y: 100 })
    const [isDragging, setIsDragging] = useState(false)
    const [isToolbarFloating, setIsToolbarFloating] = useState(false)
    const [showLinkModal, setShowLinkModal] = useState(false)
    const [linkUrl, setLinkUrl] = useState('')
    const [linkText, setLinkText] = useState('')
    const [savedSelection, setSavedSelection] = useState<Range | null>(null)
    const editorRef = useRef<HTMLDivElement>(null)
    const editorContainerRef = useRef<HTMLDivElement>(null)
    const toolbarRef = useRef<HTMLDivElement>(null)
    const dragStartPos = useRef({ x: 0, y: 0, toolbarX: 0, toolbarY: 0 })

    const colorPalette = [
        // Basic colors
        '#ffffff', '#000000', '#ff0000', '#00ff00', '#0000ff', '#ffff00',
        '#ff00ff', '#00ffff', '#ffa500', '#800080', '#008000', '#000080',
        // Modern palette
        '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9',
        '#a29bfe', '#fd79a8', '#636e72', '#2d3436', '#00b894', '#e17055',
        // Extended colors
        '#1abc9c', '#2ecc71', '#3498db', '#9b59b6', '#34495e', '#16a085',
        '#27ae60', '#2980b9', '#8e44ad', '#2c3e50', '#f1c40f', '#e67e22',
        '#e74c3c', '#ecf0f1', '#95a5a6', '#f39c12', '#d35400', '#c0392b',
        // Pastels
        '#fab1a0', '#81ecec', '#74b9ff', '#a29bfe', '#ffeaa7', '#55efc4',
        '#ff7675', '#fdcb6e', '#00cec9', '#6c5ce7', '#b2bec3', '#dfe6e9',
        // Dark shades
        '#1e272e', '#485460', '#0a3d62', '#3c6382', '#60a3bc', '#079992',
        // Neon
        '#00ff88', '#ff0055', '#00d4ff', '#ffcc00', '#ff6600', '#cc00ff'
    ]

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
            } else if (!target.closest('.image-resize-controls') && !target.closest('.color-picker-popup')) {
                setSelectedImage(null)
            }
        }
        document.addEventListener('click', handleImageClick)
        return () => document.removeEventListener('click', handleImageClick)
    }, [])

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging && isToolbarFloating) {
                e.preventDefault()
                e.stopPropagation()
                
                const deltaX = e.clientX - dragStartPos.current.x
                const deltaY = e.clientY - dragStartPos.current.y
                
                const newX = dragStartPos.current.toolbarX + deltaX
                const newY = dragStartPos.current.toolbarY + deltaY
                
                const toolbarWidth = toolbarRef.current?.offsetWidth || 400
                const toolbarHeight = toolbarRef.current?.offsetHeight || 50
                
                const maxX = window.innerWidth - toolbarWidth - 10
                const maxY = window.innerHeight - toolbarHeight - 10
                
                setToolbarPosition({
                    x: Math.max(10, Math.min(newX, maxX)),
                    y: Math.max(10, Math.min(newY, maxY))
                })
            }
        }
        
        const handleMouseUp = () => {
            setIsDragging(false)
            document.body.style.userSelect = ''
            document.body.style.cursor = ''
        }
        
        if (isDragging) {
            document.body.style.userSelect = 'none'
            document.body.style.cursor = 'grabbing'
            document.addEventListener('mousemove', handleMouseMove, true)
            document.addEventListener('mouseup', handleMouseUp, true)
        }
        
        return () => {
            document.removeEventListener('mousemove', handleMouseMove, true)
            document.removeEventListener('mouseup', handleMouseUp, true)
        }
    }, [isDragging, isToolbarFloating])

    const startDrag = (e: React.MouseEvent) => {
        if (!isToolbarFloating) return
        e.preventDefault()
        e.stopPropagation()
        
        dragStartPos.current = {
            x: e.clientX,
            y: e.clientY,
            toolbarX: toolbarPosition.x,
            toolbarY: toolbarPosition.y
        }
        setIsDragging(true)
    }

    const toggleFloatingToolbar = () => {
        if (!isToolbarFloating) {
            const viewportWidth = window.innerWidth
            const toolbarWidth = 600
            setToolbarPosition({ 
                x: Math.max(10, (viewportWidth - toolbarWidth) / 2), 
                y: 120 
            })
        }
        setIsToolbarFloating(!isToolbarFloating)
    }

    const updateField = (field: string, value: unknown) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const execCommand = (command: string, value?: string) => {
        // Ensure editor has focus before executing command
        editorRef.current?.focus()
        
        // Small delay to ensure focus is set
        setTimeout(() => {
            try {
                if (command === 'formatBlock' && value) {
                    document.execCommand(command, false, `<${value}>`)
                } else {
                    document.execCommand(command, false, value || '')
                }
            } catch (e) {
                console.error('execCommand failed:', e)
            }
        }, 10)
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

    const applyHeading = (tag: string) => {
        editorRef.current?.focus()
        setTimeout(() => {
            try {
                document.execCommand('formatBlock', false, `<${tag}>`)
            } catch (e) {
                console.error('applyHeading failed:', e)
            }
        }, 10)
    }

    const applyColorFromPicker = (color: string) => {
        editorRef.current?.focus()
        setTimeout(() => {
            try {
                if (showColorPicker === 'text') {
                    document.execCommand('foreColor', false, color)
                } else if (showColorPicker === 'bg') {
                    document.execCommand('hiliteColor', false, color)
                }
            } catch (e) {
                console.error('applyColor failed:', e)
            }
            setShowColorPicker(null)
        }, 10)
    }

    const removeColor = () => {
        editorRef.current?.focus()
        setTimeout(() => {
            try {
                if (showColorPicker === 'text') {
                    document.execCommand('removeFormat', false, '')
                } else if (showColorPicker === 'bg') {
                    document.execCommand('hiliteColor', false, 'transparent')
                }
            } catch (e) {
                console.error('removeColor failed:', e)
            }
            setShowColorPicker(null)
        }, 10)
    }

    const addBorder = () => {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            const span = document.createElement('span')
            span.style.border = '1px solid #ffffff'
            span.style.padding = '2px 6px'
            span.style.borderRadius = '4px'
            range.surroundContents(span)
        }
    }

    const addRoundBox = () => {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            const span = document.createElement('span')
            span.style.border = '2px solid #00d4ff'
            span.style.padding = '4px 12px'
            span.style.borderRadius = '20px'
            span.style.display = 'inline-block'
            range.surroundContents(span)
        }
    }

    const insertTable = () => {
        const rows = prompt('Number of rows:', '3')
        const cols = prompt('Number of columns:', '3')
        if (rows && cols) {
            const r = parseInt(rows)
            const c = parseInt(cols)
            if (r > 0 && c > 0) {
                let tableHtml = '<table style="border-collapse: collapse; width: 100%; margin: 10px 0;">'
                for (let i = 0; i < r; i++) {
                    tableHtml += '<tr>'
                    for (let j = 0; j < c; j++) {
                        const cellStyle = 'border: 1px solid #4a5568; padding: 8px; color: #ffffff;'
                        if (i === 0) {
                            tableHtml += `<th style="${cellStyle} background: #2d3748; font-weight: bold;">Header</th>`
                        } else {
                            tableHtml += `<td style="${cellStyle}">Cell</td>`
                        }
                    }
                    tableHtml += '</tr>'
                }
                tableHtml += '</table><p><br></p>'
                document.execCommand('insertHTML', false, tableHtml)
            }
        }
    }

    const openLinkModal = () => {
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            setSavedSelection(range.cloneRange())
            setLinkText(selection.toString() || '')
        }
        setLinkUrl('')
        setShowLinkModal(true)
    }

    const insertLink = () => {
        if (!linkUrl) return
        
        let finalUrl = linkUrl.trim()
        if (finalUrl && !finalUrl.match(/^(https?:\/\/|mailto:|tel:|#)/i)) {
            finalUrl = 'https://' + finalUrl
        }
        
        editorRef.current?.focus()
        
        if (savedSelection) {
            const selection = window.getSelection()
            selection?.removeAllRanges()
            selection?.addRange(savedSelection)
        }
        
        setTimeout(() => {
            const selection = window.getSelection()
            if (selection && selection.rangeCount > 0) {
                if (linkText && selection.toString() !== linkText) {
                    const range = selection.getRangeAt(0)
                    range.deleteContents()
                    const textNode = document.createTextNode(linkText)
                    range.insertNode(textNode)
                    range.selectNodeContents(textNode)
                    selection.removeAllRanges()
                    selection.addRange(range)
                }
                
                const anchor = document.createElement('a')
                anchor.href = finalUrl
                anchor.target = '_blank'
                anchor.rel = 'noopener noreferrer'
                anchor.style.color = '#00d4ff'
                anchor.style.textDecoration = 'underline'
                
                const range = selection.getRangeAt(0)
                const content = range.extractContents()
                anchor.appendChild(content)
                range.insertNode(anchor)
                
                range.setStartAfter(anchor)
                range.collapse(true)
                selection.removeAllRanges()
                selection.addRange(range)
            }
            
            setShowLinkModal(false)
            setLinkUrl('')
            setLinkText('')
            setSavedSelection(null)
        }, 10)
    }

    const removeLink = () => {
        editorRef.current?.focus()
        document.execCommand('unlink', false)
    }

    const insertHorizontalRule = () => {
        editorRef.current?.focus()
        document.execCommand('insertHTML', false, '<hr style="border: none; border-top: 1px solid #4a5568; margin: 16px 0;"/>')
    }

    const insertBlockquote = () => {
        editorRef.current?.focus()
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            const selectedText = range.toString() || 'Quote text here'
            const quote = `<blockquote style="border-left: 4px solid #00d4ff; padding-left: 16px; margin: 16px 0; font-style: italic; color: #9ca3af;">${selectedText}</blockquote>`
            document.execCommand('insertHTML', false, quote)
        }
    }

    const insertCodeBlock = () => {
        editorRef.current?.focus()
        const selection = window.getSelection()
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            const selectedText = range.toString() || 'code here'
            const code = `<pre style="background: #1a1a2e; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: monospace; color: #00d4ff; margin: 16px 0;"><code>${selectedText}</code></pre>`
            document.execCommand('insertHTML', false, code)
        }
    }

    const insertCTAButton = () => {
        const url = prompt('Enter button link URL (e.g., https://youtube.com/video):')
        if (!url) return
        
        const buttonText = prompt('Enter button text:', 'Click Here')
        if (!buttonText) return
        
        let finalUrl = url.trim()
        if (!finalUrl.match(/^(https?:\/\/|mailto:|tel:|#)/i)) {
            finalUrl = 'https://' + finalUrl
        }
        
        const buttonHtml = `<a href="${finalUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #00d4ff 0%, #0099cc 100%); color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin: 8px 4px; cursor: pointer;">${buttonText}</a>&nbsp;`
        
        editorRef.current?.focus()
        document.execCommand('insertHTML', false, buttonHtml)
    }

    const clearFormatting = () => {
        editorRef.current?.focus()
        document.execCommand('removeFormat', false)
    }

    const applySubscript = () => {
        editorRef.current?.focus()
        document.execCommand('subscript', false)
    }

    const applySuperscript = () => {
        editorRef.current?.focus()
        document.execCommand('superscript', false)
    }

    const ToolbarContent = () => (
        <>
            {/* Drag Handle for floating mode */}
            {isToolbarFloating && (
                <div 
                    onMouseDown={startDrag}
                    className="p-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-white bg-gray-800 rounded"
                    title="Drag to move toolbar"
                >
                    <GripVertical className="h-4 w-4" />
                </div>
            )}
            <button onClick={toggleFloatingToolbar} className={`p-2 rounded ${isToolbarFloating ? 'text-intelligence bg-gray-700' : 'text-gray-400'} hover:text-white hover:bg-gray-700`} title={isToolbarFloating ? 'Dock Toolbar' : 'Float Toolbar'}>
                {isToolbarFloating ? '📌' : '🔓'}
            </button>
            <div className="w-px h-6 bg-gray-700 mx-1" />
            
            {/* Undo/Redo */}
            <button onClick={() => execCommand('undo')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Undo (Ctrl+Z)">
                <Undo className="h-4 w-4" />
            </button>
            <button onClick={() => execCommand('redo')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Redo (Ctrl+Y)">
                <Redo className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-gray-700 mx-1" />
            
            {/* Headings */}
            <button onClick={() => applyHeading('H1')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded font-bold" title="Heading 1">
                H1
            </button>
            <button onClick={() => applyHeading('H2')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded font-bold text-sm" title="Heading 2">
                H2
            </button>
            <button onClick={() => applyHeading('H3')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded font-bold text-xs" title="Heading 3">
                H3
            </button>
            <button onClick={() => applyHeading('P')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded text-xs" title="Paragraph">
                P
            </button>
            <div className="w-px h-6 bg-gray-700 mx-1" />
            
            {/* Text Formatting */}
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
            <button onClick={applySubscript} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded text-xs" title="Subscript">
                X₂
            </button>
            <button onClick={applySuperscript} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded text-xs" title="Superscript">
                X²
            </button>
            <div className="w-px h-6 bg-gray-700 mx-1" />
            
            {/* Colors */}
            <div className="relative">
                <button onClick={() => setShowColorPicker(showColorPicker === 'text' ? null : 'text')} className={`p-2 rounded ${showColorPicker === 'text' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`} title="Text Color">
                    <Palette className="h-4 w-4" />
                </button>
            </div>
            <div className="relative">
                <button onClick={() => setShowColorPicker(showColorPicker === 'bg' ? null : 'bg')} className={`p-2 rounded ${showColorPicker === 'bg' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}`} title="Highlight/Background Color">
                    <Highlighter className="h-4 w-4" />
                </button>
            </div>
            <button onClick={clearFormatting} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Clear Formatting">
                <X className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-gray-700 mx-1" />
            
            {/* Lists */}
            <button onClick={() => execCommand('insertUnorderedList')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Bullet List">
                <List className="h-4 w-4" />
            </button>
            <button onClick={() => execCommand('insertOrderedList')} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Numbered List">
                <ListOrdered className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-gray-700 mx-1" />
            
            {/* Alignment */}
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
            
            {/* Links */}
            <button onClick={openLinkModal} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Insert Link (Opens in new tab)">
                <Link className="h-4 w-4" />
            </button>
            <button onClick={removeLink} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Remove Link">
                <Unlink className="h-4 w-4" />
            </button>
            <button onClick={insertCTAButton} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Insert CTA Button">
                <span className="text-xs font-bold">CTA</span>
            </button>
            <div className="w-px h-6 bg-gray-700 mx-1" />
            
            {/* Insert Elements */}
            <button onClick={insertImage} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Insert Image">
                <ImageIcon className="h-4 w-4" />
            </button>
            <button onClick={insertTable} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Insert Table">
                <Table className="h-4 w-4" />
            </button>
            <button onClick={insertHorizontalRule} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Horizontal Line">
                <Minus className="h-4 w-4" />
            </button>
            <button onClick={insertBlockquote} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Blockquote">
                <Quote className="h-4 w-4" />
            </button>
            <button onClick={insertCodeBlock} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Code Block">
                <Code className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-gray-700 mx-1" />
            
            {/* Shapes */}
            <button onClick={addBorder} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Add Border Box">
                <Square className="h-4 w-4" />
            </button>
            <button onClick={addRoundBox} className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded" title="Round Pill Box">
                <Circle className="h-4 w-4" />
            </button>
            <div className="w-px h-6 bg-gray-700 mx-1" />
            
            {/* Font Selection */}
            <select
                onChange={(e) => { if (e.target.value) { execCommand('fontName', e.target.value); e.target.selectedIndex = 0 } }}
                className="bg-gray-800 text-gray-300 rounded px-2 py-1 text-xs border border-gray-700 max-w-[100px]"
            >
                <option value="">Font</option>
                <option value="Arial" style={{ fontFamily: 'Arial' }}>Arial</option>
                <option value="Arial Black" style={{ fontFamily: 'Arial Black' }}>Arial Black</option>
                <option value="Times New Roman" style={{ fontFamily: 'Times New Roman' }}>Times New Roman</option>
                <option value="Georgia" style={{ fontFamily: 'Georgia' }}>Georgia</option>
                <option value="Verdana" style={{ fontFamily: 'Verdana' }}>Verdana</option>
                <option value="Tahoma" style={{ fontFamily: 'Tahoma' }}>Tahoma</option>
                <option value="Trebuchet MS" style={{ fontFamily: 'Trebuchet MS' }}>Trebuchet MS</option>
                <option value="Courier New" style={{ fontFamily: 'Courier New' }}>Courier New</option>
                <option value="Lucida Console" style={{ fontFamily: 'Lucida Console' }}>Lucida Console</option>
                <option value="Impact" style={{ fontFamily: 'Impact' }}>Impact</option>
                <option value="Comic Sans MS" style={{ fontFamily: 'Comic Sans MS' }}>Comic Sans</option>
                <option value="Palatino Linotype" style={{ fontFamily: 'Palatino Linotype' }}>Palatino</option>
                <option value="Garamond" style={{ fontFamily: 'Garamond' }}>Garamond</option>
                <option value="Book Antiqua" style={{ fontFamily: 'Book Antiqua' }}>Book Antiqua</option>
                <option value="Helvetica" style={{ fontFamily: 'Helvetica' }}>Helvetica</option>
                <option value="Century Gothic" style={{ fontFamily: 'Century Gothic' }}>Century Gothic</option>
            </select>
            
            {/* Font Size */}
            <select
                onChange={(e) => { if (e.target.value) { execCommand('fontSize', e.target.value); e.target.selectedIndex = 0 } }}
                className="bg-gray-800 text-gray-300 rounded px-2 py-1 text-xs border border-gray-700"
            >
                <option value="">Size</option>
                <option value="1">Tiny (8pt)</option>
                <option value="2">Small (10pt)</option>
                <option value="3">Normal (12pt)</option>
                <option value="4">Medium (14pt)</option>
                <option value="5">Large (18pt)</option>
                <option value="6">X-Large (24pt)</option>
                <option value="7">Huge (36pt)</option>
            </select>
        </>
    )

    // Calculate color picker position based on toolbar
    const getColorPickerStyle = () => {
        if (isToolbarFloating) {
            return {
                left: toolbarPosition.x,
                top: toolbarPosition.y + 60,
                maxWidth: '320px'
            }
        }
        return {
            left: '50%',
            top: '200px',
            transform: 'translateX(-50%)',
            maxWidth: '320px'
        }
    }

    return (
        <div ref={editorContainerRef} className="rounded-xl glass-morphism border border-gray-800 overflow-hidden relative">
            {/* Floating Toolbar - Always visible on screen */}
            {isToolbarFloating && (
                <div
                    ref={toolbarRef}
                    className="fixed z-[200] bg-gray-950/95 backdrop-blur-sm border border-gray-600 rounded-lg shadow-2xl p-2 flex flex-wrap items-center gap-1"
                    style={{ 
                        left: `${toolbarPosition.x}px`, 
                        top: `${toolbarPosition.y}px`, 
                        maxWidth: 'calc(100vw - 40px)',
                        minWidth: '300px'
                    }}
                >
                    <ToolbarContent />
                </div>
            )}

            {/* Link Modal */}
            {showLinkModal && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                                <Link className="h-5 w-5 text-intelligence" />
                                Insert Link
                            </h3>
                            <button 
                                onClick={() => { setShowLinkModal(false); setLinkUrl(''); setLinkText(''); setSavedSelection(null) }}
                                className="text-gray-400 hover:text-white"
                            >
                                <XCircle className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Link Text</label>
                                <input
                                    type="text"
                                    value={linkText}
                                    onChange={(e) => setLinkText(e.target.value)}
                                    placeholder="Enter display text..."
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">URL</label>
                                <input
                                    type="text"
                                    value={linkUrl}
                                    onChange={(e) => setLinkUrl(e.target.value)}
                                    placeholder="https://youtube.com/video or youtube.com/video"
                                    className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-intelligence focus:outline-none"
                                    onKeyDown={(e) => e.key === 'Enter' && insertLink()}
                                    autoFocus
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Enter full URL (https:// will be added if missing). Link opens in new tab.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => { setShowLinkModal(false); setLinkUrl(''); setLinkText(''); setSavedSelection(null) }}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={insertLink}
                                disabled={!linkUrl}
                                className="px-6 py-2 bg-intelligence text-white rounded-lg font-semibold hover:bg-intelligence/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Insert Link
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Color Picker Popup - Below toolbar */}
            {showColorPicker && (
                <div 
                    className="color-picker-popup fixed z-[250] bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl" 
                    style={getColorPickerStyle()}
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-white text-sm font-medium">{showColorPicker === 'text' ? 'Text Color' : 'Background Color'}</span>
                        <button onClick={() => setShowColorPicker(null)} className="text-gray-400 hover:text-white">
                            <XCircle className="h-4 w-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-12 gap-1 mb-3">
                        {colorPalette.map((color, index) => (
                            <button
                                key={`${color}-${index}`}
                                onClick={() => applyColorFromPicker(color)}
                                className="w-5 h-5 rounded border border-gray-600 hover:scale-125 hover:z-10 transition-transform"
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="color"
                            onChange={(e) => applyColorFromPicker(e.target.value)}
                            className="w-8 h-8 rounded cursor-pointer border-0"
                            title="Custom color"
                        />
                        <button onClick={removeColor} className="flex-1 text-xs text-gray-400 hover:text-white py-1 border border-gray-700 rounded hover:bg-gray-800">
                            Remove Color
                        </button>
                    </div>
                </div>
            )}

            {/* Static Toolbar - when not floating */}
            {!isToolbarFloating && (
                <div className="sticky top-0 z-50 border-b border-gray-800 p-2 md:p-3 flex flex-wrap items-center gap-1 bg-gray-950 shadow-lg overflow-x-auto">
                    <ToolbarContent />
                </div>
            )}

            {/* Image Resize Controls */}
            {selectedImage && (
                <div className="image-resize-controls sticky top-16 z-40 flex items-center justify-center gap-2 p-2 bg-intelligence text-white text-sm">
                    <span>Resize:</span>
                    <button onClick={() => resizeImage('small')} className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded">25%</button>
                    <button onClick={() => resizeImage('medium')} className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded">50%</button>
                    <button onClick={() => resizeImage('large')} className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded">75%</button>
                    <button onClick={() => resizeImage('full')} className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded">100%</button>
                    <button onClick={() => setSelectedImage(null)} className="px-3 py-1 bg-red-500 hover:bg-red-600 rounded ml-2">✕</button>
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
                        className="w-full min-h-[400px] max-h-[600px] overflow-y-auto p-4 bg-gray-900 border border-gray-700 rounded-lg focus:border-intelligence focus:outline-none prose prose-invert max-w-none"
                        style={{ lineHeight: 1.8, color: '#ffffff' }}
                    />
                </div>

                {/* Upload Progress Indicator */}
                {uploadProgress && (
                    <div className="mb-4 p-4 rounded-lg bg-intelligence/10 border border-intelligence/20">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-intelligence text-sm font-medium">
                                {uploadProgress.message}
                            </span>
                            <span className="text-intelligence text-sm">
                                {uploadProgress.current}/{uploadProgress.total}
                            </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                                className="bg-intelligence h-2 rounded-full transition-all duration-300"
                                style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-800">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-6 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={loading}
                        className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-intelligence to-industrial text-white rounded-lg font-semibold hover:shadow-intelligence transition-all disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        <span>
                            {loading 
                                ? (uploadProgress ? `Uploading ${uploadProgress.current}/${uploadProgress.total}...` : 'Saving...') 
                                : 'Save'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}
