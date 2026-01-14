'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes'
import { createContext, useContext, useEffect, useState } from 'react'

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