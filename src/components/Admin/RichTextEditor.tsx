'use client'

import { useEditor, EditorContent } from '@tiptap/react'
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
    List, ListOrdered, ListChecks, Quote, Code, Minus, Link as LinkIcon,
    Image as ImageIcon, Table as TableIcon, Undo2, Redo2, RemoveFormatting,
    ChevronDown, Type, Palette, Highlighter
} from 'lucide-react'

interface RichTextEditorProps {
    content: string
    onChange: (html: string) => void
    placeholder?: string
}

const FONTS = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New',
    'Verdana', 'Trebuchet MS', 'Impact', 'Comic Sans MS', 'Palatino',
    'Garamond', 'Bookman', 'Tahoma', 'Lucida Sans', 'Gill Sans',
]

const FONT_SIZES = ['8px','9px','10px','11px','12px','14px','16px','18px','20px','22px','24px','26px','28px','36px','48px','72px']

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

export default function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
            Underline,
            TextStyle,
            Color,
            FontFamily,
            Highlight.configure({ multicolor: true }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({ openOnClick: false }),
            TipTapImage,
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

    const addLink = useCallback(() => {
        if (!editor) return
        const url = window.prompt('Enter URL:')
        if (url) editor.chain().focus().setLink({ href: url }).run()
    }, [editor])

    const addImage = useCallback(() => {
        if (!editor) return
        const url = window.prompt('Enter image URL:')
        if (url) editor.chain().focus().setImage({ src: url }).run()
    }, [editor])

    const addTable = useCallback(() => {
        if (!editor) return
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    }, [editor])

    if (!editor) return <div className="h-[700px] bg-gray-800 rounded-xl animate-pulse" />

    const currentHeading = editor.isActive('heading', { level: 1 }) ? '1'
        : editor.isActive('heading', { level: 2 }) ? '2'
        : editor.isActive('heading', { level: 3 }) ? '3'
        : editor.isActive('heading', { level: 4 }) ? '4'
        : '0'

    return (
        <div className="rounded-xl border border-gray-700 overflow-hidden">
            {/* Toolbar Row 1 */}
            <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-gray-800 border-b border-gray-700">
                <Dropdown
                    label="Font"
                    options={FONTS.map(f => ({ label: f, value: f }))}
                    value=""
                    onChange={(v) => editor.chain().focus().setFontFamily(v).run()}
                />
                <Dropdown
                    label="Size"
                    options={FONT_SIZES.map(s => ({ label: s.replace('px',''), value: s }))}
                    value=""
                    onChange={(v) => editor.chain().focus().setMark('textStyle', { fontSize: v }).run()}
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
                        else editor.chain().focus().toggleHeading({ level: parseInt(v) as 1|2|3|4 }).run()
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
                    onSelect={(c) => c ? editor.chain().focus().toggleHighlight({ color: c }).run() : editor.chain().focus().unsetHighlight().run()}
                    icon={<Highlighter className="h-4 w-4" />}
                    title="Highlight Color"
                />
            </div>

            {/* Toolbar Row 2 */}
            <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-gray-800 border-b border-gray-700">
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
                <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block">
                    <Code className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
                    <Minus className="h-4 w-4" />
                </ToolbarButton>

                <div className="w-px h-6 bg-gray-700 mx-1" />

                <ToolbarButton onClick={addLink} active={editor.isActive('link')} title="Insert Link">
                    <LinkIcon className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton onClick={addImage} title="Insert Image">
                    <ImageIcon className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton onClick={addTable} title="Insert Table">
                    <TableIcon className="h-4 w-4" />
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
                    .ProseMirror blockquote { border-left: 4px solid #D4AF37; padding-left: 1em; margin: 1em 0; color: #666; font-style: italic; }
                    .ProseMirror pre { background: #1a1a2e; color: #e0e0e0; padding: 1em; border-radius: 8px; overflow-x: auto; }
                    .ProseMirror code { background: #f0f0f0; padding: 0.2em 0.4em; border-radius: 4px; font-size: 0.9em; }
                    .ProseMirror pre code { background: none; padding: 0; }
                    .ProseMirror img { max-width: 100%; height: auto; border-radius: 8px; margin: 1em 0; }
                    .ProseMirror hr { border: none; border-top: 2px solid #e0e0e0; margin: 2em 0; }
                    .ProseMirror a { color: #1155CC; text-decoration: underline; }
                    .ProseMirror table { border-collapse: collapse; width: 100%; margin: 1em 0; }
                    .ProseMirror th, .ProseMirror td { border: 1px solid #ccc; padding: 8px 12px; text-align: left; }
                    .ProseMirror th { background: #f5f5f5; font-weight: 600; }
                    .ProseMirror ul[data-type="taskList"] { list-style: none; padding-left: 0; }
                    .ProseMirror ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 8px; }
                    .ProseMirror ul[data-type="taskList"] li label { margin-top: 3px; }
                    .ProseMirror mark { padding: 0.1em 0.2em; border-radius: 2px; }
                `}</style>
                <EditorContent editor={editor} />
            </div>
        </div>
    )
}
