'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import ImageExt from '@tiptap/extension-image'
import LinkExt from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import FontFamily from '@tiptap/extension-font-family'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { Extension } from '@tiptap/core'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
    Bold, Italic, Underline as UnderlineIcon, Strikethrough,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    List, ListOrdered, Quote, Minus, Link2, ImageIcon,
    Undo2, Redo2, RemoveFormatting, Code2, Type, Palette,
    Highlighter, Table as TableIcon, Subscript as SubIcon,
    Superscript as SupIcon, ChevronDown, ListChecks, X
} from 'lucide-react'

const FontSize = Extension.create({
    name: 'fontSize',
    addGlobalAttributes() {
        return [{
            types: ['textStyle'],
            attributes: {
                fontSize: {
                    default: null,
                    parseHTML: el => el.style.fontSize?.replace(/['"]+/g, ''),
                    renderHTML: attrs => {
                        if (!attrs.fontSize) return {}
                        return { style: `font-size: ${attrs.fontSize}` }
                    },
                },
            },
        }]
    },
    addCommands() {
        return {
            setFontSize: (size: string) => ({ chain }: { chain: () => { focus: () => { setMark: (mark: string, attrs: Record<string, unknown>) => { run: () => boolean } } } }) => {
                return chain().focus().setMark('textStyle', { fontSize: size }).run()
            },
            unsetFontSize: () => ({ chain }: { chain: () => { focus: () => { setMark: (mark: string, attrs: Record<string, unknown>) => { run: () => boolean } } } }) => {
                return chain().focus().setMark('textStyle', { fontSize: null }).run()
            },
        }
    },
})

const FONTS = [
    'Inter', 'Arial', 'Georgia', 'Times New Roman', 'Courier New',
    'Verdana', 'Trebuchet MS', 'Comic Sans MS', 'Impact', 'Palatino',
    'Garamond', 'Book Antiqua', 'Lucida Console', 'Monaco', 'Tahoma',
]

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px', '36px', '48px', '64px', '72px']

const COLOR_PALETTE = [
    '#000000', '#1A1A1A', '#333333', '#4D4D4D', '#666666', '#808080', '#999999', '#B3B3B3', '#CCCCCC', '#E6E6E6',
    '#F2F2F2', '#FFFFFF', '#FF0000', '#E60000', '#CC0000', '#B30000', '#990000', '#FF3333', '#FF6666', '#FF9999',
    '#FFCCCC', '#FF6600', '#FF8533', '#FFA366', '#FFC299', '#FFE0CC', '#FFD700', '#FFED4A', '#FFF3B0', '#FFFACD',
    '#00FF00', '#00CC00', '#009900', '#006600', '#33FF33', '#66FF66', '#99FF99', '#CCFFCC', '#228B22', '#006400',
    '#2E8B57', '#3CB371', '#0000FF', '#0000CC', '#000099', '#000066', '#3333FF', '#6666FF', '#9999FF', '#CCCCFF',
    '#4169E1', '#1E90FF', '#00BFFF', '#87CEEB', '#800080', '#9B30FF', '#A020F0', '#9370DB', '#8A2BE2', '#DDA0DD',
    '#EE82EE', '#FF69B4', '#FF1493', '#DB7093', '#FFB6C1', '#D4AF37', '#14B8A6', '#059669',
]

interface Props {
    content: string
    onChange: (html: string) => void
    placeholder?: string
}

function DropdownBtn({ label, icon, children, isOpen, onToggle }: {
    label: string
    icon?: React.ReactNode
    children: React.ReactNode
    isOpen: boolean
    onToggle: () => void
}) {
    const ref = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onToggle()
        }
        if (isOpen) document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [isOpen, onToggle])

    return (
        <div className="relative" ref={ref}>
            <button
                type="button"
                onClick={onToggle}
                className="flex items-center gap-1 px-2 py-1.5 rounded text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                title={label}
            >
                {icon}
                <span className="max-w-[80px] truncate text-xs">{label}</span>
                <ChevronDown className="h-3 w-3" />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-1 min-w-[160px] max-h-[300px] overflow-y-auto">
                    {children}
                </div>
            )}
        </div>
    )
}

