'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface SiteSettings {
    contact?: {
        email?: string
        phone?: string
        address?: string
        mapEmbed?: string
    }
    social?: {
        twitter?: string
        linkedin?: string
        facebook?: string
        instagram?: string
        youtube?: string
        github?: string
    }
    seo?: {
        metaTitle?: string
        metaDescription?: string
    }
}

const footerLinks = {
    'Intelligence Verticals': [
        { label: 'Macro-Financial Forensics', href: '/capabilities' },
        { label: 'Statutory & Structural Intelligence', href: '/capabilities' },
        { label: 'Geo-Environmental Risk', href: '/capabilities' },
        { label: 'The 1% Mandate', href: '/mandate' },
    ],
    'Mayalok Ecosystem': [
        { label: 'About RiskFortress', href: '/council' },
        { label: 'Case Scenarios', href: '/dossiers' },
        { label: 'Advisory Council', href: '/council' },
        { label: 'Discrete Consultation', href: '/secure-intake' },
    ],
}

export default function Footer() {
    const [settings, setSettings] = useState<SiteSettings | null>(null)

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const res = await fetch('/api/settings?public=true')
                if (res.ok) {
                    const data = await res.json()
                    setSettings(data)
                }
            } catch (err) {
                console.error('Failed to load site settings:', err)
            }
        }
        loadSettings()
    }, [])

    return (
        <footer className="border-t border-gray-800 bg-gray-950">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <Image
                                src="/logos/logo.png"
                                alt="RiskFortress — Private Risk Intelligence"
                                width={40}
                                height={40}
                            />
                            <div>
                                <span className="text-lg font-semibold text-white block">RiskFortress</span>
                                <p className="text-xs text-champagne uppercase tracking-wider">A Mayalok Ventures Entity</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-6">
                            RiskFortress is the specialized Risk Intelligence arm of Mayalok Ventures, 
                            dedicated to preserving wealth through advanced predictive forensics.
                        </p>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-md mb-8">
                            Strategic foresight for Ultra-HNWIs with assets worth ₹100Cr+. 
                            We predict the crisis you don&apos;t see coming.
                        </p>
                        <div className="text-xs text-gray-600">
                            <p>Forensic Predictive Intelligence • Absolute Confidentiality</p>
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                                {category}
                            </h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-500 hover:text-white transition-colors text-sm"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Contact */}
                    <div>
                        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">Contact</h3>
                        <ul className="space-y-3">
                            {settings?.contact?.email && (
                                <li>
                                    <a
                                        href={`mailto:${settings.contact.email}`}
                                        className="text-gray-500 hover:text-white transition-colors text-sm"
                                    >
                                        {settings.contact.email}
                                    </a>
                                </li>
                            )}
                            {settings?.contact?.phone && (
                                <li>
                                    <a
                                        href={`tel:${settings.contact.phone}`}
                                        className="text-gray-500 hover:text-white transition-colors text-sm"
                                    >
                                        {settings.contact.phone}
                                    </a>
                                </li>
                            )}
                            {settings?.contact?.address && (
                                <li>
                                    <span className="text-gray-500 text-sm">{settings.contact.address}</span>
                                </li>
                            )}
                            {!settings?.contact && (
                                <>
                                    <li>
                                        <a
                                            href="mailto:contact@riskfortress.in"
                                            className="text-gray-500 hover:text-white transition-colors text-sm"
                                        >
                                            contact@riskfortress.in
                                        </a>
                                    </li>
                                    <li>
                                        <Link
                                            href="/secure-intake"
                                            className="text-gray-500 hover:text-white transition-colors text-sm"
                                        >
                                            Discrete Consultation
                                        </Link>
                                    </li>
                                    <li>
                                        <span className="text-gray-500 text-sm">Intelligence Node: Greater Noida, NCR, India</span>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <p className="text-xs text-gray-600">
                                © 2026 Mayalok Ventures. All rights reserved.
                            </p>
                            <p className="text-xs text-gray-700 mt-1">
                                RiskFortress · A Mayalok Ventures Entity · Intelligence Node: Greater Noida, NCR
                            </p>
                            <p className="text-xs text-gray-700 mt-1">
                                Research published in{' '}
                                <a
                                    href="https://www.cyberdefensemagazine.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-champagne/50 hover:text-champagne/80 transition-colors"
                                >
                                    Cyber Defense Magazine
                                </a>{' '}
                                (March 2026)
                            </p>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center space-x-4">
                            {settings?.social?.twitter && (
                                <a href={settings.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-400 transition-colors text-xs">
                                    Twitter
                                </a>
                            )}
                            {settings?.social?.linkedin && (
                                <a href={settings.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-400 transition-colors text-xs">
                                    LinkedIn
                                </a>
                            )}
                            {settings?.social?.facebook && (
                                <a href={settings.social.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-400 transition-colors text-xs">
                                    Facebook
                                </a>
                            )}
                            {settings?.social?.instagram && (
                                <a href={settings.social.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-400 transition-colors text-xs">
                                    Instagram
                                </a>
                            )}
                            {settings?.social?.youtube && (
                                <a href={settings.social.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-400 transition-colors text-xs">
                                    YouTube
                                </a>
                            )}
                            {settings?.social?.github && (
                                <a href={settings.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-400 transition-colors text-xs">
                                    GitHub
                                </a>
                            )}
                        </div>

                        <div className="flex items-center space-x-6 text-xs text-gray-600">
                            <Link href="/privacy" className="hover:text-gray-400 transition-colors">
                                Privacy
                            </Link>
                            <Link href="/terms" className="hover:text-gray-400 transition-colors">
                                Terms
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
