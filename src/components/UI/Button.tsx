import { Loader2 } from 'lucide-react'
import { ButtonHTMLAttributes, ReactNode } from 'react'

import { cn } from '@/lib/utils/formatters'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'intelligence'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
    leftIcon?: ReactNode
    rightIcon?: ReactNode
    fullWidth?: boolean
}

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className,
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-intelligence focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
        primary: 'bg-gradient-to-r from-intelligence to-industrial text-white hover:shadow-intelligence hover:scale-105 active:scale-95',
        secondary: 'bg-gray-800 text-gray-100 hover:bg-gray-700 border border-gray-700',
        outline: 'border border-intelligence text-intelligence hover:bg-intelligence/10',
        danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
        intelligence: 'bg-intelligence/10 text-intelligence border border-intelligence/20 hover:bg-intelligence/20',
    }

    const sizes = {
        sm: 'px-4 py-2 text-sm',
        md: 'px-6 py-3 text-base',
        lg: 'px-8 py-4 text-lg',
    }

    return (
        <button
            className={cn(
                baseStyles,
                variants[variant],
                sizes[size],
                fullWidth && 'w-full',
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
        </button>
    )
}