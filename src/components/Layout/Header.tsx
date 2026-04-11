'use client'

import { AnimatePresence } from 'framer-motion'
import { MotionDiv } from '@/lib/motion'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const navigation = [
    { name: 'Intelligence Verticals', href: '/capabilities' },
    { name: 'The 1% Mandate', href: '/mandate' },
    { name: 'Case Scenarios', href: '/dossiers' },
    { name: 'Mayalok Ecosystem', href: '/council' },
]

const mobileNavigation = [
    { name: 'Home', href: '/' },
    { name: 'Intelligence Verticals', href: '/capabilities' },
    { name: 'The 1% Mandate', href: '/mandate' },
    { name: 'Case Scenarios', href: '/dossiers' },
    { name: 'Mayalok Ecosystem', href: '/council' },
]

export default function Header() {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
            scrolled ? 'bg-gray-950/95 backdrop-blur-sm border-b border-gray-800' : 'bg-transparent'
        }`}>
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3">
                        <Image
                            src="/logos/logo.png"
                            alt="RiskFortress — Private Risk Intelligence"
                            width={44}
                            height={44}
                            priority
                        />
                        <div className="hidden sm:block">
                            <span className="text-lg font-semibold text-white tracking-wide block">
                                RiskFortress
                            </span>
                            <p className="text-[10px] text-champagne uppercase tracking-[0.15em]">
                                A Mayalok Ventures Entity
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-10">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`text-sm tracking-wide transition-colors relative pb-1 ${
                                    pathname === item.href || pathname === item.href + '/'
                                        ? 'text-intelligence border-b-2 border-intelligence' 
                                        : 'text-gray-400 hover:text-white'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>

                    {/* CTA Button */}
                    <div className="hidden lg:block">
                        <Link
                            href="/secure-intake"
                            className="px-6 py-2.5 bg-champagne text-obsidian text-sm font-medium tracking-widest uppercase hover:bg-champagne-light transition-colors"
                        >
                            Discrete Consultation
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden p-2"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? (
                            <X className="h-6 w-6 text-gray-400" />
                        ) : (
                            <Menu className="h-6 w-6 text-gray-400" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <MotionDiv
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden overflow-hidden bg-gray-950 border-t border-gray-800"
                    >
                        <div className="container mx-auto px-6 py-6">
                            <div className="space-y-4">
                                {mobileNavigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`block text-base ${
                                            pathname === item.href || pathname === item.href + '/'
                                                ? 'text-intelligence' 
                                                : 'text-gray-400'
                                        }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <div className="pt-4 border-t border-gray-800">
                                    <Link
                                        href="/secure-intake"
                                        className="block w-full text-center px-6 py-3 bg-champagne text-obsidian font-medium uppercase tracking-wider"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        Discrete Consultation
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </MotionDiv>
                )}
            </AnimatePresence>
        </header>
    )
}
