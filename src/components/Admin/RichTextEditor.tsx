'use client'

import { useEditor, EditorContent, type Editor } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/react/menus'
import { Extension } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import TipTapImage from '@tiptap/extension-image'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'
import { useCallback, useState, useRef, useEffect } from 'react'
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough, Subscript as SubIcon,
    Superscript as SupIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, ListChecks, Quote, Code, Code2, Minus, Link as LinkIcon, Unlink, Video,
    Image as ImageIcon, Table as TableIcon, Undo2, Redo2, RemoveFormatting,
    ChevronDown, Palette, Highlighter, Upload,
    Trash2, Plus, ArrowRight, Search, Replace, Indent, Outdent,
    CaseSensitive, Shapes, Circle, Square, Triangle, SeparatorHorizontal,
    SlidersHorizontal, Contrast, Sun, Crop, RectangleHorizontal, Type,
    LayoutTemplate, Info, AlertTriangle, CheckCircle, XCircle, Tag,
    FileText, Hash, AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd
} from 'lucide-react'

interface RichTextEditorProps {
    content: string
    onChange: (html: string) => void
    placeholder?: string
}

function promptForLink(editor: Editor) {
    const previousUrl = (editor.getAttributes('link').href as string | undefined) || ''
    const input = window.prompt('Enter URL (leave empty to remove link):', previousUrl || 'https://')
    if (input === null) return

    const trimmed = input.trim()
    if (!trimmed) {
        editor.chain().focus().extendMarkRange('link').unsetLink().run()
        return
    }

    const normalized = /^(https?:\/\/|mailto:|tel:)/i.test(trimmed) ? trimmed : `https://${trimmed}`
    editor.chain().focus().extendMarkRange('link').setLink({ href: normalized }).run()
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        fontSize: {
            setFontSize: (size: string) => ReturnType
            unsetFontSize: () => ReturnType
        }
        letterSpacing: {
            setLetterSpacing: (spacing: string) => ReturnType
            unsetLetterSpacing: () => ReturnType
        }
        lineHeight: {
            setLineHeight: (height: string) => ReturnType
            unsetLineHeight: () => ReturnType
        }
    }
}

const FONTS = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New',
    'Verdana', 'Trebuchet MS', 'Impact', 'Comic Sans MS', 'Palatino',
    'Garamond', 'Bookman', 'Tahoma', 'Lucida Sans', 'Gill Sans',
]

const FONT_SIZES = ['8px','9px','10px','11px','12px','14px','16px','18px','20px','22px','24px','26px','28px','36px','48px','72px']

const FONT_OPTIONS = [{ label: 'Default', value: '' }, ...FONTS.map((font) => ({ label: font, value: font }))]
const FONT_SIZE_OPTIONS = [{ label: 'Default', value: '' }, ...FONT_SIZES.map((size) => ({ label: size.replace('px', ''), value: size }))]

const FontSize = Extension.create({
    name: 'fontSize',
    addOptions() {
        return {
            types: ['textStyle'],
        }
    },
    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    fontSize: {
                        default: null,
                        parseHTML: (element: HTMLElement) => element.style.fontSize || null,
                        renderHTML: (attributes: { fontSize?: string | null }) => {
                            if (!attributes.fontSize) return {}
                            return { style: `font-size: ${attributes.fontSize}` }
                        },
                    },
                },
            },
        ]
    },
    addCommands() {
        return {
            setFontSize: (size: string) => ({ chain }) =>
                chain().setMark('textStyle', { fontSize: size }).run(),
            unsetFontSize: () => ({ chain }) =>
                chain().setMark('textStyle', { fontSize: null }).run(),
        }
    },
})

const LetterSpacing = Extension.create({
    name: 'letterSpacing',
    addOptions() {
        return { types: ['textStyle'] }
    },
    addGlobalAttributes() {
        return [{
            types: this.options.types,
            attributes: {
                letterSpacing: {
                    default: null,
                    parseHTML: (element: HTMLElement) => element.style.letterSpacing || null,
                    renderHTML: (attributes: { letterSpacing?: string | null }) => {
                        if (!attributes.letterSpacing) return {}
                        return { style: `letter-spacing: ${attributes.letterSpacing}` }
                    },
                },
            },
        }]
    },
    addCommands() {
        return {
            setLetterSpacing: (spacing: string) => ({ chain }) =>
                chain().setMark('textStyle', { letterSpacing: spacing }).run(),
            unsetLetterSpacing: () => ({ chain }) =>
                chain().setMark('textStyle', { letterSpacing: null }).run(),
        }
    },
})

const LineHeight = Extension.create({
    name: 'lineHeight',
    addOptions() {
        return { types: ['paragraph', 'heading'] }
    },
    addGlobalAttributes() {
        return [{
            types: this.options.types,
            attributes: {
                lineHeight: {
                    default: null,
                    parseHTML: (element: HTMLElement) => element.style.lineHeight || null,
                    renderHTML: (attributes: { lineHeight?: string | null }) => {
                        if (!attributes.lineHeight) return {}
                        return { style: `line-height: ${attributes.lineHeight}` }
                    },
                },
            },
        }]
    },
    addCommands() {
        return {
            setLineHeight: (height: string) => ({ chain }) =>
                chain().updateAttributes('paragraph', { lineHeight: height }).run(),
            unsetLineHeight: () => ({ chain }) =>
                chain().updateAttributes('paragraph', { lineHeight: null }).run(),
        }
    },
})

const EnhancedImage = TipTapImage.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: '100%',
                parseHTML: (element: HTMLElement) => element.style.width || element.getAttribute('width') || '100%',
                renderHTML: (attributes: { width?: string }) => {
                    if (!attributes.width) return {}
                    return { style: `width:${attributes.width};max-width:100%;height:auto;` }
                },
            },
            align: {
                default: 'center',
                parseHTML: (element: HTMLElement) => {
                    const explicit = element.getAttribute('data-align')
                    if (explicit === 'left' || explicit === 'center' || explicit === 'right') return explicit

                    const style = (element.getAttribute('style') || '').toLowerCase()
                    if (style.includes('margin-left:0') || style.includes('margin-right:auto')) return 'left'
                    if (style.includes('margin-left:auto') && style.includes('margin-right:0')) return 'right'
                    return 'center'
                },
                renderHTML: (attributes: { align?: string }) => {
                    const align = attributes.align || 'center'
                    if (align === 'left') {
                        return { 'data-align': 'left', style: 'display:block;margin-left:0;margin-right:auto;' }
                    }
                    if (align === 'right') {
                        return { 'data-align': 'right', style: 'display:block;margin-left:auto;margin-right:0;' }
                    }
                    return { 'data-align': 'center', style: 'display:block;margin-left:auto;margin-right:auto;' }
                },
            },
        }
    },
})

const TEXT_COLORS = [
    '#000000','#434343','#666666','#999999','#B7B7B7','#CCCCCC','#D9D9D9','#EFEFEF','#F3F3F3','#FFFFFF',
    '#980000','#FF0000','#FF9900','#FFFF00','#00FF00','#00FFFF','#4A86E8','#0000FF','#9900FF','#FF00FF',
    '#E6B8AF','#F4CCCC','#FCE5CD','#FFF2CC','#D9EAD3','#D0E0E3','#C9DAF8','#CFE2F3','#D9D2E9','#EAD1DC',
    '#DD7E6B','#EA9999','#F9CB9C','#FFE599','#B6D7A8','#A2C4C9','#A4C2F4','#9FC5E8','#B4A7D6','#D5A6BD',
    '#CC4125','#E06666','#F6B26B','#FFD966','#93C47D','#76A5AF','#6D9EEB','#6FA8DC','#8E7CC3','#C27BA0',
    '#A61C00','#CC0000','#E69138','#F1C232','#6AA84F','#45818E','#3C78D8','#3D85C6','#674EA7','#A64D79',
    '#85200C','#990000','#B45F06','#BF9000','#38761D','#134F5C','#1155CC','#0B5394','#351C75','#741B47',
]

const HIGHLIGHT_COLORS = [
    '#FFFF00','#00FF00','#00FFFF','#FF00FF','#FF0000','#0000FF',
    '#FFC107','#CDDC39','#4CAF50','#03A9F4','#9C27B0','#FF5722',
    '#FFE082','#C5E1A5','#80CBC4','#90CAF9','#CE93D8','#FFAB91',
    '#FFF9C4','#DCEDC8','#B2DFDB','#BBDEFB','#E1BEE7','#FFCCBC',
    '#F48FB1','#B39DDB','#81D4FA','#A5D6A7','#FFE0B2','#FFCDD2',
]

const IMAGE_SIZES = [
    { label: 'Small (25%)', value: '25%' },
    { label: 'Medium (50%)', value: '50%' },
    { label: 'Large (75%)', value: '75%' },
    { label: 'Full Width', value: '100%' },
    { label: '200px', value: '200px' },
    { label: '300px', value: '300px' },
    { label: '400px', value: '400px' },
    { label: '500px', value: '500px' },
    { label: '600px', value: '600px' },
]

const LETTER_SPACING_OPTIONS = [
    { label: 'Default', value: '' },
    { label: 'Tight (-0.5px)', value: '-0.5px' },
    { label: 'Normal (0)', value: '0px' },
    { label: 'Wide (1px)', value: '1px' },
    { label: 'Wider (2px)', value: '2px' },
    { label: 'Widest (4px)', value: '4px' },
    { label: '6px', value: '6px' },
    { label: '8px', value: '8px' },
]

const LINE_HEIGHT_OPTIONS = [
    { label: 'Default', value: '' },
    { label: '1.0', value: '1' },
    { label: '1.15', value: '1.15' },
    { label: '1.5', value: '1.5' },
    { label: '1.75', value: '1.75' },
    { label: '2.0', value: '2' },
    { label: '2.5', value: '2.5' },
    { label: '3.0', value: '3' },
]

const LAYOUT_BLOCKS = [
    { id: 'info', label: 'Info Card', bg: '#EBF5FB', border: '#3498DB', icon: '💡', textColor: '#1A5276' },
    { id: 'warning', label: 'Warning Card', bg: '#FEF9E7', border: '#F39C12', icon: '⚠️', textColor: '#7D6608' },
    { id: 'success', label: 'Success Card', bg: '#EAFAF1', border: '#27AE60', icon: '✅', textColor: '#1E8449' },
    { id: 'error', label: 'Error Card', bg: '#FDEDEC', border: '#E74C3C', icon: '❌', textColor: '#922B21' },
    { id: 'neutral', label: 'Neutral Card', bg: '#F2F3F4', border: '#BDC3C7', icon: '📋', textColor: '#2C3E50' },
    { id: 'dark', label: 'Dark Card', bg: '#1a1a2e', border: '#D4AF37', icon: '🌙', textColor: '#FFFFFF' },
]

