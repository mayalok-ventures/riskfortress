'use client'

import Image from 'next/image'
import Link from 'next/link'

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
    return (
        <footer className="border-t border-gray-800 bg-gray-950">
            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <Image
                                src="/logos/logo.png"
                                alt="RiskFortress"
                                width={40}
                                height={40}
                            />
                            <div>
                                <h2 className="text-lg font-semibold text-white">RiskFortress</h2>
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
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-xs text-gray-600">
                            © {new Date().getFullYear()} RiskFortress. All rights reserved.
                        </p>
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
