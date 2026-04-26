'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Eye, FileText, BookOpen, Lock } from 'lucide-react'
import { MotionDiv } from '@/lib/motion'

interface RelatedItem {
  id: string
  slug: string
  type: 'case' | 'article' | 'blog'
  title: string
  summary: string
  thumbnail?: string
  author: string
  publishedAt: string
  sector?: string
  threatLevel?: string
  keywords: string[]
}

const TYPE_CONFIG = {
  article: {
    label: 'Intelligence Article',
    icon: FileText,
    color: 'text-intelligence border-intelligence/20 bg-intelligence/5',
    accent: 'border-l-intelligence',
  },
  blog: {
    label: 'Expert Insights',
    icon: BookOpen,
    color: 'text-champagne border-champagne/20 bg-champagne/5',
    accent: 'border-l-champagne',
  },
  case: {
    label: 'Intelligence Dossier',
    icon: Lock,
    color: 'text-red-400 border-red-500/20 bg-red-500/5',
    accent: 'border-l-red-500',
  },
}

const THREAT_COLORS: Record<string, string> = {
  Critical: 'text-red-400 bg-red-500/10',
  High: 'text-orange-400 bg-orange-500/10',
  Medium: 'text-yellow-400 bg-yellow-500/10',
  Low: 'text-green-400 bg-green-500/10',
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'short', day: 'numeric',
    })
  } catch { return '' }
}

interface RelatedArticlesProps {
  currentSlug: string
  currentType: string
}

export default function RelatedArticles({ currentSlug, currentType }: RelatedArticlesProps) {
  const [items, setItems] = useState<RelatedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentSlug || currentSlug === '_placeholder') return
    let cancelled = false
    setLoading(true)

    const fallbackToRecent = async (): Promise<RelatedItem[]> => {
      try {
        const r = await fetch('/api/content?published=true')
        if (!r.ok) return []
        const all: RelatedItem[] = await r.json()
        return (Array.isArray(all) ? all : [])
          .filter((c) => c.slug && c.slug !== currentSlug && c.slug !== '_placeholder')
          .sort((a, b) => +new Date(b.publishedAt || 0) - +new Date(a.publishedAt || 0))
          .slice(0, 5)
      } catch {
        return []
      }
    }

    ;(async () => {
      let data: RelatedItem[] = []
      try {
        const r = await fetch(`/api/content/related?slug=${encodeURIComponent(currentSlug)}&limit=5`)
        if (r.ok) {
          const json = await r.json()
          if (Array.isArray(json)) data = json
        }
      } catch {
        /* swallow — fallback below */
      }
      if (!data.length) data = await fallbackToRecent()
      if (!cancelled) {
        setItems(data)
        setLoading(false)
      }
    })()

    return () => { cancelled = true }
  }, [currentSlug])

  if (loading) {
    return (
      <div className="mt-16 pt-8 border-t border-gray-800">
        <div className="flex items-center space-x-3 mb-8">
          <Eye className="h-5 w-5 text-intelligence" />
          <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Related Intelligence</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 rounded-xl bg-gray-900 border border-gray-800 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!items.length) return null

  return (
    <div className="mt-16 pt-8 border-t border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Eye className="h-5 w-5 text-intelligence" />
          <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Related Intelligence
          </span>
        </div>
        <Link
          href="/dossiers/"
          className="inline-flex items-center space-x-1 text-xs text-gray-500 hover:text-intelligence transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => {
          const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.article
          const Icon = cfg.icon
          const isCase = item.type === 'case'

          return (
            <MotionDiv
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.06 }}
            >
              <Link
                href={`/dossiers/${item.slug}/`}
                className={`group flex flex-col h-full rounded-xl border bg-gray-900/60 hover:bg-gray-900 border-l-4 transition-all duration-200 overflow-hidden ${cfg.accent} border-gray-800 hover:border-gray-700`}
              >
                {/* Thumbnail */}
                {item.thumbnail && (
                  <div className="relative h-32 overflow-hidden flex-shrink-0">
                    <Image
                      src={item.thumbnail}
                      alt={item.title}
                      fill
                      className="object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80" />
                  </div>
                )}

                <div className="p-4 flex flex-col flex-1">
                  {/* Type badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`inline-flex items-center space-x-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${cfg.color}`}>
                      <Icon className="h-3 w-3" />
                      <span>{cfg.label}</span>
                    </span>
                    {item.threatLevel && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${THREAT_COLORS[item.threatLevel] || ''}`}>
                        {item.threatLevel}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-semibold text-white group-hover:text-intelligence transition-colors line-clamp-2 mb-2 leading-snug flex-1">
                    {isCase ? (
                      <span className="flex items-center space-x-1.5">
                        <Lock className="h-3 w-3 text-red-400 flex-shrink-0" />
                        <span>{item.title}</span>
                      </span>
                    ) : item.title}
                  </h3>

                  {/* Summary */}
                  {item.summary && !isCase && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed">
                      {item.summary}
                    </p>
                  )}
                  {isCase && (
                    <p className="text-xs text-gray-600 italic mb-3">
                      Professional verification required
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-800">
                    <span className="text-[10px] text-gray-600">{formatDate(item.publishedAt)}</span>
                    <span className="text-[10px] text-intelligence opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                      <span>Read</span>
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </MotionDiv>
          )
        })}
      </div>
    </div>
  )
}