const CALLOUT_TYPES = [
    { id: 'info', label: 'Info', bg: '#E8F4FD', border: '#2196F3', icon: 'ℹ️', text: 'Information callout' },
    { id: 'tip', label: 'Tip', bg: '#E8F5E9', border: '#4CAF50', icon: '💡', text: 'Helpful tip' },
    { id: 'warning', label: 'Warning', bg: '#FFF3E0', border: '#FF9800', icon: '⚠️', text: 'Warning notice' },
    { id: 'danger', label: 'Danger', bg: '#FFEBEE', border: '#F44336', icon: '🚫', text: 'Danger alert' },
    { id: 'note', label: 'Note', bg: '#F3E5F5', border: '#9C27B0', icon: '📝', text: 'Take note' },
    { id: 'quote', label: 'Quote', bg: '#ECEFF1', border: '#607D8B', icon: '💬', text: 'Notable quote' },
]

const STATUS_LABELS = [
    { label: 'Draft', bg: '#6B7280', color: '#FFFFFF' },
    { label: 'Published', bg: '#10B981', color: '#FFFFFF' },
    { label: 'Pending', bg: '#F59E0B', color: '#000000' },
    { label: 'Approved', bg: '#3B82F6', color: '#FFFFFF' },
    { label: 'Rejected', bg: '#EF4444', color: '#FFFFFF' },
    { label: 'In Review', bg: '#8B5CF6', color: '#FFFFFF' },
    { label: 'Urgent', bg: '#DC2626', color: '#FFFFFF' },
    { label: 'Completed', bg: '#059669', color: '#FFFFFF' },
]

const TABLE_STYLE_PRESETS = [
    { id: 'minimal', label: 'Minimal' },
    { id: 'bordered', label: 'Bordered' },
    { id: 'striped', label: 'Striped' },
    { id: 'compact', label: 'Compact' },
    { id: 'spacious', label: 'Spacious' },
]

const DOCUMENT_PRESETS = [
    { id: 'report', label: '📊 Report', desc: 'Numbered headings, formal layout' },
    { id: 'article', label: '📰 Article', desc: 'Clean reading, sans-serif' },
    { id: 'legal', label: '⚖️ Legal Document', desc: 'Serif font, numbered sections' },
    { id: 'memo', label: '📋 Memo', desc: 'Brief, structured format' },
]

/* ================================================================== */
/*  Sub-components                                                     */
/* ================================================================== */

function ToolbarButton({ onClick, active, disabled, title, children }: {
    onClick: () => void; active?: boolean; disabled?: boolean; title: string; children: React.ReactNode
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-1.5 rounded transition-colors ${
                active ? 'bg-intelligence/20 text-intelligence' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            } ${disabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            {children}
        </button>
    )
}

function ColorPicker({ colors, onSelect, icon, title }: {
    colors: string[]; onSelect: (c: string) => void; icon: React.ReactNode; title: string
}) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                title={title}
                className="flex items-center p-1.5 rounded text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
                {icon}
                <ChevronDown className="h-3 w-3 ml-0.5" />
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-1 p-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 w-[240px]">
                    <div className="grid grid-cols-10 gap-0.5">
                        {colors.map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => { onSelect(c); setOpen(false) }}
                                className="w-5 h-5 rounded-sm border border-gray-600 hover:scale-125 transition-transform"
                                style={{ backgroundColor: c }}
                                title={c}
                            />
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={() => { onSelect(''); setOpen(false) }}
                        className="mt-2 text-xs text-gray-400 hover:text-white w-full text-left"
                    >
                        Remove color
                    </button>
                </div>
            )}
        </div>
    )
}

function Dropdown({ label, options, value, onChange }: {
    label: string; options: { label: string; value: string }[]; value: string; onChange: (v: string) => void
}) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const displayLabel = options.find(o => o.value === value)?.label || label

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="flex items-center space-x-1 px-2 py-1.5 rounded text-gray-300 hover:bg-gray-700 text-xs min-w-[80px] justify-between border border-gray-700"
            >
                <span className="truncate">{displayLabel}</span>
                <ChevronDown className="h-3 w-3 flex-shrink-0" />
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 max-h-64 overflow-auto min-w-[140px]">
                    {options.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => { onChange(opt.value); setOpen(false) }}
                            className={`block w-full text-left px-3 py-1.5 text-xs hover:bg-gray-700 transition-colors ${
                                value === opt.value ? 'text-intelligence bg-intelligence/10' : 'text-gray-300'
                            }`}
                            style={label === 'Font' ? { fontFamily: opt.value } : undefined}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

/* ================================================================== */
/*  Modal: Table Insert                                                */
/* ================================================================== */

function TableInsertModal({ open, onClose, onInsert }: {
    open: boolean; onClose: () => void; onInsert: (rows: number, cols: number) => void
}) {
    const [rows, setRows] = useState(3)
    const [cols, setCols] = useState(3)

    if (!open) return null

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <h3 className="text-white font-semibold text-lg mb-4">Insert Table</h3>

                <div className="space-y-4 mb-6">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Rows</label>
                        <div className="flex items-center space-x-3">
                            <button type="button" onClick={() => setRows(Math.max(1, rows - 1))}
                                className="p-1.5 rounded bg-gray-800 text-gray-400 hover:text-white border border-gray-700">
                                <Minus className="h-4 w-4" />
                            </button>
                            <input type="number" min={1} max={50} value={rows}
                                onChange={e => setRows(Math.max(1, Math.min(50, parseInt(e.target.value) || 1)))}
                                className="w-20 text-center px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-intelligence focus:outline-none"
                            />
                            <button type="button" onClick={() => setRows(Math.min(50, rows + 1))}
                                className="p-1.5 rounded bg-gray-800 text-gray-400 hover:text-white border border-gray-700">
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Columns</label>
                        <div className="flex items-center space-x-3">
                            <button type="button" onClick={() => setCols(Math.max(1, cols - 1))}
                                className="p-1.5 rounded bg-gray-800 text-gray-400 hover:text-white border border-gray-700">
                                <Minus className="h-4 w-4" />
                            </button>
                            <input type="number" min={1} max={20} value={cols}
                                onChange={e => setCols(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                                className="w-20 text-center px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:border-intelligence focus:outline-none"
                            />
                            <button type="button" onClick={() => setCols(Math.min(20, cols + 1))}
                                className="p-1.5 rounded bg-gray-800 text-gray-400 hover:text-white border border-gray-700">
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Grid preview */}
                <div className="mb-6 p-3 rounded-lg bg-gray-800 border border-gray-700 overflow-auto max-h-32">
                    <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `repeat(${Math.min(cols, 10)}, 1fr)` }}>
                        {Array.from({ length: Math.min(rows, 8) * Math.min(cols, 10) }).map((_, i) => (
                            <div key={i} className={`w-6 h-4 rounded-sm border ${
                                i < Math.min(cols, 10) ? 'bg-intelligence/20 border-intelligence/30' : 'bg-gray-700 border-gray-600'
                            }`} />
                        ))}
                    </div>
                    {(rows > 8 || cols > 10) && (
                        <p className="text-xs text-gray-500 mt-1">Preview truncated ({rows}×{cols})</p>
                    )}
                </div>

                <div className="flex justify-end space-x-3">
                    <button type="button" onClick={onClose}
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm">
                        Cancel
                    </button>
                    <button type="button" onClick={() => { onInsert(rows, cols); onClose() }}
                        className="px-5 py-2 bg-intelligence text-obsidian rounded-lg font-semibold text-sm hover:bg-intelligence-light transition-colors">
                        Insert {rows}×{cols} Table
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ================================================================== */
/*  Modal: Image Insert (Upload or URL)                                */
/* ================================================================== */

