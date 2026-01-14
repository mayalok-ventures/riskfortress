'use client'

import Image from 'next/image'
import Link from 'next/link'

const footerLinks = {
    Services: [
        { label: 'Enterprise Risk Management', href: '/capabilities' },
        { label: 'Land Due Diligence', href: '/capabilities' },
        { label: 'Family Office Advisory', href: '/capabilities' },
        { label: 'Technical Surveillance', href: '/capabilities' },
    ],
    Company: [
        { label: 'About', href: '/council' },
        { label: 'Case Studies', href: '/dossiers' },
        { label: 'Advisory Council', href: '/council' },
        { label: 'Contact', href: '/secure-intake' },
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
                                <p className="text-xs text-gray-500 uppercase tracking-wider">Intelligence & Risk Advisory</p>
                            </div>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-md mb-8">
                            Strategic intelligence and risk advisory for India&apos;s leading
                            industrial conglomerates and distinguished family offices.
                        </p>
                        <div className="text-xs text-gray-600">
                            <p>ISO 27001 Certified • AES-256 Encryption</p>
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
