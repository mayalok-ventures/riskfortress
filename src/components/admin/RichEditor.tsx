'use client'

import { useCallback } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Color from '@tiptap/extension-color'
import Heading from '@tiptap/extension-heading'
import Highlight from '@tiptap/extension-highlight'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Subscript from '@tiptap/extension-subscript'
import Superscript from '@tiptap/extension-superscript'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import Underline from '@tiptap/extension-underline'
import {
    Bold, Italic, UnderlineIcon, Strikethrough, Code, Heading1, Heading2, Heading3,
    List, ListOrdered, Quote, Link2, ImageIcon, AlignLeft, AlignCenter, AlignRight,
    AlignJustify, Highlighter, Minus, CornerDownLeft, Undo, Redo, CheckSquare,
} from 'lucide-react'

interface RichEditorProps {
    content?: string
    onChange?: (html: string) => void
    placeholder?: string
}

function ToolbarButton({ onClick, active, children, title }: {
    onClick: () => void
    active?: boolean
    children: React.ReactNode
    title?: string
}) {
    return (
        <button
            type="button"
            title={title}
            onClick={onClick}
            className={`p-1.5 rounded transition-colors ${
                active
                    ? 'bg-champagne/20 text-champagne'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
        >
            {children}
        </button>
    )
}

export default function RichEditor({ content = '', onChange, placeholder = 'Begin your intelligence brief...' }: RichEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ heading: false }),
            Heading.configure({ levels: [1, 2, 3] }),
            Underline,
            Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-champagne underline' } }),
            Image.configure({ HTMLAttributes: { class: 'rounded my-4 max-w-full' } }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Highlight.configure({ multicolor: true }),
            TextStyle,
            Color,
            Subscript,
            Superscript,
            Placeholder.configure({ placeholder }),
            TaskList,
            TaskItem.configure({ nested: true }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML())
        },
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none min-h-[400px] p-6 focus:outline-none text-gray-300 leading-relaxed',
            },
        },
    })

    const setLink = useCallback(() => {
        if (!editor) return
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('Enter URL:', previousUrl)
        if (url === null) return
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }, [editor])

    const addImage = useCallback(() => {
        if (!editor) return
        const url = window.prompt('Enter image URL:')
        if (url) editor.chain().focus().setImage({ src: url }).run()
    }, [editor])

    if (!editor) return null

    const iconSize = 'h-4 w-4'

    return (
        <div className="border border-gray-700 rounded-lg overflow-hidden bg-gray-900">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-1 p-2 border-b border-gray-700 bg-gray-800/80">
                {/* History */}
                <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Undo">
                    <Undo className={iconSize} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Redo">
                    <Redo className={iconSize} />
                </ToolbarButton>

                <div className="w-px h-5 bg-gray-700 mx-1" />

                {/* Headings */}
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="H1">
                    <Heading1 className={iconSize} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="H2">
                    <Heading2 className={iconSize} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="H3">
                    <Heading3 className={iconSize} />
                </ToolbarButton>

                <div className="w-px h-5 bg-gray-700 mx-1" />

                {/* Marks */}
                <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
                    <Bold className={iconSize} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
                    <Italic className={iconSize} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
                    <UnderlineIcon className={iconSize} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
                    <Strikethrough className={iconSize} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline code">
                    <Code className={iconSize} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight">
                    <Highlighter className={iconSize} />
                </ToolbarButton>

                <div className="w-px h-5 bg-gray-700 mx-1" />

                {/* Lists */}
                <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
                    <List className={iconSize} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered list">
                    <ListOrdered className={iconSize} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive('taskList')} title="Task list">
                    <CheckSquare className={iconSize} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
                    <Quote className={iconSize} />
                </ToolbarButton>

                <div className="w-px h-5 bg-gray-700 mx-1" />

                {/* Alignment */}
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align left">
                    <AlignLeft className={iconSize} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align center">
                    <AlignCenter className={iconSize} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align right">
                    <AlignRight className={iconSize} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('justify').run()} active={editor.isActive({ textAlign: 'justify' })} title="Justify">
                    <AlignJustify className={iconSize} />
                </ToolbarButton>

                <div className="w-px h-5 bg-gray-700 mx-1" />

                {/* Elements */}
                <ToolbarButton onClick={setLink} active={editor.isActive('link')} title="Insert link">
                    <Link2 className={iconSize} />
                </ToolbarButton>
                <ToolbarButton onClick={addImage} title="Insert image">
                    <ImageIcon className={iconSize} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal rule">
                    <Minus className={iconSize} />
                </ToolbarButton>
                <ToolbarButton onClick={() => editor.chain().focus().setHardBreak().run()} title="Hard break">
                    <CornerDownLeft className={iconSize} />
                </ToolbarButton>
            </div>

            {/* Editor area */}
            <EditorContent editor={editor} />


            {/* Word count */}
            <div className="px-4 py-2 border-t border-gray-700 text-xs text-gray-500 flex justify-between">
                <span>{editor.storage.characterCount?.words?.() ?? '–'} words</span>
                <span>{editor.storage.characterCount?.characters?.() ?? '–'} characters</span>
            </div>
        </div>
    )
}