function ImageInsertModal({ open, onClose, onInsert }: {
    open: boolean; onClose: () => void; onInsert: (url: string, width?: string) => void
}) {
    const [tab, setTab] = useState<'upload' | 'url'>('upload')
    const [url, setUrl] = useState('')
    const [uploading, setUploading] = useState(false)
    const [uploadError, setUploadError] = useState('')
    const [previewUrl, setPreviewUrl] = useState('')
    const [selectedWidth, setSelectedWidth] = useState('100%')
    const fileRef = useRef<HTMLInputElement>(null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadError('')
        setUploading(true)

        // Show local preview immediately
        const localPreview = URL.createObjectURL(file)
        setPreviewUrl(localPreview)

        try {
            const token = sessionStorage.getItem('rf-admin-token')
            const formData = new FormData()
            formData.append('image', file)

            const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            })

            const data = await res.json()

            if (!res.ok) {
                setUploadError(data.error || 'Upload failed')
                setPreviewUrl('')
                return
            }

            setPreviewUrl(data.url)
            setUrl(data.url)
        } catch {
            setUploadError('Network error. Please try again.')
            setPreviewUrl('')
        } finally {
            setUploading(false)
        }
    }

    const handleUrlChange = (newUrl: string) => {
        setUrl(newUrl)
        setPreviewUrl(newUrl)
    }

    const handleInsert = () => {
        const finalUrl = tab === 'url' ? url : (previewUrl || url)
        if (finalUrl) {
            onInsert(finalUrl, selectedWidth)
            onClose()
            setUrl('')
            setPreviewUrl('')
            setUploadError('')
        }
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-white font-semibold text-lg mb-4">Insert Image</h3>

                {/* Tabs */}
                <div className="flex rounded-lg bg-gray-800 border border-gray-700 p-1 mb-5">
                    <button type="button" onClick={() => setTab('upload')}
                        className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                            tab === 'upload' ? 'bg-intelligence text-obsidian' : 'text-gray-400 hover:text-white'
                        }`}>
                        <Upload className="h-4 w-4" />
                        <span>Upload</span>
                    </button>
                    <button type="button" onClick={() => setTab('url')}
                        className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                            tab === 'url' ? 'bg-intelligence text-obsidian' : 'text-gray-400 hover:text-white'
                        }`}>
                        <LinkIcon className="h-4 w-4" />
                        <span>URL</span>
                    </button>
                </div>

                {tab === 'upload' ? (
                    <div className="space-y-4">
                        <div
                            onClick={() => fileRef.current?.click()}
                            className="border-2 border-dashed border-gray-700 rounded-xl p-8 text-center cursor-pointer hover:border-intelligence/50 transition-colors"
                        >
                            {uploading ? (
                                <div className="flex flex-col items-center">
                                    <div className="h-8 w-8 border-2 border-intelligence border-t-transparent rounded-full animate-spin mb-3" />
                                    <p className="text-gray-400 text-sm">Uploading...</p>
                                </div>
                            ) : (
                                <>
                                    <Upload className="h-10 w-10 text-gray-500 mx-auto mb-3" />
                                    <p className="text-gray-300 text-sm font-medium">Click to upload an image</p>
                                    <p className="text-gray-500 text-xs mt-1">PNG, JPG, GIF, WebP, SVG — Max 5MB</p>
                                </>
                            )}
                        </div>
                        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                    </div>
                ) : (
                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Image URL</label>
                        <input type="text" value={url} onChange={e => handleUrlChange(e.target.value)}
                            placeholder="https://example.com/image.png"
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-intelligence focus:outline-none text-sm"
                        />
                    </div>
                )}

                {uploadError && (
                    <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-red-400 text-sm">{uploadError}</p>
                    </div>
                )}

                {/* Preview */}
                {previewUrl && !uploading && (
                    <div className="mt-4 rounded-lg overflow-hidden border border-gray-700 bg-gray-800 p-2">
                        <img src={previewUrl} alt="Preview" className="max-h-40 mx-auto object-contain rounded"
                            onError={() => { if (tab === 'url') setPreviewUrl('') }} />
                    </div>
                )}

                {/* Size selector */}
                <div className="mt-4">
                    <label className="block text-sm text-gray-400 mb-1.5">Image Width</label>
                    <div className="flex flex-wrap gap-2">
                        {IMAGE_SIZES.map(s => (
                            <button key={s.value} type="button" onClick={() => setSelectedWidth(s.value)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                    selectedWidth === s.value
                                        ? 'bg-intelligence/20 border-intelligence/40 text-intelligence'
                                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
                                }`}>
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button type="button" onClick={onClose}
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm">
                        Cancel
                    </button>
                    <button type="button" onClick={handleInsert}
                        disabled={!(previewUrl || url) || uploading}
                        className="px-5 py-2 bg-intelligence text-obsidian rounded-lg font-semibold text-sm hover:bg-intelligence-light transition-colors disabled:opacity-50">
                        Insert Image
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ================================================================== */
/*  Modal: CTA Button Insert                                           */
/* ================================================================== */

function CTAButtonModal({ open, onClose, onInsert }: {
    open: boolean; onClose: () => void; onInsert: (html: string) => void
}) {
    const [text, setText] = useState('Learn More')
    const [href, setHref] = useState('')
    const [bgColor, setBgColor] = useState('#D4AF37')
    const [textColor, setTextColor] = useState('#000000')
    const [size, setSize] = useState<'sm' | 'md' | 'lg'>('md')
    const [align, setAlign] = useState<'left' | 'center' | 'right'>('center')

    const sizeClasses: Record<string, string> = {
        sm: 'padding:8px 16px;font-size:13px;',
        md: 'padding:12px 28px;font-size:15px;',
        lg: 'padding:16px 36px;font-size:17px;',
    }

    const handleInsert = () => {
        if (!text.trim() || !href.trim()) return
        const html = `<div style="text-align:${align};margin:24px 0;"><a href="${href}" target="_blank" rel="noopener noreferrer" style="display:inline-block;${sizeClasses[size]}background-color:${bgColor};color:${textColor};text-decoration:none;border-radius:8px;font-weight:600;letter-spacing:0.5px;">${text}</a></div>`
        onInsert(html)
        onClose()
        setText('Learn More')
        setHref('')
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="text-white font-semibold text-lg mb-4">Insert CTA Button</h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Button Text</label>
                        <input type="text" value={text} onChange={e => setText(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-intelligence focus:outline-none text-sm"
                            placeholder="e.g. Schedule Consultation" />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Link URL</label>
                        <input type="text" value={href} onChange={e => setHref(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-intelligence focus:outline-none text-sm"
                            placeholder="https://..." />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Background Color</label>
                            <div className="flex items-center space-x-2">
                                <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                                    className="h-9 w-9 rounded border border-gray-700 bg-gray-800 cursor-pointer" />
                                <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)}
                                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs font-mono focus:border-intelligence focus:outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1.5">Text Color</label>
                            <div className="flex items-center space-x-2">
                                <input type="color" value={textColor} onChange={e => setTextColor(e.target.value)}
                                    className="h-9 w-9 rounded border border-gray-700 bg-gray-800 cursor-pointer" />
                                <input type="text" value={textColor} onChange={e => setTextColor(e.target.value)}
                                    className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-xs font-mono focus:border-intelligence focus:outline-none" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Size</label>
                        <div className="flex rounded-lg bg-gray-800 border border-gray-700 p-1">
                            {(['sm', 'md', 'lg'] as const).map(s => (
                                <button key={s} type="button" onClick={() => setSize(s)}
                                    className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                                        size === s ? 'bg-intelligence text-obsidian' : 'text-gray-400 hover:text-white'
                                    }`}>
                                    {s === 'sm' ? 'Small' : s === 'md' ? 'Medium' : 'Large'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Alignment</label>
                        <div className="flex rounded-lg bg-gray-800 border border-gray-700 p-1">
                            {(['left', 'center', 'right'] as const).map(a => (
                                <button key={a} type="button" onClick={() => setAlign(a)}
                                    className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                                        align === a ? 'bg-intelligence text-obsidian' : 'text-gray-400 hover:text-white'
                                    }`}>
                                    {a.charAt(0).toUpperCase() + a.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Live Preview */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Preview</label>
                        <div className="p-4 rounded-lg bg-white border border-gray-700" style={{ textAlign: align }}>
                            <span style={{
                                display: 'inline-block',
                                padding: size === 'sm' ? '8px 16px' : size === 'lg' ? '16px 36px' : '12px 28px',
                                fontSize: size === 'sm' ? '13px' : size === 'lg' ? '17px' : '15px',
                                backgroundColor: bgColor,
                                color: textColor,
                                borderRadius: '8px',
                                fontWeight: 600,
                                letterSpacing: '0.5px',
                            }}>
                                {text || 'Button Text'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                    <button type="button" onClick={onClose}
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm">
                        Cancel
                    </button>
                    <button type="button" onClick={handleInsert} disabled={!text.trim() || !href.trim()}
                        className="px-5 py-2 bg-intelligence text-obsidian rounded-lg font-semibold text-sm hover:bg-intelligence-light transition-colors disabled:opacity-50">
                        Insert Button
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ================================================================== */
/*  Modal: Video Embed                                                 */
/* ================================================================== */

function resolveYouTubeEmbedUrl(input: string): string | null {
    const raw = input.trim()
    if (!raw) return null

    try {
        const url = new URL(raw)

        if (url.hostname === 'youtu.be') {
            const id = url.pathname.replace('/', '').split('/')[0]
            return id ? `https://www.youtube.com/embed/${id}` : null
        }

        if (url.hostname.includes('youtube.com')) {
            const idFromQuery = url.searchParams.get('v')
            if (idFromQuery) return `https://www.youtube.com/embed/${idFromQuery}`

            const path = url.pathname
            if (path.startsWith('/embed/')) {
                const id = path.split('/')[2]
                return id ? `https://www.youtube.com/embed/${id}` : null
            }
            if (path.startsWith('/shorts/')) {
                const id = path.split('/')[2]
                return id ? `https://www.youtube.com/embed/${id}` : null
            }
        }
    } catch {
        return null
    }

    return null
}

function VideoEmbedModal({ open, onClose, onInsert }: {
    open: boolean; onClose: () => void; onInsert: (embedUrl: string) => void
}) {
    const [url, setUrl] = useState('')
    const [error, setError] = useState('')

    const handleInsert = () => {
        const embedUrl = resolveYouTubeEmbedUrl(url)
        if (!embedUrl) {
            setError('Please enter a valid YouTube URL.')
            return
        }
        onInsert(embedUrl)
        setUrl('')
        setError('')
        onClose()
    }

    if (!open) return null

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-white font-semibold text-lg mb-4">Embed Video (YouTube)</h3>

                <div className="space-y-3">
                    <input
                        type="text"
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value)
                            if (error) setError('')
                        }}
                        placeholder="Paste YouTube URL (https://youtu.be/... or https://youtube.com/watch?v=...)"
                        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-intelligence focus:outline-none text-sm"
                    />
                    <p className="text-xs text-gray-500">
                        Supported: `youtube.com/watch?v=...`, `youtu.be/...`, `youtube.com/shorts/...`
                    </p>
                </div>

                {error && (
                    <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleInsert}
                        className="px-5 py-2 bg-intelligence text-obsidian rounded-lg font-semibold text-sm hover:bg-intelligence-light transition-colors"
                    >
                        Insert Video
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ================================================================== */
/*  Modal: Find & Replace                                              */
/* ================================================================== */

function FindReplaceBar({ editor, open, onClose }: {
    editor: Editor; open: boolean; onClose: () => void
}) {
    const [findText, setFindText] = useState('')
    const [replaceText, setReplaceText] = useState('')
    const [matchCount, setMatchCount] = useState(0)

    const doFind = useCallback(() => {
        if (!findText.trim()) { setMatchCount(0); return }
        const content = editor.getText()
        const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
        const matches = content.match(regex)
        setMatchCount(matches?.length || 0)
    }, [findText, editor])

    useEffect(() => { doFind() }, [findText, doFind])

    const handleReplace = () => {
        if (!findText.trim()) return
        const html = editor.getHTML()
        const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
        const newHtml = html.replace(regex, replaceText)
        editor.commands.setContent(newHtml)
    }

    const handleReplaceAll = () => {
        if (!findText.trim()) return
        const html = editor.getHTML()
        const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
        const newHtml = html.replace(regex, replaceText)
        editor.commands.setContent(newHtml)
        setMatchCount(0)
    }

    if (!open) return null

    return (
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-gray-900/95 border-t border-yellow-500/20">
            <Search className="h-4 w-4 text-yellow-400 flex-shrink-0" />
            <input type="text" value={findText} onChange={e => setFindText(e.target.value)}
                placeholder="Find..." className="px-2.5 py-1.5 bg-gray-800 border border-gray-700 rounded text-white text-xs w-40 focus:border-intelligence focus:outline-none" />
            <Replace className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <input type="text" value={replaceText} onChange={e => setReplaceText(e.target.value)}
                placeholder="Replace..." className="px-2.5 py-1.5 bg-gray-800 border border-gray-700 rounded text-white text-xs w-40 focus:border-intelligence focus:outline-none" />
            <button type="button" onClick={handleReplace} className="px-2.5 py-1.5 rounded text-xs bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600">Replace</button>
            <button type="button" onClick={handleReplaceAll} className="px-2.5 py-1.5 rounded text-xs bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600">Replace All</button>
            {findText && <span className="text-xs text-gray-400">{matchCount} found</span>}
            <button type="button" onClick={onClose} className="ml-auto text-gray-500 hover:text-white text-xs">✕</button>
        </div>
    )
}

/* ================================================================== */
/*  Modal: Shape Insert                                                */
/* ================================================================== */

function generateShapeSvgDataUri(
    shapeType: string, fillColor: string, outlineColor: string, outlineWidth: string,
    outlineStyle: string, shapeText: string
): string {
    const sw = parseInt(outlineWidth)
    const dashArray = outlineStyle === 'dashed' ? 'stroke-dasharray="8,4"' : outlineStyle === 'dotted' ? 'stroke-dasharray="2,3"' : ''
    const fillBg = fillColor + '30'
    const textEl = shapeText ? `<text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" fill="${outlineColor}" font-size="14" font-family="Arial,sans-serif">${shapeText.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</text>` : ''

    let svg = ''
    switch (shapeType) {
        case 'rectangle':
            svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100" viewBox="0 0 300 100"><rect x="${sw}" y="${sw}" width="${300-sw*2}" height="${100-sw*2}" fill="${fillBg}" stroke="${outlineColor}" stroke-width="${sw}" ${dashArray}/>${textEl}</svg>`
            break
        case 'circle':
            svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="${58-sw}" fill="${fillBg}" stroke="${outlineColor}" stroke-width="${sw}" ${dashArray}/>${textEl}</svg>`
            break
        case 'triangle':
            svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="104" viewBox="0 0 120 104"><polygon points="60,${sw} ${118-sw},${102-sw} ${sw+2},${102-sw}" fill="${fillBg}" stroke="${outlineColor}" stroke-width="${sw}" stroke-linejoin="round" ${dashArray}/></svg>`
            break
        case 'rounded-box':
            svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="100" viewBox="0 0 300 100"><rect x="${sw}" y="${sw}" width="${300-sw*2}" height="${100-sw*2}" rx="16" ry="16" fill="${fillBg}" stroke="${outlineColor}" stroke-width="${sw}" ${dashArray}/>${textEl}</svg>`
            break
    }
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

function ShapeInsertModal({ open, onClose, onInsert, editor }: {
    open: boolean; onClose: () => void; onInsert: (html: string) => void; editor: Editor
}) {
    const [shapeType, setShapeType] = useState<'divider' | 'rectangle' | 'circle' | 'triangle' | 'rounded-box'>('divider')
    const [fillColor, setFillColor] = useState('#D4AF37')
    const [outlineColor, setOutlineColor] = useState('#D4AF37')
    const [outlineWidth, setOutlineWidth] = useState('2')
    const [outlineStyle, setOutlineStyle] = useState<'solid' | 'dashed' | 'dotted'>('solid')
    const [shapeText, setShapeText] = useState('')
    const [dividerStyle, setDividerStyle] = useState<'gradient' | 'solid' | 'dashed' | 'dotted' | 'double'>('gradient')

    const shapes = [
        { id: 'divider' as const, label: 'Divider', icon: SeparatorHorizontal },
        { id: 'rectangle' as const, label: 'Rectangle', icon: Square },
        { id: 'circle' as const, label: 'Circle', icon: Circle },
        { id: 'triangle' as const, label: 'Triangle', icon: Triangle },
        { id: 'rounded-box' as const, label: 'Rounded Box', icon: RectangleHorizontal },
    ]

    const handleInsert = () => {
        if (shapeType === 'divider') {
            const borderMap: Record<string, string> = {
                gradient: `border:none;height:3px;background:linear-gradient(to right, transparent, ${fillColor}, transparent);`,
                solid: `border:none;border-top:3px solid ${fillColor};`,
                dashed: `border:none;border-top:3px dashed ${fillColor};`,
                dotted: `border:none;border-top:3px dotted ${fillColor};`,
                double: `border:none;border-top:4px double ${fillColor};`,
            }
            const hrHtml = `<img src="data:image/svg+xml;charset=utf-8,${encodeURIComponent(
                `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='6'><rect width='600' height='6' fill='${fillColor}' opacity='0.3' rx='3'/><rect x='50' width='500' height='6' fill='${fillColor}' rx='3'/></svg>`
            )}" alt="divider" style="width:100%;height:auto;margin:24px 0;${borderMap[dividerStyle] || ''}" />`
            if (dividerStyle === 'gradient') {
                const svgDivider = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='4'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='0'><stop offset='0%' stop-color='${fillColor}' stop-opacity='0'/><stop offset='50%' stop-color='${fillColor}' stop-opacity='1'/><stop offset='100%' stop-color='${fillColor}' stop-opacity='0'/></linearGradient></defs><rect width='800' height='4' fill='url(%23g)' rx='2'/></svg>`
                editor.chain().focus().insertContent({
                    type: 'image',
                    attrs: { src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgDivider)}`, width: '100%', align: 'center' },
                }).run()
            } else {
                const lineH = dividerStyle === 'double' ? '6' : '3'
                const svgLine = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='${lineH}'><line x1='0' y1='${parseInt(lineH)/2}' x2='800' y2='${parseInt(lineH)/2}' stroke='${fillColor}' stroke-width='${lineH}' ${dividerStyle === 'dashed' ? "stroke-dasharray='12,6'" : dividerStyle === 'dotted' ? "stroke-dasharray='3,4'" : dividerStyle === 'double' ? "stroke-width='1'" : ''}/>${dividerStyle === 'double' ? `<line x1='0' y1='1' x2='800' y2='1' stroke='${fillColor}' stroke-width='1'/><line x1='0' y1='5' x2='800' y2='5' stroke='${fillColor}' stroke-width='1'/>` : ''}</svg>`
                editor.chain().focus().insertContent({
                    type: 'image',
                    attrs: { src: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgLine)}`, width: '100%', align: 'center' },
                }).run()
            }
        } else {
            const dataUri = generateShapeSvgDataUri(shapeType, fillColor, outlineColor, outlineWidth, outlineStyle, shapeText)
            const w = shapeType === 'circle' || shapeType === 'triangle' ? '120px' : '50%'
            editor.chain().focus().insertContent({
                type: 'image',
                attrs: { src: dataUri, width: w, align: 'center' },
            }).run()
        }
        onClose()
    }

    if (!open) return null

    const previewUri = shapeType !== 'divider' ? generateShapeSvgDataUri(shapeType, fillColor, outlineColor, outlineWidth, outlineStyle, shapeText) : ''

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="text-white font-semibold text-lg mb-4">Insert Shape / Divider</h3>

                <div className="grid grid-cols-5 gap-2 mb-5">
                    {shapes.map(s => (
                        <button key={s.id} type="button" onClick={() => setShapeType(s.id)}
                            className={`flex flex-col items-center p-3 rounded-lg border text-xs transition-colors ${
                                shapeType === s.id ? 'border-intelligence bg-intelligence/10 text-intelligence' : 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
                            }`}>
                            <s.icon className="h-5 w-5 mb-1" />
                            {s.label}
                        </button>
                    ))}
                </div>

                {shapeType === 'divider' && (
                    <div className="mb-4">
                        <label className="block text-xs text-gray-400 mb-2">Divider Style</label>
                        <div className="grid grid-cols-5 gap-2">
                            {(['gradient','solid','dashed','dotted','double'] as const).map(ds => (
                                <button key={ds} type="button" onClick={() => setDividerStyle(ds)}
                                    className={`px-2 py-1.5 rounded text-xs border transition-colors ${
                                        dividerStyle === ds ? 'border-intelligence bg-intelligence/10 text-intelligence' : 'border-gray-700 text-gray-400 hover:text-white'
                                    }`}>
                                    {ds.charAt(0).toUpperCase() + ds.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {shapeType !== 'divider' && shapeType !== 'triangle' && (
                    <div className="space-y-3 mb-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Text inside shape</label>
                            <input type="text" value={shapeText} onChange={e => setShapeText(e.target.value)}
                                placeholder="Optional text..." className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:border-intelligence focus:outline-none" />
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">{shapeType === 'divider' ? 'Color' : 'Fill Color'}</label>
                        <div className="flex items-center gap-2">
                            <input type="color" value={fillColor} onChange={e => setFillColor(e.target.value)}
                                className="h-8 w-8 rounded border border-gray-700 bg-gray-800 cursor-pointer" />
                            <input type="text" value={fillColor} onChange={e => setFillColor(e.target.value)}
                                className="flex-1 px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-white text-xs font-mono focus:border-intelligence focus:outline-none" />
                        </div>
                    </div>
                    {shapeType !== 'divider' && (
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Outline Color</label>
                            <div className="flex items-center gap-2">
                                <input type="color" value={outlineColor} onChange={e => setOutlineColor(e.target.value)}
                                    className="h-8 w-8 rounded border border-gray-700 bg-gray-800 cursor-pointer" />
                                <input type="text" value={outlineColor} onChange={e => setOutlineColor(e.target.value)}
                                    className="flex-1 px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-white text-xs font-mono focus:border-intelligence focus:outline-none" />
                            </div>
                        </div>
                    )}
                </div>

                {shapeType !== 'divider' && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Outline Width</label>
                            <select value={outlineWidth} onChange={e => setOutlineWidth(e.target.value)}
                                className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-white text-xs focus:border-intelligence focus:outline-none">
                                {['1','2','3','4','5'].map(w => <option key={w} value={w}>{w}px</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Border Style</label>
                            <select value={outlineStyle} onChange={e => setOutlineStyle(e.target.value as 'solid' | 'dashed' | 'dotted')}
                                className="w-full px-2 py-1.5 bg-gray-800 border border-gray-700 rounded text-white text-xs focus:border-intelligence focus:outline-none">
                                <option value="solid">Solid</option>
                                <option value="dashed">Dashed</option>
                                <option value="dotted">Dotted</option>
                            </select>
                        </div>
                    </div>
                )}

                {/* Preview */}
                <div className="p-4 rounded-lg bg-white border border-gray-700 mb-4 flex items-center justify-center min-h-[80px]">
                    {shapeType === 'divider' && (
                        <div style={{
                            width: '80%',
                            height: dividerStyle === 'double' ? '4px' : '3px',
                            ...(dividerStyle === 'gradient' ? { background: `linear-gradient(to right, transparent, ${fillColor}, transparent)` } :
                                dividerStyle === 'double' ? { borderTop: `4px double ${fillColor}` } :
                                { borderTop: `3px ${dividerStyle} ${fillColor}` }),
                        }} />
                    )}
                    {shapeType !== 'divider' && previewUri && (
                        <img src={previewUri} alt={shapeType} style={{ maxWidth: '60%', height: 'auto' }} />
                    )}
                </div>

                <div className="flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm">Cancel</button>
                    <button type="button" onClick={handleInsert}
                        className="px-5 py-2 bg-intelligence text-obsidian rounded-lg font-semibold text-sm hover:bg-intelligence-light transition-colors">
                        Insert Shape
                    </button>
                </div>
            </div>
        </div>
    )
}

/* ================================================================== */
/*  Line Spacing Dropdown                                              */
/* ================================================================== */

function LineSpacingDropdown({ editor }: { editor: Editor }) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const applySpacing = (value: string) => {
        if (!value) {
            editor.chain().focus().unsetLineHeight().run()
        } else {
            editor.chain().focus().setLineHeight(value).run()
        }
        setOpen(false)
    }

    return (
        <div className="relative" ref={ref}>
            <button type="button" onClick={() => setOpen(!open)} title="Line Height"
                className="flex items-center p-1.5 rounded text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                <SlidersHorizontal className="h-4 w-4" />
                <ChevronDown className="h-3 w-3 ml-0.5" />
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 min-w-[120px]">
                    <p className="px-3 pt-2 pb-1 text-[10px] text-gray-500 font-semibold uppercase">Line Height</p>
                    <div className="py-1">
                        {LINE_HEIGHT_OPTIONS.map(s => (
                            <button key={s.value} type="button" onClick={() => applySpacing(s.value)}
                                className="block w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

/* ================================================================== */
/*  Case Change Dropdown                                               */
/* ================================================================== */

function CaseChangeDropdown({ editor }: { editor: Editor }) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const applyCase = (caseType: 'upper' | 'lower' | 'title' | 'sentence') => {
        const { from, to } = editor.state.selection
        if (from === to) { setOpen(false); return }

        const selectedText = editor.state.doc.textBetween(from, to, ' ')
        let transformed = selectedText

        switch (caseType) {
            case 'upper': transformed = selectedText.toUpperCase(); break
            case 'lower': transformed = selectedText.toLowerCase(); break
            case 'title': transformed = selectedText.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()); break
            case 'sentence': transformed = selectedText.charAt(0).toUpperCase() + selectedText.slice(1).toLowerCase(); break
        }

        editor.chain().focus().insertContentAt({ from, to }, transformed).run()
        setOpen(false)
    }

    return (
        <div className="relative" ref={ref}>
            <button type="button" onClick={() => setOpen(!open)} title="Change Case"
                className="flex items-center p-1.5 rounded text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                <CaseSensitive className="h-4 w-4" />
                <ChevronDown className="h-3 w-3 ml-0.5" />
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 min-w-[140px]">
                    <div className="py-1">
                        <button type="button" onClick={() => applyCase('sentence')} className="block w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700 hover:text-white">Sentence case</button>
                        <button type="button" onClick={() => applyCase('upper')} className="block w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700 hover:text-white">UPPERCASE</button>
                        <button type="button" onClick={() => applyCase('lower')} className="block w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700 hover:text-white">lowercase</button>
                        <button type="button" onClick={() => applyCase('title')} className="block w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700 hover:text-white">Title Case</button>
                    </div>
                </div>
            )}
        </div>
    )
}

/* ================================================================== */
/*  Styles Pane Dropdown                                               */
/* ================================================================== */

function StylesDropdown({ editor }: { editor: Editor }) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const styles = [
        { label: 'Normal Text', action: () => editor.chain().focus().setParagraph().run() },
        { label: 'Title', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
        { label: 'Heading 1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
        { label: 'Heading 2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
        { label: 'Heading 3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
        { label: 'Heading 4', action: () => editor.chain().focus().toggleHeading({ level: 4 }).run() },
        { label: 'Quote', action: () => editor.chain().focus().toggleBlockquote().run() },
        { label: 'Code Block', action: () => editor.chain().focus().toggleCodeBlock().run() },
    ]

    return (
        <div className="relative" ref={ref}>
            <button type="button" onClick={() => setOpen(!open)} title="Quick Styles"
                className="flex items-center px-2 py-1.5 rounded text-gray-300 hover:bg-gray-700 hover:text-white transition-colors text-xs border border-gray-700 min-w-[70px] justify-between">
                <span>Styles</span>
                <ChevronDown className="h-3 w-3 ml-1" />
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 min-w-[150px]">
                    <div className="py-1">
                        {styles.map(s => (
                            <button key={s.label} type="button" onClick={() => { s.action(); setOpen(false) }}
                                className="block w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

/* ================================================================== */
/*  Layout Blocks Modal                                                */
/* ================================================================== */

function LayoutBlockModal({ open, onClose, editor }: {
    open: boolean; onClose: () => void; editor: Editor
}) {
    if (!open) return null

    const insertBlock = (block: typeof LAYOUT_BLOCKS[0]) => {
        editor.chain().focus().insertContent(
            `<blockquote style="border-left:4px solid ${block.border};background:${block.bg};padding:16px 20px;border-radius:0 8px 8px 0;margin:16px 0;color:${block.textColor};"><p>${block.icon} <strong>${block.label}</strong></p><p>Type your content here...</p></blockquote>`
        ).run()
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-white font-semibold text-lg mb-4">Insert Layout Block</h3>
                <div className="grid grid-cols-2 gap-3">
                    {LAYOUT_BLOCKS.map(block => (
                        <button key={block.id} type="button" onClick={() => insertBlock(block)}
                            className="flex items-center gap-3 p-4 rounded-xl border border-gray-700 hover:border-gray-500 transition-colors text-left">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg" style={{ background: block.bg, border: `2px solid ${block.border}` }}>
                                {block.icon}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-white">{block.label}</p>
                                <p className="text-xs text-gray-500">Container with styled background</p>
                            </div>
                        </button>
                    ))}
                </div>
                <div className="flex justify-end mt-5">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm">Cancel</button>
                </div>
            </div>
        </div>
    )
}

/* ================================================================== */
/*  Callout Modal                                                      */
/* ================================================================== */

function CalloutModal({ open, onClose, editor }: {
    open: boolean; onClose: () => void; editor: Editor
}) {
    if (!open) return null

    const insertCallout = (callout: typeof CALLOUT_TYPES[0]) => {
        editor.chain().focus().insertContent(
            `<blockquote style="border-left:4px solid ${callout.border};background:${callout.bg};padding:16px 20px;border-radius:0 8px 8px 0;margin:16px 0;"><p><strong>${callout.icon} ${callout.label}</strong></p><p>${callout.text}</p></blockquote>`
        ).run()
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h3 className="text-white font-semibold text-lg mb-4">Insert Callout</h3>
                <div className="grid grid-cols-2 gap-3">
                    {CALLOUT_TYPES.map(c => (
                        <button key={c.id} type="button" onClick={() => insertCallout(c)}
                            className="flex items-center gap-3 p-3 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors text-left">
                            <span className="text-xl">{c.icon}</span>
                            <div>
                                <p className="text-sm font-semibold text-white">{c.label}</p>
                                <p className="text-[10px] text-gray-500">{c.text}</p>
                            </div>
                        </button>
                    ))}
                </div>
                <div className="flex justify-end mt-5">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm">Cancel</button>
                </div>
            </div>
        </div>
    )
}

/* ================================================================== */
/*  Status Label Modal                                                 */
/* ================================================================== */

function StatusLabelModal({ open, onClose, editor }: {
    open: boolean; onClose: () => void; editor: Editor
}) {
    const [customLabel, setCustomLabel] = useState('')

    if (!open) return null

    const insertLabel = (label: string, bg: string, color: string) => {
        editor.chain().focus().insertContent(
            `<span style="display:inline-block;padding:2px 10px;border-radius:12px;font-size:12px;font-weight:600;background:${bg};color:${color};letter-spacing:0.5px;">${label}</span>&nbsp;`
        ).run()
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <h3 className="text-white font-semibold text-lg mb-4">Insert Status Label</h3>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {STATUS_LABELS.map(s => (
                        <button key={s.label} type="button" onClick={() => insertLabel(s.label, s.bg, s.color)}
                            className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2 mb-4">
                    <input type="text" value={customLabel} onChange={e => setCustomLabel(e.target.value)}
                        placeholder="Custom label..." className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:border-intelligence focus:outline-none" />
                    <button type="button" onClick={() => { if (customLabel.trim()) insertLabel(customLabel, '#D4AF37', '#000000') }}
                        disabled={!customLabel.trim()}
                        className="px-3 py-2 bg-intelligence text-obsidian rounded-lg font-semibold text-xs hover:bg-intelligence-light transition-colors disabled:opacity-50">Add</button>
                </div>
                <div className="flex justify-end">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm">Cancel</button>
                </div>
            </div>
        </div>
    )
}

/* ================================================================== */
/*  Document Preset Modal                                              */
/* ================================================================== */

function DocumentPresetModal({ open, onClose, editor, onToggleNumbering, numberingEnabled }: {
    open: boolean; onClose: () => void; editor: Editor; onToggleNumbering: () => void; numberingEnabled: boolean
}) {
    if (!open) return null

    const applyPreset = (presetId: string) => {
        switch (presetId) {
            case 'report':
                editor.chain().focus().setFontFamily('Arial').run()
                break
            case 'article':
                editor.chain().focus().setFontFamily('Georgia').run()
                break
            case 'legal':
                editor.chain().focus().setFontFamily('Times New Roman').run()
                break
            case 'memo':
                editor.chain().focus().setFontFamily('Helvetica').run()
                break
        }
        onClose()
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <h3 className="text-white font-semibold text-lg mb-4">Document Structure</h3>

                <div className="mb-5">
                    <label className="flex items-center justify-between p-3 rounded-lg border border-gray-700 cursor-pointer hover:border-gray-500 transition-colors">
                        <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-white">Section Numbering</span>
                        </div>
                        <button type="button" onClick={onToggleNumbering}
                            className={`w-10 h-5 rounded-full transition-colors relative ${numberingEnabled ? 'bg-intelligence' : 'bg-gray-700'}`}>
                            <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${numberingEnabled ? 'left-5' : 'left-0.5'}`} />
                        </button>
                    </label>
                </div>

                <p className="text-xs text-gray-500 mb-3">Document Presets (applies font)</p>
                <div className="space-y-2">
                    {DOCUMENT_PRESETS.map(p => (
                        <button key={p.id} type="button" onClick={() => applyPreset(p.id)}
                            className="flex items-center gap-3 w-full p-3 rounded-lg border border-gray-700 hover:border-gray-500 transition-colors text-left">
                            <span className="text-lg">{p.label.split(' ')[0]}</span>
                            <div>
                                <p className="text-sm text-white">{p.label.split(' ').slice(1).join(' ')}</p>
                                <p className="text-[10px] text-gray-500">{p.desc}</p>
                            </div>
                        </button>
                    ))}
                </div>
                <div className="flex justify-end mt-5">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm">Close</button>
                </div>
            </div>
        </div>
    )
}

/* ================================================================== */
/*  Letter Spacing Dropdown                                            */
/* ================================================================== */

function LetterSpacingDropdown({ editor }: { editor: Editor }) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    return (
        <div className="relative" ref={ref}>
            <button type="button" onClick={() => setOpen(!open)} title="Letter Spacing"
                className="flex items-center p-1.5 rounded text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                <Type className="h-4 w-4" />
                <ChevronDown className="h-3 w-3 ml-0.5" />
            </button>
            {open && (
                <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50 min-w-[140px]">
                    <p className="px-3 pt-2 pb-1 text-[10px] text-gray-500 font-semibold uppercase">Letter Spacing</p>
                    <div className="py-1">
                        {LETTER_SPACING_OPTIONS.map(s => (
                            <button key={s.value} type="button"
                                onClick={() => {
                                    if (!s.value) editor.chain().focus().unsetLetterSpacing().run()
                                    else editor.chain().focus().setLetterSpacing(s.value).run()
                                    setOpen(false)
                                }}
                                className="block w-full text-left px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-700 hover:text-white transition-colors">
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

/* ================================================================== */
/*  Main Editor Component                                              */
/* ================================================================== */

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const [showTableModal, setShowTableModal] = useState(false)
    const [showImageModal, setShowImageModal] = useState(false)
    const [showCTAModal, setShowCTAModal] = useState(false)
    const [showVideoModal, setShowVideoModal] = useState(false)
    const [showShapeModal, setShowShapeModal] = useState(false)
    const [showFindReplace, setShowFindReplace] = useState(false)
    const [showLayoutModal, setShowLayoutModal] = useState(false)
    const [showCalloutModal, setShowCalloutModal] = useState(false)
    const [showStatusModal, setShowStatusModal] = useState(false)
    const [showPresetModal, setShowPresetModal] = useState(false)
    const [tableStyle, setTableStyle] = useState('bordered')
    const [sectionNumbering, setSectionNumbering] = useState(false)

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
            Underline,
            TextStyle,
            FontSize,
            LetterSpacing,
            LineHeight,
            Color,
            FontFamily,
            Highlight.configure({ multicolor: true }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
            }),
            EnhancedImage.configure({
                HTMLAttributes: { class: 'editor-image' },
                allowBase64: true,
            }),
            Table.configure({ resizable: true }),
            TableRow,
            TableCell,
            TableHeader,
            Subscript,
            Superscript,
            TaskList,
            TaskItem.configure({ nested: true }),
            Placeholder.configure({ placeholder: placeholder || 'Start writing your content...' }),
        ],
        content,
        onUpdate: ({ editor: e }) => onChange(e.getHTML()),
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none focus:outline-none min-h-[600px] p-8 text-gray-900',
            },
        },
    })

    useEffect(() => {
        if (!editor) return

        // Keep editor content in sync when parent loads/switches entries.
        if (content !== editor.getHTML()) {
            editor.commands.setContent(content || '', { emitUpdate: false })
        }
    }, [content, editor])

    const manageLink = useCallback(() => {
        if (!editor) return
        promptForLink(editor)
    }, [editor])

    useEffect(() => {
        if (!editor) return

        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault()
                promptForLink(editor)
            }
        }

        const dom = editor.view.dom
        dom.addEventListener('keydown', handleKeyDown)
        return () => dom.removeEventListener('keydown', handleKeyDown)
    }, [editor])

    const insertImage = useCallback((url: string, width?: string) => {
        if (!editor) return
        editor.chain().focus().insertContent({
            type: 'image',
            attrs: {
                src: url,
                width: width || '100%',
                align: 'center',
            },
        }).run()
    }, [editor])

    const insertTable = useCallback((rows: number, cols: number) => {
        if (!editor) return
        editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run()
    }, [editor])

    const insertCTA = useCallback((html: string) => {
        if (!editor) return
        editor.chain().focus().insertContent(html).run()
    }, [editor])

    const insertShape = useCallback((html: string) => {
        if (!editor) return
        editor.chain().focus().insertContent(html).run()
    }, [editor])

    const insertVideo = useCallback((embedUrl: string) => {
        if (!editor) return
        const html = `
            <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin:24px 0;border-radius:12px;">
                <iframe
                    src="${embedUrl}"
                    style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                ></iframe>
            </div>
        `
        editor.chain().focus().insertContent(html).run()
    }, [editor])

    if (!editor) return <div className="h-[700px] bg-gray-800 rounded-xl animate-pulse" />

    const currentHeading = editor.isActive('heading', { level: 1 }) ? '1'
        : editor.isActive('heading', { level: 2 }) ? '2'
        : editor.isActive('heading', { level: 3 }) ? '3'
        : editor.isActive('heading', { level: 4 }) ? '4'
        : '0'

    const activeTextStyle = editor.getAttributes('textStyle') as { fontFamily?: string; fontSize?: string }
    const currentFontFamily = activeTextStyle.fontFamily || ''
    const currentFontSize = activeTextStyle.fontSize || ''

    const plainText = editor.getText().trim()
    const wordCount = plainText ? plainText.split(/\s+/).length : 0
    const charCount = plainText.length

    const isInTable = editor.isActive('table')
    const isImageActive = editor.isActive('image')
    const activeImageAttrs = editor.getAttributes('image') as { width?: string; align?: 'left' | 'center' | 'right' }
    const activeImageWidth = activeImageAttrs.width || '100%'
    const activeImageAlign = activeImageAttrs.align || 'center'

    const imageWidthPercent = (() => {
        const match = /^(\d{1,3})%$/.exec(activeImageWidth)
        if (!match) return 100
        const parsed = Number(match[1])
        if (!Number.isFinite(parsed)) return 100
        return Math.min(100, Math.max(20, parsed))
    })()

    return (
        <div className="rounded-xl border border-gray-700 overflow-visible">
            <div className="sticky top-0 z-40 border-b border-gray-700 bg-gray-800/95 backdrop-blur shadow-lg">
                {/* Toolbar Row 1 */}
                <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-gray-700">
                    <Dropdown
                        label="Font"
                        options={FONT_OPTIONS}
                        value={currentFontFamily}
                        onChange={(v) => {
                            if (!v) editor.chain().focus().unsetFontFamily().run()
                            else editor.chain().focus().setFontFamily(v).run()
                        }}
                    />
                    <Dropdown
                        label="Size"
                        options={FONT_SIZE_OPTIONS}
                        value={currentFontSize}
                        onChange={(v) => {
                            if (!v) editor.chain().focus().unsetFontSize().run()
                            else editor.chain().focus().setFontSize(v).run()
                        }}
                    />
                    <Dropdown
                        label="Heading"
                        options={[
                            { label: 'Normal', value: '0' },
                            { label: 'Heading 1', value: '1' },
                            { label: 'Heading 2', value: '2' },
                            { label: 'Heading 3', value: '3' },
                            { label: 'Heading 4', value: '4' },
                        ]}
                        value={currentHeading}
                        onChange={(v) => {
                            if (v === '0') editor.chain().focus().setParagraph().run()
                            else editor.chain().focus().toggleHeading({ level: parseInt(v) as 1 | 2 | 3 | 4 }).run()
                        }}
                    />

                    <div className="w-px h-6 bg-gray-700 mx-1" />

                    <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
                        <Bold className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
                        <Italic className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
                        <UnderlineIcon className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
                        <Strikethrough className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleSubscript().run()} active={editor.isActive('subscript')} title="Subscript">
                        <SubIcon className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleSuperscript().run()} active={editor.isActive('superscript')} title="Superscript">
                        <SupIcon className="h-4 w-4" />
                    </ToolbarButton>

                    <div className="w-px h-6 bg-gray-700 mx-1" />

                    <ColorPicker
                        colors={TEXT_COLORS}
                        onSelect={(c) => c ? editor.chain().focus().setColor(c).run() : editor.chain().focus().unsetColor().run()}
                        icon={<Palette className="h-4 w-4" />}
                        title="Text Color"
                    />
                    <ColorPicker
                        colors={HIGHLIGHT_COLORS}
                        onSelect={(c) => c ? editor.chain().focus().setHighlight({ color: c }).run() : editor.chain().focus().unsetHighlight().run()}
                        icon={<Highlighter className="h-4 w-4" />}
                        title="Highlight Color"
                    />

                    <div className="w-px h-6 bg-gray-700 mx-1" />

                    <CaseChangeDropdown editor={editor} />
                    <StylesDropdown editor={editor} />
                </div>

                {/* Toolbar Row 2 */}
                <div className="flex flex-wrap items-center gap-1 px-3 py-2">
                    <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left">
                        <AlignLeft className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align Center">
                        <AlignCenter className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right">
                        <AlignRight className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="Justify">
                        <AlignJustify className="h-4 w-4" />
                    </ToolbarButton>

                    <div className="w-px h-6 bg-gray-700 mx-1" />

                    {/* Indentation */}
                    <ToolbarButton onClick={() => {
                        const dom = editor.view.dom
                        const paras = dom.querySelectorAll('p, h1, h2, h3, h4, li')
                        paras.forEach(p => {
                            const el = p as HTMLElement
                            if (el.contains(window.getSelection()?.anchorNode as Node)) {
                                const current = parseInt(el.style.paddingLeft || '0', 10)
                                el.style.paddingLeft = `${current + 24}px`
                            }
                        })
                    }} title="Increase Indent">
                        <Indent className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => {
                        const dom = editor.view.dom
                        const paras = dom.querySelectorAll('p, h1, h2, h3, h4, li')
                        paras.forEach(p => {
                            const el = p as HTMLElement
                            if (el.contains(window.getSelection()?.anchorNode as Node)) {
                                const current = parseInt(el.style.paddingLeft || '0', 10)
                                el.style.paddingLeft = `${Math.max(0, current - 24)}px`
                            }
                        })
                    }} title="Decrease Indent">
                        <Outdent className="h-4 w-4" />
                    </ToolbarButton>

                    <LineSpacingDropdown editor={editor} />

                    <div className="w-px h-6 bg-gray-700 mx-1" />

                    <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
                        <List className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered List">
                        <ListOrdered className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive('taskList')} title="Task List">
                        <ListChecks className="h-4 w-4" />
                    </ToolbarButton>

                    <div className="w-px h-6 bg-gray-700 mx-1" />

                    <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
                        <Quote className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code">
                        <Code2 className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block">
                        <Code className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
                        <Minus className="h-4 w-4" />
                    </ToolbarButton>

                    <div className="w-px h-6 bg-gray-700 mx-1" />

                    <ToolbarButton onClick={manageLink} active={editor.isActive('link')} title="Insert/Edit Link">
                        <LinkIcon className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive('link')} title="Remove Link">
                        <Unlink className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => setShowImageModal(true)} title="Insert Image (Upload or URL)">
                        <ImageIcon className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => setShowTableModal(true)} title="Insert Table">
                        <TableIcon className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => setShowVideoModal(true)} title="Insert YouTube Video">
                        <Video className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => setShowCTAModal(true)} title="Insert CTA Button">
                        <ArrowRight className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => setShowShapeModal(true)} title="Insert Shape">
                        <Shapes className="h-4 w-4" />
                    </ToolbarButton>

                    <div className="w-px h-6 bg-gray-700 mx-1" />

                    <ToolbarButton onClick={() => setShowFindReplace(!showFindReplace)} active={showFindReplace} title="Find & Replace (Ctrl+H)">
                        <Search className="h-4 w-4" />
                    </ToolbarButton>

                    <div className="w-px h-6 bg-gray-700 mx-1" />

                    <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
                        <Undo2 className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
                        <Redo2 className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear Formatting">
                        <RemoveFormatting className="h-4 w-4" />
                    </ToolbarButton>
                </div>

                {/* Toolbar Row 3 — Advanced Features */}
                <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-t border-gray-700/50">
                    <LetterSpacingDropdown editor={editor} />
                    <LineSpacingDropdown editor={editor} />

                    <div className="w-px h-6 bg-gray-700 mx-1" />

                    <ToolbarButton onClick={() => setShowLayoutModal(true)} title="Layout Blocks">
                        <LayoutTemplate className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => setShowCalloutModal(true)} title="Callout Box">
                        <Info className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => setShowStatusModal(true)} title="Status Label">
                        <Tag className="h-4 w-4" />
                    </ToolbarButton>

                    <div className="w-px h-6 bg-gray-700 mx-1" />

                    <ToolbarButton onClick={() => setShowPresetModal(true)} title="Document Structure & Presets">
                        <FileText className="h-4 w-4" />
                    </ToolbarButton>

                    <div className="w-px h-6 bg-gray-700 mx-1" />

                    {isInTable && (
                        <>
                            <span className="text-[10px] text-gray-500 font-semibold">TABLE STYLE:</span>
                            {TABLE_STYLE_PRESETS.map(ts => (
                                <button key={ts.id} type="button"
                                    onClick={() => setTableStyle(ts.id)}
                                    className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                                        tableStyle === ts.id
                                            ? 'border-intelligence bg-intelligence/15 text-intelligence'
                                            : 'border-gray-700 text-gray-400 hover:text-white hover:border-gray-600'
                                    }`}>
                                    {ts.label}
                                </button>
                            ))}
                            <div className="w-px h-6 bg-gray-700 mx-1" />
                            <span className="text-[10px] text-gray-500 font-semibold">VERT ALIGN:</span>
                            <ToolbarButton onClick={() => {
                                const cell = editor.view.dom.querySelector('.selectedCell, td:focus-within, th:focus-within') as HTMLElement | null
                                if (cell) cell.style.verticalAlign = 'top'
                            }} title="Align Top">
                                <AlignVerticalJustifyStart className="h-3.5 w-3.5" />
                            </ToolbarButton>
                            <ToolbarButton onClick={() => {
                                const cell = editor.view.dom.querySelector('.selectedCell, td:focus-within, th:focus-within') as HTMLElement | null
                                if (cell) cell.style.verticalAlign = 'middle'
                            }} title="Align Middle">
                                <AlignVerticalJustifyCenter className="h-3.5 w-3.5" />
                            </ToolbarButton>
                            <ToolbarButton onClick={() => {
                                const cell = editor.view.dom.querySelector('.selectedCell, td:focus-within, th:focus-within') as HTMLElement | null
                                if (cell) cell.style.verticalAlign = 'bottom'
                            }} title="Align Bottom">
                                <AlignVerticalJustifyEnd className="h-3.5 w-3.5" />
                            </ToolbarButton>
                        </>
                    )}
                </div>

                <div className="px-3 py-1.5 border-t border-gray-700 text-[11px] text-gray-400 flex flex-wrap gap-3">
                    <span><kbd className="px-1 py-0.5 rounded bg-gray-700 text-gray-200">Ctrl/Cmd+B</kbd> Bold</span>
                    <span><kbd className="px-1 py-0.5 rounded bg-gray-700 text-gray-200">Ctrl/Cmd+I</kbd> Italic</span>
                    <span><kbd className="px-1 py-0.5 rounded bg-gray-700 text-gray-200">Ctrl/Cmd+U</kbd> Underline</span>
                    <span><kbd className="px-1 py-0.5 rounded bg-gray-700 text-gray-200">Ctrl/Cmd+K</kbd> Link</span>
                    <span><kbd className="px-1 py-0.5 rounded bg-gray-700 text-gray-200">Ctrl/Cmd+Z</kbd> Undo</span>
                    <span><kbd className="px-1 py-0.5 rounded bg-gray-700 text-gray-200">Ctrl/Cmd+Shift+Z</kbd> Redo</span>
                </div>

                {/* Find & Replace Bar */}
                {showFindReplace && <FindReplaceBar editor={editor} open={showFindReplace} onClose={() => setShowFindReplace(false)} />}

                {/* Table Controls Row (shown only when cursor is in a table) */}
                {isInTable && (
                    <div className="flex flex-wrap items-center gap-1 px-3 py-1.5 bg-gray-900/90 border-t border-intelligence/20">
                        <span className="text-xs text-intelligence font-semibold mr-2">TABLE:</span>
                        <ToolbarButton onClick={() => editor.chain().focus().addRowBefore().run()} title="Add Row Above">
                            <span className="text-xs font-bold">+↑</span>
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().addRowAfter().run()} title="Add Row Below">
                            <span className="text-xs font-bold">+↓</span>
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().deleteRow().run()} title="Delete Row">
                            <span className="text-xs font-bold text-red-400">−Row</span>
                        </ToolbarButton>

                        <div className="w-px h-5 bg-gray-700 mx-1" />

                        <ToolbarButton onClick={() => editor.chain().focus().addColumnBefore().run()} title="Add Column Left">
                            <span className="text-xs font-bold">+←</span>
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().addColumnAfter().run()} title="Add Column Right">
                            <span className="text-xs font-bold">+→</span>
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().deleteColumn().run()} title="Delete Column">
                            <span className="text-xs font-bold text-red-400">−Col</span>
                        </ToolbarButton>

                        <div className="w-px h-5 bg-gray-700 mx-1" />

                        <ToolbarButton onClick={() => editor.chain().focus().mergeCells().run()} title="Merge Cells">
                            <span className="text-xs font-bold">Merge</span>
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().splitCell().run()} title="Split Cell">
                            <span className="text-xs font-bold">Split</span>
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().toggleHeaderRow().run()} title="Toggle Header Row">
                            <span className="text-xs font-bold">Header</span>
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().toggleHeaderColumn().run()} title="Toggle Header Column">
                            <span className="text-xs font-bold">Head Col</span>
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().toggleHeaderCell().run()} title="Toggle Header Cell">
                            <span className="text-xs font-bold">Head Cell</span>
                        </ToolbarButton>
                        <ToolbarButton onClick={() => editor.chain().focus().deleteTable().run()} title="Delete Table">
                            <Trash2 className="h-3.5 w-3.5 text-red-400" />
                        </ToolbarButton>
                    </div>
                )}

                {/* Image Controls Row (shown only when image is selected) */}
                {isImageActive && (
                    <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-gray-900/90 border-t border-blue-500/20">
                        <span className="text-xs text-blue-300 font-semibold mr-1">IMAGE:</span>

                        <div className="flex items-center gap-1">
                            <ToolbarButton
                                onClick={() => editor.chain().focus().updateAttributes('image', { align: 'left' }).run()}
                                active={activeImageAlign === 'left'}
                                title="Align Left"
                            >
                                <AlignLeft className="h-4 w-4" />
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => editor.chain().focus().updateAttributes('image', { align: 'center' }).run()}
                                active={activeImageAlign === 'center'}
                                title="Align Center"
                            >
                                <AlignCenter className="h-4 w-4" />
                            </ToolbarButton>
                            <ToolbarButton
                                onClick={() => editor.chain().focus().updateAttributes('image', { align: 'right' }).run()}
                                active={activeImageAlign === 'right'}
                                title="Align Right"
                            >
                                <AlignRight className="h-4 w-4" />
                            </ToolbarButton>
                        </div>

                        <div className="w-px h-5 bg-gray-700 mx-1" />

                        {['25%', '50%', '75%', '100%', '320px', '480px'].map((size) => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => editor.chain().focus().updateAttributes('image', { width: size }).run()}
                                className={`px-2 py-1 rounded text-[11px] border transition-colors ${
                                    activeImageWidth === size
                                        ? 'border-blue-400 bg-blue-500/15 text-blue-300'
                                        : 'border-gray-700 text-gray-300 hover:border-gray-600 hover:text-white'
                                }`}
                            >
                                {size}
                            </button>
                        ))}

                        <div className="w-px h-5 bg-gray-700 mx-1" />

                        <div className="flex items-center gap-2">
                            <span className="text-[11px] text-gray-400">Resize</span>
                            <input
                                type="range"
                                min={20}
                                max={100}
                                step={5}
                                value={imageWidthPercent}
                                onChange={(e) => {
                                    const pct = Number(e.target.value)
                                    editor.chain().focus().updateAttributes('image', { width: `${pct}%` }).run()
                                }}
                                className="w-28 accent-intelligence"
                            />
                            <span className="text-[11px] text-gray-400 w-12 text-right">
                                {activeImageWidth}
                            </span>
                        </div>
                    </div>
                )}

                {/* Image Editing Controls Row 2 (shown when image selected) */}
                {isImageActive && (
                    <div className="flex flex-wrap items-center gap-2 px-3 py-2 bg-gray-900/90 border-t border-blue-500/10">
                        <span className="text-xs text-blue-200 font-semibold mr-1">EFFECTS:</span>

                        {/* Brightness */}
                        <div className="flex items-center gap-1">
                            <Sun className="h-3.5 w-3.5 text-gray-400" />
                            <input type="range" min={50} max={150} defaultValue={100} step={5}
                                onChange={(e) => {
                                    const img = editor.view.dom.querySelector('img.ProseMirror-selectednode') as HTMLImageElement | null
                                    if (img) img.style.filter = img.style.filter?.replace(/brightness\([^)]*\)/, '') + ` brightness(${Number(e.target.value) / 100})`
                                }}
                                className="w-16 accent-yellow-400" title="Brightness" />
                        </div>

                        {/* Contrast */}
                        <div className="flex items-center gap-1">
                            <Contrast className="h-3.5 w-3.5 text-gray-400" />
                            <input type="range" min={50} max={200} defaultValue={100} step={5}
                                onChange={(e) => {
                                    const img = editor.view.dom.querySelector('img.ProseMirror-selectednode') as HTMLImageElement | null
                                    if (img) img.style.filter = img.style.filter?.replace(/contrast\([^)]*\)/, '') + ` contrast(${Number(e.target.value) / 100})`
                                }}
                                className="w-16 accent-blue-400" title="Contrast" />
                        </div>

                        <div className="w-px h-5 bg-gray-700 mx-1" />

                        {/* Border Radius / Crop to Shape */}
                        <span className="text-[11px] text-gray-400">Shape:</span>
                        {[
                            { label: 'Square', radius: '0' },
                            { label: 'Rounded', radius: '12px' },
                            { label: 'Pill', radius: '999px' },
                            { label: 'Circle', radius: '50%' },
                        ].map(s => (
                            <button key={s.label} type="button"
                                onClick={() => {
                                    const img = editor.view.dom.querySelector('img.ProseMirror-selectednode') as HTMLImageElement | null
                                    if (img) {
                                        img.style.borderRadius = s.radius
                                        img.style.objectFit = s.radius === '50%' ? 'cover' : ''
                                        if (s.radius === '50%') { img.style.aspectRatio = '1'; img.style.objectFit = 'cover' }
                                        else { img.style.aspectRatio = ''; img.style.objectFit = '' }
                                    }
                                }}
                                className="px-2 py-0.5 rounded text-[10px] border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white transition-colors">
                                {s.label}
                            </button>
                        ))}

                        <div className="w-px h-5 bg-gray-700 mx-1" />

                        {/* Picture Style / Effects */}
                        <span className="text-[11px] text-gray-400">Effects:</span>
                        {[
                            { label: 'Shadow', css: '0 4px 24px rgba(0,0,0,0.3)' },
                            { label: 'Glow', css: '0 0 20px rgba(212,175,55,0.4)' },
                            { label: 'None', css: 'none' },
                        ].map(fx => (
                            <button key={fx.label} type="button"
                                onClick={() => {
                                    const img = editor.view.dom.querySelector('img.ProseMirror-selectednode') as HTMLImageElement | null
                                    if (img) img.style.boxShadow = fx.css
                                }}
                                className="px-2 py-0.5 rounded text-[10px] border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white transition-colors">
                                {fx.label}
                            </button>
                        ))}

                        {/* Artistic Filters */}
                        {[
                            { label: 'B&W', filter: 'grayscale(1)' },
                            { label: 'Sepia', filter: 'sepia(1)' },
                            { label: 'Blur', filter: 'blur(2px)' },
                            { label: 'Normal', filter: 'none' },
                        ].map(f => (
                            <button key={f.label} type="button"
                                onClick={() => {
                                    const img = editor.view.dom.querySelector('img.ProseMirror-selectednode') as HTMLImageElement | null
                                    if (img) img.style.filter = f.filter
                                }}
                                className="px-2 py-0.5 rounded text-[10px] border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white transition-colors">
                                {f.label}
                            </button>
                        ))}

                        {/* Border */}
                        <div className="w-px h-5 bg-gray-700 mx-1" />
                        <span className="text-[11px] text-gray-400">Border:</span>
                        {[
                            { label: 'None', border: 'none' },
                            { label: 'Thin', border: '1px solid #ccc' },
                            { label: 'Gold', border: '2px solid #D4AF37' },
                            { label: 'Thick', border: '3px solid #333' },
                        ].map(b => (
                            <button key={b.label} type="button"
                                onClick={() => {
                                    const img = editor.view.dom.querySelector('img.ProseMirror-selectednode') as HTMLImageElement | null
                                    if (img) img.style.border = b.border
                                }}
                                className="px-2 py-0.5 rounded text-[10px] border border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white transition-colors">
                                {b.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Editor Content */}
            <div className="bg-white min-h-[600px]">
                <style>{`
                    .ProseMirror { min-height: 600px; outline: none; color: #1a1a1a; }
                    .ProseMirror p.is-editor-empty:first-child::before {
                        color: #adb5bd; content: attr(data-placeholder); float: left; height: 0; pointer-events: none;
                    }
                    .ProseMirror h1 { font-size: 2em; font-weight: 700; margin: 0.67em 0; }
                    .ProseMirror h2 { font-size: 1.5em; font-weight: 700; margin: 0.75em 0; }
                    .ProseMirror h3 { font-size: 1.25em; font-weight: 600; margin: 0.83em 0; }
                    .ProseMirror h4 { font-size: 1.1em; font-weight: 600; margin: 1em 0; }
                    .ProseMirror ul { list-style: disc; padding-left: 1.5em; }
                    .ProseMirror ol { list-style: decimal; padding-left: 1.5em; }
                    .ProseMirror li { margin: 0.25em 0; }
                    .ProseMirror blockquote { border-left: 4px solid #D4AF37; padding-left: 1em; margin: 1em 0; color: #666; font-style: normal; border-radius: 0 8px 8px 0; padding: 12px 16px; }
                    .ProseMirror pre { background: #1a1a2e; color: #e0e0e0; padding: 1em; border-radius: 8px; overflow-x: auto; }
                    .ProseMirror code { background: #f0f0f0; padding: 0.2em 0.4em; border-radius: 4px; font-size: 0.9em; }
                    .ProseMirror pre code { background: none; padding: 0; }
                    .ProseMirror img { max-width: 100%; height: auto; border-radius: 8px; margin: 1em auto; display: block; cursor: pointer; }
                    .ProseMirror img.ProseMirror-selectednode { outline: 3px solid #D4AF37; outline-offset: 3px; }
                    .ProseMirror hr { border: none; border-top: 2px solid #e0e0e0; margin: 2em 0; }
                    .ProseMirror a { color: #1155CC; text-decoration: underline; }
                    .ProseMirror table { border-collapse: collapse; width: 100%; margin: 1em 0; table-layout: fixed; }
                    .ProseMirror th, .ProseMirror td { border: 1px solid #ccc; padding: ${tableStyle === 'compact' ? '4px 8px' : tableStyle === 'spacious' ? '14px 18px' : '8px 12px'}; text-align: left; position: relative; min-width: 60px; vertical-align: top; }
                    .ProseMirror th { background: #f5f5f5; font-weight: 600; }
                    ${tableStyle === 'striped' ? '.ProseMirror tr:nth-child(even) td { background: #f8f9fa; }' : ''}
                    ${tableStyle === 'minimal' ? '.ProseMirror th, .ProseMirror td { border: none; border-bottom: 1px solid #e0e0e0; }' : ''}
                    .ProseMirror .selectedCell { background: rgba(212,175,55,0.15); }
                    .ProseMirror .column-resize-handle { position: absolute; right: -2px; top: 0; bottom: 0; width: 4px; background: #D4AF37; cursor: col-resize; }
                    .ProseMirror ul[data-type="taskList"] { list-style: none; padding-left: 0; }
                    .ProseMirror ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 8px; }
                    .ProseMirror ul[data-type="taskList"] li label { margin-top: 3px; }
                    .ProseMirror mark { padding: 0.1em 0.2em; border-radius: 2px; }
                    .tableWrapper { overflow-x: auto; margin: 1em 0; }
                    .resize-cursor { cursor: col-resize; }
                    ${sectionNumbering ? `
                    .ProseMirror { counter-reset: h1counter h2counter h3counter h4counter; }
                    .ProseMirror h1 { counter-increment: h1counter; counter-reset: h2counter h3counter h4counter; }
                    .ProseMirror h1::before { content: counter(h1counter) ". "; }
                    .ProseMirror h2 { counter-increment: h2counter; counter-reset: h3counter h4counter; }
                    .ProseMirror h2::before { content: counter(h1counter) "." counter(h2counter) " "; }
                    .ProseMirror h3 { counter-increment: h3counter; counter-reset: h4counter; }
                    .ProseMirror h3::before { content: counter(h1counter) "." counter(h2counter) "." counter(h3counter) " "; }
                    .ProseMirror h4 { counter-increment: h4counter; }
                    .ProseMirror h4::before { content: counter(h1counter) "." counter(h2counter) "." counter(h3counter) "." counter(h4counter) " "; }
                    ` : ''}
                `}</style>
                <BubbleMenu
                    editor={editor}
                    updateDelay={120}
                    options={{ placement: 'top' }}
                    shouldShow={({ editor: e, from, to }) => {
                        if (from === to) return false
                        if (e.isActive('image') || e.isActive('table')) return false
                        return true
                    }}
                    className="flex items-center gap-1 p-1 rounded-lg border border-gray-700 bg-gray-900 shadow-2xl"
                >
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
                        <Bold className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
                        <Italic className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
                        <UnderlineIcon className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code">
                        <Code2 className="h-4 w-4" />
                    </ToolbarButton>
                    <ToolbarButton onClick={manageLink} active={editor.isActive('link')} title="Link">
                        <LinkIcon className="h-4 w-4" />
                    </ToolbarButton>
                </BubbleMenu>
                <EditorContent editor={editor} />
            </div>

            <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-t border-gray-700 text-xs text-gray-400">
                <span>
                    {wordCount} words • {charCount} characters
                </span>
                <span className="text-gray-500">
                    Ribbon is pinned while writing
                </span>
            </div>

            {/* Modals */}
            <TableInsertModal open={showTableModal} onClose={() => setShowTableModal(false)} onInsert={insertTable} />
            <ImageInsertModal open={showImageModal} onClose={() => setShowImageModal(false)} onInsert={insertImage} />
            <VideoEmbedModal open={showVideoModal} onClose={() => setShowVideoModal(false)} onInsert={insertVideo} />
            <CTAButtonModal open={showCTAModal} onClose={() => setShowCTAModal(false)} onInsert={insertCTA} />
            <ShapeInsertModal open={showShapeModal} onClose={() => setShowShapeModal(false)} onInsert={insertShape} editor={editor} />
            <LayoutBlockModal open={showLayoutModal} onClose={() => setShowLayoutModal(false)} editor={editor} />
            <CalloutModal open={showCalloutModal} onClose={() => setShowCalloutModal(false)} editor={editor} />
            <StatusLabelModal open={showStatusModal} onClose={() => setShowStatusModal(false)} editor={editor} />
            <DocumentPresetModal open={showPresetModal} onClose={() => setShowPresetModal(false)} editor={editor}
                onToggleNumbering={() => setSectionNumbering(prev => !prev)} numberingEnabled={sectionNumbering} />
        </div>
    )
}
