import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    200: '#bae6fd',
                    300: '#7dd3fc',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                    950: '#082f49',
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                // Premium Risk Intelligence Colors
                // Champagne Gold - Primary accent
                champagne: {
                    DEFAULT: '#D4AF37',
                    light: '#E5C158',
                    dark: '#B8962E',
                },
                // Obsidian Black - Deep backgrounds
                obsidian: {
                    DEFAULT: '#0a0a0a',
                    light: '#0d0d0d',
                    dark: '#050505',
                },
                // Deep Charcoal - Secondary backgrounds
                charcoal: {
                    DEFAULT: '#1a1a1a',
                    light: '#252525',
                    dark: '#0f0f0f',
                },
                // Legacy intelligence color (kept for compatibility)
                intelligence: {
                    DEFAULT: '#D4AF37',
                    dark: '#B8962E',
                    light: '#E5C158',
                },
                risk: {
                    DEFAULT: '#ef4444',
                    warning: '#f59e0b',
                    critical: '#dc2626',
                },
                industrial: {
                    DEFAULT: '#059669',
                    dark: '#047857',
                },
                legacy: {
                    DEFAULT: '#8b5cf6',
                    dark: '#7c3aed',
                }
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                display: ['var(--font-playfair)', 'serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'slide-down': 'slideDown 0.3s ease-out',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'radar-scan': 'radarScan 4s linear infinite',
                'encryption': 'encryption 1.5s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideDown: {
                    '0%': { transform: 'translateY(-10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                pulseGlow: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.5' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-1000px 0' },
                    '100%': { backgroundPosition: '1000px 0' },
                },
                radarScan: {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
                encryption: {
                    '0%, 100%': { transform: 'scale(1)', opacity: '0.8' },
                    '50%': { transform: 'scale(1.05)', opacity: '1' },
                },
            },
            backgroundImage: {
                'gradient-intelligence': 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)',
                'gradient-champagne': 'linear-gradient(135deg, #D4AF37 0%, #B8962E 100%)',
                'gradient-risk': 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                'gradient-industrial': 'linear-gradient(135deg, #D4AF37 0%, #8b7355 100%)',
                'gradient-legacy': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                'gradient-obsidian': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
                'grid-pattern': 'linear-gradient(to right, #1a1a1a 1px, transparent 1px), linear-gradient(to bottom, #1a1a1a 1px, transparent 1px)',
                'topographic': 'url("/images/topographic-bg.webp")',
                'wireframe': 'url("/images/wireframe-bg.webp")',
            },
            boxShadow: {
                'intelligence': '0 0 40px rgba(212, 175, 55, 0.3)',
                'champagne': '0 0 40px rgba(212, 175, 55, 0.25)',
                'risk': '0 0 40px rgba(239, 68, 68, 0.2)',
                'glass': 'inset 0 0 0 1px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.5)',
                'elevation': '0 20px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
            }
        },
    },
    plugins: [],
}

export default config