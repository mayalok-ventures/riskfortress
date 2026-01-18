'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type ThemeProviderProps = {
    children: ReactNode
    attribute?: string
    defaultTheme?: string
    enableSystem?: boolean
    disableTransitionOnChange?: boolean
}

const ThemeContext = createContext<{
    theme: string
    setTheme: (theme: string) => void
}>({
    theme: 'dark',
    setTheme: () => null,
})

export function useTheme() {
    return useContext(ThemeContext)
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
            {...props}
        >
            {children}
        </NextThemesProvider>
    )
}