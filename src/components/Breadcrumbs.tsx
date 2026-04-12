'use client'

import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'
import Script from 'next/script'

interface BreadcrumbItem {
    label: string
    href?: string
}

interface Props {
    items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: Props) {
    const fullItems = [{ label: 'Home', href: '/' }, ...items]

    const schema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: fullItems.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.label,
            ...(item.href ? { item: `https://riskfortress.in${item.href}` } : {}),
        })),
    }

    return (
        <>
            <Script
                id={`breadcrumb-schema-${items[0]?.label}`}
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
            />
            <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-gray-500">
                {fullItems.map((item, i) => (
                    <span key={item.label} className="flex items-center space-x-2">
                        {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-gray-700 flex-shrink-0" />}
                        {i === 0 && <Home className="h-3.5 w-3.5 text-gray-600 flex-shrink-0" />}
                        {item.href && i < fullItems.length - 1 ? (
                            <Link href={item.href} className="hover:text-champagne transition-colors">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-gray-400">{item.label}</span>
                        )}
                    </span>
                ))}
            </nav>
        </>
    )
}
