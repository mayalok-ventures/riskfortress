'use client'

import { useState } from 'react'
import { Share2, Linkedin, MessageCircle, Link2, Check } from 'lucide-react'

interface ShareSectionProps {
    title: string
    url?: string
}

export default function ShareSection({ title, url }: ShareSectionProps) {
    const [copied, setCopied] = useState(false)
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

    const shareLinkedIn = () => {
        window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
            '_blank',
            'noopener,noreferrer',
        )
    }

    const shareWhatsApp = () => {
        window.open(
            `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + shareUrl)}`,
            '_blank',
            'noopener,noreferrer',
        )
    }

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch {
            // Fallback for older browsers
            const el = document.createElement('textarea')
            el.value = shareUrl
            document.body.appendChild(el)
            el.select()
            document.execCommand('copy')
            document.body.removeChild(el)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className="flex items-center space-x-4 py-4 border-t border-gray-800">
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
            </div>
            <div className="flex items-center space-x-3 ml-2">
                <button
                    onClick={shareLinkedIn}
                    title="Share on LinkedIn"
                    className="p-2 rounded-lg bg-[#0077B5]/10 border border-[#0077B5]/20 text-[#0077B5] hover:bg-[#0077B5]/20 transition-colors"
                >
                    <Linkedin className="h-4 w-4" />
                </button>
                <button
                    onClick={shareWhatsApp}
                    title="Share on WhatsApp"
                    className="p-2 rounded-lg bg-[#25D366]/10 border border-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                >
                    <MessageCircle className="h-4 w-4" />
                </button>
                <button
                    onClick={copyLink}
                    title="Copy link"
                    className="p-2 rounded-lg bg-gray-800 border border-gray-700 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                >
                    {copied ? <Check className="h-4 w-4 text-green-400" /> : <Link2 className="h-4 w-4" />}
                </button>
                {copied && <span className="text-xs text-green-400">Copied!</span>}
            </div>
        </div>
    )
}
