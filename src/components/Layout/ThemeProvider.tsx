'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { createContext, useContext, type ReactNode, type ComponentProps } from 'react'

type ThemeProviderProps = ComponentProps<typeof NextThemesProvider>

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