function ToolBtn({ active, onClick, title, children, disabled }: {
    active?: boolean; onClick: () => void; title: string; children: React.ReactNode; disabled?: boolean
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-1.5 rounded transition-colors ${
                active ? 'bg-intelligence/20 text-intelligence' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
            } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    )
}

export default function RichTextEditor({ content, onChange, placeholder }: Props) {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null)
    const [linkUrl, setLinkUrl] = useState('')
    const [showLinkInput, setShowLinkInput] = useState(false)
    const [imgUrl, setImgUrl] = useState('')
    const [showImgInput, setShowImgInput] = useState(false)

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3, 4, 5, 6] },
            }),
            Underline,
            TextStyle,
            Color,
            FontFamily.configure({ types: ['textStyle'] }),
            FontSize,
            Highlight.configure({ multicolor: true }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            ImageExt.configure({ inline: true }),
            LinkExt.configure({ openOnClick: false }),
            Placeholder.configure({ placeholder: placeholder || 'Start writing your content...' }),
            Subscript,
            Superscript,
            TaskList,
            TaskItem.configure({ nested: true }),
            Table,
            TableRow,
            TableCell,
            TableHeader,
        ],
        content,
        onUpdate: ({ editor: e }) => onChange(e.getHTML()),
        editorProps: {
            attributes: {
                class: 'prose prose-invert prose-lg max-w-none focus:outline-none min-h-[600px] px-12 py-8',
            },
        },
    })

    const toggle = useCallback((key: string) => {
        setOpenDropdown(prev => prev === key ? null : key)
    }, [])

    if (!editor) return null

    const currentFont = editor.getAttributes('textStyle').fontFamily || 'Inter'
    const currentSize = editor.getAttributes('textStyle').fontSize || '16px'

    const headingLevel = (() => {
        for (let i = 1; i <= 6; i++) {
            if (editor.isActive('heading', { level: i })) return `H${i}`
        }
        return 'Paragraph'
    })()

    const insertLink = () => {
        if (linkUrl) {
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
        }
        setLinkUrl('')
        setShowLinkInput(false)
    }

    const insertImage = () => {
        if (imgUrl) {
            editor.chain().focus().setImage({ src: imgUrl }).run()
        }
        setImgUrl('')
        setShowImgInput(false)
    }

    return (
        <div className="border border-gray-700 rounded-xl overflow-hidden bg-gray-900">
            {/* Toolbar */}
            <div className="sticky top-0 z-40 bg-gray-850 border-b border-gray-700 p-2 flex flex-wrap items-center gap-0.5" style={{ backgroundColor: '#1a1f2e' }}>
                {/* Undo/Redo */}
                <ToolBtn onClick={() => editor.chain().focus().undo().run()} title="Undo" disabled={!editor.can().undo()}>
                    <Undo2 className="h-4 w-4" />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().redo().run()} title="Redo" disabled={!editor.can().redo()}>
                    <Redo2 className="h-4 w-4" />
                </ToolBtn>
                <div className="w-px h-6 bg-gray-700 mx-1" />

                {/* Heading */}
                <DropdownBtn label={headingLevel} icon={<Type className="h-3.5 w-3.5" />} isOpen={openDropdown === 'heading'} onToggle={() => toggle('heading')}>
                    <button type="button" onClick={() => { editor.chain().focus().setParagraph().run(); setOpenDropdown(null) }}
                        className={`block w-full text-left px-3 py-1.5 text-sm rounded hover:bg-gray-700 ${!editor.isActive('heading') ? 'text-intelligence' : 'text-gray-300'}`}>
                        Paragraph
                    </button>
                    {[1,2,3,4,5,6].map(l => (
                        <button key={l} type="button"
                            onClick={() => { editor.chain().focus().toggleHeading({ level: l as 1|2|3|4|5|6 }).run(); setOpenDropdown(null) }}
                            className={`block w-full text-left px-3 py-1.5 rounded hover:bg-gray-700 ${editor.isActive('heading', {level:l}) ? 'text-intelligence' : 'text-gray-300'}`}
                            style={{ fontSize: `${20 - l * 2}px`, fontWeight: 'bold' }}>
                            Heading {l}
                        </button>
                    ))}
                </DropdownBtn>

                {/* Font Family */}
                <DropdownBtn label={currentFont} isOpen={openDropdown === 'font'} onToggle={() => toggle('font')}>
                    {FONTS.map(f => (
                        <button key={f} type="button"
                            onClick={() => { editor.chain().focus().setFontFamily(f).run(); setOpenDropdown(null) }}
                            className={`block w-full text-left px-3 py-1.5 text-sm rounded hover:bg-gray-700 ${currentFont === f ? 'text-intelligence' : 'text-gray-300'}`}
                            style={{ fontFamily: f }}>
                            {f}
                        </button>
                    ))}
                </DropdownBtn>

                {/* Font Size */}
                <DropdownBtn label={currentSize} isOpen={openDropdown === 'size'} onToggle={() => toggle('size')}>
                    {FONT_SIZES.map(s => (
                        <button key={s} type="button"
                            onClick={() => { (editor.commands as unknown as Record<string, (v: string) => boolean>).setFontSize(s); setOpenDropdown(null) }}
                            className={`block w-full text-left px-3 py-1.5 text-sm rounded hover:bg-gray-700 ${currentSize === s ? 'text-intelligence' : 'text-gray-300'}`}>
                            {s}
                        </button>
                    ))}
                </DropdownBtn>
                <div className="w-px h-6 bg-gray-700 mx-1" />

                {/* Text Format */}
                <ToolBtn active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
                    <Bold className="h-4 w-4" />
                </ToolBtn>
                <ToolBtn active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
                    <Italic className="h-4 w-4" />
                </ToolBtn>
                <ToolBtn active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
                    <UnderlineIcon className="h-4 w-4" />
                </ToolBtn>
                <ToolBtn active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
                    <Strikethrough className="h-4 w-4" />
                </ToolBtn>
                <ToolBtn active={editor.isActive('subscript')} onClick={() => editor.chain().focus().toggleSubscript().run()} title="Subscript">
                    <SubIcon className="h-4 w-4" />
                </ToolBtn>
                <ToolBtn active={editor.isActive('superscript')} onClick={() => editor.chain().focus().toggleSuperscript().run()} title="Superscript">
                    <SupIcon className="h-4 w-4" />
                </ToolBtn>
                <div className="w-px h-6 bg-gray-700 mx-1" />

                {/* Text Color */}
                <DropdownBtn label="" icon={<Palette className="h-3.5 w-3.5" />} isOpen={openDropdown === 'color'} onToggle={() => toggle('color')}>
                    <div className="grid grid-cols-10 gap-0.5 p-2 w-[260px]">
                        {COLOR_PALETTE.map(c => (
                            <button key={c} type="button"
                                onClick={() => { editor.chain().focus().setColor(c).run(); setOpenDropdown(null) }}
                                className="w-5 h-5 rounded border border-gray-600 hover:scale-125 transition-transform"
                                style={{ backgroundColor: c }} title={c} />
                        ))}
                    </div>
                    <button type="button" onClick={() => { editor.chain().focus().unsetColor().run(); setOpenDropdown(null) }}
                        className="w-full text-left px-3 py-1.5 text-xs text-gray-400 hover:bg-gray-700 rounded mt-1">
                        Remove color
                    </button>
                </DropdownBtn>

                {/* Highlight */}
                <DropdownBtn label="" icon={<Highlighter className="h-3.5 w-3.5" />} isOpen={openDropdown === 'highlight'} onToggle={() => toggle('highlight')}>
                    <div className="grid grid-cols-10 gap-0.5 p-2 w-[260px]">
                        {COLOR_PALETTE.map(c => (
                            <button key={c} type="button"
                                onClick={() => { editor.chain().focus().toggleHighlight({ color: c }).run(); setOpenDropdown(null) }}
                                className="w-5 h-5 rounded border border-gray-600 hover:scale-125 transition-transform"
                                style={{ backgroundColor: c }} title={c} />
                        ))}
                    </div>
                    <button type="button" onClick={() => { editor.chain().focus().unsetHighlight().run(); setOpenDropdown(null) }}
                        className="w-full text-left px-3 py-1.5 text-xs text-gray-400 hover:bg-gray-700 rounded mt-1">
                        Remove highlight
                    </button>
                </DropdownBtn>
                <div className="w-px h-6 bg-gray-700 mx-1" />

                {/* Alignment */}
                <ToolBtn active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()} title="Align Left">
                    <AlignLeft className="h-4 w-4" />
                </ToolBtn>
                <ToolBtn active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()} title="Align Center">
                    <AlignCenter className="h-4 w-4" />
                </ToolBtn>
                <ToolBtn active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()} title="Align Right">
                    <AlignRight className="h-4 w-4" />
                </ToolBtn>
                <ToolBtn active={editor.isActive({ textAlign: 'justify' })} onClick={() => editor.chain().focus().setTextAlign('justify').run()} title="Justify">
                    <AlignJustify className="h-4 w-4" />
                </ToolBtn>
                <div className="w-px h-6 bg-gray-700 mx-1" />

                {/* Lists */}
                <ToolBtn active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet List">
                    <List className="h-4 w-4" />
                </ToolBtn>
                <ToolBtn active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Ordered List">
                    <ListOrdered className="h-4 w-4" />
                </ToolBtn>
                <ToolBtn active={editor.isActive('taskList')} onClick={() => editor.chain().focus().toggleTaskList().run()} title="Task List">
                    <ListChecks className="h-4 w-4" />
                </ToolBtn>
                <div className="w-px h-6 bg-gray-700 mx-1" />

                {/* Block Elements */}
                <ToolBtn active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote">
                    <Quote className="h-4 w-4" />
                </ToolBtn>
                <ToolBtn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
                    <Minus className="h-4 w-4" />
                </ToolBtn>
                <ToolBtn active={editor.isActive('codeBlock')} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code Block">
                    <Code2 className="h-4 w-4" />
                </ToolBtn>
                <div className="w-px h-6 bg-gray-700 mx-1" />

                {/* Link */}
                <div className="relative">
                    <ToolBtn active={editor.isActive('link')} onClick={() => {
                        if (editor.isActive('link')) {
                            editor.chain().focus().unsetLink().run()
                        } else {
                            setShowLinkInput(!showLinkInput)
                            setShowImgInput(false)
                        }
                    }} title="Link">
                        <Link2 className="h-4 w-4" />
                    </ToolBtn>
                    {showLinkInput && (
                        <div className="absolute top-full left-0 mt-1 z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-3 w-72">
                            <div className="flex gap-2">
                                <input type="url" value={linkUrl} onChange={e => setLinkUrl(e.target.value)}
                                    placeholder="https://..." onKeyDown={e => e.key === 'Enter' && insertLink()}
                                    className="flex-1 px-3 py-1.5 bg-gray-900 border border-gray-600 rounded text-sm text-white focus:border-intelligence focus:outline-none" />
                                <button type="button" onClick={insertLink} className="px-3 py-1.5 bg-intelligence text-gray-950 rounded text-sm font-medium">Add</button>
                                <button type="button" onClick={() => setShowLinkInput(false)} className="p-1.5 text-gray-400 hover:text-white">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Image */}
                <div className="relative">
                    <ToolBtn onClick={() => { setShowImgInput(!showImgInput); setShowLinkInput(false) }} title="Image">
                        <ImageIcon className="h-4 w-4" />
                    </ToolBtn>
                    {showImgInput && (
                        <div className="absolute top-full left-0 mt-1 z-50 bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-3 w-72">
                            <div className="flex gap-2">
                                <input type="url" value={imgUrl} onChange={e => setImgUrl(e.target.value)}
                                    placeholder="Image URL..." onKeyDown={e => e.key === 'Enter' && insertImage()}
                                    className="flex-1 px-3 py-1.5 bg-gray-900 border border-gray-600 rounded text-sm text-white focus:border-intelligence focus:outline-none" />
                                <button type="button" onClick={insertImage} className="px-3 py-1.5 bg-intelligence text-gray-950 rounded text-sm font-medium">Add</button>
                                <button type="button" onClick={() => setShowImgInput(false)} className="p-1.5 text-gray-400 hover:text-white">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Table */}
                <ToolBtn onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} title="Insert Table">
                    <TableIcon className="h-4 w-4" />
                </ToolBtn>
                <div className="w-px h-6 bg-gray-700 mx-1" />

                {/* Clear */}
                <ToolBtn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear Formatting">
                    <RemoveFormatting className="h-4 w-4" />
                </ToolBtn>
            </div>

            {/* Editor Area - Page-like */}
            <div className="bg-gray-950 p-8 flex justify-center overflow-y-auto max-h-[70vh]">
                <div className="w-full max-w-[816px] bg-white rounded-lg shadow-2xl">
                    <EditorContent editor={editor} />
                </div>
            </div>

            <style jsx global>{`
                .ProseMirror {
                    min-height: 600px;
                    color: #1a1a1a;
                    font-family: 'Inter', sans-serif;
                }
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #adb5bd;
                    pointer-events: none;
                    height: 0;
                }
                .ProseMirror h1 { font-size: 2em; font-weight: 700; margin: 0.67em 0; }
                .ProseMirror h2 { font-size: 1.5em; font-weight: 700; margin: 0.75em 0; }
                .ProseMirror h3 { font-size: 1.25em; font-weight: 600; margin: 0.8em 0; }
                .ProseMirror h4 { font-size: 1.1em; font-weight: 600; margin: 0.8em 0; }
                .ProseMirror h5 { font-size: 1em; font-weight: 600; margin: 0.8em 0; }
                .ProseMirror h6 { font-size: 0.9em; font-weight: 600; margin: 0.8em 0; }
                .ProseMirror ul { list-style: disc; padding-left: 1.5em; }
                .ProseMirror ol { list-style: decimal; padding-left: 1.5em; }
                .ProseMirror blockquote {
                    border-left: 4px solid #D4AF37;
                    padding-left: 1em;
                    margin: 1em 0;
                    color: #666;
                    font-style: italic;
                }
                .ProseMirror code {
                    background: #f0f0f0;
                    padding: 0.15em 0.4em;
                    border-radius: 4px;
                    font-family: 'Courier New', monospace;
                }
                .ProseMirror pre {
                    background: #1e1e1e;
                    color: #d4d4d4;
                    padding: 1em;
                    border-radius: 8px;
                    overflow-x: auto;
                    font-family: 'Courier New', monospace;
                }
                .ProseMirror a { color: #4169E1; text-decoration: underline; }
                .ProseMirror img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 8px;
                    margin: 1em 0;
                }
                .ProseMirror table {
                    border-collapse: collapse;
                    width: 100%;
                    margin: 1em 0;
                }
                .ProseMirror td, .ProseMirror th {
                    border: 1px solid #ccc;
                    padding: 8px 12px;
                    text-align: left;
                }
                .ProseMirror th { background: #f5f5f5; font-weight: 600; }
                .ProseMirror hr { border: none; border-top: 2px solid #e0e0e0; margin: 1.5em 0; }
                .ProseMirror ul[data-type="taskList"] {
                    list-style: none;
                    padding-left: 0;
                }
                .ProseMirror ul[data-type="taskList"] li {
                    display: flex;
                    align-items: flex-start;
                    gap: 8px;
                }
                .ProseMirror ul[data-type="taskList"] li label input[type="checkbox"] {
                    margin-top: 4px;
                    accent-color: #D4AF37;
                }
                .ProseMirror p { margin: 0.5em 0; }
            `}</style>
        </div>
    )
}
