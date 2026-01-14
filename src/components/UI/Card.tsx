import { ReactNode } from 'react'
import { cn } from '@/lib/utils/formatters'

interface CardProps {
    children: ReactNode
    className?: string
    variant?: 'default' | 'glass' | 'gradient'
    hover?: boolean
}

export default function Card({
    children,
    className,
    variant = 'default',
    hover = false,
}: CardProps) {
    const baseStyles = 'rounded-2xl border transition-all'

    const variants = {
        default: 'bg-gray-900/50 border-gray-800',
        glass: 'glass-morphism border-white/10 backdrop-blur-lg',
        gradient: 'bg-gradient-to-br from-gray-900 to-gray-950 border-gray-800',
    }

    const hoverStyles = hover
        ? 'hover:border-intelligence/30 hover:shadow-intelligence hover:scale-[1.02]'
        : ''

    return (
        <div className={cn(baseStyles, variants[variant], hoverStyles, className)}>
            {children}
        </div>
    )
}